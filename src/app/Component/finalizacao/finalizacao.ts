import { PessoaEndereco } from '../../models/pessoa-endereco';
import { FormsModule } from '@angular/forms';
import { PessoaEnderecoService } from '../../Service/Clienet/pessoa-endereço';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AtendimentoServico } from './../../Service/Atendimento/atendimento/atendimento-module';
import { AtendimentoModelo, ItemAtendimento } from '../../models/atendimento';
import { normalizar, mensagemErro } from '../../../../Util/util';
import { Item } from '../../Service/item/item';
import { Itens } from '../../models/item';
import {FuncionarioService} from '../../Service/Funcionario/funcionario/funcionario-module';
import { Funcionario } from '../../models/funcionario';
import { Router, RouterLink } from '@angular/router';
import { CarrinhoProduto } from '../../Service/Carrinho/carrinho';



// data de hoje no formato yyyy-MM-dd (o formato do input type="date")
function hoje(): string {
  const d = new Date()
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mes}-${dia}`
}


@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-finalizacao',
  styleUrl: './finalizacao.css',
  templateUrl: './finalizacao.html',
})
export class Finalizacao {



 // atendimento
  //lista
  idatendimento = 0
  idpessoa = 0
  dataatendimento = hoje()
  status = 'Aberto'

  //  não lista
  idItem = 0
  idFuncionario = 0
  quantidade = 0
  valorUnitario = 0



  listaPessoa = signal<PessoaEndereco[]>([])

  itensCarregados: ItemAtendimento[] = []

  ListaAtendimento = signal<AtendimentoModelo[]>([])

  listaItem = signal<Itens[]>([])

  listaFuncionario = signal<Funcionario[]>([])

  enviando = signal(false)


  constructor(
    private servicoPessoa: PessoaEnderecoService,
    private servicoAtendimento: AtendimentoServico,
    private servicoItens: Item,
    private route: ActivatedRoute,
    private servicoFuncionario: FuncionarioService,
    private router: Router
  ) { }

   // o mesmo carrinho do catálogo (service único)
  cartService = inject(CarrinhoProduto)

  valorUnitarioChange() {
    const valor = this.quantidade * this.valorUnitario
    this.valorUnitario = valor
  }

  ngOnInit() {
    this.listarPessoas()
    this.listarAtendimentos()
    this.listarFuncionarios()
    this.listarItens()
  }

   listarFuncionarios() {
    this.servicoFuncionario.listarfuncionarios()
      .subscribe({
        next: (dados) => {
          this.listaFuncionario.set(
            [...dados].sort((a, b) =>
              (a.pessoas?.[0]?.nome ?? '').localeCompare(b.pessoas?.[0]?.nome ?? ''))
          )
        },
        error: (msgErro) => console.log('Erro ao listar funcionários', msgErro)
      })
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
    const itensCarrinho = this.cartService.cart()

   if (this.idpessoa <= 0 || this.idFuncionario <= 0 || !this.dataatendimento) {
      alert('Escolha a pessoa e o funcionário')
      return
    }

    const atendimento = new AtendimentoModelo()
    atendimento.idPessoa = this.idpessoa
    atendimento.dataAtendimento = this.dataatendimento
    atendimento.statusAtendimento = this.status

        // um item do atendimento para cada item do carrinho
    atendimento.itens = itensCarrinho.map(i => {
      const item = new ItemAtendimento()
      item.idItem = i.iditem
      item.idFuncionario = this.idFuncionario
      item.quantidade = i.quantidade
      item.valorUnitario = i.precoVenda
      return item
    })

    this.enviando.set(true)


   /* const itens = new ItemAtendimento()
    itens.idItem = this.idItem
    itens.quantidade = this.quantidade
    itens.valorUnitario = this.valorUnitario
    itens.idFuncionario = this.idFuncionario
*/
  this.servicoAtendimento.adicionarAtendimento(atendimento).subscribe({
      next: () => {
        this.enviando.set(false)
        this.cartService.limpar()
        this.limpar(); //  Reseta idpessoa, idFuncionario, etc.
        alert('Pedido finalizado com sucesso!')
        this.router.navigate(['/itens'])
      },
      error: (msgErro) => {
        this.enviando.set(false)
        console.log('Erro ao cadastrar', msgErro)
        alert(mensagemErro(msgErro))
      }
    })
  }
  limpar() {
    this.idatendimento = 0
    this.idpessoa = 0
    this.dataatendimento = ''
    this.status = 'A'
    this.itensCarregados = []
    this.idItem = 0
    this.quantidade = 0
    this.valorUnitario = 0
  }

}
