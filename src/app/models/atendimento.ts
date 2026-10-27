export class Atendimento {
  idPessoa: number = 0;
  dataAtendimento: string = '';
  statusAtendimento: string = 'Aberto';
  itens: ItemAtendimento[] = [new ItemAtendimento()];
}

export class ItemAtendimento {
  idItem: number = 0;
  idFuncionario: number = 0;
  quantidade: number = 0;
  valorUnitario: number = 0;
}
