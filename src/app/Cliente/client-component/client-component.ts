import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PessoaEndereco } from '../../models/pessoa/pessoa_endereco';



@Component({
  imports: [FormsModule],
  selector: 'app-client-component',
  styleUrl: './client-component.css',
  templateUrl: './client-component.html',
})
export class ClientComponent {
  //DELCARAÇÃO DOS ATRIBUTOS DO COMPONENTE
  id = 0
  nome = ''
  cpf = ''
  sexo = ''
  cep = ''
  numero = ''
  complemento= ''
  data = ''
  telefone = ''
  editar = false
  email = ''

  exibeDados() {
    console.log(this.nome, this.data, this.cpf, this.sexo, this.email, this.telefone,this.numero, this.cep, this.complemento) //
  }

  enviaDadosAtleta() {
    const cliente = new PessoaEndereco()
    cliente.Nome = this.nome
    cliente.CPF = this.cpf
    cliente.Sexo = this.sexo
    cliente.CEP = this.cep
    cliente.Numero = this.numero
    cliente.Complemento = this.complemento
    cliente.DataNascimento = this.data
    cliente.Telefone = this.telefone
    cliente.Email = this.email

    this.limpar()


}


limpar() {
  this.nome = ''
  this.cpf = ''
  this.sexo = ''
  this.cep = ''
  this.numero = ''
  this.complemento = ''
  this.data = ''
  this.telefone = ''
  this.email = ''
  }


}
