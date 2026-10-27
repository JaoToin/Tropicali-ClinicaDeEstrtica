import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PessoaEndereco } from '../../models/pessoa-endereco';
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
          next: (objAtleta) => {
            this.pessoaId = objAtleta.pessoaId

            this.nome = objAtleta.nome
            this.cpf = objAtleta.cpf
            this.sexo = objAtleta.sexo
            this.data = objAtleta.dataNascimento
            this.email = objAtleta.email
            this.telefone = objAtleta.telefone
            this.cep = objAtleta.cep
            this.complemento = objAtleta.complemento
            this.numero = objAtleta.numero

            this.cdr.detectChanges()
          }, error: (msgErro) => {
            console.log("Erro ao Listar  o atleta ", msgErro)
          }
        })
    }

    enviaDadosAtleta() {
      const pessoa = new PessoaEndereco()
      pessoa.nome = this.nome
      pessoa.cpf = this.cpf
      pessoa.sexo = this.sexo
      pessoa.cep = this.cep
      pessoa.numero = this.numero
      pessoa.complemento = this.complemento
      pessoa.dataNascimento = this.data
      pessoa.email = this.email
      pessoa.telefone = this.telefone




      if (!this.editar) {
        this.Pessoa.adicionarpessoa(pessoa)
          .subscribe({
            next: (resposta) => {
              console.log(resposta)
            },
            error: (msgErro) => {
              console.log("Erro ao cadastrar  o atleta ", msgErro)
            }
          })
      } else {
        pessoa.pessoaId = this.pessoaId

        this.Pessoa.alterarpessoa(pessoa)
          .subscribe({
            next: (resposta) => {
              console.log(pessoa)

              console.log(resposta)
            },
            error: (msgErro) => {
              console.log("Erro ao alterar  o atleta ", msgErro)
            }
          })

      }

      this.limpar()

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
