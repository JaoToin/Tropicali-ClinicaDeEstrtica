import { Component, OnInit, signal, computed, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Itens } from './../../../models/item';
import { ProdutoItem } from './../../../models/produto-item';
import { CategoriaModelo } from './../../../models/categoria';
import { Item } from './../../../Service/item/item';
import { CategoriaService } from './../../../Service/Categoria/categoria/categoria-module';
import { normalizar, mensagemErro } from '../../../../../Util/util';

@Component({
  imports: [FormsModule],
  selector: 'app-produto',
  styleUrl: './produto.css',
  templateUrl: './produto.html',
})
export class Produto implements OnInit {

  iditem = 0
  idcategoria = 0
  item1 = ''
  descricaoItem = ''
  preco = 0
  tipoItem = 'P'                 // P = produto, S = serviço
  ativoProdutoServico = 'A'      // A = ativo, I = inativo
  codigoPreco = ''               // texto (ex.: SRV-001)
  precoVenda = 0
  unidade = 'UN'
  editar = false

  listaItens = signal<Itens[]>([])
  categorias = signal<CategoriaModelo[]>([])
  busca = signal('')

  // lista depois da pesquisa (nome ou descrição)
  itensFiltrados = computed(() => {
    const termo = normalizar(this.busca())
    if (!termo) {
      return this.listaItens()
    }
    return this.listaItens().filter(p =>
      normalizar(p.iditemNavigation?.item1).includes(termo)
      || normalizar(p.iditemNavigation?.descricaoItem).includes(termo))
  })

  constructor(
    private servico: Item,
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.listarItens()
    this.listarCategorias()

    const id = Number(this.route.snapshot.paramMap.get('id'))
    if (id > 0) {
      this.carregaCampo(id)
    }
  }

  rotuloTipo(t: string | undefined): string {
    return t === 'P' ? 'Produto' : t === 'S' ? 'Serviço' : (t ?? '')
  }

  rotuloSituacao(s: string | undefined): string {
    return s === 'A' ? 'Ativo' : s === 'I' ? 'Inativo' : (s ?? '')
  }

  nomeCategoria(id: number | undefined): string {
    return this.categorias().find(c => c.idcategoria === id)?.categoria ?? String(id ?? '')
  }

  listarCategorias() {
    this.categoriaService.listarCategorias()
      .subscribe({
        next: (dados) => {
          this.categorias.set(
            [...dados].sort((a, b) => (a.categoria ?? '').localeCompare(b.categoria ?? ''))
          )
        },
        error: (msgErro) => console.log('Erro ao listar categorias', msgErro)
      })
  }

  listarItens() {
    this.servico.listaritems()
      .subscribe({
        next: (dados) => {
          this.listaItens.set(
            [...dados].sort((a, b) =>
              (a.iditemNavigation?.item1 ?? '').localeCompare(b.iditemNavigation?.item1 ?? ''))
          )
        },
        error: (msgErro) => console.log('Erro ao listar produtos', msgErro)
      })
  }

  carregaCampo(id: number) {
    this.editar = true
    this.servico.listaritem(id)
      .subscribe({
        next: (obj) => {
          this.iditem = obj.iditem
          this.codigoPreco = String(obj.codigoPreco ?? '')
          this.precoVenda = obj.precoVenda
          this.unidade = obj.unidade ?? ''

          const nav = obj.iditemNavigation
          this.item1 = nav?.item1 ?? ''
          this.descricaoItem = nav?.descricaoItem ?? ''
          this.idcategoria = nav?.idcategoria ?? 0
          this.preco = nav?.preco ?? 0
          this.tipoItem = nav?.tipoItem ?? 'P'
          this.ativoProdutoServico = nav?.ativoProdutoServico ?? 'A'

          this.cdr.detectChanges()
        },
        error: (msgErro) => {
          console.log('Erro ao carregar produto', msgErro)
          alert(mensagemErro(msgErro))
        }
      })
  }

  enviaDadosClient() {
    if (!this.item1.trim()) {
      alert('Informe o nome do item.')
      return
    }
    if (this.idcategoria <= 0) {
      alert('Escolha a categoria.')
      return
    }

    // o back-end (ProdutoDTO) espera o formato "achatado"
    const dto = new ProdutoItem()
    dto.idCategoria = this.idcategoria
    dto.item = this.item1
    dto.descricaoItem = this.descricaoItem
    dto.preco = this.preco
    dto.tipoItem = this.tipoItem
    dto.ativoProdutoServico = this.ativoProdutoServico
    dto.codigoPreco = this.codigoPreco
    dto.precoVenda = this.precoVenda
    dto.unidade = this.unidade

    if (!this.editar) {
      this.servico.adicionaritem(dto).subscribe({
        next: () => {
          this.limpar()
          this.listarItens()
        },
        error: (msgErro) => {
          console.log('Erro ao cadastrar', msgErro)
          alert(mensagemErro(msgErro))
        }
      })
    } else {
      this.servico.alteraritem(this.iditem, dto).subscribe({
        next: () => {
          this.limpar()
          this.listarItens()
        },
        error: (msgErro) => {
          console.log('Erro ao alterar', msgErro)
          alert(mensagemErro(msgErro))
        }
      })
    }
  }

  excluir(item: Itens) {
    if (confirm(`Deseja excluir ${item.iditemNavigation?.item1} do Banco de Dados?`)) {
      this.servico.exluiritem(item)
        .subscribe({
          next: () => {
            this.listaItens.update(lista =>
              lista.filter(a => a.iditem !== item.iditem)
            )
          },
          error: (msgErro) => {
            console.log('Erro ao excluir produto', msgErro)
            alert(mensagemErro(msgErro))
          }
        })
    }
  }

  limpar() {
    this.iditem = 0
    this.idcategoria = 0
    this.item1 = ''
    this.descricaoItem = ''
    this.preco = 0
    this.tipoItem = 'P'
    this.ativoProdutoServico = 'A'
    this.codigoPreco = ''
    this.precoVenda = 0
    this.unidade = 'UN'
    this.editar = false
  }
}
