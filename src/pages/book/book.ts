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
    slotTime: "",
    displayTime: "",
    from: this.auth.uid,
    to: this.navParams.get('item')
  };


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public ap: AppointmentProvider, public auth: AuthProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookPage');
  }

  async makeAppointment() {
    try {
      let hoursMinutes = this.myAppointment.slotTime.split(':');
      this.myAppointment.displayTime = await this.formatAMPM(hoursMinutes);
      await this.ap.createAppointment(this.myAppointment);
      this.navCtrl.pop();

    } catch (e) {
      console.log(e);
    }
  }
  async formatAMPM(date) {
    try {
      var hours = date[0];
      var minutes = date[1];
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;
      return strTime;
    } catch (e) {
      throw (e);
    }
  }
}
