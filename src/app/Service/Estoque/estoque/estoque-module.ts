import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Entrada, EstoqueModelo } from './../../../models/estoque-entrada';

@Injectable({
  providedIn: 'root',
})
export class EstoqueService {

  private readonly urlApi = 'https://localhost:7077/api/EstoqueEntrada'

  constructor(private http: HttpClient) { }

  // CADASTRAR ENTRADA
  adicionarEstoqueEntrada(entrada: Entrada): Observable<unknown> {
    return this.http.post<unknown>(this.urlApi, entrada)
  }

  // LISTAR OS ESTOQUES (cada um com as suas entradas)
  listarEstoques(): Observable<EstoqueModelo[]> {
    return this.http.get<EstoqueModelo[]>(this.urlApi)
  }

  // ALTERAR ENTRADA (id = id da entrada)
  alterarEstoqueEntrada(entrada: Entrada): Observable<void> {
    return this.http.put<void>(`${this.urlApi}/${entrada.idEntrada}`, entrada)
  }

  // EXCLUIR ENTRADA (id = id da entrada)
  exluirEstoqueEntrada(entrada: Entrada): Observable<void> {
    return this.http.delete<void>(`${this.urlApi}/${entrada.idEntrada}`)
  }
}
