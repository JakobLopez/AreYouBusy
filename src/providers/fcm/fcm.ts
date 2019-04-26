import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { Platform } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthProvider } from '../auth/auth';



@Injectable()
export class FcmProvider {
  token:string;

  public auth: AuthProvider;
  constructor(private firebase: Firebase,
    private afs: AngularFirestore,
    private platform: Platform,
    ) { }

  async getToken() {
    let token;

    if (this.platform.is('android')) {
      token = await this.firebase.getToken();
    }

    if (this.platform.is('ios')) {
      token = await this.firebase.getToken();
      await this.firebase.grantPermission();
    }
    
    this.token = token;

    this.saveToken(token);
  }

  private saveToken(token) {
    if (!token) return;

    const devicesRef = this.afs.collection('devices');


    const data = {
      token,
      userId:"test"
    };
    console.log(data);

    return devicesRef.doc(token).set(data);
  }

  onNotifications() {
    return this.firebase.onNotificationOpen();
  }

}