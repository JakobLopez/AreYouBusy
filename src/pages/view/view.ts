import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';


@IonicPage()
@Component({
  selector: 'page-view',
  templateUrl: 'view.html',
})
export class ViewPage {
  pageID: any;
  userInfo: any = {
    name: null,
    email: null,
    type: null
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public db: DatabaseProvider) {    
    this.getUserInformation(navParams.get('item'));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewPage');
  }

  // Set user information from database so it can be displayed
  // Information displayed is slightly different than what page owner sees
  async getUserInformation(id: any) {
    try {
      this.pageID = id;
      let user = await this.db.getUser(id,true);

      this.userInfo.name = user['name'];
      this.userInfo.email = user['email'];
      this.userInfo.type = user['type'];

      console.log(user);
    }
    catch (e) {
      console.log(e);
    }
  }

  goToBook(){
    this.navCtrl.push('BookPage',{
      item:this.pageID
      });
  }

}
