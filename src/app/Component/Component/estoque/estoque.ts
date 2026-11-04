import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Entrada } from '../../../models/estoque-entrada';
import { EstoqueService } from '../../../Service/Estoque/estoque/estoque-module';

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

  constructor(private servico: EstoqueService) { }

  ngOnInit() {
    this.listarEstoque()
  }

  exibirDados(){
    console.log(this.idEntrada, this.idItem, this.quantidadeEntrada, this.precoUnitario, this.dataEntrada, this.unidade)
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
    const entrada = new Entrada()
    entrada.idItem = this.idItem
    entrada.dataEntrada = this.dataEntrada
    entrada.quantidadeEntrada = this.quantidadeEntrada
    entrada.precoUnitario = this.precoUnitario
    entrada.unidade = this.unidade

    if (!this.editar) {
      this.servico.adicionarEstoqueEntrada(entrada).subscribe({
        next: (resposta) => {
          console.log(resposta)
          this.limpar()
          this.listarEstoque()
        },
        error: (msgErro) => console.log('Erro ao cadastrar', msgErro)
      })
    } else {
      entrada.idEntrada = this.idEntrada

      this.servico.alterarEstoqueEntrada(entrada).subscribe({
        next: () => {
          this.limpar()
          this.listarEstoque()
        },
        error: (msgErro) => console.log('Erro ao alterar', msgErro)
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
          error: (msgErro) => console.log('Erro ao excluir entrada', msgErro)
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
