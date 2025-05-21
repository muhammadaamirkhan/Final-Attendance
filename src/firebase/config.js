import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCsi2dyWu6VaemPKDuk_OCIhv0e1e3fWjE",
  authDomain: "attendance-d8c8c.firebaseapp.com",
  projectId: "attendance-d8c8c",
  storageBucket: "attendance-d8c8c.firebasestorage.app",
  messagingSenderId: "275245957827",
  appId: "1:275245957827:web:b8aa9b55d7ee952454d876"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
export default app;