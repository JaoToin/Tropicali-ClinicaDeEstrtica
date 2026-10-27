import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PessoaEndereco } from '../models/pessoa-endereco';

@Injectable({ providedIn: 'root' })
export class PessoaEnderecoService {
  private apiUrl = 'https://localhost:7077/api/PessoaEndereco';

  constructor(private http: HttpClient) {}

  listar(): Observable<PessoaEndereco[]> {
    return this.http.get<PessoaEndereco[]>(this.apiUrl);
  }

  salvar(pessoa: PessoaEndereco): Observable<PessoaEndereco> {
    return this.http.post<PessoaEndereco>(this.apiUrl, pessoa);
  }

  atualizar(id: number, pessoa: PessoaEndereco): Observable<PessoaEndereco> {
    return this.http.put<PessoaEndereco>(`${this.apiUrl}/${id}`, pessoa);
  }

  excluir(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
