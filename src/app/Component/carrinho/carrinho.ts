import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarrinhoProduto } from '../../Service/Carrinho/carrinho';

@Component({
  imports: [RouterLink],
  selector: 'app-carrinho',
  styleUrl: './carrinho.css',
  templateUrl: './carrinho.html',
})
export class Carrinho {
  public cartService = inject(CarrinhoProduto);
}
