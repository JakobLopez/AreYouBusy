import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthProvider } from '../../providers/auth/auth';


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
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public db: DatabaseProvider, public auth: AuthProvider) {
      //this.getUserInformation();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StudentProfilePage');
    this.getUserInformation()
  }

  // Set user information from database so it can be displayed
  async getUserInformation() {
    try {
      let user = await this.db.getUser(this.auth.uid,false);
      
      this.userInfo.name = user['name'];
      this.userInfo.email = user['email'];
      this.userInfo.type = user['type'];

      this.favorites = await this.db.getFavorites(this.auth.uid);

      console.log(user);
    }
    catch (e) {
      console.log(e);
    }
  }


}
