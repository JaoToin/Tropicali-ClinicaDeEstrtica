export class ItemNavigation {
  iditem: number = 0
  idcategoria: number = 0
  item1: string = ''
  descricaoItem: string = ''
  preco: number | null = null
  tipoItem: string = ''
  ativoProdutoServico: string = ''
}

export class CategoriaModelo {
  idcategoria: number = 0
  categoria: string = ''
  items: ItemNavigation[] = []
}
