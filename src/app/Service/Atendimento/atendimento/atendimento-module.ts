import { Atendimento } from './../../../models/atendimento';
import {Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})


export class AtendimentoModule {

         //DECLARAÇÃO CONSTRUTOR
        constructor(private http: HttpClient) { }

        //ADICIONAR NA API
        adicionarAtendimento(Atendimento: Atendimento): Observable<Atendimento> {
          const urlApi = `https://localhost:7077/api/Atendimento`

          return this.http.post<Atendimento>(urlApi, Atendimento)
        }

        //LISTAR AtendimentoS NA API
        listarAtendimentos(): Observable<Atendimento[]> {
          const urlApi = `https://localhost:7077/api/Atendimento`

          return this.http.get<Atendimento []>(urlApi)
        }

        //LISTAR Atendimento
        listarAtendimento(idAtendimento: number):Observable<Atendimento>{
          const urlApi = `https://localhost:7077/api/Atendimento/${idAtendimento}`

          return this.http.get<Atendimento>(urlApi)
        }

        //EXCLUIR NA API
        exluirAtendimento(Atendimento: Atendimento): Observable<Atendimento> {
          const urlApi = `https://localhost:7077/api/Atendimento/${Atendimento.idPessoa}`

          return this.http.delete<Atendimento>(urlApi)
        }

        //ALTERAR NA API
        alterarAtendimento(Atendimento: Atendimento):Observable<Atendimento>{
          const urlApi = `https://localhost:7077/api/Atendimento/${Atendimento.idPessoa}`

          return this.http.put<Atendimento  >(urlApi, Atendimento)
        }




    }

