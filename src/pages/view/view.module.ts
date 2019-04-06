import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewPage } from './view';
import { PipesModule } from '../../pipes/pipes.module'

@NgModule({
  declarations: [
    ViewPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewPage),
    PipesModule
  ],
})
export class ViewPageModule {}
