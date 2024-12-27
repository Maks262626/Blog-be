import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import admin from 'firebase-admin';
import * as serviceAccount from '../../creds.json';
import dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN, 
  projectId: process.env.PROJECT_ID, 
  storageBucket: process.env.STORAGE_BUCKET, 
  messagingSenderId: process.env.NESSAGING_SENDER_ID, 
  appId: process.env.APP_ID, 
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

initializeApp(firebaseConfig);

const auth = getAuth();

export { auth };