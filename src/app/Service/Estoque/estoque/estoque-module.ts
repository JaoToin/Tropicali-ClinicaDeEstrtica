import { EstoqueEntrada } from './../../../models/estoque-entrada';
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
          adicionarEstoqueEntrada(estoqueEntrada: EstoqueEntrada): Observable<EstoqueEntrada> {
            const urlApi = `https://localhost:7077/api/EstoqueEntrada`

            return this.http.post<EstoqueEntrada>(urlApi, estoqueEntrada)
          }

          //LISTAR EstoqueEntradaS NA API
          listarEstoqueEntradas(): Observable<EstoqueEntrada[]> {
            const urlApi = `https://localhost:7077/api/EstoqueEntrada`

            return this.http.get<EstoqueEntrada []>(urlApi)
          }

          //LISTAR EstoqueEntrada
          listarEstoqueEntrada(idEstoqueEntrada: number):Observable<EstoqueEntrada>{
            const urlApi = `https://localhost:7077/api/EstoqueEntrada/${idEstoqueEntrada}`

            return this.http.get<EstoqueEntrada>(urlApi)
          }

          //EXCLUIR NA API
          exluirEstoqueEntrada(estoqueEntrada: EstoqueEntrada): Observable<EstoqueEntrada> {
            const urlApi = `https://localhost:7077/api/EstoqueEntrada/${estoqueEntrada.idItem}`

            return this.http.delete<EstoqueEntrada>(urlApi)
          }

          //ALTERAR NA API
          alterarEstoqueEntrada(estoqueEntrada: EstoqueEntrada):Observable<EstoqueEntrada>{
            const urlApi = `https://localhost:7077/api/EstoqueEntrada/${estoqueEntrada.idItem}`

            return this.http.put<EstoqueEntrada  >(urlApi, estoqueEntrada)
          }




      }


