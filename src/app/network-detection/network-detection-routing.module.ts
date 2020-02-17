import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NetworkDetectionPage } from './network-detection.page';

const routes: Routes = [
  {
    path: '',
    component: NetworkDetectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NetworkDetectionPageRoutingModule {}
