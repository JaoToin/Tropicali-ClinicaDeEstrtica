export class CategoriaModelo {
  idcategoria: number = 0;
  categoria: string = '';
  items: ItemNavigation[] = [];
}

export class ItemNavigation {
  iditem: number = 0
  idcategoria: number = 0
  item1: string = ''
  descricaoItem: string = ''
  preco: number = 0
  tipoItem: string = ''
  ativoProdutoServico: string = ''
}
