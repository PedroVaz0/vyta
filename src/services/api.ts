// Camada de acesso ao backend. Os nomes dos campos das requisições/respostas
// seguem as colunas do banco; os mapeadores convertem para o formato das telas.
//
// Defina a URL do backend em um arquivo `.env` na raiz do projeto:
//   EXPO_PUBLIC_API_URL=https://sua-api.com
// Sem essa variável o app roda em MODO_MOCK, com os dados de exemplo.
//
// Contrato esperado do backend:
//   POST  /auth/login                 { cpf, senha, tipo_usuario } -> { usuario_id, nome, tipo_usuario, token? }
//   POST  /auth/cadastro              payload de montarPayload()   -> { usuario_id, nome, tipo_usuario, token? }
//   GET   /medicos                    -> [{ usuario_id, nome, especialidade, endereco_id, clinica }]
//   GET   /pacientes/:id/consultas    -> [{ consulta_id, medico_id, medico_nome, especialidade, clinica,
//                                           endereco_id, data_consulta, horario, status_consulta, motivo }]
//   POST  /consultas                  { paciente_id, medico_id, endereco_id, data_consulta, horario,
//                                       tipo_consulta, modalidade, status_consulta }
//   PATCH /consultas/:id              { status_consulta }

import type { TipoUsuario } from '../constants/banco';
import { soDigitos } from '../data/cadastro-form';
import { getSessao } from '../lib/sessao';

export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, '');
export const MODO_MOCK = API_URL === '';

async function requisicao<T>(metodo: string, caminho: string, corpo?: unknown): Promise<T> {
  const token = getSessao()?.token;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${caminho}`, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });
  } catch {
    throw new Error('Sem conexão com o servidor. Verifique sua internet.');
  }

  if (!res.ok) {
    let mensagem = `Erro ${res.status} ao falar com o servidor.`;
    try {
      const json = await res.json();
      mensagem = json.mensagem ?? json.message ?? json.error ?? mensagem;
    } catch {
      // resposta sem JSON: mantém a mensagem padrão
    }
    throw new Error(mensagem);
  }

  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}

// ---------------------------------------------------------------------------
// Autenticação
// ---------------------------------------------------------------------------

type RespostaAuth = {
  usuario_id: number | string;
  nome: string;
  tipo_usuario: TipoUsuario;
  token?: string;
};

const mapearAuth = (r: RespostaAuth) => ({
  usuarioId: String(r.usuario_id),
  tipo: r.tipo_usuario,
  nome: r.nome,
  token: r.token,
});

export async function login(cpf: string, senha: string, tipo: TipoUsuario) {
  const r = await requisicao<RespostaAuth>('POST', '/auth/login', {
    cpf: soDigitos(cpf), // o banco guarda só dígitos
    senha,
    tipo_usuario: tipo,
  });
  return mapearAuth(r);
}

export async function cadastrar(payload: unknown) {
  const r = await requisicao<RespostaAuth>('POST', '/auth/cadastro', payload);
  return mapearAuth(r);
}

// ---------------------------------------------------------------------------
// Médicos e consultas
// ---------------------------------------------------------------------------

export type MedicoOpcao = {
  id: string; // medico.usuario_id
  nome: string;
  especialidade: string;
  clinica: string;
  enderecoId?: string;
};

type LinhaMedico = {
  usuario_id: number | string;
  nome: string;
  especialidade: string;
  endereco_id?: number | string | null;
  clinica?: string | null;
};

export async function listarMedicos(): Promise<MedicoOpcao[]> {
  const linhas = await requisicao<LinhaMedico[]>('GET', '/medicos');
  return linhas.map((l) => ({
    id: String(l.usuario_id),
    nome: l.nome,
    especialidade: l.especialidade,
    clinica: l.clinica ?? '',
    enderecoId: l.endereco_id == null ? undefined : String(l.endereco_id),
  }));
}

export type LinhaConsulta = {
  consulta_id: number | string;
  medico_id: number | string;
  medico_nome: string;
  especialidade: string;
  clinica?: string | null;
  endereco_id?: number | string | null;
  data_consulta: string; // AAAA-MM-DD
  horario: string; // HH:MM[:SS]
  status_consulta: string;
  motivo?: string | null;
};

export const listarConsultasPaciente = (pacienteId: string) =>
  requisicao<LinhaConsulta[]>('GET', `/pacientes/${pacienteId}/consultas`);

export type NovaConsultaBanco = {
  paciente_id: number;
  medico_id: number;
  endereco_id: number | null;
  data_consulta: string;
  horario: string;
  tipo_consulta: string;
  modalidade: string;
  status_consulta: string;
};

export const criarConsulta = (dados: NovaConsultaBanco) =>
  requisicao<unknown>('POST', '/consultas', dados);

export const atualizarStatusConsulta = (id: string, status: string) =>
  requisicao<unknown>('PATCH', `/consultas/${id}`, { status_consulta: status });