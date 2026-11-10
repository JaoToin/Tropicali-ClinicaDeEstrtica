import { Itens } from './../../models/item';
import { Injectable, signal, computed, effect } from '@angular/core';

export interface ItemCarrinho extends Itens {
  quantidade: number;
}

// Nome da chave onde o carrinho fica salvo no navegador
const CHAVE_CARRINHO = 'carrinho-tropicali'

@Injectable({
  providedIn: 'root'
})
export class CarrinhoProduto {

  // O signal já nasce com o que estava salvo no localStorage (ou vazio)
  private cardItens = signal<ItemCarrinho[]>(this.carregar())

  public cart = this.cardItens.asReadonly();

  public quantidadeTotal = computed(() =>
    this.cardItens().reduce((acc, item) => acc + item.quantidade, 0));

  public valorTotal = computed(() =>
    this.cardItens().reduce((acc, item) => acc + item.precoVenda * item.quantidade, 0));

  constructor() {
    // O effect roda sempre que o signal muda (adicionar, remover, alterar quantidade, limpar).
    // Assim, não é preciso lembrar de salvar em cada método.
    effect(() => {
      this.salvar(this.cardItens())
    })
  }

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

  // Soma 1 na quantidade do item
  incrementar(produtoId: number): void {
    const item = this.cardItens().find(i => i.iditem === produtoId)
    if (item) {
      this.alterarQuantidade(produtoId, item.quantidade + 1)
    }
  }

  // Tira 1 da quantidade (se chegar a 0, o item sai do carrinho)
  decrementar(produtoId: number): void {
    const item = this.cardItens().find(i => i.iditem === produtoId)
    if (item) {
      this.alterarQuantidade(produtoId, item.quantidade - 1)
    }
  }

  // Define uma quantidade exata para o item
  alterarQuantidade(produtoId: number, quantidade: number): void {
    // Number() e floor evitam texto, vazio ou decimal vindo de um input
    const qtd = Math.floor(Number(quantidade))

    // Quantidade zero, negativa ou inválida: remove o item
    if (!qtd || qtd <= 0) {
      this.remover(produtoId)
      return
    }

    this.cardItens.update(itens =>
      itens.map(item =>
        item.iditem === produtoId ? { ...item, quantidade: qtd } : item
      )
    )
  }

  remover(produtoId: number): void {
    this.cardItens.update(itens => itens.filter(item => item.iditem !== produtoId));
  }

  limpar(): void {
    this.cardItens.set([]);
  }

  // LÊ o carrinho salvo. Usado só uma vez, na criação do service.
  private carregar(): ItemCarrinho[] {
    try {
      const texto = localStorage.getItem(CHAVE_CARRINHO)
      if (!texto) return []

      const dados = JSON.parse(texto)
      // Garante que é uma lista, caso o conteúdo salvo esteja corrompido
      return Array.isArray(dados) ? dados : []
    } catch {
      // localStorage indisponível ou JSON inválido: começa com o carrinho vazio
      return []
    }
  }

  // GRAVA o carrinho como texto JSON
  private salvar(itens: ItemCarrinho[]): void {
    try {
      localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(itens))
    } catch {
      // Sem espaço ou modo privado bloqueado: o carrinho continua funcionando, só não persiste
    }
  }
}
