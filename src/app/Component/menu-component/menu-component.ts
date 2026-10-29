import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SessaoService } from '../../Service/Menu/sessao/sessao-module';

@Component({
  imports: [RouterLink],
  selector: 'app-menu-component',
  styleUrl: './menu-component.css',
  templateUrl: './menu-component.html',
})
export class MenuComponent {
  sessao = inject(SessaoService);
  private router = inject(Router);

  sair() {
    this.sessao.sair();
    this.router.navigate(['/home']);
  }
}
