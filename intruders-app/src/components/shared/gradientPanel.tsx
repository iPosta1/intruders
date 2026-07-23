import React from "react";
import { ReactNode } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { colors, dimensions } from "../../utils/constants";
import { Gradient } from "./gradient";

type GradientPanelProps = {
    children: Array<ReactNode> | ReactNode,
    height?: number,
    marginTop?: number,
    marginBottom?: number,
    reverse?: boolean,
    roundTop?: boolean,
    roundBottom?: boolean,
}

export const GradientPanel = ({ children, height, marginTop, reverse, roundTop, roundBottom, marginBottom }: GradientPanelProps) => {
    return (
        <View style={{
            ...styles.container,
            height: height ? height : undefined,
            flex: !height ? 1 : undefined,
            marginTop: marginTop || 0,
            marginBottom: marginBottom || 0,

        }}>
            <Gradient
                colors={reverse ? [colors.gray1, colors.gray2] : [colors.gray2, colors.gray1]}
                style={{
                    ...styles.gradientStyle,
                    height: height ? height : undefined,
                    flex: !height ? 1 : undefined,
                    borderTopLeftRadius: roundTop ? dimensions.radiusSmall : undefined,
                    borderTopRightRadius: roundTop ? dimensions.radiusSmall : undefined,
                    borderBottomLeftRadius: roundBottom ? dimensions.radiusSmall : undefined,
                    borderBottomRightRadius: roundBottom ? dimensions.radiusSmall : undefined,
                }}
            >
                {children}
            </Gradient>

        </View>);
}

const styles = StyleSheet.create({
    container: {
        alignContent: "center",
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: Dimensions.get("screen").width - 20,
        maxWidth: 500,
        borderRadius: dimensions.radiusSmall,
    },
    gradientStyle: {
        alignContent: "center",
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        borderWidth: 0,
    },
});
