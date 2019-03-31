import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';


@Injectable()
export class AppointmentProvider {

  constructor(public db: AngularFirestore) {

  }

  async createAppointment(details: any) {
    try {
      let docID = this.db.createId();
      
      await this.db.collection('Teachers').doc(details.to).collection('Appointments').doc(docID).set(details);
    } catch (e) {
      throw (e);
    }
  }

}
