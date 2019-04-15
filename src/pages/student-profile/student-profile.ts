import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, App  } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthProvider } from '../../providers/auth/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Appointment } from '../../appointment'
import { AppointmentProvider } from '../../providers/appointment/appointment';
import { Observable } from 'rxjs'
import { ValidatorProvider } from '../../providers/validator/validator';
import 'rxjs/add/observable/interval';
import { Validators, FormControl } from '@angular/forms';
import { database } from 'firebase';
import { stringify } from '@angular/core/src/render3/util';
import { ResourceLoader } from '@angular/compiler';


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
  sub:any;
  today: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public db: DatabaseProvider, public auth: AuthProvider,
    public afs: AngularFirestore,
    public appt:AppointmentProvider,
    public alertCtrl: AlertController,
    public _app:App) {
      //Track real-time changes to favorites list
      this.afs.collection('Students').doc(this.auth.uid).collection('Favorites').valueChanges().subscribe(data=>{
        this.getUserInformation();
      });
     
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

  // Set user information from database so it can be displayed
  async getUserInformation() {
    try {
      let user = await this.db.getUser(this.auth.uid,false);
      
      this.userInfo.name = user['name'];
      this.userInfo.email = user['email'];
      this.userInfo.type = user['type'];

      this.favorites = await this.db.getFavorites(this.auth.uid);

    }
    catch (e) {
      console.log(e);
    }
  }

  async clearAppointment(appoint:Appointment){
    try{
      await this.appt.clear(appoint);
    }
    catch(e){
      console.log(e);
    }
  }

  log_out(){
    let log_out = this.alertCtrl.create({
      title: 'Logout?',
      message: 'Are your sure you want to Logout?',
      buttons: [
        {
          text: 'Logout',
          handler: () => {
              this.logout();
          }
        },
        { text: 'No' }
      ]
    });
    log_out.present();
  }

  settings(){
    let alert = this.alertCtrl.create({
      title: 'Edit Account',
      inputs: [
        {
          name: 'Name',
          type: 'String',
          value: this.userInfo.name
        },
      ],
      message: '',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            if (data.Name.length > 0) {
              this.db.editAccount(this.auth.uid, data);
              this.getUserInformation();
              console.log('update successful');
              return true;
            } else {
              alert.setMessage('Your name is invalid');
              return false;
            }
          }
        }
      ]
    });
    alert.present();
  }

  async logout(){
    try{
      await this.auth.logout();
      this._app.getRootNav().setRoot('LoginSignupPage')
    }
    catch(e){
      console.log(e);
    }
  }
}
