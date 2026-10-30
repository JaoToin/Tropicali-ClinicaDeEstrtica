import { Entrada } from './../../../models/estoque-entrada';
import {Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})

export class EstoqueService {

           //DECLARAÇÃO CONSTRUTOR
          constructor(private http: HttpClient) { }

          //ADICIONAR NA API
          adicionarEstoqueEntrada(estoqueEntrada: Entrada): Observable<Entrada> {
            const urlApi = `https://localhost:7077/api/EstoqueEntrada`

            return this.http.post<Entrada>(urlApi, estoqueEntrada)
          }

          //LISTAR EstoqueEntradaS NA API
          listarEstoqueEntradas(): Observable<Entrada[]> {
            const urlApi = `https://localhost:7077/api/EstoqueEntrada`

            return this.http.get<Entrada []>(urlApi)
          }

          //LISTAR EstoqueEntrada
          listarEstoqueEntrada(idEstoqueEntrada: number):Observable<Entrada>{
            const urlApi = `https://localhost:7077/api/EstoqueEntrada/${idEstoqueEntrada}`

            return this.http.get<Entrada>(urlApi)
          }

          //EXCLUIR NA API
          exluirEstoqueEntrada(estoqueEntrada: Entrada): Observable<Entrada> {
            const urlApi = `https://localhost:7077/api/EstoqueEntrada/${estoqueEntrada.identradaProduto}`

            return this.http.delete<Entrada>(urlApi)
          }

          //ALTERAR NA API
          alterarEstoqueEntrada(estoqueEntrada: Entrada):Observable<Entrada>{
            const urlApi = `https://localhost:7077/api/EstoqueEntrada/${estoqueEntrada.identradaProduto}`

            return this.http.put<Entrada  >(urlApi, estoqueEntrada)
          }




      }


