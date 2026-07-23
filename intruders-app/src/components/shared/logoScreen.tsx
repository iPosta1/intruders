import React from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { colors } from "../../utils/constants";
import { AnimatedCursor } from "./animatedCursor";
import { AnimatedUFO } from "./animatedUFO";
import { ComputerScreen } from "./computerScreen";

type LogoScreenProps = {
    text: string,
}

export const LogoScreen = ({ text }: LogoScreenProps) => {
    const { width } = useWindowDimensions();
    return (
        <View style={styles.screen}>
            <ComputerScreen marginTop={8} width="100%" maxWidth={520}>
                <View style={styles.screenAnimation}>
                    <AnimatedUFO starLength={Math.max(100, Math.min(240, width - 96))} />
                </View>
                <View style={styles.screenTitle}>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.title, { fontSize: Math.max(14, Math.min(26, width / 21)) }]}>ALIEN INTRUDERS</Text>
                    <Text style={[styles.actionText, { fontSize: Math.max(11, Math.min(15, width / 30)) }]}>{text.toUpperCase()}<AnimatedCursor /></Text>
                </View>
            </ComputerScreen>
        </View>);
}

const styles = StyleSheet.create({
    screenTitle: {
        alignContent: "center",
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        marginBottom: 10,
        width: '100%',
        minWidth: 0,
    },
    screenAnimation: {
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        flex: 2,
    },
    title: {
        fontFamily: 'title',
        color: colors.greenDigital,
        letterSpacing: 2.2,
        textAlign: 'center',
        zIndex: 1,
        width: '100%',
    },
    actionText: {
        fontFamily: 'title',
        color: colors.greenDigital,
        letterSpacing: 1,
        textAlign: 'center',
        zIndex: 1,
        width: '100%',
    },
    screen: {
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        width: '100%',
        minWidth: 0,
    },
});
