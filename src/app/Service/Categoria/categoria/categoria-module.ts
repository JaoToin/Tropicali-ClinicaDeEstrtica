import { CategoriaModelo } from './../../../models/categoria';
import {Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})

export class CategoriaService {
  private readonly urlApi = 'https://localhost:7077/api/Categoria'   // ajuste aqui

  constructor(private http: HttpClient) { }

  adicionarCategoria(c: CategoriaModelo): Observable<CategoriaModelo> {
    return this.http.post<CategoriaModelo>(this.urlApi, c)
  }

  listarCategorias(): Observable<CategoriaModelo[]> {
    return this.http.get<CategoriaModelo[]>(this.urlApi)
  }

  listarCategoria(id: number): Observable<CategoriaModelo> {
    return this.http.get<CategoriaModelo>(`${this.urlApi}/${id}`)
  }

  exluirCategoria(c: CategoriaModelo): Observable<CategoriaModelo> {
    return this.http.delete<CategoriaModelo>(`${this.urlApi}/${c.idcategoria}`)
  }

  alterarCategoria(c: CategoriaModelo): Observable<CategoriaModelo> {
    return this.http.put<CategoriaModelo>(`${this.urlApi}/${c.idcategoria}`, c)
  }
}
