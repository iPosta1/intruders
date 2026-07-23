import React, { ReactNode } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../utils/constants';

type Props = {
    children: ReactNode;
    height?: number;
    marginTop?: number;
    marginBottom?: number;
    reverse?: boolean;
    roundTop?: boolean;
    roundBottom?: boolean;
    embedded?: boolean;
};

export const GradientPanel = ({ children, height, marginTop = 0, marginBottom = 0, reverse, embedded = false }: Props) => {
    const { width } = useWindowDimensions();
    if (embedded) {
        return <View style={{ width: '100%', height, marginTop, marginBottom, alignItems: 'center' }}>{children}</View>;
    }
    return (
        <View style={[styles.shadow, { width: Math.max(0, Math.min(width - 18, 560)), height, marginTop, marginBottom, flex: height ? undefined : 1 }]}>
            <LinearGradient
                colors={reverse ? [colors.casingMid, colors.casingDark] : [colors.casingLight, colors.casingMid, colors.casingDark]}
                style={styles.panel}
            >
                <View style={styles.highlight} />
                <View style={styles.inner}>{children}</View>
                <View style={styles.vents}>
                    {Array.from({ length: 8 }, (_, index) => <View key={index} style={styles.vent} />)}
                    <View style={styles.powerLight} />
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    shadow: {
        alignSelf: 'center',
        minWidth: 0,
        maxWidth: 560,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOpacity: 0.86,
        shadowRadius: 22,
        shadowOffset: { width: 0, height: 12 },
        elevation: 16,
    },
    panel: {
        flex: 1,
        width: '100%',
        minWidth: 0,
        minHeight: 260,
        padding: 12,
        paddingBottom: 34,
        borderRadius: 30,
        borderWidth: 2,
        borderTopColor: '#687467',
        borderLeftColor: '#465247',
        borderRightColor: '#101511',
        borderBottomColor: '#080b09',
        overflow: 'hidden',
    },
    highlight: {
        position: 'absolute',
        top: 3,
        left: 30,
        right: 30,
        height: 2,
        backgroundColor: 'rgba(220,240,215,0.18)',
    },
    inner: {
        flex: 1,
        width: '100%',
        minWidth: 0,
        overflow: 'hidden',
        alignItems: 'center',
    },
    vents: {
        position: 'absolute',
        bottom: 11,
        left: 28,
        right: 24,
        height: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    vent: {
        width: 5,
        height: 10,
        borderRadius: 3,
        backgroundColor: '#080b09',
        borderRightWidth: 1,
        borderRightColor: '#596158',
    },
    powerLight: {
        marginLeft: 'auto',
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.amber,
        shadowColor: colors.amber,
        shadowOpacity: 0.9,
        shadowRadius: 8,
    },
});
