import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';
admin.initializeApp();


exports.newAppointmentNotification = functions.firestore
    .document('Teachers/{uid}/Appointments/{id}')
    .onCreate(async (snapshot, context) => {

            const data = snapshot.data();
 
            if(!data) return null;
                
            const userId = data.uid;
            const subscriber = data.name;

            // Notification content
            const payload = {
                notification: {
                    title: 'New Appointment',
                    body: `${subscriber} is following your content!`

                }
            }

            // ref to the device collection for the user
            const db = admin.firestore()
            const devicesRef = db.collection('devices').where('userId', '==', userId)


            // get the user's tokens and send notifications
            const devices = await devicesRef.get();

            const tokens: any = [];

            // send a notification to each device token
            devices.forEach(result => {
                const token = result.data().token;

                tokens.push(token)
            })

            return admin.messaging().sendToDevice(tokens, payload)


    });