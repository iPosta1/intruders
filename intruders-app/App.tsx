import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
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

export default function App() {
    const [fontsLoaded] = useFonts({
        basic: require('./assets/fonts/digital0.ttf'),
        title: require('./assets/fonts/digital.ttf'),
    });

    const [player, setPlayer] = useState<PlayerIdentity | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setPlayer(loadPlayerIdentity());
        setIsLoading(false);
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
                    <NavigationContainer>
                        <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: 'Choose name' }} />
                        </Stack.Navigator>
                    </NavigationContainer>
                ) : (
                    <NavigationContainer linking={linking}>
                        <Stack.Navigator
                            id={undefined}
                            initialRouteName="MainScreen"
                            screenOptions={{ headerShown: false }}
                        >
                            <Stack.Screen name="MainScreen" component={MainScreen} options={{ title: 'Main' }} />
                            <Stack.Screen
                                name="GameScreen"
                                component={GameScreen}
                                options={{ title: 'Game' }}
                            />
                            <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ title: 'Settings' }} />
                            <Stack.Screen name="JoinScreen" component={JoinScreen} options={{ title: 'Join Game' }} />
                        </Stack.Navigator>
                    </NavigationContainer>
                )}
            </RootSiblingParent>
          </AppContext.Provider>
        </SafeAreaProvider>
    );
}
