// Conversões entre o banco (date: AAAA-MM-DD, time: HH:MM[:SS]) e o que o app exibe.
// Não usa `new Date('AAAA-MM-DD')` de propósito: isso interpreta a data em UTC
// e pode mostrar o dia anterior no fuso do Brasil.

const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

const dois = (n: number) => String(n).padStart(2, '0');

/** Date local -> 'AAAA-MM-DD' (coluna `date`). */
export function dateParaIso(d: Date) {
  return `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())}`;
}

/** 'AAAA-MM-DD' -> 'DD/MM/AAAA' */
export function isoParaBr(iso?: string | null) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso ?? '');
  return m ? `${m[3]}/${m[2]}/${m[1]}` : '';
}

/** 'DD/MM/AAAA' -> 'AAAA-MM-DD' (null se inválida) */
export function brParaIso(br: string) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(br);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : null;
}

/** 'AAAA-MM-DD' -> '05 de novembro de 2026' (formato das telas de consulta) */
export function isoParaExtenso(iso?: string | null) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso ?? '');
  return m ? `${m[3]} de ${MESES[Number(m[2]) - 1]} de ${m[1]}` : '';
}

/** Date local -> '05 de novembro de 2026' */
export function dateParaExtenso(d: Date) {
  return `${dois(d.getDate())} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
}

/** '14:00:00' -> '14:00' (coluna `time`) */
export function horaCurta(hora?: string | null) {
  return (hora ?? '').slice(0, 5);
}