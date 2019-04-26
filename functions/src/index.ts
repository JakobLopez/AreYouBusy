import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';
admin.initializeApp();


exports.newSubscriberNotification = functions.firestore
    .document('Teachers/{uid}/Appointments/{id}')
<<<<<<< HEAD
    .onCreate(async (snapshot, context) => {

            const data = snapshot.data();
 
            if(!data) return null;
                
            const userId = data.to;
            const fromStamp = data.timestamp;

            const from = new Date(fromStamp).toLocaleString('en-US');
 
            // Notification content
            const payload = {
                notification: {
                    title: ` New Appointment`,
                    body: `${from}`
                }
            }
=======
    .onCreate(async event => {

        const data = event.after.data();

        const userId = data.uid;
        const subscriber = data.name;
>>>>>>> parent of 8d5cd12... dynamic push notifications

        // Notification content
        const payload = {
            notification: {
                title: 'New Subscriber',
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