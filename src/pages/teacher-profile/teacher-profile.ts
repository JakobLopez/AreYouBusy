import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database'
import { AuthProvider } from '../../providers/auth/auth'
import { AppointmentProvider } from '../../providers/appointment/appointment';
import { Appointment } from '../../appointment';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';



@IonicPage()
@Component({
  selector: 'page-teacher-profile',
  templateUrl: 'teacher-profile.html',
})
export class TeacherProfilePage {

  userInfo: any = {
    name: null,
    email: null,
    type: null
  };
  appointments: Appointment[];
  today: any;
  sub: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public db: DatabaseProvider, public auth: AuthProvider, public appt: AppointmentProvider) {
    this.getUserInformation();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TeacherProfilePage');
  }

  ngOnInit(): void {
    //Listen for changes to appointments
    this.appt.getAppointments(this.auth.uid)
      .subscribe(appointments => this.appointments = appointments);

    //Get current time every second
    this.sub = Observable.interval(1000)
      .subscribe(() => this.today = Date.now());

  }

  // Set user information from database so it can be displayed
  async getUserInformation() {
    try {
      let user = await this.db.getUser(this.auth.uid, false);

      this.userInfo.name = user['name'];
      this.userInfo.email = user['email'];
      this.userInfo.type = user['type'];

      console.log(user);
    }
    catch (e) {
      console.log(e);
    }

  }
}
