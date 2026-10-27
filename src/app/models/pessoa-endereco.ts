export class Endereco {
  idEndereco: number = 0
  idPessoa: number = 0
  cep: string = ''
  numero: string = ''
  complemento: string = ''
}

export class PessoaEndereco {
  idPessoa: number = 0
  nome: string = ''
  cpf: string = ''
  telefone: string = ''
  email: string = ''
  sexo: string = ''
  dataNascimento: Date = new Date
  ativoPessoa: string = 'S'
  enderecos: Endereco[] = []
}
