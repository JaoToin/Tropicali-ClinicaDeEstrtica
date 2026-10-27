import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EstoqueEntrada } from '../models/estoque-entrada';

@Injectable({ providedIn: 'root' })
export class EstoqueEntradaService {
  private apiUrl = 'https://localhost:7077/api/EstoqueEntrada';

  constructor(private http: HttpClient) {}

  listar(): Observable<EstoqueEntrada[]> {
    return this.http.get<EstoqueEntrada[]>(this.apiUrl);
  }

  salvar(item: EstoqueEntrada): Observable<EstoqueEntrada> {
    return this.http.post<EstoqueEntrada>(this.apiUrl, item);
  }

  atualizar(id: number, item: EstoqueEntrada): Observable<EstoqueEntrada> {
    return this.http.put<EstoqueEntrada>(`${this.apiUrl}/${id}`, item);
  }

  excluir(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
