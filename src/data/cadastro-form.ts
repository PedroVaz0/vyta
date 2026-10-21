// Regras, máscaras e montagem do payload do cadastro.
// O formato do payload segue as colunas das tabelas usuario, paciente,
// medico e endereco do banco.

export type Perfil = 'medico' | 'paciente';

export type CadastroForm = {
  // usuario
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  nascimento: string; // DD/MM/AAAA
  sexo: string;
  identidade: string;
  senha: string;
  confirmarSenha: string;
  contatoNome: string;
  contatoTel: string;
  // paciente
  tipoSanguineo: string;
  // medico
  crm: string;
  crmUf: string;
  especialidade: string;
  // endereco (opcional no banco, mas completo se informado)
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
};

export const FORM_INICIAL: CadastroForm = {
  nome: '',
  email: '',
  cpf: '',
  telefone: '',
  nascimento: '',
  sexo: '',
  identidade: '',
  senha: '',
  confirmarSenha: '',
  contatoNome: '',
  contatoTel: '',
  tipoSanguineo: '',
  crm: '',
  crmUf: '',
  especialidade: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  pais: 'Brasil',
};

// sexo_biologico e identidade_genero são varchar no banco.
export const SEXOS_BIOLOGICOS = ['Feminino', 'Masculino', 'Intersexo'];
export const IDENTIDADES_GENERO = [
  'Mulher cis',
  'Homem cis',
  'Mulher trans',
  'Homem trans',
  'Não binário',
  'Outra',
  'Prefiro não informar',
];
export const TIPOS_SANGUINEOS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
export const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
  'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

// ATENÇÃO: precisa ser um valor que já exista no enum `tipo_endereco` do banco.
export const TIPO_ENDERECO_USUARIO = 'residencial';

// ---------------------------------------------------------------------------
// Máscaras
// ---------------------------------------------------------------------------

export const soDigitos = (t: string) => t.replace(/\D/g, '');

