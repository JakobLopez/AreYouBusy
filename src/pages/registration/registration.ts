import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController  } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth'

/**
 * Generated class for the RegistrationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
})
export class RegistrationPage {
  registerForm: FormGroup;
  errorMessage: String;
  successMessage: String;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public toast: ToastController,
    public auth: AuthProvider,
    public formBuilder: FormBuilder,
    public alt: AlertController ) {
  }

  ionViewWillLoad() {
    console.log('RegistrationPage loaded')
    this.registerForm = this.formBuilder.group({
      email: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
      confirmPassword: new FormControl("", Validators.required),
      first: new FormControl("", Validators.required),
      last: new FormControl("", Validators.required)
    },
      { validator: this.matchingPasswords('password', 'confirmPassword') });
  }

  //custom validator for matching passwords
  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }

  //Attempts to register user
  async tryRegister(value) {
    try {
      await this.auth.register(value);

      this.successMessage = "Your account has been created.";

      let alert = this.alt.create({
        title: 'Account needs to be verified',
        subTitle: 'Check your email',
        buttons: ['Dismiss']
      });
      alert.present();

      this.goLoginPage();
    }
    catch (e) {
      console.log(e);
      this.errorMessage = e.message;
    }
  }

  //Sends user to loginPage
  goLoginPage() {
    this.navCtrl.pop();
  }

}
