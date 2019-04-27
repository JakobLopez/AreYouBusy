import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, App } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthProvider } from '../../providers/auth/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Appointment } from '../../appointment'
import { AppointmentProvider } from '../../providers/appointment/appointment';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';

@IonicPage()
@Component({
  selector: 'page-makeappoint',
  templateUrl: 'makeappoint.html',
})
export class MakeappointPage {
  appointments: Appointment[];
  sub: any;
  today: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public db: DatabaseProvider, public auth: AuthProvider,
    public afs: AngularFirestore,
    public appt: AppointmentProvider,
    public alertCtrl: AlertController,
    public _app: App) {

  }
  
  ngOnInit(): void {
    //Watch for changes to appointments
    this.appt.getAppointments(this.auth.uid)
      .subscribe(appointments => this.appointments = appointments);

    //Get current time every second
    this.sub = Observable.interval(1000)
      .subscribe(() => this.today = Date.now());
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad StudentProfilePage');
  }

  async clearAppointment(appoint: Appointment) {
    try {
      if(appoint.timestamp > this.today){
        let confirm = this.alertCtrl.create({
          title: 'Are your sure you want to delete this appointment?',
          subTitle: "It will be deleted from the professor's schedule.",
          buttons: [
            {
              text: 'Remove',
              handler: () => {
                this.appt.delete(this.auth.uid, appoint, "Student").then(() =>{
                  this.appt.clear(this.auth.uid, appoint, "Student");
                });
              }
            },
            { text: 'Cancel' }
          ]
        });
        confirm.present();
      }
      else
        await this.appt.clear(this.auth.uid, appoint, "Student");
    }
    catch (e) {
      console.log(e);
    }
  }
}