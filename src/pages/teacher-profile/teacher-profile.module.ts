import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TeacherProfilePage } from './teacher-profile';
import { PipesModule } from '../../pipes/pipes.module'

@NgModule({
  declarations: [
    TeacherProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(TeacherProfilePage),
    PipesModule
  ],
})
export class TeacherProfilePageModule {}
