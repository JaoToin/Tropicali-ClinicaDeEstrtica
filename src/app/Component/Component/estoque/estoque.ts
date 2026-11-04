import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Entrada } from '../../../models/estoque-entrada';
import { Itens } from '../../../models/item';
import { EstoqueService } from '../../../Service/Estoque/estoque/estoque-module';
import { Item } from '../../../Service/item/item';
import { normalizar, mensagemErro } from '../../../../../Util/util';

@Component({
  imports: [FormsModule],
  selector: 'app-estoque',
  styleUrl: './estoque.css',
  templateUrl: './estoque.html',
})
export class Estoque implements OnInit {

  idEntrada = 0
  idItem = 0
  quantidadeEntrada = 0
  precoUnitario = 0
  dataEntrada = ''
  unidade = ''
  editar = false

  ListaEntradas = signal<Entrada[]>([])
  produtos = signal<Itens[]>([])
  busca = signal('')

  // id do produto -> nome do produto
  nomes = computed(() => {
    const mapa = new Map<number, string>()
    for (const p of this.produtos()) {
      mapa.set(p.iditem, p.iditemNavigation?.item1 ?? '')
    }
    return mapa
  })

  // lista depois da pesquisa (nome do produto ou id)
  entradasFiltradas = computed(() => {
    const termo = normalizar(this.busca())
    if (!termo) {
      return this.ListaEntradas()
    }
    return this.ListaEntradas().filter(e =>
      normalizar(this.nomeProduto(e.idItem)).includes(termo)
      || String(e.idItem) === termo)
  })

  constructor(
    private servico: EstoqueService,
    private itemService: Item
  ) { }

  ngOnInit() {
    this.listarProdutos()
    this.listarEstoque()
  }

  nomeProduto(id: number): string {
    return this.nomes().get(id) ?? `Produto #${id}`
  }

  listarProdutos() {
    this.itemService.listaritems()
      .subscribe({
        next: (dados) => {
          this.produtos.set(
            [...dados].sort((a, b) =>
              (a.iditemNavigation?.item1 ?? '').localeCompare(b.iditemNavigation?.item1 ?? ''))
          )
        },
        error: (msgErro) => console.log('Erro ao listar produtos', msgErro)
      })
  }

  // a API devolve um estoque por produto, com as entradas dentro: junta tudo numa lista só
  listarEstoque() {
    this.servico.listarEstoques()
      .subscribe({
        next: (estoques) => {
          const entradas = estoques.flatMap(e => e.entradas ?? [])
          this.ListaEntradas.set(
            entradas.sort((a, b) =>
              String(b.dataEntrada ?? '').localeCompare(String(a.dataEntrada ?? '')))
          )
        },
        error: (msgErro) => console.log('Erro ao listar entradas', msgErro)
      })
  }

  // editar: preenche o formulário com a linha da tabela
  carregarCampo(e: Entrada) {
    this.editar = true
    this.idEntrada = e.idEntrada
    this.idItem = e.idItem
    this.quantidadeEntrada = e.quantidadeEntrada
    this.precoUnitario = e.precoUnitario
    this.dataEntrada = String(e.dataEntrada ?? '').substring(0, 10)
    this.unidade = e.unidade
  }

  enviaDadosClient() {
    if (this.idItem <= 0 || !this.dataEntrada) {
      alert('Escolha o produto e a data da entrada.')
      return
    }

    const entrada = new Entrada()
    entrada.idItem = this.idItem
    entrada.dataEntrada = this.dataEntrada
    entrada.quantidadeEntrada = this.quantidadeEntrada
    entrada.precoUnitario = this.precoUnitario
    entrada.unidade = this.unidade

    if (!this.editar) {
      this.servico.adicionarEstoqueEntrada(entrada).subscribe({
        next: () => {
          this.limpar()
          this.listarEstoque()
        },
        error: (msgErro) => {
          console.log('Erro ao cadastrar', msgErro)
          alert(mensagemErro(msgErro))
        }
      })
    } else {
      entrada.idEntrada = this.idEntrada

      this.servico.alterarEstoqueEntrada(entrada).subscribe({
        next: () => {
          this.limpar()
          this.listarEstoque()
        },
        error: (msgErro) => {
          console.log('Erro ao alterar', msgErro)
          alert(mensagemErro(msgErro))
        }
      })
    }
  }

  excluir(e: Entrada) {
    if (confirm(`Deseja excluir a entrada #${e.idEntrada}?`)) {
      this.servico.exluirEstoqueEntrada(e)
        .subscribe({
          next: () => {
            this.ListaEntradas.update(lista =>
              lista.filter(a => a.idEntrada !== e.idEntrada)
            )
          },
          error: (msgErro) => {
            console.log('Erro ao excluir entrada', msgErro)
            alert(mensagemErro(msgErro))
          }
        })
    }
  }

  limpar() {
    this.idEntrada = 0
    this.idItem = 0
    this.quantidadeEntrada = 0
    this.dataEntrada = ''
    this.precoUnitario = 0
    this.unidade = ''
    this.editar = false
  }
}
