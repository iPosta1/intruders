import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from '@use-expo/font';
import { createContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MainScreen } from './src/screens/MainScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { auth } from './src/services/authService';
import { User } from "firebase/auth";
import { AppContext, WEB_CLIENT_ID } from './src/context';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { RootSiblingParent } from 'react-native-root-siblings';
import { GameScreen } from './src/screens/GameScreen';
import { GET } from './src/utils/fetch';
import { LoadingScreen } from './src/screens/LoadingScreen';
import { JoinScreen } from './src/screens/JoinScreen';
import * as Google from 'expo-auth-session/providers/google';
import { useTokenId, useUserGameId } from './src/services/gameService';

export type RootStackParamList = {
    LoginScreen: undefined;
    SettingsScreen: undefined;
    GameScreen: { gameId: string };
    MainScreen: undefined;
    LoadingScreen: undefined;
    JoinScreen: { gameId: string };
};
const linking: LinkingOptions<RootStackParamList> = {
    config: {
        screens: {
            GameScreen: 'game/:gameId',
            JoinScreen: 'join/:gameId',
            MainScreen: "/",
            SettingsScreen: "settings",
        }
    },
    prefixes: []
};
const loginLinking: LinkingOptions<RootStackParamList> = {
    config: {
        screens: {
            LoginScreen: "/",
        },
    },
    prefixes: []
};

const Stack = createStackNavigator<RootStackParamList>();
export default function App() {
    const isGamePage = window.location.pathname.startsWith('/game/');
    const customFonts = {
        basic: require("./assets/fonts/digital0.ttf"),
        title: require("./assets/fonts/digital.ttf"),
    };
    useFonts(customFonts);
    const [isLoading, setIsLoading] = useState(true);

    const [user, setUser] = useState<User | null>();
    const [gameIsLoading, setGameIsLoading] = useState(false);
    const [gameId, setGameId] = useState<string>(null);
    const { data: token } = useTokenId(user);
    // const { data: userGameStatus } = useUserGameId(token);

    const onAuthStateChanged = (user: User | null) => {
        setUser(user);
    }

    const loadUserGame = async () => {
        setGameIsLoading(true);
        const token = await user.getIdToken();
        const status = await GET('/find-game', token);
        if (status.ok && !!status.data.gameId) {
            console.log(status.data.gameId);
            setGameId(status.data.gameId);
        }
        setGameIsLoading(false)
    }

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    useEffect(() => {
        if (!isGamePage && !!user) {
            loadUserGame();
        }
    }, [user]);

    useEffect(() => {
        const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    const [req, res, promptAsync] = Google.useAuthRequest({
        webClientId: WEB_CLIENT_ID,
        // redirectUri: 'https://intruders-49e3e.firebaseapp.com/__/auth/handler'
        // redirectUri: 'http://localhost:19006'
        selectAccount: true,
    });

    const ifSomethingIsLoading = user === undefined || gameIsLoading;
    return (ifSomethingIsLoading ?
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
                headerShown: false
            }}><Stack.Screen name='LoadingScreen' component={LoadingScreen} options={{ title: 'Loading' }} />
            </Stack.Navigator>
        </NavigationContainer>
        :
        <AppContext.Provider value={{
            user: user as User,
            promptAsync,
        }}>
            <RootSiblingParent>
                {!user &&
                    <NavigationContainer>
                        <Stack.Navigator screenOptions={{
                            headerShown: false
                        }}>
                            <Stack.Screen name='LoginScreen' component={LoginScreen} options={{ title: 'Login' }} />
                        </Stack.Navigator>
                    </NavigationContainer>
                }
                {isGamePage && !!user &&
                    <NavigationContainer linking={linking}>
                        <Stack.Navigator screenOptions={{
                            headerShown: false
                        }}>
                            <Stack.Screen name='GameScreen' component={GameScreen} options={{ title: 'Game' }} />
                            <Stack.Screen name='SettingsScreen' component={SettingsScreen} options={{ title: 'Settings' }} />
                            <Stack.Screen name='MainScreen' component={MainScreen} options={{ title: 'Main' }} />
                            <Stack.Screen name='JoinScreen' component={JoinScreen} options={{ title: 'Join Game' }} />
                        </Stack.Navigator>
                    </NavigationContainer>
                }
                {
                    !isGamePage && !!gameId && !!user &&
                    <NavigationContainer linking={linking}>
                        <Stack.Navigator screenOptions={{
                            headerShown: false
                        }}>
                            <Stack.Screen name='GameScreen' component={GameScreen} options={{ title: 'Game' }} initialParams={{ gameId: gameId }} />
                            <Stack.Screen name='SettingsScreen' component={SettingsScreen} options={{ title: 'Settings' }} />
                            <Stack.Screen name='MainScreen' component={MainScreen} options={{ title: 'Main' }} />
                            <Stack.Screen name='JoinScreen' component={JoinScreen} options={{ title: 'Join Game' }} />

                        </Stack.Navigator>
                    </NavigationContainer>
                }
                {
                    !isGamePage && !gameId && !!user &&
                    <NavigationContainer linking={linking}>
                        <Stack.Navigator screenOptions={{
                            headerShown: false
                        }}>
                            <Stack.Screen name='MainScreen' component={MainScreen} options={{ title: 'Main' }} />
                            <Stack.Screen name='GameScreen' component={GameScreen} options={{ title: 'Game' }} initialParams={{ gameId: gameId }} />
                            <Stack.Screen name='SettingsScreen' component={SettingsScreen} options={{ title: 'Settings' }} />
                            <Stack.Screen name='JoinScreen' component={JoinScreen} options={{ title: 'Join Game' }} />
                        </Stack.Navigator>
                    </NavigationContainer>
                }
            </RootSiblingParent>
        </AppContext.Provider >
    );
}


