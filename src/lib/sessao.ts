// Guarda quem está logado (em memória). Some ao fechar o app.
// Para manter o login entre aberturas, grave o token com expo-secure-store.

import { useSyncExternalStore } from 'react';
import type { TipoUsuario } from '../constants/banco';

export type Sessao = {
  usuarioId: string; // usuario.usuario_id (int8, guardado como texto)
  tipo: TipoUsuario;
  nome: string;
  token?: string;
};

let sessao: Sessao | null = null;
const listeners = new Set<() => void>();

const notificar = () => listeners.forEach((l) => l());

export const getSessao = () => sessao;

export function setSessao(nova: Sessao) {
  sessao = nova;
  notificar();
}

export function limparSessao() {
  sessao = null;
  notificar();
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function useSessao() {
  return useSyncExternalStore(subscribe, getSessao, getSessao);
}