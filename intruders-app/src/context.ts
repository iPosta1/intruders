import { AuthRequestPromptOptions, AuthSessionResult } from "expo-auth-session";
import { User } from "firebase/auth";
import { createContext } from "react";

export const AppContext = createContext({
    user: null as unknown as User,
    promptAsync: null as (options?: AuthRequestPromptOptions) => Promise<AuthSessionResult>,
});

export const HOST = 'http://intru-manual-1158751084.us-east-2.elb.amazonaws.com';
export const WEB_CLIENT_ID = '519692767697-nn22v9c01va4offog3udgofkfqih3di5.apps.googleusercontent.com';
export const SERVER_URL = 'https://pfi1of1wg6.execute-api.us-east-2.amazonaws.com';

export const FIREBASE_CONFIG = {
    apiKey: "AIzaSyA6Exvr8X2S7AjOf8cOL0JEPQVSp0c50NY",
    authDomain: "intruders-49e3e.firebaseapp.com",
    projectId: "intruders-49e3e",
    storageBucket: "intruders-49e3e.appspot.com",
    messagingSenderId: "519692767697",
    appId: "1:519692767697:web:4674062f64115ab3e550f0",
    measurementId: "G-G9905TXYHD"
};