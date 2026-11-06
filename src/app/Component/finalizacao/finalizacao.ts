import { PessoaEndereco } from '../../models/pessoa-endereco';
import { FormsModule } from '@angular/forms';
import { PessoaEnderecoService } from '../../Service/Clienet/pessoa-endereço';
import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AtendimentoServico } from './../../Service/Atendimento/atendimento/atendimento-module';
import { AtendimentoModelo, ItemAtendimento } from '../../models/atendimento';
import { normalizar, mensagemErro } from '../../../../Util/util';
import { Item } from '../../Service/item/item';
import { Itens } from '../../models/item';




@Component({
  imports: [FormsModule],
  selector: 'app-finalizacao',
  styleUrl: './finalizacao.css',
  templateUrl: './finalizacao.html',
})
export class Finalizacao {

  // pessoa e seu endereço

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

 // atendimento

  idatendimento = 0
  idpessoa = 0
  dataatendimento = ''
  status = 'A'
  idItem = 0
  idFuncionario = 0
  quantidade = 0
  valorUnitario = 0


  listaPessoa = signal<PessoaEndereco[]>([])

  itensCarregados: ItemAtendimento[] = []

  ListaAtendimento = signal<AtendimentoModelo[]>([])

  listaItem = signal<Itens[]>([])

  constructor(
    private servicoPessoa: PessoaEnderecoService,
    private servicoAtendimento: AtendimentoServico,
    private servicoItens: Item,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }


  ngOnInit() {
    this.listarPessoas()
    this.listarAtendimentos()
  }

  listarItens() {
    this.servicoItens.listaritems()
      .subscribe({
        next: (dados) => {
          this.listaItem.set(
            [...dados].sort((a, b) =>
              (a.iditemNavigation?.item1 ?? '').localeCompare(b.iditemNavigation?.item1 ?? ''))
          )
        },
        error: (msgErro) => console.log('Erro ao listar produtos', msgErro)
      })
  }



  listarPessoas() {
    this.servicoPessoa.listarpessoas()
      .subscribe({
        next: (dados) => {
          this.listaPessoa.set(
            [...dados].sort((a, b) => (a.nome ?? '').localeCompare(b.nome ?? ''))
          )
        },
        error: (msgErro) => console.log('Erro ao listar pessoas', msgErro)
      })
  }


  listarAtendimentos() {
    this.servicoAtendimento.listarAtendimentos()
      .subscribe({
        next: (dados) => {
          this.ListaAtendimento.set(
            [...dados].sort((a, b) =>
              String(b.dataAtendimento ?? '').localeCompare(String(a.dataAtendimento ?? '')))
          )
        },
        error: (msgErro) => console.log('Erro ao listar atendimentos', msgErro)
      })
  }

  enviarDados() {
    if (this.idpessoa <= 0 || !this.dataatendimento) {
      alert('Escolha a pessoa e a data do atendimento.')
      return
    }

    const atendimento = new AtendimentoModelo()
    atendimento.idPessoa = this.idpessoa
    atendimento.dataAtendimento = this.dataatendimento
    atendimento.statusAtendimento = this.status

    const itens = new ItemAtendimento()
    itens.idItem = this.idItem
    itens.quantidade = this.quantidade
    itens.valorUnitario = this.valorUnitario
    itens.idFuncionario = this.idFuncionario

    if (!this.editar) {
      this.servicoAtendimento.adicionarAtendimento(atendimento).subscribe({
        next: () => {
          this.limpar()
          this.listarAtendimentos()
        },
        error: (msgErro) => {
          console.log('Erro ao cadastrar', msgErro)
          alert(mensagemErro(msgErro))
        }
      })
    } else {
      atendimento.idAtendimento = this.idatendimento

      this.servicoAtendimento.alterarAtendimento(atendimento).subscribe({
        next: () => {
          this.limpar()
          this.listarAtendimentos()
        },
        error: (msgErro) => {
          console.log('Erro ao alterar', msgErro)
          alert(mensagemErro(msgErro))
        }
      })
    }
  }






  limpar() {
    this.idatendimento = 0
    this.idpessoa = 0
    this.dataatendimento = ''
    this.status = 'A'
    this.itensCarregados = []
  }

}
