import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorProvider } from '../../providers/validator/validator';
import { AuthProvider } from '../../providers/auth/auth'
import { DatabaseProvider } from '../../providers/database/database';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';



@IonicPage()
@Component({
  selector: 'page-login-signup',
  templateUrl: 'login-signup.html',
})
export class LoginSignupPage {
  loginForm: FormGroup;
  loginSignUp: string = "login";
  signUpForm: FormGroup;
  submitAttempt: boolean = false;
  fbauth = firebase.auth();
  errorMessage: string = "";

  account = [
    { val: 'Student' },
    { val: 'Teacher' }
  ];
  chosenAccount: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public auth: AuthProvider,
    public db: DatabaseProvider,
    public alertCtrl: AlertController,
    public storage: Storage,) {
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, ValidatorProvider.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });

    this.signUpForm = formBuilder.group({
      name: ['', Validators.compose([Validators.minLength(1), Validators.required])],
      email: ['', Validators.compose([Validators.required, ValidatorProvider.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      confirmPassword: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      type: ['', Validators.required]
    }, { validator: ValidatorProvider.matchingPasswords('password', 'confirmPassword') })


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginSignupPage');
  }

  //Attempts to login user given credentials from loginForm
  async tryLogin(credentials) {
    try {
      await this.auth.login(credentials);
      console.log("Login sucess");

      this.storage.set('user', JSON.stringify(this.auth.uid));

      await this.db.setAccountType(this.auth.uid);

      if (this.db.accountType == 'Student')
      this.navCtrl.setRoot('StudentProfilePage');
      else
        this.navCtrl.setRoot('TeacherProfilePage');

    } catch (e) {
      this.errorMessage = "User doesn't exit. Check email and password.";
      console.log(e);
    }
  }


  //Attempts to register user
  async tryRegister(value) {
    try {
      // Submit Attempt toggles the display of form validation errors
      this.submitAttempt = true;

      await this.auth.register(value);
      console.log("Registration sucess");

      await this.db.setAccountType(this.auth.uid, this.chosenAccount)

      await this.tryLogin(value);

      this.navCtrl.push('TabPage');

    }
    catch (e) {
      this.errorMessage = e;
      console.log(e);
    }
  }

  //Sets the value for the account type chosen in checkbox
  setValue(val) {
    this.chosenAccount = val;
  }

  //allows user to reset password
  async resetPassword() {
    try {
      let getEmail = this.alertCtrl.create({
        title: 'Reset Password',
        message: 'Please enter your email?',
        inputs: [
          {
            name: 'email',
            type: 'String',
            placeholder: 'your email'
          },
        ],
        buttons: [
          {
            text: 'Send Email',
            handler: data => {
              this.auth.resetEmail(data.email).then(() => console.log("email sent")).
                catch(e => console.log(e));
            }
          },
          { text: 'Cancel' }
        ]
      });
      getEmail.present();
    }
    catch (e) {
      console.log(e);
    }
  }

}