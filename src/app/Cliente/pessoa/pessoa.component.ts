import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PessoaEndereco } from '../../models/pessoa-endereco';
import { PessoaEnderecoService } from '../../services/pessoa-endereco.service';

@Component({
  selector: 'app-pessoa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pessoa.component.html',
  styleUrl: './pessoa.component.css'
})
export class PessoaComponent implements OnInit {
  pessoas: PessoaEndereco[] = [];
  pessoa: PessoaEndereco = new PessoaEndereco();

  constructor(private pessoaService: PessoaEnderecoService) {}

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.pessoaService.listar().subscribe((res) => {
      this.pessoas = res;
    });
  }

  salvar(): void {
    this.pessoaService.salvar(this.pessoa).subscribe(() => {
      this.pessoa = new PessoaEndereco();
      this.listar();
    });
  }
}
