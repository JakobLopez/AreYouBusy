import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppointmentProvider } from '../../providers/appointment/appointment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { Appointment } from '../../appointment';


@IonicPage()
@Component({
  selector: 'page-book',
  templateUrl: 'book.html',
})
export class BookPage {
  myAppointment: any = {
    date: "",
    length: ""
  };

  appForm: FormGroup;
  appointments: Appointment[];
  today: string;
  sendToID: string = this.navParams.get('item');

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public ap: AppointmentProvider, 
    public auth: AuthProvider,
    public formBuilder: FormBuilder,) {
      //Get today's date in local time
      let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
      this.today = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);

      this.appForm = formBuilder.group({
        date: ['', Validators.required],
        time: ['', Validators.required],
        length: ['', Validators.required]
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookPage');
  }

  ngOnInit(): void {
    //Watch for changes to appointments
    this.ap.getAppointments(this.sendToID)
    .subscribe(appointments => this.appointments = appointments);


  }

  async makeAppointment() {
    try {
      let appt:Appointment = {
        date: this.myAppointment.date,
        from: this.auth.uid,
        to: this.sendToID,
        timestamp: 0,
        endStamp: this.lengthToMilliseconds(this.myAppointment.length),
        id: await this.ap.createAppointmentId()
      }

      //Convert to local time
      appt.timestamp = await this.convertTimezone();

      //Add length of appointment to timestamp
      appt.endStamp = appt.timestamp + appt.endStamp;

      //Only get the date in form yyyy/dd/mm
      appt.date = this.myAppointment.date.split("T")[0];

      //Make appointment if it is valid
      if(await this.ap.isValidAppointment(appt))
      {
        await this.ap.createAppointment(appt);
        this.navCtrl.pop();
      }
      else
        console.log("Somebody else already has an appointment during this time");
      
    } catch (e) {
      console.log(e);
    }
  }

  //Time from ion-datepicker is not in local time
  //This function converts to local time
  async convertTimezone(){
    try{
      
      let myDate = new Date(this.myAppointment.date);

      myDate.setMinutes(myDate.getMinutes() + myDate.getTimezoneOffset());

      return await myDate.getTime();
    }catch(e){
      console.log(e);
    }

  }

  lengthToMilliseconds(length){
    let split = length.split(':');

    let minutes = (+split[0]) * 60 + (+split[1]);
    let milliseconds = minutes * 60000;

    return milliseconds;
  }


}
