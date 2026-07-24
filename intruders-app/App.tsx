import { createNavigationContainerRef, LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import { useEffect, useRef, useState } from 'react';
import { RootSiblingParent } from 'react-native-root-siblings';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppContext } from './src/context';
import { loadPlayerIdentity, PlayerIdentity, savePlayerName, clearPlayerName } from './src/services/playerIdentity';
import { GameScreen } from './src/screens/GameScreen';
import { JoinScreen } from './src/screens/JoinScreen';
import { LoadingScreen } from './src/screens/LoadingScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { MainScreen } from './src/screens/MainScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

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
            MainScreen: '/',
            SettingsScreen: 'settings',
        },
    },
    prefixes: [],
};

const Stack = createStackNavigator<RootStackParamList, undefined>();
const navigationRef = createNavigationContainerRef<RootStackParamList>();

export default function App() {
    const [fontsLoaded] = useFonts({
        basic: require('./assets/fonts/digital0.ttf'),
        title: require('./assets/fonts/digital.ttf'),
    });

    const [player, setPlayer] = useState<PlayerIdentity | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // The name screen uses a separate navigator. Preserve a scanned join URL
    // before that navigator can replace it with the root route.
    const pendingJoinGameId = useRef(
        typeof globalThis.location !== 'undefined'
            ? globalThis.location.pathname.match(/^\/join\/([^/?#]+)/i)?.[1]?.trim().toLowerCase()
            : undefined,
    );
    const pendingJoinHandled = useRef(false);

    useEffect(() => {
        setPlayer(loadPlayerIdentity());
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (typeof document === 'undefined') {
            return;
        }

        // Prevent the browser's white canvas from showing around the app while
        // iOS animates its visual viewport after closing the keyboard.
        document.documentElement.style.backgroundColor = '#030504';
        document.body.style.backgroundColor = '#030504';
        document.body.style.margin = '0';
        document.documentElement.style.userSelect = 'none';
        document.documentElement.style.setProperty('-webkit-user-select', 'none');
        document.documentElement.style.setProperty('-webkit-touch-callout', 'none');
        document.body.style.userSelect = 'none';
        document.body.style.setProperty('-webkit-user-select', 'none');
        document.body.style.setProperty('-webkit-touch-callout', 'none');

        // Keep form controls editable/selectable while preventing long-press
        // selection and callouts everywhere else in the game UI.
        const interactionStyle = document.createElement('style');
        interactionStyle.id = 'intruders-touch-behavior';
        interactionStyle.textContent = `
            input, textarea {
                user-select: text !important;
                -webkit-user-select: text !important;
                -webkit-touch-callout: default !important;
            }
            img {
                user-select: none !important;
                -webkit-user-select: none !important;
                -webkit-user-drag: none;
                -webkit-touch-callout: none !important;
            }
        `;
        document.head.appendChild(interactionStyle);

        return () => {
            interactionStyle.remove();
        };
    }, []);

    const updatePlayerName = (name: string) => setPlayer(savePlayerName(name));
    const forgetPlayerName = () => {
        clearPlayerName();
        setPlayer(null);
    };

    if (isLoading || !fontsLoaded) {
        return (
            <NavigationContainer>
                <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }

    return (
        <SafeAreaProvider>
          <AppContext.Provider value={{ player, setPlayerName: updatePlayerName, clearPlayerName: forgetPlayerName }}>
            <RootSiblingParent>
                {!player ? (
                    <NavigationContainer key="unauthenticated-navigation">
                        <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: 'Choose name' }} />
                        </Stack.Navigator>
                    </NavigationContainer>
                ) : (
                    <NavigationContainer
                        key="authenticated-navigation"
                        // A scanned join route must survive the separate name
                        // navigator. Do not let browser URL initialization race
                        // the explicit resume route after the player is saved.
                        linking={pendingJoinGameId.current ? undefined : linking}
                        ref={navigationRef}
                        onReady={() => {
                            const gameId = pendingJoinGameId.current;
                            if (gameId && !pendingJoinHandled.current && navigationRef.isReady()) {
                                pendingJoinHandled.current = true;
                                navigationRef.reset({
                                    index: 0,
                                    routes: [{ name: 'JoinScreen', params: { gameId } }],
                                });
                            }
                        }}
                    >
                        <Stack.Navigator
                            id={undefined}
                            initialRouteName={pendingJoinGameId.current ? 'JoinScreen' : 'MainScreen'}
                            screenOptions={{ headerShown: false }}
                        >
                            <Stack.Screen name="MainScreen" component={MainScreen} options={{ title: 'Main' }} />
                            <Stack.Screen
                                name="GameScreen"
                                component={GameScreen}
                                options={{ title: 'Game' }}
                            />
                            <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ title: 'Settings' }} />
                            <Stack.Screen
                                name="JoinScreen"
                                component={JoinScreen}
                                initialParams={
                                    pendingJoinGameId.current
                                        ? { gameId: pendingJoinGameId.current }
                                        : undefined
                                }
                                options={{ title: 'Join Game' }}
                            />
                        </Stack.Navigator>
                    </NavigationContainer>
                )}
            </RootSiblingParent>
          </AppContext.Provider>
        </SafeAreaProvider>
    );
}
