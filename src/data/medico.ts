// Dados do médico. Sem EXPO_PUBLIC_API_URL (MODO_MOCK) as telas usam os dados de
// exemplo abaixo; com a API, as funções `carregar...` buscam tudo no back-end e
// guardam em memória, e as telas continuam lendo pelos mesmos getters.

import {
  STATUS_BANCO,
  statusDaApi,
  type StatusBanco,
} from '../constants/banco';
import { horaCurta, isoParaBr } from '../lib/datas';
import { getSessao } from '../lib/sessao';
import {
  MODO_MOCK,
  alterarStatusConsulta,
  buscarPaciente,
  criarReceita,
  listarConsultasMedico,
  listarConsultasPaciente,
  listarLaudosPaciente,
  listarReceitasPaciente,
  type ConsultaApi,
} from '../services/api';

const dois = (n: number) => String(n).padStart(2, '0');
const hojeBr = () => {
  const d = new Date();
  return `${dois(d.getDate())}/${dois(d.getMonth() + 1)}/${d.getFullYear()}`;
};

export const HOJE = MODO_MOCK ? '07/10/2026' : hojeBr();

// Mesmos valores do banco/back: aberta=AGENDADA, confirmada, concluida=REALIZADA, cancelada.
export type StatusConsulta = StatusBanco;

export type Consulta = {
  id: string;
  pacienteId: string;
  paciente: string;
  data: string; // DD/MM/AAAA
  hora: string; // HH:MM
  motivo: string;
  status: StatusConsulta;
};

export type ItemHistorico = {
  id: string;
  tipo: 'consulta' | 'laudo' | 'receita';
  titulo: string;
  data: string;
  descricao: string;
};

export type Paciente = {
  id: string;
  nome: string;
  idade: number | null; // null quando ainda não foi possível buscar a data de nascimento
  ultimaConsulta: string;
  historico: ItemHistorico[];
};

export const medico = {
  nome: 'Dr. Riquelme Santos',
  clinica: 'Clínica Bem estar',
};

const CONSULTAS_MOCK: Consulta[] = [
  {
    id: 'c1',
    pacienteId: 'p1',
    paciente: 'Maperi Julu',
    data: HOJE,
    hora: '09:00',
    motivo: 'Retorno - exames de sangue',
    status: 'confirmada',
  },
  {
    id: 'c2',
    pacienteId: 'p2',
    paciente: 'Ana Beatriz Lima',
    data: HOJE,
    hora: '10:30',
    motivo: 'Dor de cabeça frequente',
    status: 'aberta',
  },
  {
    id: 'c3',
    pacienteId: 'p3',
    paciente: 'Carlos Eduardo Souza',
    data: HOJE,
    hora: '14:00',
    motivo: 'Check-up anual',
    status: 'confirmada',
  },
  {
    id: 'c4',
    pacienteId: 'p4',
    paciente: 'Fernanda Oliveira',
    data: '08/10/2026',
    hora: '08:30',
    motivo: 'Avaliação de pressão arterial',
    status: 'aberta',
  },
  {
    id: 'c5',
    pacienteId: 'p2',
    paciente: 'Ana Beatriz Lima',
    data: '12/10/2026',
    hora: '16:00',
    motivo: 'Resultado de exames',
    status: 'aberta',
  },
];

const PACIENTES_MOCK: Paciente[] = [
  {
    id: 'p1',
    nome: 'Maperi Julu',
    idade: 34,
    ultimaConsulta: '21/08/2026',
    historico: [
      {
        id: 'h1',
        tipo: 'laudo',
        titulo: 'Laudo de Exame de Sangue',
        data: '21/08/2026',
        descricao: 'Laboratório Oswaldo Cruz',
      },
      {
        id: 'h2',
        tipo: 'receita',
        titulo: 'Receita: Vitamina D',
        data: '17/06/2026',
        descricao: '1 cápsula ao dia, por 60 dias',
      },
      {
        id: 'h3',
        tipo: 'consulta',
        titulo: 'Consulta de rotina',
        data: '17/06/2026',
        descricao: 'Paciente sem queixas relevantes.',
      },
    ],
  },
  {
    id: 'p2',
    nome: 'Ana Beatriz Lima',
    idade: 28,
    ultimaConsulta: '30/07/2026',
    historico: [
      {
        id: 'h4',
        tipo: 'consulta',
        titulo: 'Consulta - enxaqueca',
        data: '30/07/2026',
        descricao: 'Orientada a manter diário de crises.',
      },
      {
        id: 'h5',
        tipo: 'receita',
        titulo: 'Receita: Dipirona',
        data: '30/07/2026',
        descricao: '500 mg, a cada 8 horas se houver dor',
      },
    ],
  },
  {
    id: 'p3',
    nome: 'Carlos Eduardo Souza',
    idade: 52,
    ultimaConsulta: '05/03/2026',
    historico: [
      {
        id: 'h6',
        tipo: 'laudo',
        titulo: 'Laudo de Eletrocardiograma',
        data: '05/03/2026',
        descricao: 'Sem alterações.',
      },
    ],
  },
  {
    id: 'p4',
    nome: 'Fernanda Oliveira',
    idade: 61,
    ultimaConsulta: '12/09/2026',
    historico: [
      {
        id: 'h7',
        tipo: 'consulta',
        titulo: 'Consulta - hipertensão',
        data: '12/09/2026',
        descricao: 'Pressão controlada com medicação atual.',
      },
    ],
  },
];


