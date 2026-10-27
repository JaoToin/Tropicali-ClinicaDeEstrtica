import { Historia } from './Component/historia/historia';
import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { HomeCliAdm } from './Component/home-cli-adm/home-cli-adm';
import { ClientComponent } from './Component/client-component/client-component';
import {CardComponent} from './Component/card-component/card-component';


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
  }
];
