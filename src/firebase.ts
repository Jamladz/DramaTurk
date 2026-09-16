import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "gen-lang-client-0163667078",
  appId: "1:638271136518:web:b935de69f34a181b997487",
  apiKey: "AIzaSyB6jUo0n3twSTlo4UOS8EUP5LT5FgGVIP4",
  authDomain: "gen-lang-client-0163667078.firebaseapp.com",
  storageBucket: "gen-lang-client-0163667078.firebasestorage.app",
  messagingSenderId: "638271136518"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-beed856d-c8cf-4b57-8b1f-f01c9896d3da");
