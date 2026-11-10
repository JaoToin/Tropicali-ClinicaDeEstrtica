import { FormsModule } from '@angular/forms';
import { Component, signal, ChangeDetectorRef, OnInit, computed  } from '@angular/core';
import { PessoaEndereco, Endereco } from '../../../models/pessoa-endereco';
import { PessoaEnderecoService } from '../../../Service/Clienet/pessoa-endereço';
import { ActivatedRoute } from '@angular/router';
import { normalizar, mensagemErro } from '../../../../../Util/util';



@Component({
  imports: [],
  selector: 'app-endereco',
  styleUrl: './endereco.css',
  templateUrl: './endereco.html',
})
export class EnderecoADM {

  idEndereco = 0
  idPessoa = 0
  cep = ''
  numero = 0
  complemento = ''
  editar = false

  listarEndereco = signal<Endereco[]>([])
  buscar = signal('')

  pessoasFiltradas = computed(() => {
    const termo = normalizar(this.buscar())
    if (!termo) {
      return this.listarEndereco()
    }
    return this.listarEndereco().filter(e =>
      normalizar(e.cep).includes(termo)
      || String(e.complemento ?? '').includes(termo)
      || normalizar(e.numero).includes(termo))
  })

  constructor(
    private servico: PessoaEnderecoService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

}
