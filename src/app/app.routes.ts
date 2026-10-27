import { Routes } from '@angular/router';
import { HomeCliAdm } from './Cliente/home-cli-adm/home-cli-adm';
import { ClientComponent } from './Cliente/client-component/client-component';
import { AtendimentoComponent } from './Cliente/atendimento/atendimento.component';
import { CategoriaComponent } from './Cliente/categoria/categoria.component';
import { EstoqueComponent } from './Cliente/estoque/estoque.component';
import { FuncionarioComponent } from './Cliente/funcionario/funcionario.component';
import { PessoaComponent } from './Cliente/pessoa/pessoa.component';
import { ProdutoItemComponent } from './Cliente/produto/produto-item.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeCliAdm },
  { path: 'cadastro', component: ClientComponent },
  { path: 'atendimentos', component: AtendimentoComponent },
  { path: 'categorias', component: CategoriaComponent },
  { path: 'estoque', component: EstoqueComponent },
  { path: 'funcionarios', component: FuncionarioComponent },
  { path: 'pessoas', component: PessoaComponent },
  { path: 'produtos', component: ProdutoItemComponent }
];