// ---------------------------------------------------------------------------
// Dados em memória
// ---------------------------------------------------------------------------

let consultas: Consulta[] = MODO_MOCK ? CONSULTAS_MOCK : [];
let pacientes: Paciente[] = MODO_MOCK ? PACIENTES_MOCK : [];
let receitas: Receita[] = [];
// De quem são os dados em memória (evita mostrar dados do médico anterior).
let dono: string | null = null;

const idLogado = () => getSessao()?.usuarioId ?? null;
const meus = () => MODO_MOCK || (dono !== null && dono === idLogado());

function idMedico() {
  const id = idLogado();
  if (!id) throw new Error('Sessão expirada. Faça login novamente.');
  return id;
}

function adotar(id: string) {
  if (dono !== id) {
    consultas = [];
    pacientes = [];
    receitas = [];
    dono = id;
  }
}

const iso = (c: ConsultaApi) => `${c.dataConsulta}T${horaCurta(c.horario)}`;

function idadeDe(nascimentoIso?: string | null) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(nascimentoIso ?? '');
  if (!m) return null;
  const hoje = new Date();
  let idade = hoje.getFullYear() - Number(m[1]);
  const fezAniversario =
    hoje.getMonth() + 1 > Number(m[2]) ||
    (hoje.getMonth() + 1 === Number(m[2]) && hoje.getDate() >= Number(m[3]));
  if (!fezAniversario) idade -= 1;
  return idade;
}

function consultaDoApi(c: ConsultaApi): Consulta {
  return {
    id: String(c.id),
    pacienteId: String(c.pacienteId),
    paciente: c.pacienteNome,
    data: isoParaBr(c.dataConsulta),
    hora: horaCurta(c.horario),
    motivo: c.motivo?.trim() || c.tipoConsulta,
    status: statusDaApi(c.statusConsulta),
  };
}

/** Carrega a agenda do médico logado e a lista de pacientes dele (derivada das consultas). */
export async function carregarAgendaMedico() {
  if (MODO_MOCK) return;
  const id = idMedico();
  adotar(id);

  const linhas = await listarConsultasMedico(id);
  const ids = [...new Set(linhas.map((l) => l.pacienteId))];
  const dados = await Promise.all(ids.map((pid) => buscarPaciente(pid).catch(() => null)));
  const anteriores = new Map(pacientes.map((p) => [p.id, p]));

  consultas = linhas.map(consultaDoApi);
  pacientes = ids
    .map((pid, i) => {
      const dele = linhas.filter((l) => l.pacienteId === pid);
      const realizadas = dele
        .filter((l) => statusDaApi(l.statusConsulta) === STATUS_BANCO.concluida)
        .sort((a, b) => iso(b).localeCompare(iso(a)));
      const antigo = anteriores.get(String(pid));

      return {
        id: String(pid),
        nome: dele[0].pacienteNome,
        idade: dados[i] ? idadeDe(dados[i]!.dataNascimento) : antigo?.idade ?? null,
        ultimaConsulta: realizadas[0] ? isoParaBr(realizadas[0].dataConsulta) : '—',
        historico: antigo?.historico ?? [],
      };
    })
    .sort((a, b) => a.nome.localeCompare(b.nome));
}

