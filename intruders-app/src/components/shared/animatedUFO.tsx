import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../utils/constants';

export const AnimatedUFO = ({ customText }: { customText?: string, starLength: number }) => {
    const isFocused = useIsFocused();
    const float = useRef(new Animated.Value(0)).current;
    const glow = useRef(new Animated.Value(0.45)).current;

    useEffect(() => {
        if (!isFocused) return;
        const animation = Animated.loop(Animated.parallel([
            Animated.sequence([
                Animated.timing(float, { toValue: -5, duration: 1100, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
                Animated.timing(float, { toValue: 4, duration: 1100, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
            ]),
            Animated.sequence([
                Animated.timing(glow, { toValue: 0.9, duration: 1100, useNativeDriver: true }),
                Animated.timing(glow, { toValue: 0.45, duration: 1100, useNativeDriver: true }),
            ]),
        ]));
        animation.start();
        return () => animation.stop();
    }, [float, glow, isFocused]);

    return (
        <View style={styles.container}>
            <Animated.View style={{ transform: [{ translateY: float }], opacity: glow }}>
                <Image source={require('../../../assets/ufo.png')} style={styles.image} />
                <View style={styles.beam} />
            </Animated.View>
            {!!customText && <Text style={styles.text}>{customText}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 92,
    },
    image: {
        width: 54,
        height: 42,
        tintColor: colors.phosphor,
    },
    beam: {
        alignSelf: 'center',
        width: 34,
        height: 2,
        marginTop: 3,
        backgroundColor: colors.phosphor,
        shadowColor: colors.phosphor,
        shadowOpacity: 0.8,
        shadowRadius: 8,
    },
    text: {
        marginTop: 10,
        color: colors.phosphor,
        fontFamily: 'title',
        fontSize: 14,
        letterSpacing: 1.4,
        textAlign: 'center',
    },
});
