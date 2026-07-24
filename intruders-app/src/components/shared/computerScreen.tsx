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
    fill?: boolean;
};

export const ComputerScreen = ({ children, width = '100%', height, marginTop = 0, maxWidth, maxHeight, marginBottom = 0, embedded = false, fill = false }: Props) => {
    const glass = (
        <View style={[styles.glass, embedded && styles.embeddedGlass]}>
            <View style={styles.content}>{children}</View>
            <View pointerEvents="none" style={styles.curvedTop} />
            <View pointerEvents="none" style={styles.curvedBottom} />
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
    <View style={[styles.shell, fill && styles.fill, { width, height, marginTop, marginBottom, maxWidth, maxHeight }]}>
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
        backgroundColor: '#080b09',
        borderWidth: 1,
        borderTopColor: '#5f695e',
        borderLeftColor: '#394239',
        borderRightColor: '#030504',
        borderBottomColor: '#010201',
        shadowColor: '#000',
        shadowOpacity: 0.95,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 11 },
        elevation: 12,
    },
    fill: {
        flex: 1,
        minHeight: 0,
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
        backgroundColor: '#313b32',
        borderTopWidth: 3,
        borderTopColor: '#758174',
        borderLeftWidth: 2,
        borderLeftColor: '#536054',
        borderRightWidth: 3,
        borderRightColor: '#101511',
        borderBottomWidth: 5,
        borderBottomColor: '#030504',
    },
    bevelInner: {
        flex: 1,
        padding: 7,
        borderRadius: 20,
        backgroundColor: '#070a08',
        borderTopWidth: 3,
        borderTopColor: '#111812',
        borderLeftWidth: 3,
        borderLeftColor: '#0d120e',
        borderRightWidth: 2,
        borderRightColor: '#000',
        borderBottomWidth: 4,
        borderBottomColor: '#000',
        shadowColor: '#000',
        shadowOpacity: 0.9,
        shadowRadius: 8,
    },
    glass: {
        flex: 1,
        minHeight: 92,
        overflow: 'hidden',
        borderRadius: 16,
        backgroundColor: colors.screenDeep,
        borderWidth: 1,
        borderTopColor: '#4f8f61',
        borderLeftColor: '#275f3b',
        borderRightColor: '#07150c',
        borderBottomColor: '#020604',
        shadowColor: colors.phosphor,
        shadowOpacity: 0.38,
        shadowRadius: 17,
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
        backgroundColor: 'rgba(215,255,225,0.075)',
        transform: [{ rotate: '-4deg' }],
        zIndex: 4,
    },
    vignette: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        borderWidth: 12,
        borderColor: 'rgba(0,0,0,0.34)',
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
        opacity: 0.22,
        zIndex: 5,
    },
    scanline: {
        height: 1,
        width: '100%',
        backgroundColor: '#000',
    },
    curvedTop: {
        position: 'absolute',
        top: -30,
        left: '4%',
        width: '92%',
        height: 62,
        borderRadius: 100,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(124,255,155,0.10)',
        backgroundColor: 'rgba(160,255,184,0.025)',
        zIndex: 3,
    },
    curvedBottom: {
        position: 'absolute',
        bottom: -38,
        left: '3%',
        width: '94%',
        height: 70,
        borderRadius: 100,
        backgroundColor: 'rgba(0,0,0,0.24)',
        zIndex: 3,
    },
});
