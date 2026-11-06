import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CarrinhoProduto } from '../../Service/Carrinho/carrinho';
 
@Component({
  imports: [RouterLink],
  selector: 'app-carrinho',
  styleUrl: './carrinho.css',
  templateUrl: './carrinho.html',
})
export class Carrinho {

  public cartService = inject(CarrinhoProduto)
  private router = inject(Router)

  // botão "Comprar": vai para a página de finalização.
  // Os itens não precisam ser enviados: o CarrinhoProduto é um service único (providedIn: 'root'),
  // então a página de finalização lê o mesmo carrinho.
  comprar() {
    if (this.cartService.cart().length === 0) {
      return
    }
    this.router.navigate(['/finalizacao'])
  }
}
