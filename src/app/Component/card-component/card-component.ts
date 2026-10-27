import { Item } from './../../Service/item/item';
import { Itens, ItemNavigation } from './../../models/item';
import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';



@Component({
  imports: [],
  selector: 'app-card-component',
  styleUrl: './card-component.css',
  templateUrl: './card-component.html',
})
export class CardComponent {

  listaItens = signal<Itens[]>([])

  //DECLARAÇÃO CONSTRUTOR
  constructor(private router: Router, private http: Item) { }

  //EXECUTAR INSTRUÇÕES AO CARREGAR CRIAR O COMPONENTE
  ngOnInit() {
    this.listarItens()
  }

  //LISTAR OS Itens
  listarItens() {
    this.http.listaritems()
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
}
