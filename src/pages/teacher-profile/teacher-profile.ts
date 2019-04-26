import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, App  } from 'ionic-angular';
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

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public db: DatabaseProvider,
    public auth: AuthProvider,
    public appt: AppointmentProvider,
    public alertCtrl: AlertController,
    public _app:App) {
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

    }
    catch (e) {
      console.log(e);
    }
  }

  goTo() {
    this.navCtrl.push('SchedulePage');
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
        {
          name: 'email',
          type: 'String',
          value: this.userInfo.email
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
            //change name
            if (data.Name.length > 0) {
              if(data.Name != this.userInfo.name){
                this.db.setName(this.auth.uid, data.Name);
                console.log('name changed');
              }
            } else {
              alert.setMessage('Your name is invalid');
              return false;
            }
            //change email
            
            if(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(data.email)){
              if(data.email != this.userInfo.email){
                this.db.setEmail(this.auth.uid, data.email);
                this.auth.setEmail(data.email);
                console.log('email changed');
              } 
            } else {
              alert.setMessage('Your email is invalid');
              return false;
            }
            this.getUserInformation();
            return true;
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
