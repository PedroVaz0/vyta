import { useSyncExternalStore } from "react";
import {
    MODALIDADE_PADRAO,
    STATUS_BANCO,
    STATUS_CONSULTA_NOVA,
    TIPO_CONSULTA_PADRAO,
    statusBancoParaPaciente,
    type StatusPaciente,
} from "../constants/banco";
import { horaCurta, isoParaExtenso } from "../lib/datas";
import { getSessao } from "../lib/sessao";
import {
    MODO_MOCK,
    atualizarStatusConsulta,
    criarConsulta,
    listarConsultasPaciente,
    type LinhaConsulta,
} from "../services/api";

// No app do paciente "aberta" e "confirmada" aparecem como "agendada".
export type StatusConsulta = StatusPaciente;

export type Consulta = {
    id: string; // consulta.consulta_id
    medico: string;
    especialidade: string;
    clinica: string;
    data: string; // texto exibido, ex.: "05 de novembro de 2026"
    horario: string; // "14:00"
    status: StatusConsulta;
    medicoId?: string; // medico.usuario_id
    enderecoId?: string; // consulta.endereco_id
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

let consultas: Consulta[] = MODO_MOCK ? CONSULTAS_MOCK : [];

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

function getSnapshot() {
    return consultas;
}

function atualizar(novas: Consulta[]) {
    consultas = novas;
    listeners.forEach((l) => l());
}

function doBanco(l: LinhaConsulta): Consulta {
    return {
        id: String(l.consulta_id),
        medico: l.medico_nome,
        especialidade: l.especialidade,
        clinica: l.clinica ?? "",
        data: isoParaExtenso(l.data_consulta),
        horario: horaCurta(l.horario),
        status: statusBancoParaPaciente(l.status_consulta),
        medicoId: String(l.medico_id),
        enderecoId: l.endereco_id == null ? undefined : String(l.endereco_id),
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
    atualizar(linhas.map(doBanco));
}

export type NovaConsulta = Omit<Consulta, "id" | "status"> & {
    dataIso: string; // "AAAA-MM-DD", gravado em consulta.data_consulta
};

export async function adicionarConsulta({ dataIso, ...nova }: NovaConsulta) {
    if (MODO_MOCK) {
        atualizar([
            { ...nova, id: String(Date.now()), status: "agendada" },
            ...consultas,
        ]);
        return;
    }

    if (!nova.medicoId) throw new Error("Médico inválido.");

    await criarConsulta({
        paciente_id: Number(pacienteLogado()),
        medico_id: Number(nova.medicoId),
        endereco_id: nova.enderecoId ? Number(nova.enderecoId) : null,
        data_consulta: dataIso,
        horario: nova.horario,
        tipo_consulta: TIPO_CONSULTA_PADRAO,
        modalidade: MODALIDADE_PADRAO,
        status_consulta: STATUS_CONSULTA_NOVA,
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

    await atualizarStatusConsulta(id, STATUS_BANCO.cancelada);
    await carregarConsultas();
}

export function useConsultas() {
    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}