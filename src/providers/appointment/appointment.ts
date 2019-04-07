import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { DatabaseProvider } from '../database/database';
import { Observable } from 'rxjs'
import { Appointment } from '../../appointment'
import { map, catchError } from 'rxjs/operators';


@Injectable()
export class AppointmentProvider {

  constructor(public db: AngularFirestore, public dbProv: DatabaseProvider) {

  }

  async createAppointment(details: any) {
    try {
      let docID = this.db.createId();
      let obj = details;
      obj.id = docID;

      await this.db.collection('Teachers').doc(details.to).collection('Appointments').doc(docID).set(obj);
      if (this.dbProv.accountType == 'Student')
        await this.db.collection('Students').doc(details.from).collection('Appointments').doc(docID).set(obj);
    } catch (e) {
      throw (e);
    }
  }

  getAppointments(id: string): Observable<Appointment[]> {
    try{
      if (this.dbProv.usersObj[id]['type'] == 'Student')
      {
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
      else
      {
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
    }catch(e){
      throw(e);
    }
  }

  async clear(appointment:Appointment){
    try{
      let temp = {};
      temp["status"] = "Cleared";
      this.db.collection('Students').doc(appointment.from).collection('Appointments').doc(appointment.id).update(temp);
    }
    catch(e){
      throw(e);
    }
  }

}
