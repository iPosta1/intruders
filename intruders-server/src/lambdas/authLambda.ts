import { Handler } from 'aws-lambda';
import { cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
const FAKE_E2E_USERS = [
    {
        userId: 'loshok1id',
        username: 'loshped 1'
    },
    {
        userId: 'loshok2id',
        username: 'loshok 2'
    },
    {
        userId: 'loshok3id',
        username: 'loshara 3'
    },
    {
        userId: 'loshok4id',
        username: 'lohoped 4'
    },
    {
        userId: 'loshok5id',
        username: 'prosto loh 5'
    },
    {
        userId: 'loshok6id',
        username: 'shesterka i loh'
    },
    {
        userId: 'loshok7id',
        username: 'loshidze7'
    },
    {
        userId: 'loshok8id',
        username: 'loshik 8'
    },
    {
        userId: 'loshok9id',
        username: 'lohoeb 9'
    },
    {
        userId: 'loshok10id',
        username: 'lohusik 10'
    }
];

const app = initializeApp({
    credential: cert({
        "type": "service_account",
        "project_id": "intruders-49e3e",
        "private_key_id": "42367efefa7cc4880a879387cfb19981e5ddf5de",
        "private_key": process.env.PRIVATE_KEY,
        "client_email": "firebase-adminsdk-5g14a@intruders-49e3e.iam.gserviceaccount.com",
        "client_id": "105387048028326410001",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-5g14a%40intruders-49e3e.iam.gserviceaccount.com"
    } as any)
});
const auth = getAuth(app);

export const handler: Handler = async (event) => {
    console.log('Auth lambda executed: ' + event.headers.authorization);
    const testPlayersTokensSecret = process.env.PLAYERS_SECRET_TOKENS;
    if (event.headers.authorization.length === 30 && testPlayersTokensSecret) {
        const userIndex = testPlayersTokensSecret.split(',').findIndex(token => token === event.headers.authorization);
        return userIndex === -1 ? {
            isAuthorized: false
        } : {
            isAuthorized: true,
            context: {
                userId: FAKE_E2E_USERS[userIndex].userId,
                username: FAKE_E2E_USERS[userIndex].username,
            }
        }
    } else {
        try {
            const result = await auth.verifyIdToken(event.headers.authorization);
            return {
                isAuthorized: true,
                context: {
                    userId: result.uid,
                    username: result.name,
                }
            }

        } catch (e) {
            console.log((e as any).message);
            return { isAuthorized: false };
        }
    }
}