export function mascaraCpf(t: string) {
  return soDigitos(t)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function mascaraTelefone(t: string) {
  const d = soDigitos(t).slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function mascaraData(t: string) {
  const d = soDigitos(t).slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

export function mascaraCep(t: string) {
  const d = soDigitos(t).slice(0, 8);
  return d.length <= 5 ? d : `${d.slice(0, 5)}-${d.slice(5)}`;
}

// ---------------------------------------------------------------------------
// Validações
// ---------------------------------------------------------------------------

export function validarCpf(valor: string) {
  const c = soDigitos(valor);
  if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
  const digito = (base: string, pesoInicial: number) => {
    const soma = base.split('').reduce((acc, n, i) => acc + Number(n) * (pesoInicial - i), 0);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return digito(c.slice(0, 9), 10) === Number(c[9]) && digito(c.slice(0, 10), 11) === Number(c[10]);
}

/** Converte DD/MM/AAAA em AAAA-MM-DD (tipo `date` do banco); null se inválida. */
export function dataParaIso(texto: string) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
  if (!m) return null;
  const [dia, mes, ano] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const d = new Date(ano, mes - 1, dia);
  const valida = d.getFullYear() === ano && d.getMonth() === mes - 1 && d.getDate() === dia;
  if (!valida || ano < 1900 || d > new Date()) return null;
  return `${m[3]}-${m[2]}-${m[1]}`;
}

const telefoneValido = (t: string) => [10, 11].includes(soDigitos(t).length);
const ufValida = (t: string) => UFS.includes(t.trim().toUpperCase());

export type Erros = Partial<Record<keyof CadastroForm, string>>;

const CAMPOS_ENDERECO: (keyof CadastroForm)[] = [
  'cep',
  'logradouro',
  'numero',
  'bairro',
  'cidade',
  'estado',
];

export const enderecoPreenchido = (f: CadastroForm) =>
  CAMPOS_ENDERECO.some((c) => f[c].trim() !== '');

export function validarEtapa(etapa: number, f: CadastroForm, perfil: Perfil): Erros {
  const e: Erros = {};

  if (etapa === 0) {
    if (f.nome.trim().split(/\s+/).length < 2) e.nome = 'Informe nome e sobrenome.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'E-mail inválido.';
    if (!validarCpf(f.cpf)) e.cpf = 'CPF inválido.';
    if (!telefoneValido(f.telefone)) e.telefone = 'Informe DDD e número.';
    if (!dataParaIso(f.nascimento)) e.nascimento = 'Data inválida (DD/MM/AAAA).';
    if (!f.sexo) e.sexo = 'Selecione uma opção.';
    if (!f.identidade) e.identidade = 'Selecione uma opção.';
    if (f.senha.length < 8) e.senha = 'A senha deve ter pelo menos 8 caracteres.';
    if (f.confirmarSenha !== f.senha) e.confirmarSenha = 'As senhas não coincidem.';
  }

  if (etapa === 1) {
    if (!f.contatoNome.trim()) e.contatoNome = 'Informe o nome do contato.';
    if (!telefoneValido(f.contatoTel)) e.contatoTel = 'Informe DDD e número.';
    if (perfil === 'medico') {
      if (!/^\d{4,7}$/.test(f.crm.trim())) e.crm = 'CRM inválido (somente números).';
      if (!ufValida(f.crmUf)) e.crmUf = 'UF inválida.';
      if (!f.especialidade.trim()) e.especialidade = 'Informe a especialidade.';
    }
  }

  if (etapa === 2 && enderecoPreenchido(f)) {
    if (soDigitos(f.cep).length !== 8) e.cep = 'CEP inválido.';
    if (!f.logradouro.trim()) e.logradouro = 'Informe o logradouro.';
    if (!f.numero.trim()) e.numero = 'Informe o número.';
    if (!f.bairro.trim()) e.bairro = 'Informe o bairro.';
    if (!f.cidade.trim()) e.cidade = 'Informe a cidade.';
    if (!ufValida(f.estado)) e.estado = 'UF inválida.';
    if (!f.pais.trim()) e.pais = 'Informe o país.';
  }

  return e;
}

// ---------------------------------------------------------------------------
// Payload (colunas do banco)
// ---------------------------------------------------------------------------

export function montarPayload(perfil: Perfil, f: CadastroForm) {
  return {
    usuario: {
      // Ajuste se o enum/valores de `tipo_usuario` no banco forem outros.
      tipo_usuario: perfil,
      nome: f.nome.trim(),
      cpf: soDigitos(f.cpf),
      email: f.email.trim().toLowerCase(),
      telefone: soDigitos(f.telefone),
      data_nascimento: dataParaIso(f.nascimento),
      sexo_biologico: f.sexo,
      identidade_genero: f.identidade,
      nome_contato_emergencia: f.contatoNome.trim(),
      tel_contato_emergencia: soDigitos(f.contatoTel),
      // status_conta: definido pelo backend ao criar a conta.
      // senha: enviar por HTTPS; o backend deve gravar apenas o hash.
      senha: f.senha,
    },
    endereco: enderecoPreenchido(f)
      ? {
          cep: soDigitos(f.cep),
          logradouro: f.logradouro.trim(),
          numero: f.numero.trim(),
          complemento: f.complemento.trim() || null,
          bairro: f.bairro.trim(),
          cidade: f.cidade.trim(),
          estado: f.estado.trim().toUpperCase(),
          pais: f.pais.trim(),
          tipo_endereco: TIPO_ENDERECO_USUARIO,
        }
      : null, // usuario.endereco_id é opcional
    paciente: perfil === 'paciente' ? { tipo_sanguineo: f.tipoSanguineo || null } : null,
    medico:
      perfil === 'medico'
        ? {
            crm: f.crm.trim(),
            crm_uf: f.crmUf.trim().toUpperCase(),
            especialidade: f.especialidade.trim(),
          }
        : null,
  };
}
