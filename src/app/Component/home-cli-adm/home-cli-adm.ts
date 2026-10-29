import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SessaoService } from '../../Service/Menu/sessao/sessao-module';

@Component({
  imports: [],
  selector: 'app-home-cli-adm',
  styleUrl: './home-cli-adm.css',
  templateUrl: './home-cli-adm.html',
})
export class HomeCliAdm {
  private sessao = inject(SessaoService);
  private router = inject(Router);

  pedindoSenha = signal(false);
  erro = signal(false);

  entrarNaLoja() {
    this.sessao.entrarComoLoja();
    this.router.navigate(['/itens']);
  }

  entrarNoAdm(senha: string) {
    if (this.sessao.entrarComoAdm(senha)) {
      this.erro.set(false);
      this.router.navigate(['/adm/itens']); // ajuste para sua rota de ADM
    } else {
      this.erro.set(true);
    }
  }
}
