import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthProvider } from '../../providers/auth/auth';


@IonicPage()
@Component({
  selector: 'page-view',
  templateUrl: 'view.html',
})
export class ViewPage {
  pageID: any;
  isFollowing: boolean = false;
  userInfo: any = {
    name: null,
    email: null,
    type: null
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public db: DatabaseProvider, public auth: AuthProvider, public alertCtrl: AlertController) {
    this.getUserInformation(navParams.get('item'));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewPage');
    this.favor();
  }

  // Set user information from database so it can be displayed
  // Information displayed is slightly different than what page owner sees
  async getUserInformation(id: any) {
    try {
      this.pageID = id;
      let user = await this.db.getUser(id, true);

      this.userInfo.name = user['name'];
      this.userInfo.email = user['email'];
      this.userInfo.type = user['type'];

      console.log(user);
    }
    catch (e) {
      console.log(e);
    }
  }
  async favor() {
    try {
      await this.db.isFavorite(this.auth.uid, this.pageID);
    } catch (e) {
      console.log(e);
    }
  }

  toggleFollow() {
    /*
    if(this.isFollowing){
      let confirm = this.alertCtrl.create({
        title: 'Unfollow?',
        message: 'Are your sure you want to unfollow?',
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              this.isFollowing = false;

              this.userSettings.unfavoriteTeam(this.team);

              let toast = this.toastCtrl.create({
                message: 'You have unfollowed the team',
                duration: 2000,
                position: 'bottom'
              });
              toast.present();
            }
          },
          {text: 'No'}
        ]
      });
      confirm.present();
    } else {
      this.isFollowing = true;
      this.userSettings.favoriteTeam(
        this.team,
        this.tourneyData.tournament.id,
        this.tourneyData.tournament.name
      );
    }*/
    this.isFollowing = true;
    this.db.setFavorite(
      this.auth.uid,
      this.pageID);
    }

  goToBook() {
    this.navCtrl.push('BookPage', {
      item: this.pageID
    });
  }

}
