import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppointmentProvider } from '../../providers/appointment/appointment';
import { AuthProvider } from '../../providers/auth/auth';
import { Appointment } from '../../appointment';


@IonicPage()
@Component({
  selector: 'page-book',
  templateUrl: 'book.html',
})
export class BookPage {
  myAppointment: any = {
    date: "",
    length: ""
  };
  today: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public ap: AppointmentProvider, public auth: AuthProvider) {
      let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
      this.today = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookPage');
  }

  async makeAppointment() {
    try {
      let appt:Appointment = {
        date: this.myAppointment.date,
        from: this.auth.uid,
        to: this.navParams.get('item'),
        timestamp: 0,
        endStamp: this.lengthToMilliseconds(this.myAppointment.length),
        id: await this.ap.createAppointmentId()
      }

      
      appt.timestamp = await this.convertTimezone();
      appt.endStamp = appt.timestamp + appt.endStamp;
      appt.date = this.myAppointment.date.split("T")[0];

      if(await this.ap.isValidAppointment(appt))
      {
        await this.ap.createAppointment(appt);
        this.navCtrl.pop();
      }
      else
      {
        console.log("Somebody else already has an appointment during this time");
      }
      

    } catch (e) {
      console.log(e);
    }
  }

  async convertTimezone(){
    try{
      
      let myDate = new Date(this.myAppointment.date);

      myDate.setMinutes(myDate.getMinutes() + myDate.getTimezoneOffset());

      return await myDate.getTime();
    }catch(e){
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
