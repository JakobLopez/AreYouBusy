import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthProvider } from '../../providers/auth/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Appointment } from '../../appointment'
import { AppointmentProvider } from '../../providers/appointment/appointment';
import { OrderbyPipe } from '../../pipes/orderby/orderby'


@IonicPage()
@Component({
  selector: 'page-student-profile',
  templateUrl: 'student-profile.html',
})
export class StudentProfilePage {
  userInfo: any = {
    name: null,
    email: null,
    type: null
  };
  favorites = [];
  appointments: Appointment[];
  today = Date.now();

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public db: DatabaseProvider, public auth: AuthProvider,
    public afs: AngularFirestore,
    public appt:AppointmentProvider) {
      //Track real-time changes to favorites list
      this.afs.collection('Students').doc(this.auth.uid).collection('Favorites').valueChanges().subscribe(data=>{
        this.getUserInformation();
      });
     
  }
  ngOnInit(): void {
    this.appt.getAppointments(this.auth.uid)
    .subscribe(appointments => this.appointments = appointments);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad StudentProfilePage');
  }

  // Set user information from database so it can be displayed
  async getUserInformation() {
    try {
      let user = await this.db.getUser(this.auth.uid,false);
      
      this.userInfo.name = user['name'];
      this.userInfo.email = user['email'];
      this.userInfo.type = user['type'];

      this.favorites = await this.db.getFavorites(this.auth.uid);

      console.log(user);
    }
    catch (e) {
      console.log(e);
    }
  }


}
