import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidatorProvider } from '../../providers/validator/validator';
import { AuthProvider } from '../../providers/auth/auth'
import { DatabaseProvider } from '../../providers/database/database';


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

  account = [
    { val: 'Student' },
    { val: 'Teacher' }
  ];
  chosenAccount: any;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public auth: AuthProvider, 
    public db: DatabaseProvider) {
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, ValidatorProvider.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });

    this.signUpForm = formBuilder.group({
      name: ['', Validators.compose([Validators.minLength(1), Validators.required])],
      email: ['', Validators.compose([Validators.required, ValidatorProvider.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      confirmPassword: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      type : ['', Validators.required]
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

      let type = await this.db.getUserType(this.auth.uid);

      if(type == 'Student')
        this.navCtrl.setRoot('HomePage');
      else
        this.navCtrl.setRoot('MePage');
    } catch (e) {
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

      if(this.chosenAccount == 'Student')
        this.navCtrl.push('HomePage');
      else
        this.navCtrl.setRoot('MePage');

    }
    catch (e) {
      console.log(e);
    }
  }

  //Sets the value for the account type chosen in checkbox
  setValue(val){
    this.chosenAccount = val;
  }

}
