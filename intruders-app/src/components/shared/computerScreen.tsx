import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../utils/constants';

type Props = {
    children: ReactNode;
    width?: number | `${number}%`;
    height?: number;
    marginTop?: number;
    marginBottom?: number;
    maxWidth?: number;
    maxHeight?: number;
    embedded?: boolean;
};

export const ComputerScreen = ({ children, width = '100%', height, marginTop = 0, maxWidth, maxHeight, marginBottom = 0, embedded = false }: Props) => {
    const glass = (
        <View style={[styles.glass, embedded && styles.embeddedGlass]}>
            <View style={styles.content}>{children}</View>
            <View pointerEvents="none" style={styles.gloss} />
            <View pointerEvents="none" style={styles.vignette} />
            <View pointerEvents="none" style={styles.scanlines}>
                {Array.from({ length: 14 }, (_, index) => <View key={index} style={styles.scanline} />)}
            </View>
        </View>
    );

    if (embedded) {
        return <View style={[styles.embedded, { width, height, marginTop, marginBottom, maxWidth, maxHeight }]}>{glass}</View>;
    }

    return (
    <View style={[styles.shell, { width, height, marginTop, marginBottom, maxWidth, maxHeight }]}>
        <View style={styles.bevelOuter}>
            <View style={styles.bevelInner}>
                {glass}
            </View>
        </View>
    </View>
    );
};

const styles = StyleSheet.create({
    shell: {
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        alignSelf: 'stretch',
        minHeight: 120,
        padding: 3,
        borderRadius: 28,
        backgroundColor: colors.casingDark,
        shadowColor: '#000',
        shadowOpacity: 0.8,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 9 },
        elevation: 12,
    },
    embedded: {
        maxWidth: '100%',
        minWidth: 0,
        alignSelf: 'stretch',
        minHeight: 72,
    },
    embeddedGlass: {
        borderRadius: 10,
        borderWidth: 1,
    },
    bevelOuter: {
        flex: 1,
        padding: 8,
        borderRadius: 25,
        backgroundColor: colors.casingMid,
        borderTopWidth: 2,
        borderTopColor: colors.casingLight,
        borderBottomWidth: 4,
        borderBottomColor: '#050706',
    },
    bevelInner: {
        flex: 1,
        padding: 7,
        borderRadius: 20,
        backgroundColor: '#070b08',
        borderWidth: 2,
        borderColor: '#010302',
    },
    glass: {
        flex: 1,
        minHeight: 92,
        overflow: 'hidden',
        borderRadius: 16,
        backgroundColor: colors.screenDeep,
        borderWidth: 1,
        borderColor: '#28583a',
        shadowColor: colors.phosphor,
        shadowOpacity: 0.24,
        shadowRadius: 13,
    },
    content: {
        flex: 1,
        width: '100%',
        minWidth: 0,
        zIndex: 2,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gloss: {
        position: 'absolute',
        top: -18,
        left: '7%',
        width: '86%',
        height: '42%',
        borderRadius: 100,
        backgroundColor: 'rgba(215,255,225,0.055)',
        transform: [{ rotate: '-4deg' }],
        zIndex: 4,
    },
    vignette: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        borderWidth: 10,
        borderColor: 'rgba(0,0,0,0.28)',
        borderRadius: 16,
        zIndex: 3,
    },
    scanlines: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        justifyContent: 'space-around',
        opacity: 0.16,
        zIndex: 5,
    },
    scanline: {
        height: 1,
        width: '100%',
        backgroundColor: '#000',
    },
});
