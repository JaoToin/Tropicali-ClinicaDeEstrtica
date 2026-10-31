import { FuncionarioService } from './../../../Service/Funcionario/funcionario/funcionario-module';
import { Component, signal, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Funcionario, PessoaEndereco, Endereco } from '../../../models/funcionario';

@Component({
  imports: [FormsModule],
  selector: 'app-funcionarios',
  styleUrl: './funcionarios.css',
  templateUrl: './funcionarios.html',
})
export class Funcionarios  {

  // Dados do funcionário
  idPessoa = 0
  cargo = ''
  dataAdmissao = ''

  // Dados da pessoa
  nome = ''
  cpf = ''
  sexo = ''
  data = ''            // data de nascimento
  telefone = ''
  email = ''

  // Dados do endereço
  enderecoId = 0
  cep = ''
  numero = ''
  complemento = ''

  editar = false
  listaFuncionarios = signal<Funcionario[]>([])

  constructor(
    private servico: FuncionarioService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.listarFuncionarios()

    this.idPessoa = Number(this.route.snapshot.paramMap.get('id'))
    if (this.idPessoa > 0) {
      this.editar = true
      this.carregaCampo(this.idPessoa)
    }
  }

  // LISTAR TODOS
  listarFuncionarios() {
    this.servico.listarfuncionarios()
      .subscribe({
        next: (dados) => {
          this.listaFuncionarios.set(
            [...dados].sort((a, b) =>
              (a.pessoas?.[0]?.nome ?? '').localeCompare(b.pessoas?.[0]?.nome ?? ''))
          )
        },
        error: (msgErro) => {
          console.log("Erro ao listar funcionários", msgErro)
        }
      })
  }

  // CARREGAR UM FUNCIONÁRIO NO FORMULÁRIO
  carregaCampo(id: number) {
    this.editar = true
    this.servico.listarfuncionario(id)
      .subscribe({
        next: (obj) => {
          this.idPessoa = obj.idPessoa
          this.cargo = obj.cargo
          this.dataAdmissao = obj.dataAdmissao

          const p = obj.pessoas?.[0]
          if (p) {
            this.nome = p.nome
            this.sexo = p.sexo
            this.data = p.dataNascimento
            this.email = p.email
            this.cpf = String(p.cpf ?? '')
            this.telefone = String(p.telefone ?? '')

            const end = p.enderecos?.[0]
            if (end) {
              this.enderecoId = end.idEndereco
              this.cep = end.cep
              this.numero = end.numero
              this.complemento = end.complemento
            }
          }

          this.cdr.detectChanges()
        },
        error: (msgErro) => {
          console.log("Erro ao carregar funcionário", msgErro)
        }
      })
  }

  // CADASTRAR / ALTERAR
  enviaDadosFuncionario() {
    const endereco = new Endereco()
    endereco.cep = this.cep.replace(/\D/g, '')
    endereco.numero = this.numero
    endereco.complemento = this.complemento

    const pessoa = new PessoaEndereco()
    pessoa.nome = this.nome
    pessoa.cpf = String(this.cpf).replace(/\D/g, '')
    pessoa.telefone = String(this.telefone).replace(/\D/g, '')
    endereco.cep = String(this.cep).replace(/\D/g, '')
    pessoa.email = this.email
    pessoa.sexo = this.sexo
    pessoa.dataNascimento = this.data
    pessoa.ativoPessoa = 'S'
    pessoa.enderecos = [endereco]

    const funcionario = new Funcionario()
    funcionario.cargo = this.cargo
    funcionario.dataAdmissao = this.dataAdmissao
    funcionario.pessoas = [pessoa]

    if (!this.editar) {
      this.servico.adicionarfuncionario(funcionario).subscribe({
        next: (resposta) => {
          console.log(resposta)
          this.limpar()
          this.listarFuncionarios()
        },
        error: (msgErro) => console.log("Erro ao cadastrar", msgErro)
      })
    } else {
      funcionario.idPessoa = this.idPessoa
      pessoa.idPessoa = this.idPessoa
      endereco.idPessoa = this.idPessoa
      endereco.idEndereco = this.enderecoId

      this.servico.alterarfuncionario(funcionario).subscribe({
        next: (resposta) => {
          console.log(resposta)
          this.limpar()
          this.listarFuncionarios()
        },
        error: (msgErro) => console.log("Erro ao alterar", msgErro)
      })
    }
  }

  // EXCLUIR
  excluir(funcionario: Funcionario) {
    const nomeFunc = funcionario.pessoas?.[0]?.nome ?? funcionario.idPessoa
    if (confirm(`Deseja excluir ${nomeFunc} do Banco de Dados?`)) {
      this.servico.exluirfuncionario(funcionario)
        .subscribe({
          next: (dados) => {
            this.listaFuncionarios.update(lista =>
              lista.filter(f => f.idPessoa !== funcionario.idPessoa)
            )
            console.log('Funcionário excluído com sucesso', dados)
          },
          error: (msgErro) => {
            console.log("Erro ao excluir funcionário", msgErro)
          }
        })
    }
  }

  limpar() {
    this.idPessoa = 0
    this.cargo = ''
    this.dataAdmissao = ''
    this.nome = ''
    this.cpf = ''
    this.sexo = ''
    this.data = ''
    this.email = ''
    this.telefone = ''
    this.enderecoId = 0
    this.cep = ''
    this.numero = ''
    this.complemento = ''
    this.editar = false
  }
}
