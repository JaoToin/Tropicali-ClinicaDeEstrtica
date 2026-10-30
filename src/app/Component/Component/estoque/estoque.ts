import { Component, signal, ChangeDetectorRef } from '@angular/core';
import { Entrada } from '../../../models/estoque-entrada';
import { EstoqueService } from '../../../Service/Estoque/estoque/estoque-module';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';



@Component({
  imports: [FormsModule],
  selector: 'app-estoque',
  styleUrl: './estoque.css',
  templateUrl: './estoque.html',
})
export class Estoque {

  IdEntrada = 0
  idItem = 0;
  quantidadeEntrada = 0;
  precoUnitario = 0;
  dataEntrada = '';
  unidade = ''
  editar = false

  ListaEntradas = signal<Entrada[]>([])

  constructor(
    private servico: EstoqueService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ){}
  ngOnInit() {
    this.listarEstoque()

    this.IdEntrada = Number(this.route.snapshot.paramMap.get('id'))
    if (this.IdEntrada > 0) {
      this.CarregarCampo(this.IdEntrada)
    }
  }

  listarEstoque() {
    this.servico.listarEstoqueEntradas()
      .subscribe({
        next: (dados) => {
          this.ListaEntradas.set(
            [...dados].sort((a, b) => b.dataEntradaProduto.localeCompare(a.dataEntradaProduto))
          )
        },
        error: (msgErro) => console.log("Erro ao listar entradas", msgErro)
      })
  }

  CarregarCampo(id: number) {
    this.editar = true
    this.servico.listarEstoqueEntrada(id)
      .subscribe({
        next: (obj) => {
          this.IdEntrada = obj.identradaProduto
          this.idItem = obj.iditem
          this.quantidadeEntrada = obj.quantidadeEntrada
          this.precoUnitario = obj.valorUnitarioEntrada
          this.dataEntrada = obj.dataEntradaProduto
          this.unidade = obj.unidade
          this.cdr.detectChanges()
        },
        error: (msgErro) => console.log("Erro ao carregar entrada", msgErro)
      })
  }

  enviaDadosClient() {
    const estoque = new Entrada()
    estoque.iditem = this.idItem
    estoque.quantidadeEntrada = this.quantidadeEntrada
    estoque.dataEntradaProduto = this.dataEntrada
    estoque.valorUnitarioEntrada = this.precoUnitario
    estoque.unidade = this.unidade

    if (!this.editar) {
      this.servico.adicionarEstoqueEntrada(estoque).subscribe({
        next: (resposta) => {
          console.log(resposta)
          this.limpar()
          this.listarEstoque()
        },
        error: (msgErro) => console.log("Erro ao cadastrar", msgErro)
      })
    } else {
      estoque.identradaProduto = this.IdEntrada

      this.servico.alterarEstoqueEntrada(estoque).subscribe({
        next: (resposta) => {
          console.log(resposta)
          this.limpar()
          this.listarEstoque()
        },
        error: (msgErro) => console.log("Erro ao alterar", msgErro)
      })
    }
  }

  excluir(esto: Entrada) {
    if (confirm(`Deseja excluir a entrada #${esto.identradaProduto}?`)) {
      this.servico.exluirEstoqueEntrada(esto)
        .subscribe({
          next: () => {
            this.ListaEntradas.update(lista =>
              lista.filter(a => a.identradaProduto !== esto.identradaProduto)
            )
          },
          error: (msgErro) => console.log("Erro ao excluir entrada", msgErro)
        })
    }
  }

  limpar() {
    this.IdEntrada = 0
    this.idItem = 0
    this.quantidadeEntrada = 0
    this.dataEntrada = ''
    this.precoUnitario = 0
    this.unidade = ''
    this.editar = false
  }



}
