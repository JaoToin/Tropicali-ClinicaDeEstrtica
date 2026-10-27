export class Endereco {
  idEndereco: number = 0;
  cep: string = '';
  numero: string = '';
  complemento: string = '';
}

export class PessoaEndereco {
  idPessoa: number = 0;
  nome: string = '';
  cpf: string = '';
  telefone: string = '';
  email: string = '';
  sexo: string = '';
  dataNascimento: string = '';
  ativoPessoa: string = 'Ativo';
  enderecos: Endereco[] = [new Endereco()];
}
