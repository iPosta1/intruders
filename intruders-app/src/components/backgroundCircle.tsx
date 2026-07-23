import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { colors } from "../context";

export const BackgroundCircle = () => {


    return (<View>
        <View style={styles.bgOfGoogleBG}></View>
        <View style={styles.bgOfGoogleBG2}></View>
        <View style={styles.bgOfGoogleBG3}></View>
        <View style={styles.smallCirle1}></View>
        <View style={styles.smallCirle2}></View>
        <View style={styles.smallCirle3}></View>
    </View>);
}

const styles = StyleSheet.create({
    bgOfGoogleBG: {
        position: 'absolute',
        width: 170,
        height: 170,
        backgroundColor: '#1e3669',
        borderRadius: 999,
        opacity: 0.4,
        marginTop: -80,
        marginLeft: -45,
        zIndex: -10,
    },
    bgOfGoogleBG2: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 999,
        opacity: 0.5,
        marginTop: -95,
        marginLeft: -60,
        zIndex: -10,
        borderWidth: 3,
        borderColor: '#1e3669',
    },
    bgOfGoogleBG3: {
        position: 'absolute',
        width: 70,
        height: 70,
        opacity: 0.2,
        marginTop: 0,
        marginLeft: 35,
        zIndex: -10,
        borderBottomRightRadius: 999,
        borderBottomWidth: 20,
        borderRightWidth: 20,
        borderColor: colors.whiteBlue,
    },
    smallCirle1: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderRadius: 999,
        opacity: 0.5,
        marginTop: 40,
        marginLeft: -57,
        zIndex: -8,
        backgroundColor: colors.whiteBlue,
    },
    smallCirle2: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderRadius: 999,
        opacity: 0.5,
        marginTop: 63,
        marginLeft: -42,
        zIndex: -8,
        backgroundColor: colors.whiteBlue,
    },
    smallCirle3: {
        position: 'absolute',
        width: 15,
        height: 15,
        borderRadius: 999,
        opacity: 0.8,
        marginTop: 80,
        marginLeft: -22,
        zIndex: -8,
        borderColor: colors.whiteBlue,
        borderWidth: 4,
    },
});
