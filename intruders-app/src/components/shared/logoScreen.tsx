import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { colors } from "../../utils/constants";
import { AnimatedCursor } from "./animatedCursor";
import { AnimatedUFO } from "./animatedUFO";
import { ComputerScreen } from "./computerScreen";

type LogoScreenProps = {
    text: string,
}

export const LogoScreen = ({ text }: LogoScreenProps) => {
    return (
        <View style={styles.screen}>
            <ComputerScreen marginTop={10} width={Dimensions.get("screen").width - 40}>
                <View style={styles.screenAnimation}>
                    <AnimatedUFO starLength={Dimensions.get("screen").width / 2 - 10} />
                </View>
                <View style={styles.screenTitle}>
                    <Text style={styles.title}>ALIEN INTRUDERS</Text>
                    <Text style={styles.actionText}>{text}<AnimatedCursor /></Text>
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
        fontSize: 20,
        textAlign: 'center',
        zIndex: 1,
    },
    actionText: {
        fontFamily: 'title',
        color: colors.greenDigital,
        fontSize: 12,
        textAlign: 'center',
        zIndex: 1,
    },
    screen: {
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
});
