import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCppfzMb0axZYYGW5b181p15ua6OndrbV0",
  authDomain: "coolstuff-458f3.firebaseapp.com",
  projectId: "coolstuff-458f3",
  storageBucket: "coolstuff-458f3.firebasestorage.app",
  messagingSenderId: "293657075375",
  appId: "1:293657075375:web:e5ba575e9d4096e1167e5a",
  measurementId: "G-YMCGDT9661"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Enable offline persistence
try {
  enableMultiTabIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a a time.
      console.log('Persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      // The current browser doesn't support persistence
      console.log('Persistence not supported by browser');
    }
  });
} catch (err) {
  console.error('Error enabling persistence:', err);
}

export default app;