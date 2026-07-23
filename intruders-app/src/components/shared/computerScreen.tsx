import React from 'react'
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { colors, dimensions } from "../../utils/constants";
import { Gradient } from "./gradient";

type ComputerScreenProps = {
    children: Array<ReactNode> | ReactNode,
    width?: number,
    height?: number,
    marginTop?: number,
    marginBottom?: number,
    maxWidth?: number,
    maxHeight?: number,
}

export const ComputerScreen = ({ children, width, height, marginTop, maxWidth, maxHeight, marginBottom }: ComputerScreenProps) => {
    return (
        <View style={{
            ...styles.windowOutside,
            height: height ? height : undefined,
            flex: height ? undefined : 1,
            marginTop: marginTop || 0,
            width: width,
            maxWidth: maxWidth,
            maxHeight: maxHeight,
            marginBottom: marginBottom || 0,
        }}>
            <Gradient
                colors={[colors.gray4, colors.gray]}
                style={styles.gradientStyle}
            >
                <View style={styles.windowContainer}>
                    <View style={styles.softwareContainer}>
                        {children}
                    </View>
                </View>
            </Gradient>
        </View>);
}

const styles = StyleSheet.create({
    windowOutside: {
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        zIndex: 1,
    },
    gradientStyle: {
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        borderRadius: dimensions.radiusSmall,
        borderColor: colors.gray1,
        shadowColor: colors.gray1,
        shadowOffset: { width: 1, height: 1 },
        padding: 10,
        width: '100%',
        maxWidth: 490,
        zIndex: 1,
    },
    windowContainer: {
        flex: 1,
        backgroundColor: colors.screenColor,
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: dimensions.radiusSmall,
        width: '100%',
        padding: 7,
    },
    softwareContainer: {
        borderWidth: 1,
        borderColor: colors.greenDigital,
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.greenDigital,
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 1,
        flex: 1,
        width: '100%',
    },
});