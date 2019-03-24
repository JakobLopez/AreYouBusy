import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';


@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  users = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public db: DatabaseProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
    this.getAllTeachers()
  }

  // Get list of all the teacher profiles
  async getAllTeachers() {
    try {
      let usersObj = await this.db.getAllTeachers();
      for (var user in usersObj) {
        this.users.push({ Key: user, User: usersObj[user] });
      }
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

}
