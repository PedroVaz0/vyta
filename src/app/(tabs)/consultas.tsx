import { useSyncExternalStore } from "react";

export type StatusConsulta = "agendada" | "concluida" | "cancelada";

export type Consulta = {
  id: string;
  medico: string;
  especialidade: string;
  clinica: string;
  data: string;
  horario: string;
  status: StatusConsulta;
};

// Dados de exemplo — troque pelos dados reais vindos da API quando estiver pronta.
let consultas: Consulta[] = [
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

// TODO: quando o backend existir, envie para a API e depois atualize a lista.
export function adicionarConsulta(nova: Omit<Consulta, "id" | "status">) {
  const consulta: Consulta = {
    ...nova,
    id: String(Date.now()),
    status: "agendada",
  };
  consultas = [consulta, ...consultas];
  listeners.forEach((l) => l());
}

export function useConsultas() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
