import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../utils/constants';

export const AnimatedUFO = ({ customText, starLength }: { customText?: string, starLength: number }) => {
    const isFocused = useIsFocused();
    const hover = useRef(new Animated.Value(0)).current;
    const trailWidth = Math.max(72, Math.min(starLength - 18, 210));
    const particles = useRef(Array.from({ length: 28 }, () => ({
        x: new Animated.Value(0),
        y: new Animated.Value(0),
        opacity: new Animated.Value(0),
        width: new Animated.Value(5),
        height: new Animated.Value(2),
    }))).current;

    useEffect(() => {
        if (!isFocused) return;
        hover.setValue(0);
        let active = true;
        let currentHover = 5;
        const timers = new Set<ReturnType<typeof setTimeout>>();
        const particleAnimations = new Set<Animated.CompositeAnimation>();
        const hoverListener = hover.addListener(({ value }) => {
            currentHover = 5 - value * 10;
        });
        const hoverAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(hover, {
                    toValue: 1,
                    duration: 850,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(hover, {
                    toValue: 0,
                    duration: 850,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ]),
        );

        const emitParticle = (particle: typeof particles[number]) => {
            if (!active) return;
            // Capture the ship's vertical position only at emission time.
            particle.x.setValue(0);
            particle.y.setValue(currentHover + (Math.random() * 8 - 4));
            particle.opacity.setValue(1);
            particle.width.setValue(3 + Math.floor(Math.random() * 7));
            particle.height.setValue(Math.random() > 0.7 ? 3 : 2);
            const travelDuration = 1800 + Math.floor(Math.random() * 600);
            const animation = Animated.parallel([
                Animated.timing(particle.x, {
                    toValue: -trailWidth,
                    duration: travelDuration,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }),
                Animated.timing(particle.opacity, {
                    toValue: 0.36,
                    duration: travelDuration,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }),
            ]);
            particleAnimations.add(animation);
            animation.start(({ finished }) => {
                particleAnimations.delete(animation);
                if (finished) particle.opacity.setValue(0);
            });
        };

        hoverAnimation.start();
        let nextParticle = 0;
        const emitNextParticle = () => {
            if (!active) return;
            emitParticle(particles[nextParticle]);
            nextParticle = (nextParticle + 1) % particles.length;
            const timer = setTimeout(() => {
                timers.delete(timer);
                emitNextParticle();
            }, 85 + Math.floor(Math.random() * 26));
            timers.add(timer);
        };
        emitNextParticle();
        return () => {
            active = false;
            hoverAnimation.stop();
            hover.removeListener(hoverListener);
            timers.forEach(clearTimeout);
            timers.clear();
            particleAnimations.forEach(animation => animation.stop());
            particleAnimations.clear();
            particles.forEach(particle => particle.opacity.setValue(0));
        };
    }, [hover, isFocused, particles, trailWidth]);

    const shipHover = hover.interpolate({
        inputRange: [0, 1],
        outputRange: [5, -5],
    });

    return (
        <View style={[styles.container, { width: starLength }]}>
            <View pointerEvents="none" style={[styles.trailWindow, { width: trailWidth }]}>
                {particles.map((particle, index) => (
                    <Animated.View
                        key={index}
                        style={[
                            styles.pixel,
                            {
                                width: particle.width,
                                height: particle.height,
                                opacity: particle.opacity,
                                transform: [
                                    { translateX: particle.x },
                                    { translateY: particle.y },
                                ],
                            },
                        ]}
                    />
                ))}
            </View>
            <Animated.View style={[styles.ship, { transform: [{ translateY: shipHover }] }]}>
                <Image source={require('../../../assets/ufo.png')} style={styles.image} />
            </Animated.View>
            {!!customText && <Text style={styles.text}>{customText}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 92,
        overflow: 'hidden',
        position: 'relative',
    },
    ship: {
        zIndex: 2,
    },
    image: {
        width: 54,
        height: 42,
        tintColor: colors.phosphor,
    },
    trailWindow: {
        position: 'absolute',
        right: '50%',
        height: 38,
        marginRight: 38,
        top: 27,
        overflow: 'hidden',
    },
    pixel: {
        position: 'absolute',
        right: 0,
        top: 17,
        height: 3,
        backgroundColor: colors.phosphor,
        shadowColor: colors.phosphor,
        shadowOpacity: 0.85,
        shadowRadius: 4,
    },
    text: {
        marginTop: 10,
        color: colors.phosphor,
        fontFamily: 'title',
        fontSize: 14,
        letterSpacing: 1.4,
        textAlign: 'center',
    },
});
