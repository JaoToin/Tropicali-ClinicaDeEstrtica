// Remove acentos e deixa em minúsculas: a busca ignora acento e maiúscula
export function normalizar(valor: unknown): string {
  return String(valor ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

// Monta o texto de erro que a API devolveu (campos "mensagem" e "erro"),
// para aparecer num alerta em vez de só "500" no console.
export function mensagemErro(e: any): string {
  const corpo = e?.error

  if (typeof corpo === 'string' && corpo) {
    return corpo
  }
  if (corpo?.erro) {
    return `${corpo.mensagem ?? 'Erro'}\n${corpo.erro}`
  }
  if (corpo?.mensagem) {
    return corpo.mensagem
  }
  if (corpo?.errors) {
    return Object.entries(corpo.errors)
      .map(([campo, msgs]) => `${campo}: ${(msgs as string[]).join(' ')}`)
      .join('\n')
  }
  if (e?.status === 0) {
    return 'A API não respondeu. Confira se ela está rodando.'
  }
  return `Erro ${e?.status ?? ''}`.trim()
}
