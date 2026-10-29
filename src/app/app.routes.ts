import { Historia } from './Component/historia/historia';
import { Routes } from '@angular/router';
import { HomeCliAdm } from './Component/home-cli-adm/home-cli-adm';
import { ClientComponent } from './Component/client-component/client-component';
import {CardComponent} from './Component/card-component/card-component';
import { Carrinho } from './Component/carrinho/carrinho';
import { admGuard } from './Component/Component/admGuard';
import { Atendimento } from './Component/Component/atendimento/atendimento';
import { Categoria } from './Component/Component/categoria/categoria';
import { Estoque } from './Component/Component/estoque/estoque';
import { Funcionarios } from './Component/Component/funcionarios/funcionarios';
import { Pessoa } from './Component/Component/pessoa/pessoa';
import { Produto } from './Component/Component/produto/produto';
import { HomeAdm } from './Component/Component/home-adm/home-adm';

export const routes: Routes = [

  {
    path:'',
    redirectTo:"/home",
    pathMatch: 'full'
},
  {
    path: 'home',
    component: HomeCliAdm
  },

  {
    path: 'cadastro',
    component: ClientComponent
  },
  {
    path: 'itens',
    component: CardComponent
  },
  {
    path: 'historia',
    component: Historia
  },
  {
    path: 'carrinho',
    component: Carrinho
  },

  {
    path: 'adm',
    canActivate: [admGuard],
    children: [
      { path: 'atendimento', component: Atendimento },
      { path: 'categoria', component: Categoria },
      { path: 'estoque', component: Estoque },
      { path: 'funcionarios', component: Funcionarios },
      { path: 'pessoa', component: Pessoa },
      { path: 'produto', component: Produto },
      {path: 'homeadm', component:HomeAdm},
    ],
  },
];

