import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Atendimento, ItemAtendimento } from '../../models/atendimento';
import { AtendimentoService } from '../../services/atendimento.service';

@Component({
  selector: 'app-atendimento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './atendimento.component.html',
  styleUrl: './atendimento.component.css'
})
export class AtendimentoComponent implements OnInit {
  atendimentos: Atendimento[] = [];
  atendimento: Atendimento = new Atendimento();

  constructor(private atendimentoService: AtendimentoService) {}

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.atendimentoService.listar().subscribe((res) => {
      this.atendimentos = res;
    });
  }

  salvar(): void {
    this.atendimentoService.salvar(this.atendimento).subscribe(() => {
      this.atendimento = new Atendimento();
      this.listar();
    });
  }

  adicionarItem(): void {
    this.atendimento.itens.push(new ItemAtendimento());
  }
}
