import React, { ReactNode } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { colors } from "../../utils/constants";
import { AnimatedCursor } from "./animatedCursor";
import { AnimatedUFO } from "./animatedUFO";
import { ComputerScreen } from "./computerScreen";

type LogoScreenProps = {
    text: string,
    footer?: ReactNode,
}

export const LogoScreen = ({ text, footer }: LogoScreenProps) => {
    const { width } = useWindowDimensions();
    return (
        <View style={styles.screen}>
            <ComputerScreen marginTop={8} width="100%" maxWidth={520}>
                <View style={[styles.screenAnimation, footer ? styles.screenAnimationWithFooter : undefined]}>
                    <AnimatedUFO starLength={Math.max(100, Math.min(240, width - 96))} />
                </View>
                <View style={[styles.screenTitle, footer ? styles.screenTitleWithFooter : undefined]}>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.title, { fontSize: Math.max(14, Math.min(26, width / 21)) }]}>ALIEN INTRUDERS</Text>
                    <Text style={[styles.actionText, { fontSize: Math.max(11, Math.min(15, width / 30)) }]}>{text.toUpperCase()}<AnimatedCursor /></Text>
                    {!!footer && <View style={styles.footer}>{footer}</View>}
                </View>
            </ComputerScreen>
        </View>);
}

const styles = StyleSheet.create({
    screenTitle: {
        alignContent: "center",
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        marginBottom: 10,
        width: '100%',
        minWidth: 0,
    },
    screenAnimation: {
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        flex: 2,
    },
    screenAnimationWithFooter: {
        flex: 1,
        minHeight: 60,
    },
    screenTitleWithFooter: {
        flex: 2,
        justifyContent: 'flex-start',
        gap: 6,
    },
    footer: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    title: {
        fontFamily: 'title',
        color: colors.greenDigital,
        letterSpacing: 2.2,
        textAlign: 'center',
        zIndex: 1,
        width: '100%',
    },
    actionText: {
        fontFamily: 'title',
        color: colors.greenDigital,
        letterSpacing: 1,
        textAlign: 'center',
        zIndex: 1,
        width: '100%',
    },
    screen: {
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        width: '100%',
        minWidth: 0,
    },
});
