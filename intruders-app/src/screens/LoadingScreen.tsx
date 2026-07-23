import { Background } from "../components/background"
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { GradientPanel } from "../components/shared/gradientPanel";
import { ComputerScreen } from "../components/shared/computerScreen";
import { AnimatedUFO } from "../components/shared/animatedUFO";

export const LoadingScreen = () => {
    return (<Background>
        <View style={styles.outside}>
            <GradientPanel roundBottom roundTop marginTop={10} marginBottom={10}>
                <ComputerScreen marginTop={10} marginBottom={10} width={Dimensions.get("screen").width - 40}>
                    <View style={styles.screenAnimation}>
                        <AnimatedUFO starLength={Dimensions.get("screen").width / 2 - 10} customText='LOADING' />
                    </View>

                </ComputerScreen>
            </GradientPanel>
        </View>
    </Background>);
}

const styles = StyleSheet.create({
    outside: {
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    screenAnimation: {
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
});
