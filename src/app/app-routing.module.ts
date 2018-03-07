import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardComponent } from './board/board.component';
import { CreateComponent } from './create/create.component';

const routes: Routes = [
  { path: 'board/:id', component: BoardComponent },
  { path: 'new', component: CreateComponent }
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
  
}
