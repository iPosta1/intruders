import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { ViewStyle } from "react-native";

type GradientProps = {
    children: Array<ReactNode> | ReactNode,
    style: ViewStyle,
    colors: string[]
}

export const Gradient = ({ children, style, colors }: GradientProps) => {
    return (
        <LinearGradient
            colors={colors}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            locations={[0.3, 0.8]}
            style={style}
        >
            {children}
        </LinearGradient>);
}
