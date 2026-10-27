import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Funcionario } from '../../models/funcionario';
import { FuncionarioService } from '../../services/funcionario.service';

@Component({
  selector: 'app-funcionario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './funcionario.component.html',
  styleUrl: './funcionario.component.css'
})
export class FuncionarioComponent implements OnInit {
  funcionarios: Funcionario[] = [];
  funcionario: Funcionario = new Funcionario();

  constructor(private funcionarioService: FuncionarioService) {}

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.funcionarioService.listar().subscribe((res) => {
      this.funcionarios = res;
    });
  }

  salvar(): void {
    this.funcionarioService.salvar(this.funcionario).subscribe(() => {
      this.funcionario = new Funcionario();
      this.listar();
    });
  }
}
