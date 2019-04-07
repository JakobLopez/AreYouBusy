import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthProvider } from '../../providers/auth/auth';
import { Appointment } from '../../appointment'
import { AppointmentProvider } from '../../providers/appointment/appointment';
import { Observable } from 'rxjs'
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
  appointments: Appointment[];
  today:any;
  sub:any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public db: DatabaseProvider,
    public auth: AuthProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public appt: AppointmentProvider
  ) {
    this.getUserInformation(navParams.get('item'));
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
      .subscribe(() => this.today = Date.now());

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

}
