import { Component } from '@angular/core';
import { Platform, ToastController } from 'ionic-angular';
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

  constructor(private platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private storage: Storage,
    auth: AuthProvider,
    db: DatabaseProvider,
    private toastController:ToastController,
    private fcm:FcmProvider
    
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
            this.rootPage = 'TabPage';
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



}

