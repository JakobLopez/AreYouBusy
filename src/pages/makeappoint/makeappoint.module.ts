import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MakeappointPage } from './makeappoint';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    MakeappointPage,
  ],
  imports: [
    IonicPageModule.forChild(MakeappointPage), PipesModule
  ],
})
export class MakeappointPageModule {}
