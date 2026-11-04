export class Entrada {
  idEntrada: number = 0
  idItem: number = 0
  dataEntrada: string = ''
  quantidadeEntrada: number = 0
  unidade: string = ''
  precoUnitario: number = 0
}

// o GET devolve um estoque por produto, com as entradas dentro
export class EstoqueModelo {
  idItem: number = 0
  quantidade: number = 0
  entradas: Entrada[] = []
}
