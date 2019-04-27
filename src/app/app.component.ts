import { Component, ViewChild } from '@angular/core';
import { Platform, ToastController, Nav, App, AlertController, UrlSerializer } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { AuthProvider } from '../providers/auth/auth';
import { DatabaseProvider } from '../providers/database/database';
import { FcmProvider } from '../providers/fcm/fcm';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  @ViewChild(Nav) nav: Nav;

  constructor(private platform: Platform,
    public alertCtrl: AlertController,
    public _app: App,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private storage: Storage,
    public auth: AuthProvider,
    public db: DatabaseProvider,
    public toastController: ToastController,
    private fcm: FcmProvider,
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();


      this.storage.get('user').then((user) => {
        if (user) {
          //If there is a user in storage set uid in auth
          //auth has not yet loaded so value would be null
          //TabsPage calls tracker which needs a valid uid
          auth.uid = JSON.parse(user);

          this.storage.get('usersObj').then(value => db.usersObj = JSON.parse(value));
          this.storage.get('type').then(value => {
          db.accountType = JSON.parse(value)

          if (JSON.parse(value) == 'Student')
            this.rootPage = 'StudentProfilePage';
          else
            this.rootPage = 'TeacherProfilePage';
          });

        }
        else {
          this.rootPage = 'LoginSignupPage';
        }
      });

      //this.notificationSetup();
    });
  }
  
  private async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 3000
    });
    toast.present();
  }

  private notificationSetup() {
    this.fcm.getToken();
    this.fcm.onNotifications().subscribe(
      (msg) => {
        if (this.platform.is('ios')) {
          this.presentToast(msg.aps.alert);
        } else {
          this.presentToast(msg.body);
        }
      });
  }

  profileClicked() {
    if (this.db.accountType == 'Student')
      this.nav.setRoot('StudentProfilePage');
      else
        this.nav.setRoot('TeacherProfilePage');
  }

  searchClicked() {
    this.nav.setRoot('SearchPage');
  }

  appointmentsClicked() {
    this.nav.setRoot('MakeappointPage');
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
