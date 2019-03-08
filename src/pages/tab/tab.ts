import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthProvider } from '../../providers/auth/auth';


@IonicPage()
@Component({
  selector: 'page-tab',
  templateUrl: 'tab.html',
})
export class TabPage {
  tab1Root: any;
  tab2Root: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public db: DatabaseProvider,
    public auth: AuthProvider) {
      this.setTabs();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabPage');
  }

  setTabs() {
    if (this.db.accountType == 'Student')
      this.tab1Root = 'StudentProfilePage';
    else
      this.tab1Root = 'TeacherProfilePage';
    this.tab2Root = 'SearchPage';
  }

}
