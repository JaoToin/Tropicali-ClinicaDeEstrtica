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
      const urlApi = `https://6a7f6d923183f5fd884b1a61.mockapi.io/esportearlivre/item`

      return this.http.post<Itens>(urlApi, Item)
    }

    //LISTAR itemS NA API
    listaritems(): Observable<Itens[]> {
      const urlApi = `https://6a7f6d923183f5fd884b1a61.mockapi.io/esportearlivre/item`

      return this.http.get<Itens []>(urlApi)
    }

    //LISTAR item
    listaritem(idItem: number):Observable<Itens>{
      const urlApi = `https://6a7f6d923183f5fd884b1a61.mockapi.io/esportearlivre/item/${idItem}`

      return this.http.get<Itens>(urlApi)
    }

    //EXCLUIR NA API
    exluiritem(Item: Itens): Observable<Itens> {
      const urlApi = `https://6a7f6d923183f5fd884b1a61.mockapi.io/esportearlivre/item/${Item.idItem}`

      return this.http.delete<Itens>(urlApi)
    }

    //ALTERAR NA API
    alteraritem(Item: Itens):Observable<Itens>{
      const urlApi = `https://6a7f6d923183f5fd884b1a61.mockapi.io/esportearlivre/item/${Item.idItem}`

      return this.http.put<Itens  >(urlApi, Item)
    }




}
