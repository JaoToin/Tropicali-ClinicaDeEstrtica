import { FormsModule } from '@angular/forms';
import { AtendimentoServico } from './../../../Service/Atendimento/atendimento/atendimento-module';
import { PessoaEnderecoService } from './../../../Service/Clienet/pessoa-endereço';
import { Component, OnInit, signal, computed, ChangeDetectorRef } from '@angular/core';
import { AtendimentoModelo, ItemAtendimento } from '../../../models/atendimento';
import { PessoaEndereco } from '../../../models/pessoa-endereco';
import { ActivatedRoute } from '@angular/router';
import { normalizar, mensagemErro } from '../../../../../Util/util';
import { Item } from '../../../Service/item/item';
import { Itens } from '../../../models/item';
import { FuncionarioService } from '../../../Service/Funcionario/funcionario/funcionario-module';
import { Funcionario } from '../../../models/funcionario';

function hoje(): string {
  const d = new Date()
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mes}-${dia}`
}


@Component({
  imports: [FormsModule],
  selector: 'app-atendimento',
  styleUrl: './atendimento.css',
  templateUrl: './atendimento.html',
})
export class Atendimento implements OnInit {

  idatendimento = 0
  idpessoa = 0
  dataatendimento = hoje()
  status = 'A'                          // A = aberto, C = concluído, X = cancelado
  editar = false

  // campos do item que está sendo preenchido
  idItem = 0
  idFuncionario = 0
  quantidade = 1
  valorUnitario = 0

  // itens do atendimento (os já cadastrados + os adicionados agora).
  // Tudo isso é enviado junto no POST/PUT.
  itensAtendimento: ItemAtendimento[] = []

  ListaAtendimento = signal<AtendimentoModelo[]>([])
  pessoas = signal<PessoaEndereco[]>([])
  busca = signal('')
  listaItem = signal<Itens[]>([])
  funcionarios = signal<Funcionario[]>([])


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
    private servicoItens: Item,
    private funcionarioService: FuncionarioService,
    private pessoaService: PessoaEnderecoService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.listarAtendimentos()
    this.listarPessoas()
    this.listarItens()
    this.listarFuncionarios()

    const id = Number(this.route.snapshot.paramMap.get('id'))
    if (id > 0) {
      this.carregarCampo(id)
    }
  }

  nomes = computed(() => {
    const mapa = new Map<number, string>()
    for (const p of this.listaItem()) {
      mapa.set(p.iditem, p.iditemNavigation?.item1 ?? '')
    }
    return mapa
  })


  nomeProduto(id: number): string {
    return this.nomes().get(id) ?? `Produto #${id}`
  }

  nomesFuncionarios = computed(() => {
    const mapa = new Map<number, string>()
    for (const f of this.funcionarios()) {
      mapa.set(f.idPessoa, f.pessoas?.[0]?.nome ?? '')
    }
    return mapa
  })

  nomeFuncionario(id: number): string {
    return this.nomesFuncionarios().get(id) ?? `Funcionário #${id}`
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

  moeda(valor: number | undefined): string {
    return (valor ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  // soma de quantidade x valor de todos os itens do formulário
  get totalItens(): number {
    return this.itensAtendimento.reduce((soma, i) => soma + i.quantidade * i.valorUnitario, 0)
  }


  listarItens() {
    this.servicoItens.listaritems()
      .subscribe({
        next: (dados) => {
          this.listaItem.set(
            [...dados].sort((a, b) =>
              (a.iditemNavigation?.item1 ?? '').localeCompare(b.iditemNavigation?.item1 ?? ''))
          )
        },
        error: (msgErro) => console.log('Erro ao listar produtos', msgErro)
      })
  }


  listarFuncionarios() {
    this.funcionarioService.listarfuncionarios()
    .subscribe({
      next: (dados) => {
        this.funcionarios.set(
          [...dados].sort((a, b) =>
            (a.pessoas?.[0]?.nome ?? '').localeCompare(b.pessoas?.[0]?.nome ?? ''))
        )
      },
        error: (msgErro) => console.log('Erro ao listar funcionários', msgErro)
      })
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
          this.itensAtendimento = obj.itens ?? []
          this.limparItem()
          this.cdr.detectChanges()
        },
        error: (msgErro) => {
          console.log('Erro ao carregar atendimento', msgErro)
          alert(mensagemErro(msgErro))
        }
      })
  }

  // ---------- itens do atendimento ----------

  adicionarItem() {
    if (this.idItem <= 0 || this.idFuncionario <= 0
      || this.quantidade <= 0 || this.valorUnitario <= 0) {
      alert('Informe o produto, o funcionário, a quantidade e o valor (todos maiores que zero).')
      return
    }

    const item = new ItemAtendimento()
    item.idItem = this.idItem
    item.idFuncionario = this.idFuncionario
    item.quantidade = this.quantidade
    item.valorUnitario = this.valorUnitario

    this.itensAtendimento = [...this.itensAtendimento, item]
    this.limparItem()
  }

  removerItem(indice: number) {
    this.itensAtendimento = this.itensAtendimento.filter((_, i) => i !== indice)
  }

  limparItem() {
    this.idItem = 0
    this.idFuncionario = 0
    this.quantidade = 1
    this.valorUnitario = 0
  }

  // ---------- atendimento ----------

  enviarDados() {
    if (this.idpessoa <= 0 || !this.dataatendimento) {
      alert('Escolha a pessoa e a data do atendimento.')
      return
    }

    if (this.itensAtendimento.length === 0) {
      alert('Adicione pelo menos um item ao atendimento.')
      return
    }

    const atendimento = new AtendimentoModelo()
    atendimento.idPessoa = this.idpessoa
    atendimento.dataAtendimento = this.dataatendimento
    atendimento.statusAtendimento = this.status
    atendimento.itens = this.itensAtendimento

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
    this.itensAtendimento = []
    this.limparItem()
    this.editar = false
  }
}
