export class Funcionario {
  idPessoa: number = 0;
  cargo: string = '';
  dataAdmissao: string = '';
  pessoas: PessoaEndereco[] = [new PessoaEndereco()];
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

export class Endereco {
  idEndereco: number = 0;
  idPessoa: number = 0; 
  cep: string = '';
  numero: string = '';
  complemento: string = '';
}
