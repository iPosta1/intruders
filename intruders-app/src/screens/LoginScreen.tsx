import React, { useEffect } from "react";
import { Image, Text, View, StyleSheet, TouchableOpacity, Platform, Dimensions, Animated } from "react-native";
import { Background } from "../components/background";
import { TextLogo } from "../components/textLogo";
import { BackgroundCircle } from "../components/backgroundCircle";
import { firebaseAuthenticate } from "../services/authService";
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { AppContext, WEB_CLIENT_ID } from "../context";
import { GradientPanel } from "../components/shared/gradientPanel";
import { ComputerScreen } from "../components/shared/computerScreen";
import { AnimatedUFO } from "../components/shared/animatedUFO";
import { colors } from "../utils/constants";
import { AnimatedCursor } from "../components/shared/animatedCursor";
import { GameButton, GameButtonGroup } from "../components/shared/gameButton";
import { LogoScreen } from "../components/shared/logoScreen";

export const LoginScreen = () => {
    if (Platform.OS === 'web') {
        WebBrowser.maybeCompleteAuthSession();
    }
    const { promptAsync } = React.useContext(AppContext);
    const authenticateWithGoogle = async () => {
        const res = await promptAsync();
        if (res.type === 'success') {
            await firebaseAuthenticate((res as any).authentication.accessToken);
        }
    }

    return (<Background>
        <View style={styles.outside}>
            <GradientPanel roundBottom roundTop marginTop={10} marginBottom={10}>
                <View style={styles.container}>
                    <LogoScreen text="Log in to start" />
                    <View style={styles.button}>
                        <GameButton color={colors.red} size={50} />
                        <GameButtonGroup>
                            <GameButton color={colors.pureWhite} size={50} />
                            <GameButton color={colors.pureWhite} size={50} />
                        </GameButtonGroup>
                        <GameButton color={colors.pureWhite} size={50} isEnabled labelBottom="Google sign in" labelSize={10}
                            onPress={() => authenticateWithGoogle()} />
                    </View>
                </View>
            </GradientPanel>
        </View>
    </Background>);
};

const styles = StyleSheet.create({
    outside: {
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    container: {
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    button: {
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        flexWrap: "wrap",
    },
});
