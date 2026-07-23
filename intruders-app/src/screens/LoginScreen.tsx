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

    return (
        <Background>
            <View style={styles.outside}>
                <GradientPanel roundBottom roundTop marginTop={10} marginBottom={10}>
                    <View style={styles.container}>
                        <LogoScreen text="What should we call you?" />
                        <TextInput
                            autoFocus
                            maxLength={16}
                            placeholder="Your name"
                            placeholderTextColor={colors.lightGray2}
                            value={name}
                            onChangeText={setName}
                            onSubmitEditing={() => normalizedName && setPlayerName(normalizedName)}
                            style={styles.input}
                        />
                        <GameButton
                            color={colors.greenDigital}
                            size={50}
                            isEnabled={!!normalizedName}
                            labelBottom="Continue"
                            labelSize={12}
                            onPress={() => setPlayerName(normalizedName)}
                        />
                    </View>
                </GradientPanel>
            </View>
        </Background>
    );
};

const styles = StyleSheet.create({
    outside: {
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        gap: 24,
    },
    input: {
        width: 240,
        borderWidth: 2,
        borderColor: colors.greenDigital,
        backgroundColor: colors.screenColor,
        color: colors.greenDigital,
        fontFamily: 'title',
        fontSize: 18,
        padding: 12,
        textAlign: 'center',
    },
});
