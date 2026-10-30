import { FormsModule } from '@angular/forms';
import { AtendimentoServico } from './../../../Service/Atendimento/atendimento/atendimento-module';
import { Component, signal, ChangeDetectorRef } from '@angular/core';
import { AtendimentoModelo} from '../../../models/atendimento';
import { ActivatedRoute } from '@angular/router';


@Component({
  imports: [FormsModule],
  selector: 'app-atendimento',
  styleUrl: './atendimento.css',
  templateUrl: './atendimento.html',
})
export class Atendimento {

  idatendimento = 0
  idpessoa = 0
  dataatendimento = ''
  status = 'Aberto'
  editar = false

  ListaAtendimento = signal<AtendimentoModelo[]>([])

  constructor(
    private servico: AtendimentoServico,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit() {
    this.listarAtendimentos()

    this.idatendimento = Number(this.route.snapshot.paramMap.get('id'))
    if (this.idatendimento > 0) {
      this.carregarCampo(this.idatendimento)
    }
  }

  listarAtendimentos() {
    this.servico.listarAtendimentos()
      .subscribe({
        next: (dados) => {
          this.ListaAtendimento.set(
            [...dados].sort((a, b) =>
              (b.dataAtendimento ?? '').localeCompare(a.dataAtendimento ?? ''))
          )
        },
        error: (msgErro) => console.log("Erro ao listar atendimentos", msgErro)
      })
  }

  carregarCampo(id: number){
    this.editar = true
    this.servico.listarAtendimento(id)
    .subscribe({
      next: (obj) => {
        this.idpessoa = obj.idPessoa
        this.idatendimento = obj.idAtendimento
        this.dataatendimento = obj.dataAtendimento.substring(0, 10)
        this.status = obj.statusAtendimento
        this.cdr.detectChanges()
      },
      error: (msgErro) => {
        console.log("Erro ao carregar Atendimento", msgErro)
      }
    })

  }

  enviarDados(){
    const Atendimento = new AtendimentoModelo()

    Atendimento.idPessoa = this.idpessoa
    Atendimento.dataAtendimento = this.dataatendimento
    Atendimento.statusAtendimento = this.status
    Atendimento.itens = []

    if (!this.editar) {
      this.servico.adicionarAtendimento(Atendimento).subscribe({
        next: (resposta) => {
          console.log(resposta)
          this.limpar()
          this.listarAtendimentos()
        },
        error: (msgErro) => console.log("Erro ao cadastrar", msgErro)
      })
    } else {
      Atendimento.idAtendimento = this.idatendimento

      this.servico.alterarAtendimento(Atendimento).subscribe({
        next: (resposta) => {
          console.log(resposta)
          this.limpar()
          this.listarAtendimentos()
        },
        error: (msgErro) => console.log("Erro ao alterar", msgErro)
      })
    }

  }


  excluir(aten: AtendimentoModelo) {
    if (confirm(`Deseja excluir o Atendimento ${aten.idAtendimento} do Banco de Dados?`)) {
      this.servico.exluirAtendimento(aten)
        .subscribe({
          next: (dados) => {
            this.ListaAtendimento.update(lista =>
              lista.filter(a => a.idAtendimento !== aten.idAtendimento)
            )
            console.log('Atendimento excluído com sucesso', dados)
          },
          error: (msgErro) => {
            console.log("Erro ao excluir Atendimento", msgErro)
          }
        })
    }
  }







  limpar() {
    this.idatendimento = 0
    this.idpessoa = 0
    this.dataatendimento = ''
    this.status = 'Aberto'
    this.editar = false
  }


}
