import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {Itens} from '../../models/item'


@Injectable({
  providedIn: 'root',
})
export class Item {


     //DECLARAÇÃO CONSTRUTOR
    constructor(private http: HttpClient) { }

    //ADICIONAR NA API
    adicionaritem(Item: Itens): Observable<Itens> {
      const urlApi = `https://localhost:7077/api/ProdutoItem`

      return this.http.post<Itens>(urlApi, Item)
    }

    //LISTAR itemS NA API
    listaritems(): Observable<Itens[]> {
      const urlApi = `https://localhost:7077/api/ProdutoItem`

      return this.http.get<Itens []>(urlApi)
    }

    //LISTAR item
    listaritem(idItem: number):Observable<Itens>{
      const urlApi = `https://localhost:7077/api/ProdutoItem/${idItem}`

      return this.http.get<Itens>(urlApi)
    }

    //EXCLUIR NA API
    exluiritem(Item: Itens): Observable<Itens> {
      const urlApi = `https://localhost:7077/api/ProdutoItem/${Item.iditem}`

      return this.http.delete<Itens>(urlApi)
    }

    //ALTERAR NA API
    alteraritem(Item: Itens):Observable<Itens>{
      const urlApi = `https://localhost:7077/api/ProdutoItem/${Item.iditem}`

      return this.http.put<Itens  >(urlApi, Item)
    }




}
