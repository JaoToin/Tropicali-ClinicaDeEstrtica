export class Entrada {
  idEntrada: number = 0
  idItem: number = 0
  dataEntrada: string = ''
  quantidadeEntrada: number = 0
  unidade: string = ''
  precoUnitario: number = 0
}

export class EstoqueModelo {
  idItem: number = 0
  quantidade: number = 0
  entradas: Entrada[] = []
}
