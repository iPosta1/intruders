import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { colors } from "../../utils/constants";

type AnimatedCursorProps = {
    style?: ViewStyle | TextStyle,
    inline?: boolean,
}

export const AnimatedCursor = ({ style, inline = false }: AnimatedCursorProps) => {

    const opacityAnimationValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacityAnimationValue, {
                    toValue: 1,
                    duration: 650,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnimationValue, {
                    toValue: 0,
                    duration: 650,
                    useNativeDriver: true,
                })
            ])
        );
        animation.start();
        return () => animation.stop();
    }, [opacityAnimationValue]);

    if (inline) {
        return <Animated.Text style={[styles.inlineCursor, style as TextStyle, { opacity: opacityAnimationValue }]}>█</Animated.Text>;
    }
    return (<Animated.View style={style ? {...style, opacity: opacityAnimationValue} :  {...styles.cursor,  opacity: opacityAnimationValue}} />);
}

const styles = StyleSheet.create({
    cursor: {
        width: 8,
        height: 10,
        backgroundColor: colors.greenDigital,
        shadowColor: colors.greenDigital,
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 1,
        marginTop: 2,
        marginLeft: 3,
    },
    inlineCursor: {
        color: colors.greenDigital,
        fontFamily: 'title',
        textShadowColor: colors.greenDigital,
        textShadowRadius: 4,
    },
});
