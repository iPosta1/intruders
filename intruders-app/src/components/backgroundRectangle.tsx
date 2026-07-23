import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { colors } from "../context";

export const BackgroundRectangle = () => {


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
        width: 300,
        height: 100,
        backgroundColor: '#1e3669',
        opacity: 0.4,
        marginTop: -30,
        zIndex: -10,
        marginLeft: -10,
    },
    bgOfGoogleBG2: {
        position: 'absolute',
        width: 330,
        height: 130,
        opacity: 0.7,
        marginTop: -45,
        marginLeft: -25,
        zIndex: -10,
        borderWidth: 3,
        borderColor: '#1e3669',
    },
    bgOfGoogleBG3: {
        position: 'absolute',
        width: 100,
        height: 20,
        opacity: 0.2,
        marginTop: 45,
        marginLeft: 0,
        zIndex: -10,
        backgroundColor: colors.whiteBlue,

    },
    smallCirle1: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderRadius: 999,
        opacity: 0.5,
        marginTop: -50,
        marginLeft: 200,
        zIndex: -8,
        backgroundColor: colors.whiteBlue,
    },
    smallCirle2: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderRadius: 999,
        opacity: 0.5,
        marginTop: -50,
        marginLeft: 220,
        zIndex: -8,
        backgroundColor: colors.whiteBlue,
    },
    smallCirle3: {
        position: 'absolute',
        width: 15,
        height: 15,
        borderRadius: 999,
        opacity: 0.8,
        marginTop: -51,
        marginLeft: 240,
        zIndex: -8,
        borderColor: colors.whiteBlue,
        borderWidth: 4,
    },
});
