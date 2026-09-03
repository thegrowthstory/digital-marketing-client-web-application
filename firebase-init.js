import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBkDMLmKeLHZonC_dx9Nj_YC_RgmI7DiDI",
  authDomain: "projects-14a34.firebaseapp.com",
  projectId: "projects-14a34",
  storageBucket: "projects-14a34.firebasestorage.app",
  messagingSenderId: "726812157735",
  appId: "1:726812157735:web:9073901fb681b52b37ab02"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.saveToFirebase = async (data) => {
  try {
    const docRef = await addDoc(collection(db, 'projects'), data);
    console.log("Firebase document written with ID: ", docRef.id);
    return true;
  } catch (error) {
    console.error("Firebase error: ", error);
    return false;
  }
};
