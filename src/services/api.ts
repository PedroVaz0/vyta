// Camada de acesso ao back-end (Spring Boot). Aqui ficam as rotas, os formatos
// JSON do back (camelCase) e a conversão de erros. As telas usam o vocabulário
// do app (constants/banco.ts); a tradução acontece nos stores e em data/medico.ts.
//
// Defina a URL do backend em um arquivo `.env` na raiz do projeto:
//   EXPO_PUBLIC_API_URL=http://10.0.2.2:8080     (emulador Android)
//   EXPO_PUBLIC_API_URL=http://192.168.0.10:8080 (celular físico: IP do seu PC)
// Sem essa variável o app roda em MODO_MOCK, com os dados de exemplo.
//
// Rotas usadas (todas já existem no back):
//   POST  /auth/login                         { cpf, senha, tipo } -> { id, nome, tipo, token }
//   POST  /pacientes | /medicos               cadastro
//   GET   /pacientes/{id} | /medicos/{id}     perfil
//   GET   /medicos                            lista de médicos (com endereço)
//   GET   /medicos/{id}/pacientes             pacientes atendidos pelo médico
//   GET   /consultas/paciente/{id}            consultas do paciente
//   GET   /consultas/medico/{id}              agenda do médico
//   POST  /consultas                          agendar
//   PATCH /consultas/{id}/status              { status }
//   GET   /laudos/paciente/{id}
//   GET   /pacientes/{id}/receitas
//   POST  /consultas/{consultaId}/receitas    emitir receita

import type { StatusBanco, TipoUsuario, ModalidadeApi } from '../constants/banco';
import { statusParaApi, tipoUsuarioDaApi, tipoUsuarioParaApi } from '../constants/banco';
import type { PayloadCadastro } from '../data/cadastro-form';
import { soDigitos } from '../data/cadastro-form';
import { router } from 'expo-router';
import { getSessao, limparSessao } from '../lib/sessao';

export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, '');
export const MODO_MOCK = API_URL === '';

// Se você corrigir o ReceitaController do back para "/consultas/{consultaId}/receitas",
// troque só esta linha.
const rotaCriarReceita = (consultaId: number | string) => `/consultas/${consultaId}/receitas`;

// ---------------------------------------------------------------------------
// HTTP
// ---------------------------------------------------------------------------

/** O back responde {erro}, {campo: mensagem} (validação) ou o JSON padrão do Spring. */
function extrairMensagem(json: unknown, padrao: string): string {
  if (!json || typeof json !== 'object') return padrao;
  const j = json as Record<string, unknown>;

  for (const chave of ['erro', 'mensagem', 'message']) {
    const v = j[chave];
    if (typeof v === 'string' && v.trim()) return v;
  }

  const ehErroPadraoSpring = 'status' in j || 'timestamp' in j;
  if (!ehErroPadraoSpring) {
    const textos = Object.values(j).filter((v): v is string => typeof v === 'string');
    if (textos.length > 0) return textos.join('\n');
  }

  return typeof j.error === 'string' ? j.error : padrao;
}

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

  // Token expirado/inválido (o login em si não manda token): volta para a tela de login.
  if (res.status === 401 && token) {
    limparSessao();
    try {
      router.replace('/login');
    } catch {
      // navegação ainda não montada: a próxima ação do usuário já falha com a mensagem abaixo
    }
    throw new Error('Sua sessão expirou. Faça login novamente.');
  }

  if (!res.ok) {
    let mensagem = `Erro ${res.status} ao falar com o servidor.`;
    try {
      mensagem = extrairMensagem(await res.json(), mensagem);
    } catch {
      // resposta sem JSON: mantém a mensagem padrão
    }
    throw new Error(mensagem);
  }

  if (res.status === 204) return undefined as T;
  const texto = await res.text();
  return (texto ? JSON.parse(texto) : undefined) as T;
}

// ---------------------------------------------------------------------------
// Endereço
// ---------------------------------------------------------------------------

export type EnderecoApi = {
  id: number;
  cep: string;
  logradouro: string;
  numero?: string | null;
  complemento?: string | null;
  bairro: string;
  cidade: string;
  estado: string;
  pais?: string | null;
};

/** "Rua X, 123 - Cidade/UF" (o banco não tem o nome da clínica). */
export function rotuloEndereco(e?: EnderecoApi | null) {
  if (!e) return '';
  const rua = e.numero ? `${e.logradouro}, ${e.numero}` : e.logradouro;
  return `${rua} - ${e.cidade}/${e.estado}`;
}

// ---------------------------------------------------------------------------
// Autenticação e cadastro
// ---------------------------------------------------------------------------

type RespostaAuth = { id: number | string; nome: string; tipo: string; token?: string };

export async function login(cpf: string, senha: string, tipo: TipoUsuario) {
  const r = await requisicao<RespostaAuth>('POST', '/auth/login', {
    cpf: soDigitos(cpf), // o back guarda só os dígitos
    senha,
    tipo: tipoUsuarioParaApi(tipo),
  });

  const tipoRetornado = tipoUsuarioDaApi(r.tipo);
  if (tipoRetornado !== tipo) {
    throw new Error(
      tipo === 'medico'
        ? 'Esta conta não é de médico. Entre como paciente.'
        : 'Esta conta é de médico. Entre como médico.'
    );
  }

  return { usuarioId: String(r.id), tipo: tipoRetornado, nome: r.nome, token: r.token };
}

export async function cadastrar(payload: PayloadCadastro) {
  const rota = payload.perfil === 'medico' ? '/medicos' : '/pacientes';
  await requisicao<{ id: number | string; nome: string }>('POST', rota, payload.corpo);
  // O cadastro não devolve token: entra logo em seguida com o CPF e a senha informados.
  return login(payload.corpo.cpf, payload.corpo.senha, payload.perfil as TipoUsuario);
}

