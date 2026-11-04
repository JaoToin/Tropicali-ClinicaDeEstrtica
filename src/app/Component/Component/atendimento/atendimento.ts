import { FormsModule } from '@angular/forms';
import { AtendimentoServico } from './../../../Service/Atendimento/atendimento/atendimento-module';
import { PessoaEnderecoService } from './../../../Service/Clienet/pessoa-endereço';
import { Component, OnInit, signal, computed, ChangeDetectorRef } from '@angular/core';
import { AtendimentoModelo, ItemAtendimento } from '../../../models/atendimento';
import { PessoaEndereco } from '../../../models/pessoa-endereco';
import { ActivatedRoute } from '@angular/router';
import { normalizar, mensagemErro } from '../../../../../Util/util';

@Component({
  imports: [FormsModule],
  selector: 'app-atendimento',
  styleUrl: './atendimento.css',
  templateUrl: './atendimento.html',
})
export class Atendimento implements OnInit {

  idatendimento = 0
  idpessoa = 0
  dataatendimento = ''
  status = 'A'                          // A = aberto, C = concluído, X = cancelado
  editar = false

  // itens do atendimento carregado: são reenviados na edição para não serem apagados
  itensCarregados: ItemAtendimento[] = []

  ListaAtendimento = signal<AtendimentoModelo[]>([])
  pessoas = signal<PessoaEndereco[]>([])
  busca = signal('')

  // lista depois da pesquisa (nome da pessoa, id ou status)
  atendimentosFiltrados = computed(() => {
    const termo = normalizar(this.busca())
    if (!termo) {
      return this.ListaAtendimento()
    }
    return this.ListaAtendimento().filter(a =>
      normalizar(a.nomePessoa).includes(termo)
      || normalizar(this.rotuloStatus(a.status)).includes(termo)
      || String(a.idAtendimento) === termo)
  })

  constructor(
    private servico: AtendimentoServico,
    private pessoaService: PessoaEnderecoService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.listarAtendimentos()
    this.listarPessoas()

    const id = Number(this.route.snapshot.paramMap.get('id'))
    if (id > 0) {
      this.carregarCampo(id)
    }
  }

  // a coluna do banco é curta: o sistema grava só a letra e mostra o texto
  rotuloStatus(s: string | undefined): string {
    switch (s) {
      case 'A': return 'Aberto'
      case 'C': return 'Concluído'
      case 'X': return 'Cancelado'
      default: return s ?? ''
    }
  }

  listarPessoas() {
    this.pessoaService.listarpessoas()
      .subscribe({
        next: (dados) => {
          this.pessoas.set(
            [...dados].sort((a, b) => (a.nome ?? '').localeCompare(b.nome ?? ''))
          )
        },
        error: (msgErro) => console.log('Erro ao listar pessoas', msgErro)
      })
  }

  listarAtendimentos() {
    this.servico.listarAtendimentos()
      .subscribe({
        next: (dados) => {
          this.ListaAtendimento.set(
            [...dados].sort((a, b) =>
              String(b.dataAtendimento ?? '').localeCompare(String(a.dataAtendimento ?? '')))
          )
        },
        error: (msgErro) => console.log('Erro ao listar atendimentos', msgErro)
      })
  }

  carregarCampo(id: number) {
    this.editar = true
    this.servico.listarAtendimento(id)
      .subscribe({
        next: (obj) => {
          this.idatendimento = obj.idAtendimento
          this.idpessoa = obj.idPessoa
          this.dataatendimento = String(obj.dataAtendimento ?? '').substring(0, 10)
          this.status = obj.status
          this.itensCarregados = obj.itens ?? []
          this.cdr.detectChanges()
        },
        error: (msgErro) => {
          console.log('Erro ao carregar atendimento', msgErro)
          alert(mensagemErro(msgErro))
        }
      })
  }

  enviarDados() {
    if (this.idpessoa <= 0 || !this.dataatendimento) {
      alert('Escolha a pessoa e a data do atendimento.')
      return
    }

    const atendimento = new AtendimentoModelo()
    atendimento.idPessoa = this.idpessoa
    atendimento.dataAtendimento = this.dataatendimento
    atendimento.statusAtendimento = this.status
    atendimento.itens = this.editar ? this.itensCarregados : []   // sem isto a API apagaria os itens

    if (!this.editar) {
      this.servico.adicionarAtendimento(atendimento).subscribe({
        next: () => {
          this.limpar()
          this.listarAtendimentos()
        },
        error: (msgErro) => {
          console.log('Erro ao cadastrar', msgErro)
          alert(mensagemErro(msgErro))
        }
      })
    } else {
      atendimento.idAtendimento = this.idatendimento

      this.servico.alterarAtendimento(atendimento).subscribe({
        next: () => {
          this.limpar()
          this.listarAtendimentos()
        },
        error: (msgErro) => {
          console.log('Erro ao alterar', msgErro)
          alert(mensagemErro(msgErro))
        }
      })
    }
  }

  excluir(aten: AtendimentoModelo) {
    if (confirm(`Deseja excluir o atendimento #${aten.idAtendimento}?`)) {
      this.servico.exluirAtendimento(aten)
        .subscribe({
          next: () => {
            this.ListaAtendimento.update(lista =>
              lista.filter(a => a.idAtendimento !== aten.idAtendimento)
            )
          },
          error: (msgErro) => {
            console.log('Erro ao excluir atendimento', msgErro)
            alert(mensagemErro(msgErro))
          }
        })
    }
  }

  limpar() {
    this.idatendimento = 0
    this.idpessoa = 0
    this.dataatendimento = ''
    this.status = 'A'
    this.itensCarregados = []
    this.editar = false
  }
}
