import { PessoaEnderecoService } from './../../../Service/Clienet/pessoa-endereço';
import { Component, OnInit, signal, computed, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PessoaEndereco, Endereco } from '../../../models/pessoa-endereco';
import { normalizar, mensagemErro } from '../../../../../Util/util';

@Component({
  imports: [FormsModule],
  selector: 'app-pessoa',
  styleUrl: './pessoa.css',
  templateUrl: './pessoa.html',
})
export class Pessoa implements OnInit {

  pessoaId = 0
  nome = ''
  cpf = ''
  sexo = ''              // M, F ou N (não declarar)
  data = ''              // data de nascimento "yyyy-MM-dd"
  email = ''
  telefone = ''
  enderecoId = 0
  cep = ''
  numero = ''
  complemento = ''
  editar = false

  listaPessoa = signal<PessoaEndereco[]>([])
  busca = signal('')

  // lista depois da pesquisa (nome, CPF ou e-mail)
  pessoasFiltradas = computed(() => {
    const termo = normalizar(this.busca())
    if (!termo) {
      return this.listaPessoa()
    }
    return this.listaPessoa().filter(p =>
      normalizar(p.nome).includes(termo)
      || String(p.cpf ?? '').includes(termo)
      || normalizar(p.email).includes(termo))
  })

  constructor(
    private servico: PessoaEnderecoService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.listarPessoas()

    const id = Number(this.route.snapshot.paramMap.get('id'))
    if (id > 0) {
      this.carregaCampo(id)
    }
  }

  // CPF, telefone e CEP chegam como número da API: converte para texto antes de limpar
  private apenasDigitos(valor: unknown): string {
    return String(valor ?? '').replace(/\D/g, '')
  }

  listarPessoas() {
    this.servico.listarpessoas()
      .subscribe({
        next: (dados) => {
          this.listaPessoa.set(
            [...dados].sort((a, b) => (a.nome ?? '').localeCompare(b.nome ?? ''))
          )
        },
        error: (msgErro) => console.log('Erro ao listar pessoas', msgErro)
      })
  }

  carregaCampo(id: number) {
    this.editar = true
    this.servico.listarpessoa(id)
      .subscribe({
        next: (obj) => {
          this.pessoaId = obj.idPessoa
          this.nome = obj.nome ?? ''
          this.cpf = String(obj.cpf ?? '')
          this.sexo = obj.sexo ?? ''
          this.data = String(obj.dataNascimento ?? '').substring(0, 10)
          this.email = obj.email ?? ''
          this.telefone = String(obj.telefone ?? '')

          const end = obj.enderecos?.[0]
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

          this.cdr.detectChanges()
        },
        error: (msgErro) => {
          console.log('Erro ao carregar pessoa', msgErro)
          alert(mensagemErro(msgErro))
        }
      })
  }

  enviaDadosClient() {
    if (!this.nome.trim() || !this.apenasDigitos(this.cpf) || !this.apenasDigitos(this.telefone) || !this.data) {
      alert('Preencha nome, CPF, telefone e data de nascimento.')
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
    pessoa.dataNascimento = this.data
    pessoa.ativoPessoa = 'S'
    pessoa.enderecos = [endereco]

    if (!this.editar) {
      this.servico.adicionarpessoa(pessoa).subscribe({
        next: () => {
          this.limpar()
          this.listarPessoas()
        },
        error: (msgErro) => {
          console.log('Erro ao cadastrar', msgErro)
          alert(mensagemErro(msgErro))
        }
      })
    } else {
      pessoa.idPessoa = this.pessoaId
      endereco.idPessoa = this.pessoaId
      endereco.idEndereco = this.enderecoId > 0 ? this.enderecoId : null   // null = endereço novo

      this.servico.alterarpessoa(pessoa).subscribe({
        next: () => {
          this.limpar()
          this.listarPessoas()
        },
        error: (msgErro) => {
          console.log('Erro ao alterar', msgErro)
          alert(mensagemErro(msgErro))
        }
      })
    }
  }

  excluir(pessoa: PessoaEndereco) {
    if (confirm(`Deseja excluir ${pessoa.nome} do Banco de Dados?`)) {
      this.servico.exluirpessoa(pessoa)
        .subscribe({
          next: () => {
            this.listaPessoa.update(lista =>
              lista.filter(p => p.idPessoa !== pessoa.idPessoa)
            )
          },
          error: (msgErro) => {
            console.log('Erro ao excluir pessoa', msgErro)
            alert(mensagemErro(msgErro))
          }
        })
    }
  }

  limpar() {
    this.pessoaId = 0
    this.enderecoId = 0
    this.nome = ''
    this.cpf = ''
    this.sexo = ''
    this.cep = ''
    this.numero = ''
    this.complemento = ''
    this.data = ''
    this.email = ''
    this.telefone = ''
    this.editar = false
  }
}
