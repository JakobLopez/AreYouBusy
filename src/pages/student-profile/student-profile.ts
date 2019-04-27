import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, App } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthProvider } from '../../providers/auth/auth';
import { AngularFirestore } from 'angularfire2/firestore';


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
  sub: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public db: DatabaseProvider, public auth: AuthProvider,
    public afs: AngularFirestore,
    public alertCtrl: AlertController,
    public _app: App) {

    //Track real-time changes to favorites list
    this.afs.collection('Students').doc(this.auth.uid).collection('Favorites').valueChanges().subscribe(data => {
      this.getUserInformation();
    });
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad StudentProfilePage');
  }

  // Set user information from database so it can be displayed
  async getUserInformation() {
    try {
      let user = await this.db.getUser(this.auth.uid, false);

      this.userInfo.name = user['name'];
      this.userInfo.email = user['email'];
      this.userInfo.type = user['type'];
      
      var pic = await document.getElementById("profile-pic");
      pic.style['background'] = 'url(' + await this.db.getProfilePic(user['profile_pic']) + ')';
      pic.style.backgroundSize = "contain";
      this.favorites = await this.db.getFavorites(this.auth.uid);
    }
    catch (e) {
      console.log(e);
    }
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

  // Go to selected Teacher profile
  viewUser(viewID:any) {
    try {
      this.navCtrl.push('ViewPage',{
        item:viewID
        });
    }
    catch (e) {
      console.log(e);
    }
  }

  //prompts the user asking them if they would like to change their profile picture
  setProfilePic(){
    let change_pic = this.alertCtrl.create({
      title: 'Change Profile Pucture?',
      message: 'Would you like to change your profile picture?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            console.log("So would I!");
          }
        },
        { text: 'No' }
      ]
    });
    change_pic.present();
  }






}
