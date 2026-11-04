import { PessoaEndereco } from './pessoa-endereco'

export class Funcionario {
  idPessoa: number = 0
  cargo: string = ''
  dataAdmissao: string = ''          // "yyyy-MM-dd"
  pessoas: PessoaEndereco[] = []
}
