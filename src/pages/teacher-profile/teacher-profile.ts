import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database'
import { AuthProvider } from '../../providers/auth/auth'
import { AppointmentProvider } from '../../providers/appointment/appointment';
import { Appointment } from '../../appointment'



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
  today = Date.now();

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public db: DatabaseProvider, public auth: AuthProvider, public appt:AppointmentProvider) {
      this.getUserInformation();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TeacherProfilePage');
  }

  ngOnInit(): void {
    this.appt.getAppointments(this.auth.uid)
    .subscribe(appointments => this.appointments = appointments);

  }

  // Set user information from database so it can be displayed
  async getUserInformation() {
    try {
      let user = await this.db.getUser(this.auth.uid,false);

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
