import { Categoria } from './../../../models/categoria';
import {Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})


export class CategoriaModule {

         //DECLARAÇÃO CONSTRUTOR
        constructor(private http: HttpClient) { }

        //ADICIONAR NA API
        adicionarCategoria(Categoria: Categoria): Observable<Categoria> {
          const urlApi = `https://localhost:7077/api/Categorias`

          return this.http.post<Categoria>(urlApi, Categoria)
        }

        //LISTAR CategoriaS NA API
        listarCategorias(): Observable<Categoria[]> {
          const urlApi = `https://localhost:7077/api/Categorias`

          return this.http.get<Categoria []>(urlApi)
        }

        //LISTAR Categoria
        listarCategoria(idCategoria: number):Observable<Categoria>{
          const urlApi = `https://localhost:7077/api/Categorias/${idCategoria}`

          return this.http.get<Categoria>(urlApi)
        }

        //EXCLUIR NA API
        exluirCategoria(Categoria: Categoria): Observable<Categoria> {
          const urlApi = `https://localhost:7077/api/Categorias/${Categoria.idcategoria}`

          return this.http.delete<Categoria>(urlApi)
        }

        //ALTERAR NA API
        alterarCategoria(Categoria: Categoria):Observable<Categoria>{
          const urlApi = `https://localhost:7077/api/Categorias/${Categoria.idcategoria}`

          return this.http.put<Categoria  >(urlApi, Categoria)
        }




    }

