// Dados de exemplo dos laudos. Quando a API estiver pronta, troque
// `LAUDOS` / `getLaudoPorId` por chamadas ao backend (mantendo os tipos).

export type StatusResultado = 'normal' | 'alto' | 'baixo';

export type Resultado = {
  nome: string;
  valor: string;
  unidade?: string;
  referencia?: string;
  status: StatusResultado;
};

export type Laudo = {
  id: string;
  titulo: string;
  tipo: 'Sangue' | 'Imagem' | 'Urina';
  laboratorio: string;
  data: string; // data do exame
  medicoSolicitante: string;
  resultados?: Resultado[]; // exames com valores (sangue, urina...)
  achados?: string; // exames de imagem
  conclusao?: string;
  url?: string; // PDF original, quando o backend fornecer
};

export const LAUDOS: Laudo[] = [
  {
    id: '1',
    titulo: 'Hemograma Completo',
    tipo: 'Sangue',
    laboratorio: 'Laboratório Oswaldo Cruz',
    data: '21/08/2026',
    medicoSolicitante: 'Dra. Camila Rocha',
    resultados: [
      { nome: 'Hemácias', valor: '4,8', unidade: 'milhões/mm³', referencia: '4,5 a 5,9', status: 'normal' },
      { nome: 'Hemoglobina', valor: '14,2', unidade: 'g/dL', referencia: '13,5 a 17,5', status: 'normal' },
      { nome: 'Hematócrito', valor: '42', unidade: '%', referencia: '41 a 53', status: 'normal' },
      { nome: 'VCM', valor: '88', unidade: 'fL', referencia: '80 a 100', status: 'normal' },
      { nome: 'Leucócitos', valor: '11.800', unidade: '/mm³', referencia: '4.000 a 11.000', status: 'alto' },
      { nome: 'Plaquetas', valor: '245.000', unidade: '/mm³', referencia: '150.000 a 450.000', status: 'normal' },
    ],
    conclusao:
      'Leucócitos levemente acima do valor de referência. Demais parâmetros dentro da normalidade.',
  },
  {
    id: '2',
    titulo: 'Raio-X do Tórax',
    tipo: 'Imagem',
    laboratorio: 'Clínica Bem Estar',
    data: '17/06/2026',
    medicoSolicitante: 'Dr. Paulo Menezes',
    achados:
      'Campos pulmonares limpos, sem consolidações ou derrame pleural. Área cardíaca de tamanho normal. Seios costofrênicos livres.',
    conclusao: 'Exame sem alterações significativas.',
  },
  {
    id: '3',
    titulo: 'Exame de Urina Tipo I',
    tipo: 'Urina',
    laboratorio: 'Laboratório Oswaldo Cruz',
    data: '02/03/2026',
    medicoSolicitante: 'Dra. Camila Rocha',
    resultados: [
      { nome: 'Cor', valor: 'Amarelo claro', status: 'normal' },
      { nome: 'Aspecto', valor: 'Límpido', status: 'normal' },
      { nome: 'Densidade', valor: '1.020', referencia: '1.005 a 1.030', status: 'normal' },
      { nome: 'pH', valor: '6,0', referencia: '5,0 a 8,0', status: 'normal' },
      { nome: 'Proteínas', valor: 'Ausentes', status: 'normal' },
      { nome: 'Glicose', valor: 'Ausente', status: 'normal' },
    ],
    conclusao: 'Todos os parâmetros dentro da normalidade.',
  },
  {
    id: '4',
    titulo: 'Glicemia em Jejum',
    tipo: 'Sangue',
    laboratorio: 'Laboratório Oswaldo Cruz',
    data: '15/01/2026',
    medicoSolicitante: 'Dr. Paulo Menezes',
    resultados: [
      { nome: 'Glicose', valor: '92', unidade: 'mg/dL', referencia: '70 a 99', status: 'normal' },
    ],
    conclusao: 'Glicemia de jejum dentro do valor de referência.',
  },
];

export const getLaudoPorId = (id?: string) => LAUDOS.find((l) => l.id === id);