// ---------------------------------------------------------------------------
// Pacientes e médicos
// ---------------------------------------------------------------------------

export type PacienteApi = {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  dataNascimento: string; // AAAA-MM-DD
  tipoSanguineo?: string | null;
  statusConta?: string;
  enderecoId?: number | null;
  endereco?: EnderecoApi | null;
};

export type MedicoApi = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  crm: string;
  crmUf: string;
  especialidade: string;
  statusConta?: string;
  enderecoId?: number | null;
  endereco?: EnderecoApi | null;
};

/** Item de GET /medicos (lista pública, sem CPF/e-mail/telefone). */
export type MedicoResumoApi = {
  id: number;
  nome: string;
  crm: string;
  crmUf: string;
  especialidade: string;
  statusConta?: string;
  endereco?: EnderecoApi | null;
};

/** Item de GET /medicos/{id}/pacientes. */
export type PacienteResumoApi = {
  id: number;
  nome: string;
  dataNascimento: string; // AAAA-MM-DD
  sexoBiologico?: string | null;
  tipoSanguineo?: string | null;
};

export const listarPacientesDoMedico = (medicoId: string | number) =>
  requisicao<PacienteResumoApi[]>('GET', `/medicos/${medicoId}/pacientes`);

export const buscarPaciente = (id: string | number) =>
  requisicao<PacienteApi>('GET', `/pacientes/${id}`);

export const buscarMedico = (id: string | number) =>
  requisicao<MedicoApi>('GET', `/medicos/${id}`);

export type MedicoOpcao = {
  id: string; // medico.usuario_id
  nome: string;
  especialidade: string;
  clinica: string;
  enderecoId?: string;
};

export async function listarMedicos(): Promise<MedicoOpcao[]> {
  const linhas = await requisicao<MedicoResumoApi[]>('GET', '/medicos');
  return linhas
    .filter((m) => !m.statusConta || m.statusConta === 'ATIVA')
    .map((m) => ({
      id: String(m.id),
      nome: m.nome,
      especialidade: m.especialidade,
      clinica: rotuloEndereco(m.endereco),
      enderecoId: m.endereco ? String(m.endereco.id) : undefined,
    }));
}

// ---------------------------------------------------------------------------
// Consultas
// ---------------------------------------------------------------------------

export type ConsultaApi = {
  id: number;
  pacienteId: number;
  pacienteNome: string;
  medicoId: number;
  medicoNome: string;
  especialidade: string;
  dataConsulta: string; // AAAA-MM-DD
  horario: string; // HH:MM[:SS]
  tipoConsulta: string;
  modalidade: ModalidadeApi;
  statusConsulta: string;
  convenio?: string | null;
  motivo?: string | null;
  endereco?: EnderecoApi | null;
};

export const listarConsultasPaciente = (pacienteId: string | number) =>
  requisicao<ConsultaApi[]>('GET', `/consultas/paciente/${pacienteId}`);

export const listarConsultasMedico = (medicoId: string | number) =>
  requisicao<ConsultaApi[]>('GET', `/consultas/medico/${medicoId}`);

export type NovaConsultaApi = {
  pacienteId: number;
  medicoId: number;
  dataConsulta: string;
  horario: string;
  tipoConsulta: string;
  modalidade: ModalidadeApi;
  enderecoId: number | null;
  motivo?: string | null;
};

export const criarConsulta = (dados: NovaConsultaApi) =>
  requisicao<ConsultaApi>('POST', '/consultas', dados);

export const alterarStatusConsulta = (id: string | number, status: StatusBanco) =>
  requisicao<ConsultaApi>('PATCH', `/consultas/${id}/status`, { status: statusParaApi(status) });

// ---------------------------------------------------------------------------
// Laudos
// ---------------------------------------------------------------------------

export type LaudoResultadoApi = {
  id: number;
  nome: string;
  valor: string;
  unidade?: string | null;
  referencia?: string | null;
  status: 'NORMAL' | 'ALTO' | 'BAIXO';
};

export type LaudoApi = {
  id: number;
  pacienteId: number;
  medicoSolicitanteId?: number | null;
  consultaId?: number | null;
  titulo: string;
  tipo: 'SANGUE' | 'URINA' | 'IMAGEM';
  laboratorio: string;
  dataExame: string; // AAAA-MM-DD
  achados?: string | null;
  conclusao?: string | null;
  arquivoUrl?: string | null;
  resultados: LaudoResultadoApi[];
};

export const listarLaudosPaciente = (pacienteId: string | number) =>
  requisicao<LaudoApi[]>('GET', `/laudos/paciente/${pacienteId}`);

// ---------------------------------------------------------------------------
// Receitas
// ---------------------------------------------------------------------------

export type ReceitaItemApi = {
  id: number;
  nomeMedicamento: string;
  dosagem: string;
  quantidade: string;
  duracaoTratamento: string;
};

export type ReceitaApi = {
  id: number;
  consultaId: number;
  dataEmissao: string;
  dataVencimento: string;
  tipoReceita: string;
  numeroNotificacao?: string | null;
  statusReceita: string;
  itens: ReceitaItemApi[];
};

export const listarReceitasPaciente = (pacienteId: string | number) =>
  requisicao<ReceitaApi[]>('GET', `/pacientes/${pacienteId}/receitas`);

export type NovaReceitaApi = {
  consultaId: number;
  tipoReceita: string;
  numeroNotificacao: string | null;
  itens: Omit<ReceitaItemApi, 'id'>[];
};

export const criarReceita = (dados: NovaReceitaApi) =>
  requisicao<ReceitaApi>('POST', rotaCriarReceita(dados.consultaId), dados);