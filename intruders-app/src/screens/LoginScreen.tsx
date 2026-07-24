import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Background } from '../components/background';
import { GameButton } from '../components/shared/gameButton';
import { GradientPanel } from '../components/shared/gradientPanel';
import { LogoScreen } from '../components/shared/logoScreen';
import { AppContext } from '../context';
import { colors } from '../utils/constants';

export const LoginScreen = () => {
    const [name, setName] = useState('');
    const { setPlayerName } = React.useContext(AppContext);
    const normalizedName = name.trim();
    const submitName = () => normalizedName && setPlayerName(normalizedName);

    return (
        <Background>
            <View style={styles.outside}>
                <GradientPanel roundBottom roundTop marginTop={10} marginBottom={10}>
                    <View style={styles.container}>
                        <View style={styles.display}>
                            <LogoScreen
                                text="What should we call you?"
                                typewriter
                                footer={
                                    <TextInput
                                        autoFocus
                                        maxLength={16}
                                        placeholder="YOUR NAME"
                                        placeholderTextColor={colors.lightGray2}
                                        value={name}
                                        onChangeText={setName}
                                        onSubmitEditing={submitName}
                                        style={styles.input}
                                    />
                                }
                            />
                        </View>
                        <View style={styles.buttonArea}>
                            <GameButton
                                color={colors.greenDigital}
                                size={50}
                                isEnabled={!!normalizedName}
                                labelBottom="Continue"
                                labelSize={12}
                                onPress={submitName}
                            />
                        </View>
                    </View>
                </GradientPanel>
            </View>
        </Background>
    );
};

const styles = StyleSheet.create({
    outside: {
        alignContent: 'center',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flex: 1,
        width: '100%',
        paddingHorizontal: 9,
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        width: '100%',
        minWidth: 0,
        gap: 10,
    },
    display: {
        flex: 1,
        width: '100%',
        minHeight: 0,
    },
    buttonArea: {
        width: '100%',
        height: 94,
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: '90%',
        maxWidth: 340,
        borderWidth: 1,
        borderColor: colors.phosphor,
        backgroundColor: 'rgba(0, 8, 4, 0.72)',
        color: colors.phosphorBright,
        fontFamily: 'title',
        fontSize: 20,
        letterSpacing: 1.2,
        paddingVertical: 11,
        paddingHorizontal: 12,
        textAlign: 'center',
        shadowColor: colors.phosphor,
        shadowOpacity: 0.55,
        shadowRadius: 8,
    },
});
