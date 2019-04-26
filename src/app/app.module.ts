import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {IonicStorageModule} from '@ionic/storage';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth'
import { AngularFirestoreModule } from 'angularfire2/firestore'
import { Firebase } from '@ionic-native/firebase';
import { FIREBASE_CONFIG } from './credentials'

import { MyApp } from './app.component';
import { AuthProvider } from '../providers/auth/auth';
import { ValidatorProvider } from '../providers/validator/validator';
import { DatabaseProvider } from '../providers/database/database';
import { AppointmentProvider } from '../providers/appointment/appointment';
import { FcmProvider } from '../providers/fcm/fcm';


@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG.config),
    AngularFireAuthModule,
    AngularFirestoreModule,
    IonicStorageModule.forRoot(),
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    ValidatorProvider,
    DatabaseProvider,
    AppointmentProvider,
    Firebase,
    FcmProvider
  ]
})
export class AppModule {}
