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
    public db:DatabaseProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
    this.getAllTeachers()
  }

  async getAllTeachers(){
    try{
      let usersObj = await this.db.getAllTeachers();
      for(var user in usersObj)
      {
        this.users.push({Key:user,User:usersObj[user]});
      }
    }
    catch(e){
      console.log(e);
    }
  }

}
