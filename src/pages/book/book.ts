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
    from: this.auth.uid,
    to: this.navParams.get('item'),
    timestamp:""
  };


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public ap: AppointmentProvider, public auth: AuthProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookPage');
  }

  async makeAppointment() {
    try {
      let date = this.myAppointment.date + ' ' + this.myAppointment.slotTime;
      let time = new Date(date);
      this.myAppointment.timestamp = await time.getTime(); 


      await this.ap.createAppointment(this.myAppointment);
      this.navCtrl.pop();

    } catch (e) {
      console.log(e);
    }
  }
  
 
}
