import { Funcionario } from './../../../models/funcionario';
import {Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})


export class FuncionarioService {

         //DECLARAÇÃO CONSTRUTOR
        constructor(private http: HttpClient) { }

        //ADICIONAR NA API
        adicionarfuncionario(funcionario: Funcionario): Observable<Funcionario> {
          const urlApi = `https://localhost:7077/api/Funcionarios`

          return this.http.post<Funcionario>(urlApi, funcionario)
        }

        //LISTAR funcionarioS NA API
        listarfuncionarios(): Observable<Funcionario[]> {
          const urlApi = `https://localhost:7077/api/Funcionarios`

          return this.http.get<Funcionario []>(urlApi)
        }

        //LISTAR funcionario
        listarfuncionario(idfuncionario: number):Observable<Funcionario>{
          const urlApi = `https://localhost:7077/api/Funcionarios/${idfuncionario}`

          return this.http.get<Funcionario>(urlApi)
        }

        //EXCLUIR NA API
        exluirfuncionario(funcionario: Funcionario): Observable<Funcionario> {
          const urlApi = `https://localhost:7077/api/Funcionarios/${funcionario.idPessoa}`

          return this.http.delete<Funcionario>(urlApi)
        }

        //ALTERAR NA API
        alterarfuncionario(funcionario: Funcionario):Observable<Funcionario>{
          const urlApi = `https://localhost:7077/api/Funcionarios/${funcionario.idPessoa}`

          return this.http.put<Funcionario  >(urlApi, funcionario)
        }




    }

