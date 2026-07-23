
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithCredential, getIdToken, setPersistence, browserLocalPersistence, signOut } from "firebase/auth";
import * as Google from 'expo-auth-session/providers/google';
import { FIREBASE_CONFIG } from "../context";


const app = initializeApp(FIREBASE_CONFIG);
export const auth = getAuth(app);

export const firebaseAuthenticate = async (googleAccessToken: string) => {
    await setPersistence(auth, browserLocalPersistence);
    const googleCredential = GoogleAuthProvider.credential(null, googleAccessToken);
    await signInWithCredential(auth, googleCredential);
    // const user = result.user;
    // const idToken = await getIdToken(user);
}

export const logout = async () => {
    await signOut(auth);
}
