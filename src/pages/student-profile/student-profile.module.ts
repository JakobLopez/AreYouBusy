import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StudentProfilePage } from './student-profile';
import { PipesModule } from '../../pipes/pipes.module'

@NgModule({
  declarations: [
    StudentProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(StudentProfilePage),
    PipesModule
    
  ],
})
export class StudentProfilePageModule {}
