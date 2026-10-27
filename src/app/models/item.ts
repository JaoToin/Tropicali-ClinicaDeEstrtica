export class ItemNavigation {
  iditem: number = 0
  idcategoria: number = 0
  item1: string = ''
  descricaoItem: string = ''
  preco: number = 0
  tipoItem: string = ''
  ativoProdutoServico: string = ''
}

export class Itens {
  iditem: number = 0
  codigoPreco: number = 0
  precoVenda: number = 0
  unidade: string = ''
  estoque: number | null = null
  iditemNavigation: ItemNavigation = new ItemNavigation()
}
