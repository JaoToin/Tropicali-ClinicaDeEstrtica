import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PessoaEndereco, Endereco } from '../../models/pessoa-endereco';
import { PessoaEndereço } from '../../Service/Clienet/pessoa-endereço';


@Component({
  imports: [FormsModule],
  selector: 'app-client-component',
  styleUrl: './client-component.css',
  templateUrl: './client-component.html',
})
export class ClientComponent {
  //DELCARAÇÃO DOS ATRIBUTOS DO COMPONENTE
  pessoaId = 0
  nome = ''
  cpf = ''
  sexo = ''
  cep = ''
  numero = ''
  enderecoId = 0
  complemento= ''
  data = new Date()
  telefone = ''
  editar = false
  email = ''


  //DECLARAÇÃO DO CONSTRUTOR
  constructor(private Pessoa: PessoaEndereço, private route: ActivatedRoute, private cdr: ChangeDetectorRef) { }

  exibeDados() {
    console.log(this.nome, this.data, this.cpf, this.sexo, this.email, this.telefone,this.numero, this.cep, this.complemento) //
  }



    ngOnInit() {
      this.pessoaId = Number(this.route.snapshot.paramMap.get('id'))

      if (this.pessoaId > 0) {
        this.editar = true
        this.carregaCampo(this.pessoaId)
      }

    }

    carregaCampo(idAtleta: number) {
      this.Pessoa.listarpessoa(idAtleta)
        .subscribe({
          next: (obj) => {
            this.pessoaId = obj.idPessoa
            this.nome = obj.nome
            this.cpf = obj.cpf
            this.sexo = obj.sexo
            this.data = obj.dataNascimento
            this.email = obj.email
            this.telefone = obj.telefone

            const end = obj.enderecos?.[0]
            if (end) {
              this.enderecoId = end.idEndereco
              this.cep = end.cep
              this.numero = end.numero
              this.complemento = end.complemento
            }

            this.cdr.detectChanges()
          },
          error: (msgErro) => {
            console.log("Erro ao Listar o client ", msgErro)
          }
        })
    }
    enviaDadosClient() {
      const pessoa = new PessoaEndereco()
      pessoa.nome = this.nome
      pessoa.cpf = this.cpf.replace(/\D/g, '')           // só números
      pessoa.telefone = this.telefone.replace(/\D/g, '') // só números
      pessoa.email = this.email
      pessoa.sexo = this.sexo
      pessoa.dataNascimento = this.data                  // "yyyy-MM-dd"
      pessoa.ativoPessoa = 'S'

      const endereco = new Endereco()
      endereco.cep = this.cep.replace(/\D/g, '')
      endereco.numero = this.numero
      endereco.complemento = this.complemento
      pessoa.enderecos = [endereco]

      if (!this.editar) {
        this.Pessoa.adicionarpessoa(pessoa).subscribe({
          next: (resposta) => {
            console.log(resposta)
            this.limpar()
          },
          error: (msgErro) => console.log("Erro ao cadastrar", msgErro)
        })
      } else {
        pessoa.idPessoa = this.pessoaId
        endereco.idPessoa = this.pessoaId
        endereco.idEndereco = this.enderecoId

        this.Pessoa.alterarpessoa(pessoa).subscribe({
          next: (resposta) => {
            console.log(resposta)
            this.limpar()
          },
          error: (msgErro) => console.log("Erro ao alterar", msgErro)
        })
      }
    }
    listaAtleta(idAtleta: number) {
      this.Pessoa.listarpessoa(idAtleta)
        .subscribe({
          next: (dados) => {
            console.table(dados)
          },
          error: (msgErro) => {
            console.log("Erro ao listar atletas ", msgErro)
          }
        })
    }

    limpar() {
      this.nome = ''
      this.cpf = ''
      this.sexo = ''
      this.cep = ''
      this.numero = ''
      this.complemento = ''
      this.data = new Date()
      this.email = ''
      this.telefone = ''
    }

}
