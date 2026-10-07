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

export function adicionarReceita(
  pacienteId: string,
  receita: { medicamento: string; dosagem: string; instrucoes: string }
) {
  const paciente = pacientes.find((p) => p.id === pacienteId);
  if (!paciente) return;

  paciente.historico.unshift({
    id: `h${Date.now()}`,
    tipo: 'receita',
    titulo: `Receita: ${receita.medicamento}`,
    data: HOJE,
    descricao: [receita.dosagem, receita.instrucoes].filter(Boolean).join(' - '),
  });
}