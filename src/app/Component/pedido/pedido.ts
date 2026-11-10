import { FormsModule } from '@angular/forms';
import { AtendimentoServico } from './../../Service/Atendimento/atendimento/atendimento-module';
import { PessoaEnderecoService } from './../../Service/Clienet/pessoa-endereço';
import { Component, OnInit, signal, computed, ChangeDetectorRef } from '@angular/core';
import { AtendimentoModelo, ItemAtendimento } from '../../models/atendimento';
import { PessoaEndereco } from '../../models/pessoa-endereco';
import { ActivatedRoute } from '@angular/router';
import { normalizar, mensagemErro } from '../../../../Util/util';
import { Item } from '../../Service/item/item';
import { Itens } from '../../models/item';
import { FuncionarioService } from '../../Service/Funcionario/funcionario/funcionario-module';
import { Funcionario } from '../../models/funcionario';

@Component({
  imports: [],
  selector: 'app-pedido',
  styleUrl: './pedido.css',
  templateUrl: './pedido.html',
})
export class Pedido {



  cpfDigitado = signal('')
  itensAtendimento: ItemAtendimento[] = []

  ListaAtendimento = signal<AtendimentoModelo[]>([])
  pessoas = signal<PessoaEndereco[]>([])
  busca = signal('')
  listaItem = signal<Itens[]>([])
  funcionarios = signal<Funcionario[]>([])

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

  moeda(valor: number | undefined): string {
    return (valor ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }


  cpfNumeros = computed(() => this.cpfDigitado().replace(/\D/g, ''))

  pessoaDoCpf = computed(() => {
    const cpf = this.cpfNumeros()
    if (cpf.length !== 11) return undefined

    return this.pessoas().find(p =>
      String(p.cpf ?? '').replace(/\D/g, '').padStart(11, '0') === cpf
    )
  })
  
    // só os pedidos dela
    meusPedidos = computed(() => {
      const pessoa = this.pessoaDoCpf()
      if (!pessoa) return []
      return this.ListaAtendimento().filter(a => a.idPessoa === pessoa.idPessoa)
    })

    totalPedido(a: AtendimentoModelo): number {
      return (a.itens ?? []).reduce((soma, i) => soma + i.quantidade * i.valorUnitario, 0)
    }
  }




