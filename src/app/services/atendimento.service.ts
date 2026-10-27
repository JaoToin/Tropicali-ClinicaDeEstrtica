import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Atendimento } from '../models/atendimento';

@Injectable({ providedIn: 'root' })
export class AtendimentoService {
  private apiUrl = 'https://localhost:7077/api/Atendimento';

  constructor(private http: HttpClient) {}

  listar(): Observable<Atendimento[]> {
    return this.http.get<Atendimento[]>(this.apiUrl);
  }

  salvar(atendimento: Atendimento): Observable<Atendimento> {
    return this.http.post<Atendimento>(this.apiUrl, atendimento);
  }

  atualizar(id: number, atendimento: Atendimento): Observable<Atendimento> {
    return this.http.put<Atendimento>(`${this.apiUrl}/${id}`, atendimento);
  }

  excluir(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
