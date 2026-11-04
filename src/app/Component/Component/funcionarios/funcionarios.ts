import { Component, OnInit, signal, computed, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FuncionarioService } from './../../../Service/Funcionario/funcionario/funcionario-module';
import { Funcionario } from '../../../models/funcionario';
import { PessoaEndereco, Endereco } from '../../../models/pessoa-endereco';
import { normalizar, mensagemErro } from '../../../../../Util/util';

@Component({
  imports: [FormsModule],
  selector: 'app-funcionarios',
  styleUrl: './funcionarios.css',
  templateUrl: './funcionarios.html',
})
export class Funcionarios implements OnInit {

  // funcionário
  idPessoa = 0
  cargo = ''
  dataAdmissao = ''

  // pessoa
  nome = ''
  cpf = ''
  telefone = ''
  email = ''
  sexo = ''              // M, F ou N (não declarar)
  dataNascimento = ''

  // endereço
  enderecoId = 0
  cep = ''
  numero = ''
  complemento = ''

  editar = false
  listaFuncionarios = signal<Funcionario[]>([])
  busca = signal('')

  // lista depois da pesquisa (nome, cargo ou CPF)
  funcionariosFiltrados = computed(() => {
    const termo = normalizar(this.busca())
    if (!termo) {
      return this.listaFuncionarios()
    }
    return this.listaFuncionarios().filter(f =>
      normalizar(f.pessoas?.[0]?.nome).includes(termo)
      || normalizar(f.cargo).includes(termo)
      || String(f.pessoas?.[0]?.cpf ?? '').includes(termo))
  })

  constructor(
    private servico: FuncionarioService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.listarFuncionarios()

    const id = Number(this.route.snapshot.paramMap.get('id'))
    if (id > 0) {
      this.carregaCampo(id)
    }
  }

  // CPF, telefone e CEP chegam como número da API: converte para texto antes de limpar
  private apenasDigitos(valor: unknown): string {
    return String(valor ?? '').replace(/\D/g, '')
  }

  listarFuncionarios() {
    this.servico.listarfuncionarios()
      .subscribe({
        next: (dados) => {
          this.listaFuncionarios.set(
            [...dados].sort((a, b) =>
              (a.pessoas?.[0]?.nome ?? '').localeCompare(b.pessoas?.[0]?.nome ?? ''))
          )
        },
        error: (msgErro) => console.log('Erro ao listar funcionários', msgErro)
      })
  }

  carregaCampo(id: number) {
    this.editar = true
    this.servico.listarfuncionario(id)
      .subscribe({
        next: (obj) => {
          this.idPessoa = obj.idPessoa
          this.cargo = obj.cargo ?? ''
          this.dataAdmissao = String(obj.dataAdmissao ?? '').substring(0, 10)

          const p = obj.pessoas?.[0]
          if (p) {
            this.nome = p.nome ?? ''
            this.cpf = String(p.cpf ?? '')
            this.telefone = String(p.telefone ?? '')
            this.email = p.email ?? ''
            this.sexo = p.sexo ?? ''
            this.dataNascimento = String(p.dataNascimento ?? '').substring(0, 10)

            const end = p.enderecos?.[0]
            if (end) {
              this.enderecoId = end.idEndereco ?? 0
              this.cep = String(end.cep ?? '')
              this.numero = end.numero ?? ''
              this.complemento = end.complemento ?? ''
            } else {
              this.enderecoId = 0
              this.cep = ''
              this.numero = ''
              this.complemento = ''
            }
          }

          this.cdr.detectChanges()
        },
        error: (msgErro) => {
          console.log('Erro ao carregar funcionário', msgErro)
          alert(mensagemErro(msgErro))
        }
      })
  }

  enviaDadosFuncionario() {
    if (!this.nome.trim() || !this.cargo.trim() || !this.dataAdmissao || !this.dataNascimento
        || !this.apenasDigitos(this.cpf) || !this.apenasDigitos(this.telefone)) {
      alert('Preencha nome, cargo, data de admissão, CPF, telefone e data de nascimento.')
      return
    }

    const endereco = new Endereco()
    endereco.cep = this.apenasDigitos(this.cep)
    endereco.numero = this.numero
    endereco.complemento = this.complemento

    const pessoa = new PessoaEndereco()
    pessoa.nome = this.nome
    pessoa.cpf = this.apenasDigitos(this.cpf)
    pessoa.telefone = this.apenasDigitos(this.telefone)
    pessoa.email = this.email
    pessoa.sexo = this.sexo
    pessoa.dataNascimento = this.dataNascimento
    pessoa.ativoPessoa = 'S'
    pessoa.enderecos = [endereco]

    const funcionario = new Funcionario()
    funcionario.cargo = this.cargo
    funcionario.dataAdmissao = this.dataAdmissao
    funcionario.pessoas = [pessoa]

    if (!this.editar) {
      this.servico.adicionarfuncionario(funcionario).subscribe({
        next: () => {
          this.limpar()
          this.listarFuncionarios()
        },
        error: (msgErro) => {
          console.log('Erro ao cadastrar', msgErro)
          alert(mensagemErro(msgErro))
        }
      })
    } else {
      funcionario.idPessoa = this.idPessoa
      pessoa.idPessoa = this.idPessoa
      endereco.idPessoa = this.idPessoa
      endereco.idEndereco = this.enderecoId > 0 ? this.enderecoId : null

      this.servico.alterarfuncionario(funcionario).subscribe({
        next: () => {
          this.limpar()
          this.listarFuncionarios()
        },
        error: (msgErro) => {
          console.log('Erro ao alterar', msgErro)
          alert(mensagemErro(msgErro))
        }
      })
    }
  }

  excluir(func: Funcionario) {
    const nomeFunc = func.pessoas?.[0]?.nome ?? `#${func.idPessoa}`
    if (confirm(`Deseja excluir ${nomeFunc} do Banco de Dados?`)) {
      this.servico.exluirfuncionario(func)
        .subscribe({
          next: () => {
            this.listaFuncionarios.update(lista =>
              lista.filter(f => f.idPessoa !== func.idPessoa)
            )
          },
          error: (msgErro) => {
            console.log('Erro ao excluir funcionário', msgErro)
            alert(mensagemErro(msgErro))
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
    this.telefone = ''
    this.email = ''
    this.sexo = ''
    this.dataNascimento = ''
    this.enderecoId = 0
    this.cep = ''
    this.numero = ''
    this.complemento = ''
    this.editar = false
  }
}
