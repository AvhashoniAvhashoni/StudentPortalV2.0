import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewsPage } from './news.page';

const routes: Routes = [
  {
    path: '',
    component: NewsPage
  },  {
    path: 'newsdetails',
    loadChildren: () => import('./newsdetails/newsdetails.module').then( m => m.NewsdetailsPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsPageRoutingModule {}
