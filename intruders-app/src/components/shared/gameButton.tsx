import React, { ReactNode, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, dimensions } from "../../utils/constants";
import { blurIcon } from "../icons";
import { Gradient } from "./gradient";

const BlurLight = ({ size, color }: { size: number, color: string }) =>
    (<Image source={blurIcon} style={{ height: size, width: size, tintColor: color }}></Image>);

type GameButtonProps = {
    size: number,
    labelSize?: number,
    color: string,
    isEnabled?: boolean,
    onPress?: () => void,
    onPressIn?: () => void,
    onPressOut?: () => void,
    round?: boolean,
    labelBottom?: string,
    indicator?: boolean,
};

export const GameButtonGroup = ({ children }: { children: Array<ReactNode> | ReactNode }) => {
    return (<View>
        <Gradient
            colors={[colors.gray4, colors.gray2]}
            style={styles.gradientStyle}
        >
            {children}
        </Gradient>
    </View>);
}

export const GameButton = ({ size, color, isEnabled, onPress, onPressIn, onPressOut, round, labelBottom, indicator, labelSize }: GameButtonProps) => {
    const buttonLabelSize = labelSize || (size <= 30 ? dimensions.smallTextMinimum : dimensions.smallTextMaximum);

    const [numberOfClicks, setNumberOfClicks] = useState(0);

    return (<View style={{ ...styles.outerBG, width: size, height: size + 10 }}>
        <Gradient
            colors={indicator ? [colors.gray2, colors.gray1] : [colors.gray3, colors.black]}
            style={{
                ...styles.gradientStyleOutside, width: size, height: size,
                borderRadius: round ? 100 : styles.gradientStyleOutside.borderRadius
            }}
        >
            {
                isEnabled &&
                <View style={{ ...styles.light, width: size / 2, height: size / 2 }}><BlurLight size={size * 1.6} color={color} /></View>
            }
            {
                isEnabled &&
                <View style={{ ...styles.light, width: size / 2, height: size / 2 }}><BlurLight size={size * 1.2} color={color} /></View>
            }
            {
                (!!onPress || !!onPressIn || !!onPressOut) && isEnabled ?
                    <TouchableOpacity onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}
                        style={{
                            ...styles.buttonOuter,
                            width: size - 8,
                            height: size - 8,
                            backgroundColor: color,
                            borderRadius: round ? 100 : styles.buttonOuter.borderRadius
                        }}>
                        <View style={{
                            ...styles.buttonInner,
                            width: size - 12,
                            height: size - 12,
                            backgroundColor: color,
                            borderRadius: round ? 100 : styles.buttonInner.borderRadius
                        }}>
                        </View>
                    </TouchableOpacity> :
                    <View style={{
                        ...styles.buttonOuter,
                        width: size - 8,
                        height: size - 8,
                        backgroundColor: color,
                        borderRadius: round ? 100 : styles.buttonOuter.borderRadius
                    }}>
                        <View style={{
                            ...styles.buttonInner,
                            width: size - 12,
                            height: size - 12,
                            backgroundColor: color,
                            borderRadius: round ? 100 : styles.buttonInner.borderRadius
                        }}>
                        </View>
                    </View>
            }
        </Gradient>
        {!!labelBottom &&
            <Text style={{ ...styles.labelText, fontSize: buttonLabelSize }}>{labelBottom}</Text>
        }
    </View>);
}

const styles = StyleSheet.create({
    outerBG: {
        flex: 1,
        alignContent: "center",
        justifyContent: "flex-start",
        alignItems: "center",
        marginHorizontal: 3,
    },
    gradientStyleOutside: {
        borderRadius: 7,
        borderWidth: 1,
        borderTopColor: colors.gray2,
        borderBottomColor: colors.lightGray2,
        borderLeftColor: colors.gray2,
        borderRightColor: colors.lightGray2,
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
    },
    buttonOuter: {
        borderRadius: 3,
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        opacity: 0.4,
    },
    buttonInner: {
        borderRadius: 2,
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: colors.blackTransparent,
        shadowOffset: { width: 2, height: 2 },
        shadowRadius: 5,
        opacity: 1,
    },
    light: {
        position: "absolute",
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
    },
    labelText: {
        color: colors.lightGray1,
        textAlign: 'center'
    },
    gradientStyle: {
        borderRadius: dimensions.radiusSmall,
        borderColor: colors.gray1,
        shadowColor: colors.gray1,
        shadowOffset: { width: 1, height: 1 },
        padding: 5,
        paddingBottom: 8,
        flexDirection: 'row',
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 3,
    }
});