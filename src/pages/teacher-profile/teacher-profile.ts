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
    type: null,
    toggle: null
  };
  appointments: Appointment[];
  today: any;

  sub: any;
  statusCheck: any;

  schedule: any[] = [];
  scheduleObj: any = {};

  day: string;

  busyStatus: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public db: DatabaseProvider,
    public auth: AuthProvider,
    public appt: AppointmentProvider,
    public alertCtrl: AlertController,
    public _app: App,
    public afs: AngularFirestore) {

    this.getDay();
    this.today = Date.now()
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

    //Get current availability every 5 seconds
    this.statusCheck = Observable.interval(1000)
      .subscribe(() => {
        this.getStatus();
      });

    //Update page on professor's database changes
    this.afs.collection('Teachers').doc(this.auth.uid).valueChanges().subscribe(() => {
      this.getUserInformation();
    })

    this.db.getScheduleBySemester(this.auth.uid, 'Fall 2019').subscribe(res => {
      this.scheduleObj = res;
      this.getStatus();

      for (let key in res) {
        switch (key) {
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
      let user = await this.db.getUser(this.auth.uid, true);

      this.userInfo.name = user['name'];
      this.userInfo.email = user['email'];
      this.userInfo.type = user['type'];
      this.userInfo.toggle = user['toggle'];


      var pic = await document.getElementById("profile-pic");
      pic.style['background'] = 'url(' + await this.db.getProfilePic(user['profile_pic']) + ')';
      pic.style.backgroundSize = "contain";
    }
    catch (e) {
      console.log(e);
    }
  }

  //Gets the day name for today
  getDay() {
    let currentDate = new Date();
    let weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    this.day = weekdays[currentDate.getDay()];
  }

  //Gets availability of current professor
  //Checks office hours and appointments 
  getStatus() {


    if (this.userInfo.toggle) {
      this.statusCheck.unsubscribe();
      this.busyStatus = this.userInfo.toggle;
    }
    else {

      if (this.day != "Sunday" && this.day != "Saturday") {
        if (this.day != "Sunday" && this.day != "Saturday") {

          let appStatus: string = 'Available';
          for (let item of this.appointments) {
            if (this.today >= item.timestamp && this.today <= item.endStamp)
              appStatus = 'Busy';
          }

          //If not in middle of appointment, check if in office hours
          if (appStatus == "Available") {
            let daySchedule = this.scheduleObj[this.day];
            let scheduleStatus = "";

            for (let slot of daySchedule) {
              //Get current time in 24hr format
              let event = new Date(this.today);
              let time = event.toLocaleTimeString('en-GB');

              if (time >= slot.From && time <= slot.To)
                scheduleStatus = 'Available';

            }

            if (scheduleStatus != 'Available')
              this.busyStatus = 'Not Available';
            else
              this.busyStatus = 'Available';
          } else {
            this.busyStatus = appStatus;
          }

          if (this.userInfo.toggle) {
            this.statusCheck.unsubscribe();
            this.busyStatus = this.userInfo.toggle;
          }
        }
      }
    }
  }

  //Toggle the status in the database
  //If toggle is being activated, unsubscribe from 
  async toggleStatus() {
    try {
      if (this.userInfo.toggle == "") {
        this.statusCheck.unsubscribe();

        if (this.busyStatus == 'Available') {
          await this.db.setStatus(this.auth.uid, "Busy");
          this.busyStatus = 'Busy';
        }
        else {
          await this.db.setStatus(this.auth.uid, 'Available');
          this.busyStatus = 'Available';
        }
      }
      else {
        await this.db.setStatus(this.auth.uid, "");
        this.statusCheck = Observable.interval(1000)
          .subscribe(() => {
            this.getStatus();
          });
      }
    } catch (e) {
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
              if (data.Name != this.userInfo.name) {
                this.db.setName(this.auth.uid, data.Name);
                console.log('name changed');
              }
            } else {
              alert.setMessage('Your name is invalid');
              return false;
            }
            //change email

            if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(data.email)) {
              if (data.email != this.userInfo.email) {
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

  async logout() {
    try {
      await this.auth.logout();
      this._app.getRootNav().setRoot('LoginSignupPage')
    }
    catch (e) {
      console.log(e);
    }
  }

  async clearAppointment(appoint: Appointment) {
    try {
      if (appoint.timestamp > this.today) {
        let confirm = this.alertCtrl.create({
          title: 'Are your sure you want to delete this appointment?',
          subTitle: "It will be deleted from the professor's schedule.",
          buttons: [
            {
              text: 'Remove',
              handler: () => {
                this.appt.delete(this.auth.uid, appoint, "Teacher").then(() => {
                  this.appt.clear(this.auth.uid, appoint, "Teacher");
                });
              }
            },
            { text: 'Cancel' }
          ]
        });
        confirm.present();
      }
      else
        await this.appt.clear(this.auth.uid, appoint, "Teacher");
    }
    catch (e) {
      console.log(e);
    }
  }

}
