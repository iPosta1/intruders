import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode } from "react";
import { ColorValue, ImageBackground, SafeAreaView } from "react-native";
import { colors } from "../utils/constants";

export const Background = ({ children, colorsArray }: {
    children: Array<ReactNode> | ReactNode,
    colorsArray?: readonly [ColorValue, ColorValue, ...ColorValue[]],
}) => {
    return (<SafeAreaView style={{ flex: 1, justifyContent: 'space-around', alignContent: 'center' }}>
        <LinearGradient
            colors={colorsArray || [colors.gray4, colors.gray1, colors.gray3]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            locations={[0.3, 0.5, 0.8]}
            style={{ flex: 1 }}
        >
            <ImageBackground
                style={{ flex: 1, }}
                imageStyle={{ resizeMode: 'repeat', }}
                source={require('../../assets/bgcell.png')}
            >
                {children}
            </ImageBackground>
        </LinearGradient>
    </SafeAreaView>);
}
