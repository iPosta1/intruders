import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, ViewStyle } from "react-native";
import { colors } from "../../utils/constants";

type AnimatedCursorProps = {
    style?: ViewStyle,
}

export const AnimatedCursor = ({ style }: AnimatedCursorProps) => {

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
