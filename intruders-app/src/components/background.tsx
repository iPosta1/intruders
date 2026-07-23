import { LinearGradient } from 'expo-linear-gradient';
import React, { ReactNode } from 'react';
import { ColorValue, ImageBackground, SafeAreaView, StyleSheet, View } from 'react-native';
import { colors } from '../utils/constants';

export const Background = ({ children, colorsArray }: {
    children: ReactNode;
    colorsArray?: readonly [ColorValue, ColorValue, ...ColorValue[]];
}) => (
    <SafeAreaView style={styles.safe}>
        <LinearGradient colors={colorsArray || ['#09110c', '#171d18', '#030504']} style={styles.gradient}>
            <ImageBackground source={require('../../assets/bgcell.png')} resizeMode="repeat" style={styles.texture} imageStyle={styles.textureImage}>
                <View pointerEvents="none" style={styles.ambientTop} />
                <View pointerEvents="none" style={styles.ambientBottom} />
                <View style={styles.content}>{children}</View>
            </ImageBackground>
        </LinearGradient>
    </SafeAreaView>
);

const styles = StyleSheet.create({
    safe: { flex: 1, width: '100%', height: '100%', overflow: 'hidden', backgroundColor: colors.black },
    gradient: { flex: 1 },
    texture: { flex: 1 },
    textureImage: { opacity: 0.1 },
    content: { flex: 1, width: '100%', minWidth: 0, paddingVertical: 8, alignItems: 'center' },
    ambientTop: {
        position: 'absolute',
        top: -100,
        left: '15%',
        width: '70%',
        height: 190,
        borderRadius: 200,
        backgroundColor: 'rgba(90,180,105,0.09)',
    },
    ambientBottom: {
        position: 'absolute',
        bottom: -120,
        left: '-10%',
        width: '120%',
        height: 200,
        borderRadius: 200,
        backgroundColor: 'rgba(35,75,45,0.12)',
    },
});
