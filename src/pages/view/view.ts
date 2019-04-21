import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthProvider } from '../../providers/auth/auth';
import { Appointment } from '../../appointment'
import { AppointmentProvider } from '../../providers/appointment/appointment';
import { Observable } from 'rxjs'
import { AngularFirestore } from 'angularfire2/firestore';
import 'rxjs/add/observable/interval';


@IonicPage()
@Component({
  selector: 'page-view',
  templateUrl: 'view.html',
})
export class ViewPage {
  pageID: any;
  isFollowing: boolean = false;
  userInfo: any = {
    name: null,
    email: null,
    type: null
  };
  scheduleObj: any = {};
  appointments: Appointment[];
  today: any;
  day: string;
  sub: any;
  busyStatus: string;
  schedule: any[] = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public db: DatabaseProvider,
    public auth: AuthProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public appt: AppointmentProvider,
    public afs: AngularFirestore
  ) {
    this.getDay();
    this.today = Date.now()
    this.getUserInformation(this.navParams.get('item'));

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewPage');
  }

  ngOnInit(): void {
    //Listen to changes in appointments
    this.appt.getAppointments(this.pageID)
      .subscribe(appointments => this.appointments = appointments);

    //Get current time every second
    this.sub = Observable.interval(1000)
      .subscribe(() => {
        this.today = Date.now();
        this.getStatus();
      });

    //Update page on professor's database changes
    this.afs.collection('Teachers').doc(this.pageID).valueChanges().subscribe(() => {
      this.getUserInformation(this.pageID);
    })

    this.db.getScheduleBySemester(this.pageID, 'Fall 2019').subscribe(res => {
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

  //Gets the day name for today
  getDay(){
    let currentDate = new Date();
    let weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    this.day = weekdays[currentDate.getDay()];
  }
  async getStatus() {
    try {
      //if(day != "Sunday" && day != "Saturday")
      //{
      let appStatus = await this.appt.getStatus(this.pageID, this.today);

      //If not in middle of appointment, check if in office hours
      if (appStatus == "Available") {
        let daySchedule = this.scheduleObj[this.day];
        for (let slot of daySchedule) {
          //Get current time in 24hr format
          let event = new Date(this.today);
          let time = event.toLocaleTimeString('en-GB')

          if (time >= slot.From && time <= slot.To)
            this.busyStatus = 'Available';
        }
        if (this.busyStatus != 'Available')
          this.busyStatus = 'Not Available';
      } else {
        this.busyStatus = appStatus;
      }
      //}
      


    } catch (e) {
      console.log(e);
    }
  }

  // Set user information from database so it can be displayed
  // Information displayed is slightly different than what page owner sees
  async getUserInformation(id: any) {
    try {
      this.pageID = id;
      let user = await this.db.getUser(id, true);

      this.userInfo.name = user['name'];
      this.userInfo.email = user['email'];
      this.userInfo.type = user['type'];

      this.isFollowing = await this.favor();

      await this.getStatus();

      console.log(user);
    }
    catch (e) {
      console.log(e);
    }
  }


  async favor() {
    try {
      return this.db.isFavorite(this.auth.uid, this.pageID);
    } catch (e) {
      console.log(e);
    }
  }

  //Toggles favorite status of teacher
  toggleFollow() {
    //If teacher is already a favorite
    if (this.isFollowing) {
      //Confirm unfavorite with an alert
      let confirm = this.alertCtrl.create({
        title: 'Unfollow?',
        message: 'Are your sure you want to unfollow?',
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              this.isFollowing = false;

              this.db.removeFavorite(this.auth.uid, this.pageID);

              let toast = this.toastCtrl.create({
                message: 'You have unfollowed this professor',
                duration: 2000,
                position: 'bottom'
              });
              toast.present();
            }
          },
          { text: 'No' }
        ]
      });
      confirm.present();
    } else {
      //Favorite teacher
      this.isFollowing = true;
      this.db.setFavorite(
        this.auth.uid,
        this.pageID);
    }
  }

  //Goes to appointment page
  goToBook() {
    //Sends teacher's uid
    this.navCtrl.push('BookPage', {
      item: this.pageID
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

}
