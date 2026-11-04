
// formato que o POST e o PUT do ProdutoItem esperam (ProdutoDTO, "achatado")
export class ProdutoItem {
  idCategoria: number = 0
  item: string = ''
  descricaoItem: string = ''
  preco: number = 0
  tipoItem: string = 'P'               // P = produto, S = serviço
  ativoProdutoServico: string = 'A'    // A = ativo, I = inativo
  codigoPreco: string = ''
  precoVenda: number = 0
  unidade: string = 'UN'
}
