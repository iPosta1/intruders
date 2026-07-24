import React, { ReactNode, useRef } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../utils/constants';

type Props = {
    size: number;
    labelSize?: number;
    color: string;
    isEnabled?: boolean;
    onPress?: () => void;
    onPressIn?: () => void;
    onPressOut?: () => void;
    round?: boolean;
    labelBottom?: string;
    indicator?: boolean;
    sustainPressOnTouch?: boolean;
};

export const GameButtonGroup = ({ children }: { children: ReactNode }) => (
    <View style={styles.group}>{children}</View>
);

export const GameButton = ({ size, color, isEnabled = false, onPress, onPressIn, onPressOut, round, labelBottom, labelSize, indicator = false, sustainPressOnTouch = false }: Props) => {
    const { width } = useWindowDimensions();
    const responsiveLabel = labelSize || Math.max(10, Math.min(13, width / 32));
    const interactive = isEnabled && !!(onPress || onPressIn || onPressOut);
    const activeTouch = useRef(false);
    const releaseTouch = () => {
        if (!activeTouch.current) return;
        activeTouch.current = false;
        onPressOut?.();
    };

    return (
        <View style={[
            styles.wrapper,
            indicator && styles.indicatorWrapper,
            sustainPressOnTouch && ({
                userSelect: 'none',
                WebkitUserSelect: 'none',
                WebkitTouchCallout: 'none',
            } as any),
            { width: indicator ? size : Math.max(size, width <= 390 ? 54 : 58) },
        ]}>
            <LinearGradient
                colors={indicator ? ['#6c746a', '#171b17', '#010201'] : ['#697168', '#242a24', '#050705', '#010201']}
                locations={indicator ? [0, 0.45, 1] : [0, 0.34, 0.72, 1]}
                style={[styles.socket, indicator && styles.indicatorSocket, { width: size, height: size, borderRadius: round ? size : 9 }]}
            >
                <Pressable
                    accessibilityRole={interactive ? 'button' : undefined}
                    accessibilityLabel={labelBottom}
                    disabled={!interactive}
                    onPress={onPress}
                    onPressIn={onPressIn}
                    onPressOut={() => {
                        if (!sustainPressOnTouch || !activeTouch.current) {
                            onPressOut?.();
                        }
                    }}
                    onTouchStart={sustainPressOnTouch ? () => {
                        activeTouch.current = true;
                        onPressIn?.();
                    } : undefined}
                    onTouchEnd={sustainPressOnTouch ? releaseTouch : undefined}
                    onTouchCancel={sustainPressOnTouch ? releaseTouch : undefined}
                    style={({ pressed }) => [
                        styles.button,
                        sustainPressOnTouch && ({
                            touchAction: 'none',
                            userSelect: 'none',
                            WebkitUserSelect: 'none',
                            WebkitTouchCallout: 'none',
                        } as any),
                        {
                            width: size - 10,
                            height: size - 10,
                            borderRadius: round ? size : 5,
                            backgroundColor: color,
                            opacity: isEnabled ? 0.96 : 0.2,
                            transform: [{ translateY: pressed ? 2 : 0 }],
                            shadowColor: isEnabled ? color : '#000',
                            shadowOpacity: isEnabled ? 0.82 : 0.15,
                        },
                        indicator && styles.indicatorButton,
                    ]}
                >
                    <View style={[styles.faceRim, { borderRadius: round ? size : 4 }]} />
                    <View style={[styles.gloss, { borderRadius: round ? size : 4 }]} />
                    <View style={[styles.lowerShade, { borderRadius: round ? size : 4 }]} />
                </Pressable>
            </LinearGradient>
            {!!labelBottom && <Text selectable={false} numberOfLines={2} style={[styles.label, { fontSize: responsiveLabel }]}>{labelBottom.toUpperCase()}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: { alignItems: 'center', marginHorizontal: 3, marginBottom: 0, flexShrink: 1 },
    indicatorWrapper: {
        marginHorizontal: 0,
        marginBottom: 0,
    },
    group: {
        flexDirection: 'row',
        padding: 5,
        marginHorizontal: 3,
        borderRadius: 11,
        backgroundColor: '#0b0e0b',
        borderTopWidth: 1,
        borderTopColor: '#5f695f',
        borderLeftWidth: 1,
        borderLeftColor: '#343b34',
        borderRightWidth: 2,
        borderRightColor: '#020302',
        borderBottomWidth: 3,
        borderBottomColor: '#010201',
        shadowColor: '#000',
        shadowOpacity: 0.75,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
    },
    socket: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderTopColor: '#737b70',
        borderBottomColor: '#000',
        shadowColor: '#000',
        shadowOpacity: 0.85,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 },
    },
    indicatorSocket: {
        borderWidth: 1,
        borderTopColor: '#8a9286',
        borderLeftColor: '#535b52',
        borderRightColor: '#060806',
        borderBottomColor: '#000',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflow: 'hidden',
        borderWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.76)',
        borderLeftColor: 'rgba(255,255,255,0.25)',
        borderRightColor: 'rgba(0,0,0,0.55)',
        borderBottomColor: 'rgba(0,0,0,0.90)',
        shadowRadius: 11,
        shadowOffset: { width: 0, height: 3 },
        elevation: 7,
    },
    indicatorButton: {
        borderWidth: 1,
        shadowRadius: 7,
        shadowOffset: { width: 0, height: 1 },
    },
    gloss: {
        position: 'absolute',
        top: 2,
        left: '7%',
        width: '86%',
        height: '40%',
        marginTop: 2,
        backgroundColor: 'rgba(255,255,255,0.30)',
    },
    faceRim: {
        position: 'absolute',
        top: 1,
        right: 1,
        bottom: 1,
        left: 1,
        borderWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.22)',
        borderBottomColor: 'rgba(0,0,0,0.48)',
    },
    lowerShade: {
        position: 'absolute',
        left: '5%',
        right: '5%',
        bottom: 1,
        height: '30%',
        backgroundColor: 'rgba(0,0,0,0.18)',
    },
    label: {
        minHeight: 25,
        marginTop: 4,
        lineHeight: 13,
        color: colors.phosphorBright,
        fontFamily: 'basic',
        letterSpacing: 0.7,
        textAlign: 'center',
        textShadowColor: 'rgba(124,255,155,0.55)',
        textShadowRadius: 4,
        textShadowOffset: { width: 0, height: 0 },
    },
});
