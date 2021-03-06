import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardComponent } from './board/board.component';
import { CreateComponent } from './create/create.component';
import { HomeComponent } from './home/home.component';
import { FindComponent } from './find/find.component';

const routes: Routes = [
  { path: 'board/:id', component: BoardComponent },
  { path: 'new', component: CreateComponent },
  { path: 'find', component: FindComponent },
  { path: '', component: HomeComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
  
}
