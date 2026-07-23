import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Background } from "../components/background";
import { AppContext } from "../context";
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { StackNavigationProp } from "@react-navigation/stack";
import { POST } from "../utils/fetch";
import { useTokenId, useUserGameId } from "../services/gameService";
import { LoadingScreen } from "./LoadingScreen";
import { GradientPanel } from "../components/shared/gradientPanel";
import { LogoScreen } from "../components/shared/logoScreen";
import { GameButton, GameButtonGroup } from "../components/shared/gameButton";
import { colors } from "../utils/constants";

const CELL_COUNT = 4;

export const MainScreen = () => {
    useIsFocused();
    const { user } = React.useContext(AppContext);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });
    const [isLoading, setIsLoading] = useState(false);
    const { data: token } = useTokenId(user);
    const { data: userGameStatus } = useUserGameId(token);

    if (userGameStatus?.gameId) {
        navigation.navigate('GameScreen', { gameId: userGameStatus.gameId } as any);
    }

    const onCreateGame = async () => {
        setIsLoading(true);
        const status = await POST('/create-game', token);
        if (status.ok) {
            navigation.navigate('GameScreen', { gameId: status.data.gameId } as any);
        }
        setIsLoading(false);
    }

    const onJoinGame = async (gameId: string) => {
        setIsLoading(true);
        const status = await POST('/join-game', token, { gameId: gameId.toLocaleLowerCase() });
        if (status.ok) {
            navigation.navigate('GameScreen', { gameId });
        }
        setIsLoading(false);
    }

    const onChangeText = (input: string) => {
        setValue(input);
        if (input.length === 4) {
            return onJoinGame(input);
        }
    }

    return (<Background>
        {(isLoading || !token) && <LoadingScreen />}
        {!isLoading && !!token &&
            <View style={styles.outside}>
                <GradientPanel roundBottom roundTop marginTop={10} marginBottom={10}>
                    <View style={styles.container}>
                        <LogoScreen text="Join the game or create a new one" />
                        <View style={styles.panelSection}>
                            <View style={styles.joinGameContainer}>
                                <Text style={styles.gameCodeText}>Enter game code:</Text>
                                <View style={styles.joinGameInput}>

                                    <CodeField
                                        ref={ref}
                                        {...props}
                                        // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                                        value={value}
                                        onChangeText={onChangeText}
                                        cellCount={CELL_COUNT}
                                        rootStyle={styles.codeFieldRoot}
                                        keyboardType="default"
                                        textContentType="name"
                                        renderCell={({ index, symbol, isFocused }) => (
                                            <Text
                                                key={index}
                                                style={[styles.cell, isFocused && styles.focusCell]}
                                                onLayout={getCellOnLayoutHandler(index)}>
                                                {symbol || (isFocused ? <Cursor /> : null)}
                                            </Text>
                                        )}
                                    />
                                </View>
                            </View>
                            <View style={styles.button}>
                                <GameButtonGroup>
                                    <GameButton color={colors.pureWhite} size={50} isEnabled labelBottom="Settings"
                                        onPress={() => navigation.navigate('SettingsScreen')} />
                                    <GameButton color={colors.pureWhite} size={50} />
                                </GameButtonGroup>
                                <GameButtonGroup>
                                    <GameButton color={colors.pureWhite} size={50} />
                                    <GameButton color={colors.greenDigital} size={50} isEnabled labelBottom="Create new game"
                                        onPress={() => onCreateGame()} />
                                </GameButtonGroup>
                            </View>
                        </View>
                    </View>
                </GradientPanel>
            </View>
        }

    </Background>);
}

const styles = StyleSheet.create({
    outside: {
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    container: {
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    panelSection: {
        alignContent: "center",
        justifyContent: 'space-around',
        alignItems: 'center',
        flex: 1,
        flexWrap: "wrap",
    },
    joinGameContainer: {
        justifyContent: "flex-start",
        alignContent: 'flex-start',
    },
    joinGameInput: {
        flexDirection: 'row',
        justifyContent: "center",
        alignContent: 'center',
    },
    button: {
        flexDirection: 'row',
        justifyContent: "center",
        alignContent: 'center',
    },
    gameCodeText: {
        color: colors.lightGray1,
        fontSize: 18,
        marginLeft: 10,
    },
    root: { flex: 1, padding: 20 },
    title: { textAlign: 'center', fontSize: 30 },
    codeFieldRoot: { marginTop: 5 },
    cell: {
        width: 50,
        height: 60,
        lineHeight: 38,
        fontSize: 24,
        borderWidth: 2,
        borderColor: colors.lightGray1,
        backgroundColor: colors.screenColor,
        textAlign: 'center',
        fontFamily: 'title',
        fontWeight: 'bold',
        color: colors.greenDigital,
        margin: 8,
        paddingTop: 10,
    },
    focusCell: {
        borderColor: colors.greenDigital,
    },
});