import{initializeApp}from'firebase/app'
import{getAuth}from'firebase/auth'
import{getFirestore}from'firebase/firestore'
// These values identify the project; they are public by design. Access is enforced by firestore.rules.
const app=initializeApp({apiKey:'AIzaSyClXTKoCMJHR2s08MEbDB1UtZ0_hdxytao',authDomain:'francoserve.firebaseapp.com',projectId:'francoserve',storageBucket:'francoserve.firebasestorage.app',messagingSenderId:'888489996121',appId:'1:888489996121:web:e5144a107b743f14c92648'})
export const auth=getAuth(app),db=getFirestore(app)
