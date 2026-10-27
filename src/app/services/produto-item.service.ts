import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProdutoItem } from '../models/produto-item';

@Injectable({ providedIn: 'root' })
export class ProdutoItemService {
  private apiUrl = 'https://localhost:7077/api/ProdutoItem';

  constructor(private http: HttpClient) {}

  listar(): Observable<ProdutoItem[]> {
    return this.http.get<ProdutoItem[]>(this.apiUrl);
  }

  salvar(produto: ProdutoItem): Observable<ProdutoItem> {
    return this.http.post<ProdutoItem>(this.apiUrl, produto);
  }

  atualizar(id: number, produto: ProdutoItem): Observable<ProdutoItem> {
    return this.http.put<ProdutoItem>(`${this.apiUrl}/${id}`, produto);
  }

  excluir(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
