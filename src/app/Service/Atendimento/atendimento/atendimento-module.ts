import { AtendimentoModelo } from './../../../models/atendimento';
import {Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})


export class AtendimentoServico {

         //DECLARAÇÃO CONSTRUTOR
        constructor(private http: HttpClient) { }

        //ADICIONAR NA API
        adicionarAtendimento(Atendimento: AtendimentoModelo): Observable<AtendimentoModelo> {
          const urlApi = `https://localhost:7077/api/Atendimento`

          return this.http.post<AtendimentoModelo>(urlApi, Atendimento)
        }

        //LISTAR AtendimentoS NA API
        listarAtendimentos(): Observable<AtendimentoModelo[]> {
          const urlApi = `https://localhost:7077/api/Atendimento`

          return this.http.get<AtendimentoModelo []>(urlApi)
        }

        //LISTAR Atendimento
        listarAtendimento(idAtendimento: number):Observable<AtendimentoModelo>{
          const urlApi = `https://localhost:7077/api/Atendimento/${idAtendimento}`

          return this.http.get<AtendimentoModelo>(urlApi)
        }

        //EXCLUIR NA API
        exluirAtendimento(Atendimento: AtendimentoModelo): Observable<AtendimentoModelo> {
          const urlApi = `https://localhost:7077/api/Atendimento/${Atendimento.idAtendimento}`

          return this.http.delete<AtendimentoModelo>(urlApi)
        }

        //ALTERAR NA API
        alterarAtendimento(Atendimento: AtendimentoModelo):Observable<AtendimentoModelo>{
          const urlApi = `https://localhost:7077/api/Atendimento/${Atendimento.idAtendimento}`

          return this.http.put<AtendimentoModelo  >(urlApi, Atendimento)
        }




    }

