// Valores que precisam ser IGUAIS aos gravados no banco.
// Se algum for diferente no seu banco, ajuste AQUI e mais nada.

// usuario.tipo_usuario (varchar)
export const TIPO_USUARIO = {
  paciente: 'paciente',
  medico: 'medico',
} as const;

export type TipoUsuario = (typeof TIPO_USUARIO)[keyof typeof TIPO_USUARIO];

// consulta.status_consulta (varchar) — vocabulário único para paciente e médico.
export const STATUS_BANCO = {
  aberta: 'aberta', // marcada, aguardando confirmação do médico
  confirmada: 'confirmada',
  concluida: 'concluida',
  cancelada: 'cancelada',
} as const;

export type StatusBanco = (typeof STATUS_BANCO)[keyof typeof STATUS_BANCO];

// Colunas NOT NULL que a tela de agendamento não pergunta ao paciente.
export const TIPO_CONSULTA_PADRAO = 'consulta'; // consulta.tipo_consulta
export const MODALIDADE_PADRAO = 'presencial'; // consulta.modalidade

// Status de uma consulta recém-agendada pelo paciente.
export const STATUS_CONSULTA_NOVA: StatusBanco = STATUS_BANCO.aberta;

// O app do paciente mostra só 3 estados: aberta e confirmada viram "agendada".
export type StatusPaciente = 'agendada' | 'concluida' | 'cancelada';

export function statusBancoParaPaciente(status: string): StatusPaciente {
  if (status === STATUS_BANCO.concluida) return 'concluida';
  if (status === STATUS_BANCO.cancelada) return 'cancelada';
  return 'agendada';
}