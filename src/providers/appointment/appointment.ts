import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { DatabaseProvider } from '../database/database';
import { Observable } from 'rxjs'
import { Appointment } from '../../appointment'
import { map, catchError } from 'rxjs/operators';
import { Timestamp } from 'rxjs/internal/operators/timestamp';


@Injectable()
export class AppointmentProvider {

  constructor(public db: AngularFirestore, public dbProv: DatabaseProvider) {

  }

  async isValidAppointment(appointment: Appointment) {
    try {
      let size: any;
 
      let appRef = await this.db.collection('Teachers').doc(appointment.to).collection('Appointments').ref;

      let query1 = await appRef.where('date', '==', appointment.date).where('timestamp', '<=', appointment.timestamp);
      let query2 = await appRef.where('date', '==', appointment.date).where('timestamp', '<', appointment.endStamp);

      let result = await query1.get();
      let flag = true;
      result.forEach(doc => {
        var doc_data = doc.data();

        //If appointment is made in the middle of another appointment
        if(doc_data['endStamp'] >= appointment.timestamp)
          flag = false;     
      });
      if(!flag)
        return flag;

      result = await query2.get();
      flag = true;
      result.forEach(doc => {
        var doc_data = doc.data();

        //If appointment ends in the middle of another appointment or
        //if appointment is spanning over an appointment
        if(doc_data['endStamp'] >= appointment.endStamp || ((doc_data['timestamp'] > appointment.timestamp) && (appointment.endStamp >= doc_data['endStamp'])))
          flag = false;
        
      });

      return flag;
    } catch (e) {
      throw (e);
    }
  }

  async createAppointmentId() {
    try {
      return await this.db.createId();
    } catch (e) {
      throw (e);
    }
  }

  async createAppointment(details: any) {
    try {
      await this.db.collection('Teachers').doc(details.to).collection('Appointments').doc(details.id).set(details);

      if (this.dbProv.accountType == 'Student')
        await this.db.collection('Students').doc(details.from).collection('Appointments').doc(details.id).set(details);
    } catch (e) {
      throw (e);
    }
  }

  getAppointments(id: string): Observable<Appointment[]> {
    try {
      if (this.dbProv.usersObj[id]['type'] == 'Student') {
        let userRef = this.db.collection('Students').doc(id);
        return userRef.collection<Appointment>(
          'Appointments'
        ).snapshotChanges().pipe(map(actions => {
          return actions.map(action => {
            const data = action.payload.doc.data() as Appointment;
            const id = action.payload.doc.id;
            return { id, ...data };
          });
        }));
      }
      else {
        let userRef = this.db.collection('Teachers').doc(id);
        return userRef.collection<Appointment>(
          'Appointments'
        ).snapshotChanges().pipe(map(actions => {
          return actions.map(action => {
            const data = action.payload.doc.data() as Appointment;
            const id = action.payload.doc.id;
            return { id, ...data };
          });
        }));
      }
    } catch (e) {
      throw (e);
    }
  }

  async clear(appointment: Appointment) {
    try {
      await this.db.collection('Students').doc(appointment.from).collection('Cleared Appointments').doc(appointment.id).set(appointment);
      await this.db.collection('Students').doc(appointment.from).collection('Appointments').doc(appointment.id).delete();
    }
    catch (e) {
      throw (e);
    }
  }

}
