import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NetworkDetectionPageRoutingModule } from './network-detection-routing.module';

import { NetworkDetectionPage } from './network-detection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NetworkDetectionPageRoutingModule
  ],
  declarations: [NetworkDetectionPage]
})
export class NetworkDetectionPageModule {}
