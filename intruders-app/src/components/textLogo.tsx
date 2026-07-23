import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { colors } from "../context";

export const TextLogo = () => {
    return (<span>
        <Text style={styles.title0}>
            ALIEN
        </Text>
        <Text style={styles.title2}>
            <View style={styles.rectangle2}></View>
            <View style={styles.rectangle2Line}></View>
            {'\ IN'}
        </Text>
        <Text style={styles.title1}>
            TR
        </Text>
        <Text style={styles.title2}>
            <View style={styles.rectangle3}></View>
            <View style={styles.rectangle3Line}></View>
            UDE
        </Text>

        <Text style={styles.title3}>
            <View style={styles.rectangle1}></View>
            <View style={styles.rectangle1Line}></View>
            RS
        </Text>
    </span>);
}

const styles = StyleSheet.create({
    rectangle1: {
        position: "absolute",
        width: 150,
        height: 25,
        opacity: 0.4,
        backgroundColor: '#ff4a80',
        marginLeft: -80,
        marginTop: 20,
    },
    rectangle1Line: {
        position: "absolute",
        width: 300,
        height: 1,
        opacity: 0.3,
        backgroundColor: '#ff4a80',
        marginLeft: -200,
        marginTop: 45,
    },
    rectangle2: {
        position: "absolute",
        width: 140,
        height: 15,
        opacity: 0.5,
        backgroundColor: '#f75d73',
        marginLeft: -80,
        marginTop: -2,
        zIndex: -1,
    },
    rectangle2Line: {
        position: "absolute",
        width: 300,
        height: 1,
        opacity: 0.2,
        backgroundColor: '#f75d73',
        marginLeft: -100,
        marginTop: -3,
        zIndex: -1,
    },
    rectangle3: {
        position: "absolute",
        width: 20,
        height: 130,
        opacity: 0.3,
        backgroundColor: '#ef4369',
        marginLeft: 65,
        marginTop: -10,
        zIndex: -1,
    },
    rectangle3Line: {
        position: "absolute",
        width: 1,
        height: 200,
        opacity: 0.3,
        backgroundColor: '#ef4369',
        marginLeft: 85,
        marginTop: -30,
        zIndex: -1,
    },
    title1: {
        fontSize: 26,
        textAlign: 'left',
        textShadowColor: '#08142a',
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 3,
        letterSpacing: 0.3,
        transform: [
            { scaleY: 1.3 },
        ],
        color: '#f75d73',
        fontFamily: 'title',
    },
    title2: {
        fontSize: 26,
        textAlign: 'left',
        textShadowColor: '#08142a',
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 3,
        letterSpacing: 0.3,
        transform: [
            { scaleY: 1.3 },
        ],
        color: '#ef4369',
        fontFamily: 'title',
    },
    title3: {
        fontSize: 26,
        textAlign: 'left',
        textShadowColor: '#08142a',
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 3,
        letterSpacing: 0.3,
        transform: [
            { scaleY: 1.3 },
        ],
        color: '#ff4a80',
        fontFamily: 'title',
    },
    title0: {
        fontSize: 26,
        textAlign: 'left',
        textShadowColor: colors.blueDark,
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 3,
        letterSpacing: 0.3,
        transform: [
            { scaleY: 1.3 },
        ],
        color: '#7bd1ea',
        fontFamily: 'title',
    },
});