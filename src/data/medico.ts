// Dados de exemplo do médico. Quando a API estiver pronta, troque estas funções
// por chamadas reais (as telas só dependem das funções exportadas aqui).

export const HOJE = '07/10/2026'; // troque por new Date() formatado quando integrar

export type StatusConsulta = 'confirmada' | 'aberta' | 'concluida';

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
  idade: number;
  ultimaConsulta: string;
  historico: ItemHistorico[];
};

export const medico = {
  nome: 'Dr. Riquelme Santos',
  clinica: 'Clínica Bem estar',
};

const consultas: Consulta[] = [
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

const pacientes: Paciente[] = [
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

export function getConsultas() {
  return consultas;
}

export function getConsulta(id?: string) {
  return consultas.find((c) => c.id === id);
}

export function atualizarConsulta(
  id: string,
  dados: Partial<Omit<Consulta, 'id' | 'pacienteId' | 'paciente'>>
) {
  const consulta = consultas.find((c) => c.id === id);
  if (consulta) Object.assign(consulta, dados);
}

export function getPacientes() {
  return pacientes;
}

export function getPaciente(id?: string) {
  return pacientes.find((p) => p.id === id);
}

// ---------------------------------------------------------------------------
// Receitas (espelham as tabelas `receita` e `receita_item` do banco)
// ---------------------------------------------------------------------------

// ATENÇÃO: estes valores precisam ser IGUAIS aos do enum `tipo_receita` e
// `status_receita` que já existem no banco. Ajuste aqui se forem diferentes;
// a tela usa esta lista, então não precisa mudar mais nada.
export type TipoReceita =
  | 'simples'
  | 'controle_especial'
  | 'notificacao_azul'
  | 'notificacao_amarela';

export const TIPOS_RECEITA: { valor: TipoReceita; label: string }[] = [
  { valor: 'simples', label: 'Simples' },
  { valor: 'controle_especial', label: 'Controle especial' },
  { valor: 'notificacao_azul', label: 'Notificação azul (B)' },
  { valor: 'notificacao_amarela', label: 'Notificação amarela (A)' },
];

export type StatusReceita = 'emitida' | 'cancelada';
export const STATUS_RECEITA_INICIAL: StatusReceita = 'emitida';

// Notificações azul (B) e amarela (A) exigem número de notificação
// (regra validada só no app: `numero_notificacao` é opcional no banco).
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

const receitas: Receita[] = [];

export function getReceitas() {
  return receitas;
}

/** Consultas de um paciente (a receita precisa estar vinculada a uma consulta). */
export function getConsultasDoPaciente(pacienteId?: string) {
  return consultas.filter((c) => c.pacienteId === pacienteId);
}

/** Consulta sugerida: a de hoje, se houver; senão a primeira da lista. */
export function getConsultaPadrao(pacienteId?: string) {
  const lista = getConsultasDoPaciente(pacienteId);
  return (lista.find((c) => c.data === HOJE) ?? lista[0])?.id;
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