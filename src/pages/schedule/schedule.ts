import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
})
export class SchedulePage {

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

  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  scheduleForm: FormGroup;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder) {
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

  makeSchedule() {
    console.log(this.schedule)
    this.navCtrl.pop();
  }
}
