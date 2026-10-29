import { SessaoService } from './../../Service/Menu/sessao/sessao-module';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const admGuard: CanActivateFn = () => {
  const sessao = inject(SessaoService);
  const router = inject(Router);
  return sessao.perfil() === 'adm' ? true : router.createUrlTree(['/home']);
};
