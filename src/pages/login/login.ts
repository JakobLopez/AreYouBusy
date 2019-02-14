import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';




@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: FormGroup;
  errorMessage: String;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public auth: AuthProvider) {
  }

  ionViewWillLoad() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl(),
      password: new FormControl(),
    });
  }

  async tryLogin(credentials) {
    try {
      await this.auth.login(credentials);
      console.log("success")
    } catch (e) {
      console.log(e);
      this.errorMessage = e.message;
    }
  }

}
