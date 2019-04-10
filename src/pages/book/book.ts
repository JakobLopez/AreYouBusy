import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppointmentProvider } from '../../providers/appointment/appointment';
import { AuthProvider } from '../../providers/auth/auth';


@IonicPage()
@Component({
  selector: 'page-book',
  templateUrl: 'book.html',
})
export class BookPage {
  myAppointment: any = {
    date: "",
    time: "",
    length: ""
  };
  today: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public ap: AppointmentProvider, public auth: AuthProvider) {
      let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
      this.today = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
      console.log(this.today);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookPage');
  }

  async makeAppointment() {
    try {
      let appt = {
        date: this.myAppointment.date,
        from: this.auth.uid,
        to: this.navParams.get('item'),
        timestamp: 0,
        length: await this.lengthToMilliseconds(this.myAppointment.length)
      }

      let myDate = new Date(this.myAppointment.date);

      myDate.setMinutes(myDate.getMinutes() + myDate.getTimezoneOffset());

      appt.timestamp = await myDate.getTime();

      await this.ap.createAppointment(appt);

      this.navCtrl.pop();

    } catch (e) {
      console.log(e);
    }
  }

  lengthToMilliseconds(length){
    let split = length.split(':');

    let minutes = (+split[0]) * 60 + (+split[1]);
    let milliseconds = minutes * 60000;

    return milliseconds;
  }


}