/** Carrega consultas realizadas, laudos e receitas do paciente para o histórico clínico. */
export async function carregarHistoricoPaciente(pacienteId: string) {
  if (MODO_MOCK) return;

  const [cons, laudos, recs] = await Promise.all([
    listarConsultasPaciente(pacienteId).catch(() => []),
    listarLaudosPaciente(pacienteId).catch(() => []),
    listarReceitasPaciente(pacienteId).catch(() => []),
  ]);

  const itens: { ordem: string; item: ItemHistorico }[] = [];

  cons
    .filter((c) => statusDaApi(c.statusConsulta) === STATUS_BANCO.concluida)
    .forEach((c) =>
      itens.push({
        ordem: iso(c),
        item: {
          id: `c${c.id}`,
          tipo: 'consulta',
          titulo: `Consulta - ${c.tipoConsulta}`,
          data: isoParaBr(c.dataConsulta),
          descricao: c.motivo?.trim() || `${c.medicoNome} - ${c.especialidade}`,
        },
      })
    );

  laudos.forEach((l) =>
    itens.push({
      ordem: `${l.dataExame}T00:00`,
      item: {
        id: `l${l.id}`,
        tipo: 'laudo',
        titulo: l.titulo,
        data: isoParaBr(l.dataExame),
        descricao: l.conclusao?.trim() || l.laboratorio,
      },
    })
  );

  recs.forEach((r) => {
    const [primeiro, ...resto] = r.itens;
    if (!primeiro) return;
    itens.push({
      ordem: `${r.dataEmissao}T23:59`,
      item: {
        id: `r${r.id}`,
        tipo: 'receita',
        titulo:
          resto.length === 0
            ? `Receita: ${primeiro.nomeMedicamento}`
            : `Receita: ${primeiro.nomeMedicamento} e mais ${resto.length}`,
        data: isoParaBr(r.dataEmissao),
        descricao:
          resto.length === 0
            ? [primeiro.dosagem, `Qtd.: ${primeiro.quantidade}`, `Duração: ${primeiro.duracaoTratamento}`].join(' - ')
            : r.itens.map((i) => `${i.nomeMedicamento} (${i.dosagem})`).join('; '),
      },
    });
  });

  const historico = itens.sort((a, b) => b.ordem.localeCompare(a.ordem)).map((x) => x.item);
  const paciente = pacientes.find((p) => p.id === pacienteId);
  if (paciente) paciente.historico = historico;
}

// ---------------------------------------------------------------------------
// Leitura (usada pelas telas)
// ---------------------------------------------------------------------------

export function getConsultas() {
  return meus() ? consultas : [];
}

export function getConsulta(id?: string) {
  return getConsultas().find((c) => c.id === id);
}

/** Edição local (só no modo mock). Com a API o back só aceita mudar a situação: use salvarStatusConsulta. */
export function atualizarConsulta(
  id: string,
  dados: Partial<Omit<Consulta, 'id' | 'pacienteId' | 'paciente'>>
) {
  const consulta = consultas.find((c) => c.id === id);
  if (consulta) Object.assign(consulta, dados);
}

/** Muda a situação da consulta (aberta/confirmada/concluida/cancelada). */
export async function salvarStatusConsulta(id: string, status: StatusConsulta) {
  if (MODO_MOCK) {
    atualizarConsulta(id, { status });
    return;
  }
  await alterarStatusConsulta(id, status);
  await carregarAgendaMedico();
}

export const cancelarConsultaMedico = (id: string) =>
  salvarStatusConsulta(id, STATUS_BANCO.cancelada);

export function getPacientes() {
  return meus() ? pacientes : [];
}

export function getPaciente(id?: string) {
  return getPacientes().find((p) => p.id === id);
}

// ---------------------------------------------------------------------------
// Receitas (espelham as tabelas `receita` e `receita_item` do banco)
// ---------------------------------------------------------------------------

// Valores do app. Para o back-end (enum TipoReceita) a tradução está em TIPO_RECEITA_API.
export type TipoReceita =
  | 'simples'
  | 'controle_especial'
  | 'antimicrobiano'
  | 'notificacao_azul'
  | 'notificacao_amarela';

export const TIPOS_RECEITA: { valor: TipoReceita; label: string }[] = [
  { valor: 'simples', label: 'Simples' },
  { valor: 'controle_especial', label: 'Controle especial' },
  { valor: 'antimicrobiano', label: 'Antimicrobiano' },
  { valor: 'notificacao_azul', label: 'Notificação azul (B)' },
  { valor: 'notificacao_amarela', label: 'Notificação amarela (A)' },
];

export type StatusReceita = 'emitida' | 'cancelada';
export const STATUS_RECEITA_INICIAL: StatusReceita = 'emitida';

// Notificações azul (B) e amarela (A) exigem número de notificação
// (o back valida: azul/amarela exigem o número; os demais tipos não aceitam).
export const TIPOS_COM_NOTIFICACAO: TipoReceita[] = ['notificacao_azul', 'notificacao_amarela'];

// Espelha `receita_item`: nome_medicamento, dosagem, quantidade, duracao_tratamento.
export type ReceitaItem = {
  id: string;
  nomeMedicamento: string;
  dosagem: string; // dosagem + frequência no mesmo campo (ex.: "500 mg, a cada 8 horas")
  quantidade: string;
  duracaoTratamento: string;
};

