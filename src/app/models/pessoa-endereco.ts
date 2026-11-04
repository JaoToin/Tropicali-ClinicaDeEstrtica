export class Endereco {
  idEndereco: number | null = null   // null = endereço novo
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
  dataNascimento: string = ''        // "yyyy-MM-dd"
  ativoPessoa: string = 'S'
  enderecos: Endereco[] = []
}
