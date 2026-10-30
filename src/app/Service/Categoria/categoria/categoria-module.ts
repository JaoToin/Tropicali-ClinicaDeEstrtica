import { CategoriaModelo } from './../../../models/categoria';
import {Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})


export class CategoriaService {

         //DECLARAÇÃO CONSTRUTOR
        constructor(private http: HttpClient) { }

        //ADICIONAR NA API
        adicionarCategoria(Categoria: CategoriaModelo): Observable<CategoriaModelo> {
          const urlApi = `https://localhost:7077/api/Categorias`

          return this.http.post<CategoriaModelo>(urlApi, Categoria)
        }

        //LISTAR CategoriaS NA API
        listarCategorias(): Observable<CategoriaModelo[]> {
          const urlApi = `https://localhost:7077/api/Categorias`

          return this.http.get<CategoriaModelo []>(urlApi)
        }

        //LISTAR Categoria
        listarCategoria(idCategoria: number):Observable<CategoriaModelo>{
          const urlApi = `https://localhost:7077/api/Categorias/${idCategoria}`

          return this.http.get<CategoriaModelo>(urlApi)
        }

        //EXCLUIR NA API
        exluirCategoria(Categoria: CategoriaModelo): Observable<CategoriaModelo> {
          const urlApi = `https://localhost:7077/api/Categorias/${Categoria.idcategoria}`

          return this.http.delete<CategoriaModelo>(urlApi)
        }

        //ALTERAR NA API
        alterarCategoria(Categoria: CategoriaModelo):Observable<CategoriaModelo>{
          const urlApi = `https://localhost:7077/api/Categorias/${Categoria.idcategoria}`

          return this.http.put<CategoriaModelo  >(urlApi, Categoria)
        }




    }

