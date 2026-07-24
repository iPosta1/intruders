import React, { ReactNode, useEffect, useState } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { colors } from "../../utils/constants";
import { AnimatedCursor } from "./animatedCursor";
import { AnimatedUFO } from "./animatedUFO";
import { ComputerScreen } from "./computerScreen";

type LogoScreenProps = {
    text: string,
    footer?: ReactNode,
    typewriter?: boolean,
}

export const LogoScreen = ({ text, footer, typewriter = false }: LogoScreenProps) => {
    const { width } = useWindowDimensions();
    const prompt = text.toUpperCase();
    const actionFontSize = Math.max(11, Math.min(15, width / 30));
    const typewriterWidth = Math.min(340, Math.max(76, prompt.length * actionFontSize * 0.72 + 16));
    const [visiblePrompt, setVisiblePrompt] = useState(typewriter ? '' : prompt);

    useEffect(() => {
        if (!typewriter) {
            setVisiblePrompt(prompt);
            return;
        }
        setVisiblePrompt('');
        let index = 0;
        let typingTimer: ReturnType<typeof setInterval> | undefined;
        const startTimer = setTimeout(() => {
            typingTimer = setInterval(() => {
                index += 1;
                setVisiblePrompt(prompt.slice(0, index));
                if (index >= prompt.length && typingTimer) clearInterval(typingTimer);
            }, 58);
        }, 320);
        return () => {
            clearTimeout(startTimer);
            if (typingTimer) clearInterval(typingTimer);
        };
    }, [prompt, typewriter]);

    return (
        <View style={styles.screen}>
            <ComputerScreen fill marginTop={8} width="100%" maxWidth={520}>
                <View style={[styles.screenAnimation, footer ? styles.screenAnimationWithFooter : undefined]}>
                    <AnimatedUFO starLength={Math.max(100, Math.min(240, width - 96))} />
                </View>
                <View style={[styles.screenTitle, footer ? styles.screenTitleWithFooter : undefined]}>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.title, { fontSize: Math.max(14, Math.min(26, width / 21)) }]}>ALIEN INTRUDERS</Text>
                    {!!footer ? (
                        <View style={styles.footerCluster}>
                            <Text style={[
                                styles.actionText,
                                typewriter && styles.typewriterText,
                                { fontSize: actionFontSize },
                                typewriter && { width: typewriterWidth },
                            ]} numberOfLines={2}>{visiblePrompt}<AnimatedCursor inline /></Text>
                            <View style={styles.footer}>{footer}</View>
                        </View>
                    ) : (
                        <Text style={[styles.actionText, { fontSize: actionFontSize }]}>{visiblePrompt}<AnimatedCursor /></Text>
                    )}
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
        justifyContent: 'space-between',
        paddingTop: 4,
        paddingBottom: 8,
    },
    footerCluster: {
        flex: 1,
        width: '100%',
        minHeight: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 14,
    },
    footer: {
        width: '100%',
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
        textShadowColor: 'rgba(124,255,155,0.85)',
        textShadowRadius: 8,
        textShadowOffset: { width: 0, height: 0 },
    },
    actionText: {
        fontFamily: 'title',
        color: colors.greenDigital,
        letterSpacing: 1,
        textAlign: 'center',
        zIndex: 1,
        width: '100%',
        textShadowColor: 'rgba(124,255,155,0.75)',
        textShadowRadius: 6,
        textShadowOffset: { width: 0, height: 0 },
    },
    typewriterText: {
        width: '90%',
        maxWidth: '88%',
        flexShrink: 1,
        textAlign: 'left',
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
