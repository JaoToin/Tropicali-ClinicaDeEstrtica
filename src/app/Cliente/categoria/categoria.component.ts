import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Categoria } from '../../models/categoria';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css'
})
export class CategoriaComponent implements OnInit {
  categorias: Categoria[] = [];
  categoria: Categoria = new Categoria();
  itemsInput = '';

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.categoriaService.listar().subscribe((res) => {
      this.categorias = res;
    });
  }

  salvar(): void {
    this.categoria.items = this.itemsInput
      .split(',')
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    this.categoriaService.salvar(this.categoria).subscribe(() => {
      this.categoria = new Categoria();
      this.itemsInput = '';
      this.listar();
    });
  }
}
