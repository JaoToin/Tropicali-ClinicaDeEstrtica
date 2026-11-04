import { PessoaEndereco } from '../../models/pessoa-endereco';
import { FormsModule } from '@angular/forms';
import { PessoaEnderecoService } from '../../Service/Clienet/pessoa-endereço';
import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  imports: [FormsModule],
  selector: 'app-finalizacao',
  styleUrl: './finalizacao.css',
  templateUrl: './finalizacao.html',
})
export class Finalizacao {

  pessoaId = 0
  nome = ''
  cpf = ''
  sexo = ''              // M, F ou N (não declarar)
  data = ''              // data de nascimento "yyyy-MM-dd"
  email = ''
  telefone = ''
  enderecoId = 0
  cep = ''
  numero = ''
  complemento = ''
  editar = false


  listaPessoa = signal<PessoaEndereco[]>([])

  constructor(
    private servico: PessoaEnderecoService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }


  ngOnInit() {
    this.listarPessoas()
  }


  listarPessoas() {
    this.servico.listarpessoas()
      .subscribe({
        next: (dados) => {
          this.listaPessoa.set(
            [...dados].sort((a, b) => (a.nome ?? '').localeCompare(b.nome ?? ''))
          )
        },
        error: (msgErro) => console.log('Erro ao listar pessoas', msgErro)
      })
  }


}
