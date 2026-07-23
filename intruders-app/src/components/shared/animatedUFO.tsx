import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Animated, StyleSheet, Easing, LayoutAnimation, Text } from 'react-native';
import { colors } from '../../utils/constants';

export const AnimatedUFO = ({ customText, starLength }: { customText?: string, starLength: number }) => {
    const { position } = useMemo(() => ({
        position: new Animated.Value(0)
    }), []);
    const { rotation } = useMemo(() => ({
        rotation: new Animated.Value(0)
    }), []);
    const { opacity1 } = useMemo(() => ({
        opacity1: new Animated.Value(0)
    }), []);
    const { margin1 } = useMemo(() => ({
        margin1: new Animated.Value(-20)
    }), []);
    const { opacity2 } = useMemo(() => ({
        opacity2: new Animated.Value(0)
    }), []);
    const { margin2 } = useMemo(() => ({
        margin2: new Animated.Value(-25)
    }), []);
    const { opacity3 } = useMemo(() => ({
        opacity3: new Animated.Value(0)
    }), []);
    const { margin3 } = useMemo(() => ({
        margin3: new Animated.Value(-35)
    }), []);
    const { opacity4 } = useMemo(() => ({
        opacity4: new Animated.Value(0)
    }), []);
    const { margin4 } = useMemo(() => ({
        margin4: new Animated.Value(-25)
    }), []);
    const { opacity5 } = useMemo(() => ({
        opacity5: new Animated.Value(0)
    }), []);
    const { margin5 } = useMemo(() => ({
        margin5: new Animated.Value(-20)
    }), []);
    const { star1 } = useMemo(() => ({
        star1: new Animated.Value(0)
    }), []);
    const { star1Opacity } = useMemo(() => ({
        star1Opacity: new Animated.Value(0)
    }), []);
    const { star2 } = useMemo(() => ({
        star2: new Animated.Value(0)
    }), []);
    const { star2Opacity } = useMemo(() => ({
        star2Opacity: new Animated.Value(0)
    }), []);
    const { star3 } = useMemo(() => ({
        star3: new Animated.Value(0)
    }), []);
    const { star3Opacity } = useMemo(() => ({
        star3Opacity: new Animated.Value(0)
    }), []);
    const { star4 } = useMemo(() => ({
        star4: new Animated.Value(0)
    }), []);
    const { star4Opacity } = useMemo(() => ({
        star4Opacity: new Animated.Value(0)
    }), []);
    const { star5 } = useMemo(() => ({
        star5: new Animated.Value(0)
    }), []);
    const { star5Opacity } = useMemo(() => ({
        star5Opacity: new Animated.Value(0)
    }), []);
    useEffect(() => {
        // line 1
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity1, {
                    toValue: 0.7,
                    duration: 100,
                    delay: 100,
                    useNativeDriver: false
                }),
                Animated.timing(opacity1, {
                    toValue: 0,
                    duration: 900,
                    useNativeDriver: false
                })
            ]),
            {
                iterations: -1
            }
        ).start();
        Animated.loop(
            Animated.timing(margin1, {
                toValue: -40,
                delay: 200,
                duration: 900,
                useNativeDriver: false
            })
        ).start();

        // line 2
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity2, {
                    toValue: 0.7,
                    duration: 100,
                    delay: 300,
                    useNativeDriver: false
                }),
                Animated.timing(opacity2, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: false
                })
            ]),
            {
                iterations: -1
            }
        ).start();
        Animated.loop(
            Animated.timing(margin2, {
                toValue: -45,
                delay: 400,
                duration: 800,
                useNativeDriver: false
            })
        ).start();

        // line 3
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity3, {
                    toValue: 0.7,
                    duration: 100,
                    delay: 1200,
                    useNativeDriver: false
                }),
                Animated.timing(opacity3, {
                    toValue: 0,
                    duration: 700,
                    useNativeDriver: false
                })
            ]),
            {
                iterations: -1
            }
        ).start();
        Animated.loop(
            Animated.timing(margin3, {
                toValue: -75,
                delay: 1300,
                duration: 700,
                useNativeDriver: false
            })
        ).start();

        // line 4
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity4, {
                    toValue: 0.7,
                    duration: 100,
                    delay: 0,
                    useNativeDriver: false
                }),
                Animated.timing(opacity4, {
                    toValue: 0,
                    duration: 700,
                    useNativeDriver: false
                })
            ]),
            {
                iterations: -1
            }
        ).start();
        Animated.loop(
            Animated.timing(margin4, {
                toValue: -80,
                delay: 100,
                duration: 700,
                useNativeDriver: false
            })
        ).start();

        // line 5
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity5, {
                    toValue: 0.7,
                    duration: 100,
                    delay: 1500,
                    useNativeDriver: false
                }),
                Animated.timing(opacity5, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: false
                })
            ]),
            {
                iterations: -1
            }
        ).start();
        Animated.loop(
            Animated.timing(margin5, {
                toValue: -55,
                delay: 1600,
                duration: 500,
                useNativeDriver: false
            })
        ).start();

        // star 1
        Animated.loop(
            Animated.timing(star1, {
                toValue: starLength,
                delay: 1600,
                duration: 200,
                useNativeDriver: false
            })
        ).start();
        Animated.loop(
            Animated.sequence([
                Animated.timing(star1Opacity, {
                    toValue: 1,
                    duration: 0,
                    delay: 1600,
                    useNativeDriver: false
                }),
                Animated.timing(star1Opacity, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: false
                })
            ]),
            {
                iterations: -1
            }
        ).start();
        // star 2
        Animated.loop(
            Animated.timing(star2, {
                toValue: starLength,
                delay: 600,
                duration: 200,
                useNativeDriver: false
            })
        ).start();
        Animated.loop(
            Animated.sequence([
                Animated.timing(star2Opacity, {
                    toValue: 1,
                    duration: 0,
                    delay: 600,
                    useNativeDriver: false
                }),
                Animated.timing(star2Opacity, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: false
                })
            ]),
            {
                iterations: -1
            }
        ).start();
        // star 3
        Animated.loop(
            Animated.timing(star3, {
                toValue: starLength,
                delay: 1800,
                duration: 200,
                useNativeDriver: false
            })
        ).start();
        Animated.loop(
            Animated.sequence([
                Animated.timing(star3Opacity, {
                    toValue: 1,
                    duration: 0,
                    delay: 1800,
                    useNativeDriver: false
                }),
                Animated.timing(star3Opacity, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: false
                })
            ]),
            {
                iterations: -1
            }
        ).start();
        // star 4
        Animated.loop(
            Animated.timing(star4, {
                toValue: starLength,
                delay: 200,
                duration: 200,
                useNativeDriver: false
            })
        ).start();
        Animated.loop(
            Animated.sequence([
                Animated.timing(star4Opacity, {
                    toValue: 1,
                    duration: 0,
                    delay: 200,
                    useNativeDriver: false
                }),
                Animated.timing(star4Opacity, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: false
                })
            ]),
            {
                iterations: -1
            }
        ).start();
        // star 5
        Animated.loop(
            Animated.timing(star5, {
                toValue: starLength,
                delay: 2000,
                duration: 200,
                useNativeDriver: false
            })
        ).start();
        Animated.loop(
            Animated.sequence([
                Animated.timing(star5Opacity, {
                    toValue: 1,
                    duration: 0,
                    delay: 2000,
                    useNativeDriver: false
                }),
                Animated.timing(star5Opacity, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: false
                })
            ]),
            {
                iterations: -1
            }
        ).start();

        // ufo animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(position, {
                    toValue: 5,
                    duration: 200,

                    useNativeDriver: false
                }),
                Animated.timing(position, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: false
                })
            ]),
            {
                iterations: -1
            }
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(rotation, {
                    toValue: 5,
                    duration: 500,

                    useNativeDriver: false
                }),
                Animated.timing(rotation, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: false
                })
            ]),
            {
                iterations: -1
            }
        ).start();
    }, []);

    return (
        <View style={style.container}>
            <View style={style.loadingContainer}>
                <View style={style.item}>
                    <Animated.Image source={require('../../../assets/ufo.png')} style={{
                        ...style.image, marginTop: position, transform: [{
                            rotateZ: rotation.interpolate({
                                inputRange: [0, 360],
                                outputRange: ['0deg', '360deg']
                            })
                        }]
                    }} />
                </View>
                <Animated.View style={{ ...style.ufoLine1, opacity: opacity1, marginLeft: margin1 }} />
                <Animated.View style={{ ...style.ufoLine2, opacity: opacity2, marginLeft: margin2 }} />
                <Animated.View style={{ ...style.ufoLine3, opacity: opacity3, marginLeft: margin3 }} />
                <Animated.View style={{ ...style.ufoLine4, opacity: opacity4, marginLeft: margin4 }} />
                <Animated.View style={{ ...style.ufoLine5, opacity: opacity5, marginLeft: margin5 }} />
                {customText && <Text style={style.loadText}>{customText}</Text>}
                
            </View>
            <Animated.View style={{ ...style.starLine1, marginRight: star1, opacity: star1Opacity, right: starLength/2*-1 }} />
            <Animated.View style={{ ...style.starLine2, marginRight: star2, opacity: star2Opacity, right: starLength/2*-1 }} />
            <Animated.View style={{ ...style.starLine3, marginRight: star3, opacity: star3Opacity, right: starLength/2*-1 }} />
            <Animated.View style={{ ...style.starLine4, marginRight: star4, opacity: star4Opacity, right: starLength/2*-1 }} />
            <Animated.View style={{ ...style.starLine5, marginRight: star5, opacity: star5Opacity, right: starLength/2*-1 }} />
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        opacity: 0.8,
        zIndex: 1,
    },
    loadingContainer: {
        height: 80,
    },
    loadText: {
        fontFamily: 'title',
        color: colors.greenDigital,
        fontSize: 16,
        textAlign: 'center',
        zIndex: 1,
    },
    item: {
        flex: 1,
    },
    image: {
        width: 50,
        height: 40,
        marginLeft: 10,
        zIndex: 2,
        tintColor: colors.greenDigital,
    },
    ufoLine1: {
        height: 1,
        width: 25,
        backgroundColor: colors.greenDigital,
        position: 'absolute',
        marginTop: 20,
        zIndex: 1
    },
    ufoLine2: {
        height: 1,
        width: 30,
        backgroundColor: colors.greenDigital,
        position: 'absolute',
        marginTop: 25,
        zIndex: 1
    },
    ufoLine3: {
        height: 1,
        width: 35,
        backgroundColor: colors.greenDigital,
        position: 'absolute',
        marginTop: 30,
        zIndex: 1
    },
    ufoLine4: {
        height: 1,
        width: 40,
        backgroundColor: colors.greenDigital,
        position: 'absolute',
        marginTop: 15,
        zIndex: 1
    },
    ufoLine5: {
        height: 1,
        width: 35,
        backgroundColor: colors.greenDigital,
        position: 'absolute',
        marginTop: 35,
        zIndex: 1
    },
    starLine1: {
        height: 2,
        width: 35,
        backgroundColor: colors.greenDigital,
        position: 'absolute',
        marginTop: 45,
        zIndex: 0,
        right: -50,
        overflow: 'hidden',
    },
    starLine2: {
        height: 2,
        width: 45,
        backgroundColor: colors.greenDigital,
        position: 'absolute',
        marginTop: 35,
        zIndex: 0,
        right: -55,
        overflow: 'hidden',
    },
    starLine3: {
        height: 2,
        width: 55,
        backgroundColor: colors.greenDigital,
        position: 'absolute',
        marginTop: -75,
        zIndex: 0,
        right: -75,
        overflow: 'hidden',
    },
    starLine4: {
        height: 2,
        width: 55,
        backgroundColor: colors.greenDigital,
        position: 'absolute',
        marginTop: 100,
        zIndex: 0,
        right: -75,
        overflow: 'hidden',
    },
    starLine5: {
        height: 2,
        width: 55,
        backgroundColor: colors.greenDigital,
        position: 'absolute',
        marginTop: -100,
        zIndex: 0,
        right: -75,
        overflow: 'hidden',
    }
});