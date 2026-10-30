import { FormsModule } from '@angular/forms';
import { CategoriaService } from './../../../Service/Categoria/categoria/categoria-module';
import { Component, signal, ChangeDetectorRef } from '@angular/core';
import { CategoriaModelo } from '../../../models/categoria';
import { ActivatedRoute } from '@angular/router';

@Component({
  imports: [FormsModule],
  selector: 'app-categoria',
  styleUrl: './categoria.css',
  templateUrl: './categoria.html',
})
export class Categoria {

  editar = false
  IdCategoria = 0
  Categoria = ''

  listaCategoria = signal<CategoriaModelo[]>([])

  constructor(
    private servico: CategoriaService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.listarCategorias()

    this.IdCategoria = Number(this.route.snapshot.paramMap.get('id'))
    if (this.IdCategoria > 0) {
      this.carregaCampo(this.IdCategoria)
    }
  }

  listarCategorias() {
    this.servico.listarCategorias()
      .subscribe({
        next: (dados) => {
          this.listaCategoria.set(
            [...dados].sort((a, b) => a.categoria.localeCompare(b.categoria))
          )
        },
        error: (msgErro) => {
          console.log("Erro ao listar categorias", msgErro)
        }
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
          console.log("Erro ao carregar categoria", msgErro)
        }
      })
  }

  enviaDadosClient() {
    const Categoria = new CategoriaModelo()
    Categoria.categoria = this.Categoria
    Categoria.items = []

    if (!this.editar) {
      this.servico.adicionarCategoria(Categoria).subscribe({
        next: (resposta) => {
          console.log(resposta)
          this.limpar()
          this.listarCategorias()
        },
        error: (msgErro) => console.log("Erro ao cadastrar", msgErro)
      })
    } else {
      Categoria.idcategoria = this.IdCategoria

      this.servico.alterarCategoria(Categoria).subscribe({
        next: (resposta) => {
          console.log(resposta)
          this.limpar()
          this.listarCategorias()
        },
        error: (msgErro) => console.log("Erro ao alterar", msgErro)
      })
    }
  }

  excluir(cat: CategoriaModelo) {
    if (confirm(`Deseja excluir ${cat.categoria} do Banco de Dados?`)) {
      this.servico.exluirCategoria(cat)
        .subscribe({
          next: (dados) => {
            this.listaCategoria.update(lista =>
              lista.filter(a => a.idcategoria !== cat.idcategoria)
            )
            console.log('Categoria excluída com sucesso', dados)
          },
          error: (msgErro) => {
            console.log("Erro ao excluir categoria", msgErro)
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
