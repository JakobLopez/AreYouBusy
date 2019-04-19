import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, App } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database'
import { AuthProvider } from '../../providers/auth/auth'
import { AppointmentProvider } from '../../providers/appointment/appointment';
import { Appointment } from '../../appointment';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';
import { AngularFirestore } from 'angularfire2/firestore';



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

  schedule: any[] = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public db: DatabaseProvider,
    public auth: AuthProvider,
    public appt: AppointmentProvider,
    public alertCtrl: AlertController,
    public _app: App,
    public afs: AngularFirestore) {

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

    this.db.getScheduleBySemester(this.auth.uid,'Fall 2019').subscribe(res => {
        for (let key in res) {
          switch(key) { 
            case "Monday": { 
              this.schedule[0] = ({
                key: key,
                value: res[key]
              }); 
               break; 
            } 
            case "Tuesday": { 
              this.schedule[1] = ({
                key: key,
                value: res[key]
              });  
               break; 
            } 
            case "Wednesday": {
              this.schedule[2] = ({
                key: key,
                value: res[key]
              });  
               break;    
            } 
            case "Thursday": { 
              this.schedule[3] = ({
                key: key,
                value: res[key]
              });  
               break; 
            }  
            case "Friday": { 
              this.schedule[4] = ({
                key: key,
                value: res[key]
              }); 
               break;              
            } 
         }
        }
      });

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

  log_out() {
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

  settings() {
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
              this.db.setName(this.auth.uid, data);
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

  async logout() {
    try {
      await this.auth.logout();
      this._app.getRootNav().setRoot('LoginSignupPage')
    }
    catch (e) {
      console.log(e);
    }
  }
}
