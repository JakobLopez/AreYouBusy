import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database'
import { AuthProvider } from '../../providers/auth/auth'



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

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public db: DatabaseProvider, public auth: AuthProvider) {
      this.getUserInformation();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TeacherProfilePage');
  }

  // Set user information from database so it can be displayed
  async getUserInformation() {
    try {
      let user = await this.db.getUser(this.auth.uid,false);

      this.userInfo.name = user['name'];
      this.userInfo.email = user['email'];
      this.userInfo.type = user['type'];

      console.log(user);
    }
    catch (e) {
      console.log(e);
    }

  }
}
