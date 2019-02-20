import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidatorProvider } from '../../providers/validator/validator';
import { AuthProvider } from '../../providers/auth/auth'


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

  accounts = [
    { val: 'Student', isChecked: false },
    { val: 'Teacher', isChecked: false }
  ];
  account = [
    { val: 'Student' },
    { val: 'Teacher' }
  ];
  chosenAccount: any;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public auth: AuthProvider, ) {
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
      console.log("success")
      this.navCtrl.setRoot('LoginPage');
    } catch (e) {
      console.log(e);
      //this.errorMessage = e.message;
    }
  }

  //Attempts to register user
  async tryRegister(value) {
    try {
      // Submit Attempt toggles the display of form validation errors
      this.submitAttempt = true;
      
      await this.auth.register(value);

      //Once the user signs up, pass them to to login segment to login. Could modify to auto-login the user.
      //this.loginSignUp = 'login';
      //this.successMessage = "Your account has been created.";

      this.navCtrl.push('HomePage');

      console.log(this.chosenAccount)
    }
    catch (e) {
      console.log(e);
      //this.errorMessage = e.message;
    }
  }

  //Sets the value for the account type chosen in checkbox
  setValue(val){
    this.chosenAccount = val;
    console.log(val);

  }

}
