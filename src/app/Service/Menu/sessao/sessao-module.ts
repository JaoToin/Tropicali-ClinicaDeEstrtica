import { Injectable, signal } from '@angular/core';

export type Perfil = 'loja' | 'adm' | null;

@Injectable({
  providedIn: 'root'
 })
export class SessaoService {
  private readonly SENHA_ADM = 'TropicalíADM'; // provisório, veja o aviso no final

  perfil = signal<Perfil>((sessionStorage.getItem('perfil') as Perfil) ?? null);

  entrarComoLoja() {
    this.definir('loja');
  }

  entrarComoAdm(senha: string): boolean {
    if (senha === this.SENHA_ADM) {
      this.definir('adm');
      return true;
    }
    return false;
  }

  sair() {
    sessionStorage.removeItem('perfil');
    this.perfil.set(null);
  }

  private definir(p: 'loja' | 'adm') {
    sessionStorage.setItem('perfil', p);
    this.perfil.set(p);
  }
}
