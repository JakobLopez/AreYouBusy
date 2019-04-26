import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { Platform } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthProvider } from '../auth/auth';


@Injectable()
export class FcmProvider {


  constructor(private firebase: Firebase,
    private afs: AngularFirestore,
    private platform: Platform,
    public auth:AuthProvider) { }

  async getToken() {
    let token;

    if (this.platform.is('android')) {
      token = await this.firebase.getToken();
    }

    if (this.platform.is('ios')) {
      token = await this.firebase.getToken();
      await this.firebase.grantPermission();
    }
    console.log(token);
    this.saveToken(token);
  }

  private saveToken(token) {
    if (!token) return;

    const devicesRef = this.afs.collection('devices');
    console.log(this.auth.uid)
    const data = {
      token,
      userId: this.auth.uid
    };

    return devicesRef.doc(token).set(data);
  }

  onNotifications() {
    return this.firebase.onNotificationOpen();
  }

  

}
