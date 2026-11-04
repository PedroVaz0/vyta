import { useSyncExternalStore } from 'react';
import { LAUDOS, type Laudo, type StatusResultado } from '../data/laudos';
import { isoParaBr } from '../lib/datas';
import { getSessao } from '../lib/sessao';
import { MODO_MOCK, buscarMedico, listarLaudosPaciente, type LaudoApi } from '../services/api';

const VAZIO: Laudo[] = [];

let laudos: Laudo[] = MODO_MOCK ? LAUDOS : VAZIO;
let dono: string | null = null;

const idLogado = () => getSessao()?.usuarioId ?? null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  if (MODO_MOCK) return laudos;
  return dono !== null && dono === idLogado() ? laudos : VAZIO;
}

function atualizar(novos: Laudo[]) {
  laudos = novos;
  dono = idLogado();
  listeners.forEach((l) => l());
}

const TIPO_LAUDO: Record<LaudoApi['tipo'], Laudo['tipo']> = {
  SANGUE: 'Sangue',
  URINA: 'Urina',
  IMAGEM: 'Imagem',
};

// O back só devolve o id do médico solicitante; guardamos os nomes já buscados.
const nomesMedicos = new Map<number, string>();

async function carregarNomesMedicos(ids: number[]) {
  const faltando = ids.filter((id) => !nomesMedicos.has(id));
  await Promise.all(
    faltando.map((id) =>
      buscarMedico(id)
        .then((m) => nomesMedicos.set(id, m.nome))
        .catch(() => {})
    )
  );
}

function doApi(l: LaudoApi): Laudo {
  const resultados = l.resultados.map((r) => ({
    nome: r.nome,
    valor: r.valor,
    unidade: r.unidade ?? undefined,
    referencia: r.referencia ?? undefined,
    status: r.status.toLowerCase() as StatusResultado,
  }));

  return {
    id: String(l.id),
    titulo: l.titulo,
    tipo: TIPO_LAUDO[l.tipo] ?? 'Sangue',
    laboratorio: l.laboratorio,
    data: isoParaBr(l.dataExame),
    dataIso: l.dataExame,
    medicoSolicitante:
      (l.medicoSolicitanteId != null && nomesMedicos.get(l.medicoSolicitanteId)) ||
      'Não informado',
    resultados: resultados.length > 0 ? resultados : undefined,
    achados: l.achados ?? undefined,
    conclusao: l.conclusao ?? undefined,
    url: l.arquivoUrl ?? undefined,
  };
}

/** Busca os laudos do paciente logado. No modo mock não faz nada. */
export async function carregarLaudos() {
  if (MODO_MOCK) return;
  const sessao = getSessao();
  if (!sessao) throw new Error('Sessão expirada. Faça login novamente.');

  const linhas = await listarLaudosPaciente(sessao.usuarioId);
  const ids = [...new Set(linhas.map((l) => l.medicoSolicitanteId).filter((v): v is number => v != null))];
  await carregarNomesMedicos(ids);
  atualizar(linhas.map(doApi));
}

export function getLaudoPorId(id?: string) {
  return getSnapshot().find((l) => l.id === id);
}

export function useLaudos() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}