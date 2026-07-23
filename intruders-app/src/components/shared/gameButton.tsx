import React, { ReactNode } from 'react';
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
};

export const GameButtonGroup = ({ children }: { children: ReactNode }) => (
    <View style={styles.group}>{children}</View>
);

export const GameButton = ({ size, color, isEnabled = false, onPress, onPressIn, onPressOut, round, labelBottom, labelSize }: Props) => {
    const { width } = useWindowDimensions();
    const responsiveLabel = labelSize || Math.max(11, Math.min(13, width / 32));
    const interactive = isEnabled && !!(onPress || onPressIn || onPressOut);

    return (
        <View style={[styles.wrapper, { width: Math.max(size, 58) }]}>
            <LinearGradient colors={['#495149', '#101410', '#030403']} style={[styles.socket, { width: size, height: size, borderRadius: round ? size : 9 }]}>
                <Pressable
                    accessibilityRole={interactive ? 'button' : undefined}
                    accessibilityLabel={labelBottom}
                    disabled={!interactive}
                    onPress={onPress}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    style={({ pressed }) => [
                        styles.button,
                        {
                            width: size - 10,
                            height: size - 10,
                            borderRadius: round ? size : 5,
                            backgroundColor: color,
                            opacity: isEnabled ? 0.96 : 0.2,
                            transform: [{ translateY: pressed ? 2 : 0 }],
                            shadowColor: isEnabled ? color : '#000',
                            shadowOpacity: isEnabled ? 0.65 : 0.15,
                        },
                    ]}
                >
                    <View style={[styles.gloss, { borderRadius: round ? size : 4 }]} />
                </Pressable>
            </LinearGradient>
            {!!labelBottom && <Text numberOfLines={2} style={[styles.label, { fontSize: responsiveLabel }]}>{labelBottom.toUpperCase()}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: { alignItems: 'center', marginHorizontal: 4, marginBottom: 7 },
    group: {
        flexDirection: 'row',
        padding: 5,
        marginHorizontal: 3,
        borderRadius: 11,
        backgroundColor: '#141914',
        borderTopWidth: 1,
        borderTopColor: '#4d574e',
        borderBottomWidth: 2,
        borderBottomColor: '#030403',
    },
    socket: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderTopColor: '#737b70',
        borderBottomColor: '#000',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflow: 'hidden',
        borderWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.65)',
        borderBottomColor: 'rgba(0,0,0,0.75)',
        shadowRadius: 9,
        elevation: 5,
    },
    gloss: {
        width: '86%',
        height: '42%',
        marginTop: 2,
        backgroundColor: 'rgba(255,255,255,0.24)',
    },
    label: {
        minHeight: 23,
        marginTop: 5,
        color: colors.phosphorBright,
        fontFamily: 'basic',
        letterSpacing: 0.7,
        textAlign: 'center',
    },
});
