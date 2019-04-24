import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { DatabaseProvider } from '../database/database';
import { Observable } from 'rxjs'
import { Appointment } from '../../appointment'
import { map } from 'rxjs/operators';


@Injectable()
export class AppointmentProvider {

  constructor(public db: AngularFirestore, public dbProv: DatabaseProvider) {

  }

  /* isValidAppointment
  * Desc:  
  *     Checks 4 cases:
  *       - Appointment is in professor's office hours
  *       - Appointment is not being made during an already existing appointment
  *       - Appointment is not ending during the middle of an exisiting appointment
  *       - Appointment is not made so that it puts an already existing appointment in 
  *         the middle of it
  * Params:
  *     appointment - the appointment being requested to make
  * returns: 
  *     true if appointment is valid
  */
  async isValidAppointment(appointment: Appointment) {
    try {
      let startDate = new Date(appointment.timestamp);
      let endDate = new Date(appointment.endStamp);
      let weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      let day = weekdays[startDate.getDay()];
      let timeFrom = startDate.toLocaleTimeString('en-GB');
      let timeTo = endDate.toLocaleTimeString('en-GB');

      let appRef = await this.db.collection('Teachers').doc(appointment.to).collection('Appointments').ref;
      let hoursRef = await this.db.collection('Teachers').doc(appointment.to).collection("Schedules").doc('Fall 2019').get();
      
      let flag = false;
      await hoursRef.forEach(doc => {
        var doc_data = doc.data();
        for (let field in doc_data[day]) {
          if (timeFrom >= doc_data[day][field]['From'] && timeTo <= doc_data[day][field]['To'])
            flag = true;         
        }
      });
      if (!flag)
        return flag

      let query1 = await appRef.where('date', '==', appointment.date).where('timestamp', '<=', appointment.timestamp);
      let query2 = await appRef.where('date', '==', appointment.date).where('timestamp', '<', appointment.endStamp);

      let result = await query1.get();
      flag = true;
      result.forEach(doc => {
        var doc_data = doc.data();

        //If appointment is made in the middle of another appointment
        if (doc_data['endStamp'] >= appointment.timestamp)
          flag = false;
      });
      if (!flag)
        return flag;

      result = await query2.get();
      flag = true;
      result.forEach(doc => {
        var doc_data = doc.data();

        //If appointment ends in the middle of another appointment or
        //if appointment is spanning over an appointment
        if (doc_data['endStamp'] >= appointment.endStamp || ((doc_data['timestamp'] > appointment.timestamp) && (appointment.endStamp >= doc_data['endStamp'])))
          flag = false;

      });

      return flag;
    } catch (e) {
      throw (e);
    }
  }



  /* createAppointmentId
  * Desc:  
  *     Creates an id
  * Params:
  *     none
  * returns: 
  *     a new id
  */
  async createAppointmentId() {
    try {
      return await this.db.createId();
    } catch (e) {
      throw (e);
    }
  }

  /* createAppointment
  * Desc:  
  *     Creates an appointment
  * Params:
  *     details - the appointment to make
  * returns: 
  *     none
  */
  async createAppointment(details: any) {
    try {
      await this.db.collection('Teachers').doc(details.to).collection('Appointments').doc(details.id).set(details);

      if (this.dbProv.accountType == 'Student')
        await this.db.collection('Students').doc(details.from).collection('Appointments').doc(details.id).set(details);
    } catch (e) {
      throw (e);
    }
  }

  /* getAppointments
  * Desc:  
  *     Gets all appointments 
  * Params:
  *     id - uid of user from which appointments are retrieved
  * returns: 
  *     observable of appointments
  */
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


  /* clear
  * Desc:  
  *     Clears user's appointment by moving it to a different collection
  * Params:
  *     appointment - appointment to be cleared
  * returns: 
  *     none
  */
  async clear(id: string, appointment: Appointment, type: string) {
    try {
      if (type == "Student") {
        await this.db.collection('Students').doc(id).collection('Cleared Appointments').doc(appointment.id).set(appointment);
        await this.db.collection('Students').doc(id).collection('Appointments').doc(appointment.id).delete();
      }
      else {
        await this.db.collection('Teachers').doc(id).collection('Cleared Appointments').doc(appointment.id).set(appointment);
        await this.db.collection('Teachers').doc(id).collection('Appointments').doc(appointment.id).delete();
      }

    }
    catch (e) {
      throw (e);
    }
  }

  /* delete
  * Desc:  
  *     Moves appointment from other user's appointments to cleared collection
  *     3 cases for removal:
  *         - student deleting appointment made with professor
  *         - professor deleting appointment made from student
  *         - professor deleting appointment made to another professor
  * Params:
  *     id - uid of user making deletion request
  *     appointment - appointment to be deleted from professor's collection
  *     type - account type of user making deletion request
  * returns: 
  *     none
  */
  async delete(id: string, appointment: Appointment, type: string) {
    try {
      //If student wants to delete an upcoming appointment
      if (type == "Student") {
        await this.db.collection('Teachers').doc(appointment.to).collection('Cleared Appointments').doc(appointment.id).set(appointment);
        await this.db.collection('Teachers').doc(appointment.to).collection('Appointments').doc(appointment.id).delete();
      }
      //If professor wants to delete upcoming appointment
      else {
        //If professor made appointment with another professor
        if (id == appointment.from) {
          await this.db.collection('Teachers').doc(appointment.to).collection('Cleared Appointments').doc(appointment.id).set(appointment);
          await this.db.collection('Teachers').doc(appointment.to).collection('Appointments').doc(appointment.id).delete();
        }
        //If deleting an appointment from a student
        else {
          await this.db.collection('Students').doc(appointment.from).collection('Cleared Appointments').doc(appointment.id).set(appointment);
          await this.db.collection('Students').doc(appointment.from).collection('Appointments').doc(appointment.id).delete();
        }
      }
    }
    catch (e) {
      throw (e);
    }
  }
}
