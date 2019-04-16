import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
})
export class SchedulePage {
  
  schedule:any = {
    mon:[null],
    tue:[null],
    wed:[null],
    thur:[null],
    fri:[null]
  }
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SchedulePage');
  }

  Add(day:string){
    this.schedule[day].push(null);
    }

}
