import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Itens } from '../../models/item'
import { ProdutoItem } from '../../models/produto-item'

@Injectable({
  providedIn: 'root',
})
export class Item {

  private readonly urlApi = 'https://localhost:7077/api/ProdutoItem'

  constructor(private http: HttpClient) { }

  // CADASTRAR: o back-end espera o ProdutoDTO (ProdutoItem), não o objeto aninhado
  adicionaritem(dto: ProdutoItem): Observable<unknown> {
    return this.http.post<unknown>(this.urlApi, dto)
  }

  // LISTAR TODOS
  listaritems(): Observable<Itens[]> {
    return this.http.get<Itens[]>(this.urlApi)
  }

  // LISTAR UM
  listaritem(idItem: number): Observable<Itens> {
    return this.http.get<Itens>(`${this.urlApi}/${idItem}`)
  }

  // EXCLUIR
  exluiritem(item: Itens): Observable<void> {
    return this.http.delete<void>(`${this.urlApi}/${item.iditem}`)
  }

  // ALTERAR: o back-end espera o ProdutoDTO (ProdutoItem)
  alteraritem(idItem: number, dto: ProdutoItem): Observable<void> {
    return this.http.put<void>(`${this.urlApi}/${idItem}`, dto)
  }
}
