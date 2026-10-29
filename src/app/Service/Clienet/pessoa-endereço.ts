import { PessoaEndereco } from '../../models/pessoa-endereco';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class PessoaEnderecoService {

   //DECLARAÇÃO CONSTRUTOR
  constructor(private http: HttpClient) { }

  //ADICIONAR NA API
  adicionarpessoa(pessoa: PessoaEndereco): Observable<PessoaEndereco> {
    const urlApi = `https://localhost:7077/api/PessoaEndereco`

    return this.http.post<PessoaEndereco>(urlApi, pessoa)
  }

  //LISTAR pessoaS NA API
  listarpessoas(): Observable<PessoaEndereco[]> {
    const urlApi = `https://localhost:7077/api/PessoaEndereco`

    return this.http.get<PessoaEndereco []>(urlApi)
  }

  //LISTAR pessoa
  listarpessoa(idpessoa: number):Observable<PessoaEndereco>{
    const urlApi = `https://localhost:7077/api/PessoaEndereco/${idpessoa}`

    return this.http.get<PessoaEndereco>(urlApi)
  }

  //EXCLUIR NA API
  exluirpessoa(pessoa: PessoaEndereco): Observable<PessoaEndereco> {
    const urlApi = `https://localhost:7077/api/PessoaEndereco/${pessoa.idPessoa}`

    return this.http.delete<PessoaEndereco>(urlApi)
  }

  //ALTERAR NA API
  alterarpessoa(pessoa: PessoaEndereco):Observable<PessoaEndereco>{
    const urlApi = `https://localhost:7077/api/PessoaEndereco/${pessoa.idPessoa}`

    return this.http.put<PessoaEndereco>(urlApi, pessoa)
  }


}
