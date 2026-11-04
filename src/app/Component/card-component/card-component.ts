import { Item } from './../../Service/item/item';
import { CategoriaService } from './../../Service/Categoria/categoria/categoria-module';
import { Itens } from './../../models/item';
import { CategoriaModelo } from './../../models/categoria';
import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CarrinhoProduto } from '../../Service/Carrinho/carrinho';
import { FormsModule } from '@angular/forms';
import { normalizar } from '../../../../Util/util';

@Component({
  imports: [FormsModule],
  selector: 'app-card-component',
  styleUrl: './card-component.css',
  templateUrl: './card-component.html',
})
export class CardComponent implements OnInit {

  private itemService = inject(Item)
  private categoriaService = inject(CategoriaService)
  private cartService = inject(CarrinhoProduto)

  listaItens = signal<Itens[]>([])
  categorias = signal<CategoriaModelo[]>([])

  busca = signal('')                    // texto da pesquisa
  categoriaSelecionada = signal(0)      // 0 = todas as categorias

  // quantos produtos tem em cada categoria
  contagens = computed(() => {
    const mapa = new Map<number, number>()
    for (const i of this.listaItens()) {
      const id = i.iditemNavigation?.idcategoria ?? 0
      mapa.set(id, (mapa.get(id) ?? 0) + 1)
    }
    return mapa
  })

  // produtos depois de aplicar a categoria escolhida e a pesquisa
  itensFiltrados = computed(() => {
    const termo = normalizar(this.busca())
    const cat = this.categoriaSelecionada()

    return this.listaItens().filter(i => {
      const nav = i.iditemNavigation
      const naCategoria = cat === 0 || nav?.idcategoria === cat
      const noTexto = !termo
        || normalizar(nav?.item1).includes(termo)
        || normalizar(nav?.descricaoItem).includes(termo)
      return naCategoria && noTexto
    })
  })

  ngOnInit() {
    this.listarItens()
    this.listarCategorias()
  }

  listarItens() {
    this.itemService.listaritems()
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

  selecionarCategoria(id: number) {
    this.categoriaSelecionada.set(id)
  }

  nomeCategoria(id: number | undefined): string {
    return this.categorias().find(c => c.idcategoria === id)?.categoria ?? ''
  }

  adicionarAoCarrinho(produto: Itens): void {
    this.cartService.adicionar(produto)
  }
}
