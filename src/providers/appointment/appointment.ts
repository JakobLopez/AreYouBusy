import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';


@Injectable()
export class AppointmentProvider {

  constructor(public db: AngularFirestore) {

  }

  async createAppointment(details: any) {
    try {
      let slot = details.slotTime.replace(':','');
      await this.db.collection('Teachers').doc(details.to).collection('Appointments').doc(details.date).collection('Times').doc(slot).set(details);
    } catch (e) {
      throw (e);
    }
  }

}
