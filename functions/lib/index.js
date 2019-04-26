"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
exports.newAppointmentNotification = functions.firestore
    .document('Teachers/{uid}/Appointments/{id}')
    .onCreate((snapshot, context) => __awaiter(this, void 0, void 0, function* () {
    const data = snapshot.data();
    if (!data)
        return null;
    const userId = data.to;
    const fromStamp = data.timestamp;
    const from = new Date(fromStamp).toLocaleString('en-US');
    // Notification content
    const payload = {
        notification: {
            title: ` New Appointment`,
            body: `${from}`
        }
    };
    // ref to the device collection for the user
    const db = admin.firestore();
    const devicesRef = db.collection('devices').where('userId', '==', userId);
    // get the user's tokens and send notifications
    const devices = yield devicesRef.get();
    const tokens = [];
    // send a notification to each device token
    devices.forEach(result => {
        const token = result.data().token;
        tokens.push(token);
    });
    return admin.messaging().sendToDevice(tokens, payload);
}));
//# sourceMappingURL=index.js.map