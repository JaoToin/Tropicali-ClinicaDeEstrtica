import { FormsModule } from '@angular/forms';
import { CategoriaService } from './../../../Service/Categoria/categoria/categoria-module';
import { Component, OnInit, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CategoriaModelo } from '../../../models/categoria';
import { ActivatedRoute } from '@angular/router';
import { normalizar, mensagemErro } from '../../../../../Util/util';

@Component({
  imports: [FormsModule],
  selector: 'app-categoria',
  styleUrl: './categoria.css',
  templateUrl: './categoria.html',
})
export class Categoria implements OnInit {

  editar = false
  IdCategoria = 0
  Categoria = ''

  listaCategoria = signal<CategoriaModelo[]>([])
  busca = signal('')

  // lista depois da pesquisa (nome da categoria ou nome de um item dela)
  categoriasFiltradas = computed(() => {
    const termo = normalizar(this.busca())
    if (!termo) {
      return this.listaCategoria()
    }
    return this.listaCategoria().filter(c =>
      normalizar(c.categoria).includes(termo)
      || (c.items ?? []).some(i => normalizar(i.item1).includes(termo)))
  })

  constructor(
    private servico: CategoriaService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.listarCategorias()

    const id = Number(this.route.snapshot.paramMap.get('id'))
    if (id > 0) {
      this.carregaCampo(id)
    }
  }

  listarCategorias() {
    this.servico.listarCategorias()
      .subscribe({
        next: (dados) => {
          this.listaCategoria.set(
            [...dados].sort((a, b) => (a.categoria ?? '').localeCompare(b.categoria ?? ''))
          )
        },
        error: (msgErro) => console.log('Erro ao listar categorias', msgErro)
      })
  }

  carregaCampo(id: number) {
    this.editar = true
    this.servico.listarCategoria(id)
      .subscribe({
        next: (obj) => {
          this.IdCategoria = obj.idcategoria
          this.Categoria = obj.categoria
          this.cdr.detectChanges()
        },
        error: (msgErro) => {
          console.log('Erro ao carregar categoria', msgErro)
          alert(mensagemErro(msgErro))
        }
      })
  }

  enviaDadosClient() {
    if (!this.Categoria.trim()) {
      alert('Informe o nome da categoria.')
      return
    }

    const cat = new CategoriaModelo()
    cat.categoria = this.Categoria

    if (!this.editar) {
      this.servico.adicionarCategoria(cat).subscribe({
        next: () => {
          this.limpar()
          this.listarCategorias()
        },
        error: (msgErro) => {
          console.log('Erro ao cadastrar', msgErro)
          alert(mensagemErro(msgErro))
        }
      })
    } else {
      cat.idcategoria = this.IdCategoria

      this.servico.alterarCategoria(cat).subscribe({
        next: () => {
          this.limpar()
          this.listarCategorias()
        },
        error: (msgErro) => {
          console.log('Erro ao alterar', msgErro)
          alert(mensagemErro(msgErro))
        }
      })
    }
  }

  excluir(cat: CategoriaModelo) {
    if (confirm(`Deseja excluir ${cat.categoria} do Banco de Dados?`)) {
      this.servico.exluirCategoria(cat)
        .subscribe({
          next: () => {
            this.listaCategoria.update(lista =>
              lista.filter(a => a.idcategoria !== cat.idcategoria)
            )
          },
          error: (msgErro) => {
            console.log('Erro ao excluir categoria', msgErro)
            alert(mensagemErro(msgErro))
          }
        })
    }
  }

  limpar() {
    this.IdCategoria = 0
    this.Categoria = ''
    this.editar = false
  }
}
