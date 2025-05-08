import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCppfzMb0axZYYGW5b181p15ua6OndrbV0",
  authDomain: "coolstuff-458f3.firebaseapp.com",
  projectId: "coolstuff-458f3",
  storageBucket: "coolstuff-458f3.appspot.com",
  messagingSenderId: "293657075375",
  appId: "1:293657075375:web:e5ba575e9d4096e1167e5a",
  measurementId: "G-YMCGDT9661",
  cookieDomain: "coolstff.com"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Initialize Firestore with modern persistence settings
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
    cacheSizeBytes: 50000000 // 50MB cache size
  })
});

export default app;