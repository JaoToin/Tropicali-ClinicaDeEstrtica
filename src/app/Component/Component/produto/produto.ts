import { Itens } from './../../../models/item';
import { Item } from './../../../Service/item/item';
import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-produto',
  styleUrl: './produto.css',
  templateUrl: './produto.html',
})
export class Produto {

  produtos: Itens[] = [];
  produto: Itens = new Itens();
  editar = false

  // Atributos de ItemNavigation
  iditem = 0
  idcategoria = 0
  item1 = ''
  descricaoItem = ''
  preco = 0
  tipoItem = ''
  ativoProdutoServico = ''

  // Atributos de Itens
  codigoPreco = 0
  precoVenda = 0
  unidade = ''
  estoque: number | null = null

  constructor(private Item: Item, private route: ActivatedRoute, private cdr: ChangeDetectorRef) { }

    listaItens = signal<Itens[]>([])

    //DECLARAÇÃO DO CONSTRUTOR

    exibeDados() {
      console.log(this.produto, this.iditem, this.idcategoria, this.item1, this.descricaoItem, this.preco, this.tipoItem, this.ativoProdutoServico, this.codigoPreco, this.precoVenda, this.unidade, this.estoque) //
    }



      ngOnInit() {
        this.listarItens()
        this.iditem = Number(this.route.snapshot.paramMap.get('id'))
        this.Item.listaritems().subscribe({
          next: (dados) => {
            this.produtos = dados;
          }
        });

        if (this.iditem > 0) {
          this.editar = true
          this.carregaCampo(this.iditem)
        }

      }

        listarItens() {
    this.Item.listaritems()
      .subscribe({
        next: (dados) => {
          //this.listaItens = [...dados].sort((a, b) => a.nome.localeCompare(b.nome))
          this.listaItens.set(
            [...dados].sort((a, b) =>
              a.iditemNavigation.item1.localeCompare(b.iditemNavigation.item1))
          )},
        error: (msgErro) => {
          console.log("Erro", msgErro)
        }

      })

  }

      carregaCampo(idItem: number) {
        this.editar = true
          this.Item.listaritem(idItem)
            .subscribe({
              next: (obj) => {
              this.iditem = obj.iditem
              this.item1 = obj.iditemNavigation.item1
              this.idcategoria = obj.iditemNavigation.idcategoria
              this.descricaoItem = obj.iditemNavigation.descricaoItem
              this.preco = obj.iditemNavigation.preco
              this.tipoItem = obj.iditemNavigation.tipoItem
              this.ativoProdutoServico = obj.iditemNavigation.ativoProdutoServico
              this.codigoPreco = obj.codigoPreco
              this.precoVenda = obj.precoVenda
              this.unidade = obj.unidade
              this.estoque = obj.estoque

              this.cdr.detectChanges()
            },
            error: (msgErro) => {
              console.log("Erro ao Listar o Produto ", msgErro)
            }
          })
      }
      enviaDadosClient() {
        const Iten = new Itens()
        Iten.iditem = this.iditem
        Iten.codigoPreco = this.codigoPreco
        Iten.precoVenda = this.precoVenda
        Iten.unidade = this.unidade
        Iten.estoque = this.estoque
        Iten.iditemNavigation.iditem = this.iditem
        Iten.iditemNavigation.idcategoria = this.idcategoria
        Iten.iditemNavigation.item1 = this.item1
        Iten.iditemNavigation.descricaoItem = this.descricaoItem
        Iten.iditemNavigation.preco = this.preco
        Iten.iditemNavigation.tipoItem = this.tipoItem
        Iten.iditemNavigation.ativoProdutoServico = this.ativoProdutoServico

        if (!this.editar) {
          this.Item.adicionaritem(Iten).subscribe({
            next: (resposta) => {
              console.log(resposta)
              this.listarItens()
              this.limpar()
            },
            error: (msgErro) => console.log("Erro ao cadastrar", msgErro)
          })
        } else {
          Iten.iditem = this.iditem
          Iten.iditemNavigation.iditem = this.iditem

          this.Item.alteraritem(Iten).subscribe({
            next: (resposta) => {
              console.log(resposta)
              this.limpar()
            },
            error: (msgErro) => console.log("Erro ao alterar", msgErro)
          })
        }
      }
      listaItem(IdItem: number) {
        this.Item.listaritem(IdItem)
          .subscribe({
            next: (dados) => {
              console.table(dados)
            },
            error: (msgErro) => {
              console.log("Erro ao listar itens ", msgErro)
            }
          })
      }

      limpar() {
        this.iditem = 0
        this.codigoPreco = 0
        this.precoVenda = 0
        this.unidade = ''
        this.estoque = 0
        this.idcategoria = 0
        this.item1 = ''
        this.descricaoItem = ''
        this.preco = 0
        this.tipoItem = ''
        this.ativoProdutoServico = ''
        this.editar = false


      }


      excluir(item: Itens) {
        if (confirm(`Deseja excluir ${item.iditemNavigation.item1} do Banco de Dados?`)) {
          this.Item.exluiritem(item)
            .subscribe({
              next: (dados) => {
                this.listaItens.update(lista =>
                  lista.filter(a => a.iditem !== item.iditem)
                )
                console.log('Item excluído com sucesso', dados)
              },
              error: (msgErro) => {
                console.log("Erro ao excluir item", msgErro)
              }
            })
        }
      }


}
