import { useSyncExternalStore } from "react";
import {
    MODALIDADE,
    STATUS_BANCO,
    TIPO_CONSULTA_PADRAO,
    statusBancoParaPaciente,
    statusDaApi,
    type StatusPaciente,
} from "../constants/banco";
import { horaCurta, isoParaExtenso } from "../lib/datas";
import { getSessao } from "../lib/sessao";
import {
    MODO_MOCK,
    alterarStatusConsulta,
    criarConsulta,
    listarConsultasPaciente,
    rotuloEndereco,
    type ConsultaApi,
} from "../services/api";

// No app do paciente "aberta" e "confirmada" aparecem como "agendada".
export type StatusConsulta = StatusPaciente;

export type Consulta = {
    id: string; // consulta.consulta_id
    medico: string;
    especialidade: string;
    clinica: string; // endereço do atendimento (o banco não tem o nome da clínica)
    data: string; // texto exibido, ex.: "05 de novembro de 2026"
    horario: string; // "14:00"
    status: StatusConsulta;
    medicoId?: string; // medico.usuario_id
    enderecoId?: string; // consulta.endereco_id
    dataIso?: string; // "AAAA-MM-DD" (só nas consultas vindas da API)
};

// Dados de exemplo: usados só quando EXPO_PUBLIC_API_URL não está definida.
const CONSULTAS_MOCK: Consulta[] = [
    {
        id: "1",
        medico: "Dr. Riquelme Santos",
        especialidade: "Clínico Geral",
        clinica: "Clínica Bem Estar",
        data: "05 de novembro de 2026",
        horario: "14:00",
        status: "agendada",
    },
    {
        id: "2",
        medico: "Dra. Carla Menezes",
        especialidade: "Cardiologia",
        clinica: "Clínica Bem Estar",
        data: "18 de novembro de 2026",
        horario: "09:30",
        status: "agendada",
    },
    {
        id: "3",
        medico: "Dr. André Lima",
        especialidade: "Dermatologia",
        clinica: "Espaço Saúde",
        data: "20 de agosto de 2026",
        horario: "11:00",
        status: "concluida",
    },
    {
        id: "4",
        medico: "Dra. Carla Menezes",
        especialidade: "Cardiologia",
        clinica: "Clínica Bem Estar",
        data: "02 de julho de 2026",
        horario: "15:30",
        status: "concluida",
    },
    {
        id: "5",
        medico: "Dr. Riquelme Santos",
        especialidade: "Clínico Geral",
        clinica: "Clínica Bem Estar",
        data: "14 de maio de 2026",
        horario: "10:00",
        status: "cancelada",
    },
];

const VAZIO: Consulta[] = [];

let consultas: Consulta[] = MODO_MOCK ? CONSULTAS_MOCK : VAZIO;
// De quem são as consultas em memória (evita mostrar dados do usuário anterior).
let dono: string | null = null;

const idLogado = () => getSessao()?.usuarioId ?? null;

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

function getSnapshot() {
    if (MODO_MOCK) return consultas;
    return dono !== null && dono === idLogado() ? consultas : VAZIO;
}

function atualizar(novas: Consulta[]) {
    consultas = novas;
    dono = idLogado();
    listeners.forEach((l) => l());
}

function doApi(c: ConsultaApi): Consulta {
    return {
        id: String(c.id),
        medico: c.medicoNome,
        especialidade: c.especialidade,
        clinica: c.endereco ? rotuloEndereco(c.endereco) : "Consulta online",
        data: isoParaExtenso(c.dataConsulta),
        horario: horaCurta(c.horario),
        status: statusBancoParaPaciente(statusDaApi(c.statusConsulta)),
        medicoId: String(c.medicoId),
        enderecoId: c.endereco ? String(c.endereco.id) : undefined,
        dataIso: c.dataConsulta,
    };
}

function pacienteLogado() {
    const sessao = getSessao();
    if (!sessao) throw new Error("Sessão expirada. Faça login novamente.");
    return sessao.usuarioId;
}

/** Busca as consultas do paciente logado no banco. No modo mock não faz nada. */
export async function carregarConsultas() {
    if (MODO_MOCK) return;
    const linhas = await listarConsultasPaciente(pacienteLogado());
    atualizar(linhas.map(doApi));
}

/** Próxima consulta ainda não realizada nem cancelada (a mais cedo). */
export function proximaDaLista(lista: Consulta[]): Consulta | undefined {
    const agora = new Date();
    const dois = (n: number) => String(n).padStart(2, "0");
    const agoraIso = `${agora.getFullYear()}-${dois(agora.getMonth() + 1)}-${dois(agora.getDate())}T${dois(agora.getHours())}:${dois(agora.getMinutes())}`;

    return lista
        .filter((c) => c.status === "agendada")
        .filter((c) => !c.dataIso || `${c.dataIso}T${c.horario}` >= agoraIso)
        .sort((a, b) => `${a.dataIso ?? ""}T${a.horario}`.localeCompare(`${b.dataIso ?? ""}T${b.horario}`))[0];
}

export type NovaConsulta = Omit<Consulta, "id" | "status"> & {
    dataIso: string; // "AAAA-MM-DD", gravado em consulta.data_consulta
};

export async function adicionarConsulta({ dataIso, ...nova }: NovaConsulta) {
    if (MODO_MOCK) {
        atualizar([
            { ...nova, dataIso, id: String(Date.now()), status: "agendada" },
            ...consultas,
        ]);
        return;
    }

    if (!nova.medicoId) throw new Error("Médico inválido.");

    // O back exige endereço na consulta presencial e proíbe na online:
    // médico com endereço cadastrado atende presencial; sem endereço, online.
    const enderecoId = nova.enderecoId ? Number(nova.enderecoId) : null;

    await criarConsulta({
        pacienteId: Number(pacienteLogado()),
        medicoId: Number(nova.medicoId),
        dataConsulta: dataIso,
        horario: nova.horario,
        tipoConsulta: TIPO_CONSULTA_PADRAO,
        modalidade: enderecoId ? MODALIDADE.presencial : MODALIDADE.online,
        enderecoId,
    });
    await carregarConsultas();
}

export async function cancelarConsulta(id: string) {
    if (MODO_MOCK) {
        atualizar(
            consultas.map((c) => (c.id === id ? { ...c, status: "cancelada" } : c))
        );
        return;
    }

    await alterarStatusConsulta(id, STATUS_BANCO.cancelada);
    await carregarConsultas();
}

export function useConsultas() {
    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}