export type Receita = {
  id: string;
  consultaId: string; // receita.consulta_id (obrigatório)
  pacienteId: string;
  dataEmissao: string; // DD/MM/AAAA
  dataVencimento: string; // DD/MM/AAAA
  tipo: TipoReceita;
  status: StatusReceita;
  numeroNotificacao?: string;
  itens: ReceitaItem[];
};

export function getReceitas() {
  return receitas;
}

/**
 * Consultas de um paciente (a receita precisa estar vinculada a uma consulta).
 * Com a API só entram as realizadas: o back só emite receita de consulta REALIZADA.
 */
export function getConsultasDoPaciente(pacienteId?: string) {
  return getConsultas().filter(
    (c) => c.pacienteId === pacienteId && (MODO_MOCK || c.status === STATUS_BANCO.concluida)
  );
}

/** Consulta sugerida: a de hoje, se houver; senão a primeira (mock) ou a mais recente (API). */
export function getConsultaPadrao(pacienteId?: string) {
  const lista = getConsultasDoPaciente(pacienteId);
  const padrao = MODO_MOCK ? lista[0] : lista[lista.length - 1];
  return (lista.find((c) => c.data === HOJE) ?? padrao)?.id;
}

/** Soma dias a uma data DD/MM/AAAA e devolve no mesmo formato. */
export function adicionarDias(data: string, dias: number) {
  const [dia, mes, ano] = data.split('/').map(Number);
  const d = new Date(ano, mes - 1, dia + dias);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
}

export function adicionarReceita(dados: {
  consultaId: string;
  tipo: TipoReceita;
  numeroNotificacao?: string;
  validadeDias: number;
  itens: Omit<ReceitaItem, 'id'>[];
}) {
  const consulta = consultas.find((c) => c.id === dados.consultaId);
  if (!consulta || dados.itens.length === 0) return;

  const paciente = pacientes.find((p) => p.id === consulta.pacienteId);
  if (!paciente) return;

  const stamp = Date.now();
  const itens: ReceitaItem[] = dados.itens.map((item, i) => ({
    ...item,
    id: `ri${stamp}-${i}`,
  }));

  receitas.unshift({
    id: `r${stamp}`,
    consultaId: consulta.id,
    pacienteId: paciente.id,
    dataEmissao: HOJE,
    dataVencimento: adicionarDias(HOJE, dados.validadeDias),
    tipo: dados.tipo,
    status: STATUS_RECEITA_INICIAL,
    numeroNotificacao: dados.numeroNotificacao,
    itens,
  });

  const [primeiro, ...resto] = itens;
  paciente.historico.unshift({
    id: `h${stamp}`,
    tipo: 'receita',
    titulo:
      resto.length === 0
        ? `Receita: ${primeiro.nomeMedicamento}`
        : `Receita: ${primeiro.nomeMedicamento} e mais ${resto.length}`,
    data: HOJE,
    descricao:
      resto.length === 0
        ? [
            primeiro.dosagem,
            `Qtd.: ${primeiro.quantidade}`,
            `Duração: ${primeiro.duracaoTratamento}`,
          ].join(' - ')
        : itens.map((i) => `${i.nomeMedicamento} (${i.dosagem})`).join('; '),
  });
}

// Tipos de receita do app -> enum TipoReceita do back.
export const TIPO_RECEITA_API: Record<TipoReceita, string> = {
  simples: 'BRANCA_SIMPLES',
  controle_especial: 'BRANCA_CONTROLE_ESPECIAL',
  antimicrobiano: 'BRANCA_ANTIMICROBIANOS',
  notificacao_azul: 'AZUL',
  notificacao_amarela: 'AMARELA',
};

// Com a API a validade é definida pelo back conforme o tipo (TipoReceita.diasValidade).
export const VALIDADE_POR_TIPO: Record<TipoReceita, number> = {
  simples: 30,
  controle_especial: 30,
  antimicrobiano: 10,
  notificacao_azul: 30,
  notificacao_amarela: 30,
};

/** Emite a receita: no mock grava em memória; com a API envia ao back e recarrega o histórico. */
export async function emitirReceita(dados: Parameters<typeof adicionarReceita>[0]) {
  if (MODO_MOCK) {
    adicionarReceita(dados);
    return;
  }

  const consulta = consultas.find((c) => c.id === dados.consultaId);

  await criarReceita({
    consultaId: Number(dados.consultaId),
    tipoReceita: TIPO_RECEITA_API[dados.tipo],
    numeroNotificacao: dados.numeroNotificacao ?? null,
    itens: dados.itens,
  });

  if (consulta) await carregarHistoricoPaciente(consulta.pacienteId).catch(() => {});
}