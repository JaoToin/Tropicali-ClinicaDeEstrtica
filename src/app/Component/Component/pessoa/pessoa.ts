import { PessoaEnderecoService } from './../../../Service/Clienet/pessoa-endereço';
import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PessoaEndereco, Endereco } from '../../../models/pessoa-endereco';

@Component({
  imports: [FormsModule],
  selector: 'app-pessoa',
  styleUrl: './pessoa.css',
  templateUrl: './pessoa.html',
})
export class Pessoa {


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
  listaPessoa = signal<PessoaEndereco[]>([])


  //DECLARAÇÃO DO CONSTRUTOR
  constructor(private Pessoa: PessoaEnderecoService, private route: ActivatedRoute, private cdr: ChangeDetectorRef) { }

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


        listarItens() {
    this.Pessoa.listarpessoas()
      .subscribe({
        next: (dados) => {
          //this.listaItens = [...dados].sort((a, b) => a.nome.localeCompare(b.nome))
          this.listaPessoa.set(
            [...dados].sort((a, b) =>
              a.nome.localeCompare(b.nome))
          )},
        error: (msgErro) => {
          console.log("Erro", msgErro)
        }

      })

  }

    carregaCampo(idAtleta: number) {
      this.editar = true
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

    excluir(Pessoa: PessoaEndereco) {
        if(confirm(`Deseja excluir ${Pessoa.idPessoa} do Banco de Dados? `)){
          this.Pessoa.exluirpessoa(Pessoa)
          .subscribe({
            next:(dados)=>{
               this.listaPessoa.update(elem =>
                elem.filter(a => a.idPessoa  !== a.idPessoa)
              );

              console.log('item excluído com Sucesso ', dados)
            },
            error: (msgErro) => {
              console.log("Erro ao Excluir  o item ", msgErro)
            }
          })

        }
        this.ngOnInit()
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

