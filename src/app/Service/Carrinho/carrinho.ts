import { Itens } from './../../models/item';
import { Injectable, signal, computed } from '@angular/core';

export interface ItemCarrinho extends Itens {
  quantidade: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarrinhoProduto {

  private cardItens = signal<ItemCarrinho[]>([])

  public cart = this.cardItens.asReadonly();

  public quantidadeTotal = computed(() =>
    this.cardItens().reduce((acc, item) => acc + item.quantidade, 0));

  public valorTotal = computed(() =>
    this.cardItens().reduce((acc, item) => acc + item.precoVenda * item.quantidade, 0));

  adicionar(produto: Itens): void {
    this.cardItens.update(itens => {
      const index = itens.findIndex(item => item.iditem === produto.iditem);

      if (index > -1) {
        const atualizados = [...itens];
        atualizados[index] = {
          ...atualizados[index],
          quantidade: atualizados[index].quantidade + 1
        };
        return atualizados;
      }

      return [...itens, { ...produto, quantidade: 1 }];
    });
  }

  remover(produtoId: number): void {
    this.cardItens.update(itens => itens.filter(item => item.iditem !== produtoId));
  }

  limpar(): void {
    this.cardItens.set([]);
  }
}
