import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
})
export class SchedulePage {
  semester: any

  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  scheduleForm: FormGroup;

  schedule: any = {
    Monday: [{
      From: null,
      To: null
    }],
    Tuesday: [{
      From: null,
      To: null
    }],
    Wednesday: [{
      From: null,
      To: null
    }],
    Thursday: [{
      From: null,
      To: null
    }],
    Friday: [{
      From: null,
      To: null
    }]
  }


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public db:DatabaseProvider,
    public auth:AuthProvider) {


    this.scheduleForm = formBuilder.group({
      Monday: [null],
      Tuesday: [null],
      Wednesday: [null],
      Thursday: [null],
      Friday: [null]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SchedulePage');
  }

  Add(day: string) {
    this.schedule[day].push({
      From: null,
      To: null
    });
  }

  async makeSchedule() {
    try{
      let temp = this.schedule;
      temp['semester'] = this.semester;
  
      await this.db.setSchedule(this.auth.uid, temp);
      this.navCtrl.pop();
    }catch(e){
      console.log(e);
    }

  }
}
