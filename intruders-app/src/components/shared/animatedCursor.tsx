import React, { useEffect, useMemo } from "react";
import { Animated, StyleSheet, ViewStyle } from "react-native";
import { colors } from "../../utils/constants";

type AnimatedCursorProps = {
    style?: ViewStyle,
}

export const AnimatedCursor = ({ style }: AnimatedCursorProps) => {

    const { opacityAnimationValue } = useMemo(() => ({
        opacityAnimationValue: new Animated.Value(0)
    }), []);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacityAnimationValue, {
                    toValue: 1,
                    duration: 500,

                    useNativeDriver: false
                }),
                Animated.timing(opacityAnimationValue, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: false
                })
            ]),
            {
                iterations: -1
            }
        ).start();
    }, []);

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
});
