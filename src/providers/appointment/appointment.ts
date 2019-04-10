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

  async isValidAppointment(appointment:Appointment){
      try{
        let appRef = await this.db.collection('Teachers').doc(appointment.to).collection('Appointments').ref;
        let docs = await appRef.where('date' , '==' , appointment.date).get();
        
        var doc_obj = {};
        docs.forEach(doc => {
        var doc_data = doc.data();
        for (var field in doc_data) {
          
          doc_obj[field] = doc_data[field];
        }
        console.log(doc.id);
      });
      console.log(doc_obj);
      }catch(e){
        throw(e);
      }
  }

  async createAppointment(details: any) {
    try {

      details['id']= this.db.createId();
      this.isValidAppointment(details);

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
    try{
      await this.db.collection('Students').doc(appointment.from).collection('Cleared Appointments').doc(appointment.id).set(appointment);
      await this.db.collection('Students').doc(appointment.from).collection('Appointments').doc(appointment.id).delete();
    }
    catch(e){
      throw(e);
    }
  }

}
