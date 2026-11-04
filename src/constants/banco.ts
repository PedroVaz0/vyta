// Vocabulário do app (minúsculas) e a conversão para os valores que o
// back-end usa (enums Java, em MAIÚSCULAS). Se o back mudar um enum,
// ajuste AQUI e mais nada.

// ---------------------------------------------------------------------------
// Tipo de usuário  (back: TipoUsuario { MEDICO, PACIENTE })
// ---------------------------------------------------------------------------
export const TIPO_USUARIO = {
  paciente: 'paciente',
  medico: 'medico',
} as const;

export type TipoUsuario = (typeof TIPO_USUARIO)[keyof typeof TIPO_USUARIO];

export const tipoUsuarioParaApi = (tipo: TipoUsuario) =>
  tipo === TIPO_USUARIO.medico ? 'MEDICO' : 'PACIENTE';

export const tipoUsuarioDaApi = (valor?: string | null): TipoUsuario =>
  String(valor ?? '').toUpperCase() === 'MEDICO' ? TIPO_USUARIO.medico : TIPO_USUARIO.paciente;

// ---------------------------------------------------------------------------
// Status da consulta  (back: StatusConsulta { AGENDADA, CONFIRMADA, REALIZADA, CANCELADA })
// ---------------------------------------------------------------------------
export const STATUS_BANCO = {
  aberta: 'aberta', // back: AGENDADA  (marcada, aguardando confirmação do médico)
  confirmada: 'confirmada', // back: CONFIRMADA
  concluida: 'concluida', // back: REALIZADA
  cancelada: 'cancelada', // back: CANCELADA
} as const;

export type StatusBanco = (typeof STATUS_BANCO)[keyof typeof STATUS_BANCO];

const STATUS_PARA_API: Record<StatusBanco, string> = {
  aberta: 'AGENDADA',
  confirmada: 'CONFIRMADA',
  concluida: 'REALIZADA',
  cancelada: 'CANCELADA',
};

export const statusParaApi = (status: StatusBanco) => STATUS_PARA_API[status];

export function statusDaApi(valor?: string | null): StatusBanco {
  switch (String(valor ?? '').toUpperCase()) {
    case 'CONFIRMADA':
      return STATUS_BANCO.confirmada;
    case 'REALIZADA':
      return STATUS_BANCO.concluida;
    case 'CANCELADA':
      return STATUS_BANCO.cancelada;
    default:
      return STATUS_BANCO.aberta; // AGENDADA
  }
}

// ---------------------------------------------------------------------------
// Modalidade  (back: ModalidadeConsulta { PRESENCIAL, ONLINE })
// Presencial exige endereço; online NÃO pode ter endereço.
// ---------------------------------------------------------------------------
export const MODALIDADE = { presencial: 'PRESENCIAL', online: 'ONLINE' } as const;
export type ModalidadeApi = (typeof MODALIDADE)[keyof typeof MODALIDADE];

// Coluna NOT NULL que a tela de agendamento não pergunta ao paciente.
export const TIPO_CONSULTA_PADRAO = 'Consulta'; // consulta.tipo_consulta

// O app do paciente mostra só 3 estados: aberta e confirmada viram "agendada".
export type StatusPaciente = 'agendada' | 'concluida' | 'cancelada';

export function statusBancoParaPaciente(status: string): StatusPaciente {
  if (status === STATUS_BANCO.concluida) return 'concluida';
  if (status === STATUS_BANCO.cancelada) return 'cancelada';
  return 'agendada';
}