export class ItemAtendimento {
  idItem: number = 0
  idFuncionario: number = 0
  quantidade: number = 0
  valorUnitario: number = 0
}

export class AtendimentoModelo {
  idAtendimento: number = 0
  idPessoa: number = 0
  nomePessoa: string = ''
  dataAtendimento: string = ''
  status: string = ''              // o GET devolve "status"
  statusAtendimento: string = 'A'  // POST e PUT esperam "statusAtendimento"
  itens: ItemAtendimento[] = []
}
