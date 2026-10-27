import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EstoqueEntrada } from '../../models/estoque-entrada';
import { EstoqueEntradaService } from '../../services/estoque-entrada.service';

@Component({
  selector: 'app-estoque',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estoque.component.html',
  styleUrl: './estoque.component.css'
})
export class EstoqueComponent implements OnInit {
  registros: EstoqueEntrada[] = [];
  item: EstoqueEntrada = new EstoqueEntrada();

  constructor(private estoqueService: EstoqueEntradaService) {}

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.estoqueService.listar().subscribe((res) => {
      this.registros = res;
    });
  }

  salvar(): void {
    this.estoqueService.salvar(this.item).subscribe(() => {
      this.item = new EstoqueEntrada();
      this.listar();
    });
  }
}
