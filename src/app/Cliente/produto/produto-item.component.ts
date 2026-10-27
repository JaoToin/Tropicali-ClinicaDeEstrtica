import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProdutoItem } from '../../models/produto-item';
import { ProdutoItemService } from '../../services/produto-item.service';

@Component({
  selector: 'app-produto-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produto-item.component.html',
  styleUrl: './produto-item.component.css'
})
export class ProdutoItemComponent implements OnInit {
  produtos: ProdutoItem[] = [];
  produto: ProdutoItem = new ProdutoItem();

  constructor(private produtoService: ProdutoItemService) {}

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.produtoService.listar().subscribe((res) => {
      this.produtos = res;
    });
  }

  salvar(): void {
    this.produtoService.salvar(this.produto).subscribe(() => {
      this.produto = new ProdutoItem();
      this.listar();
    });
  }
}
