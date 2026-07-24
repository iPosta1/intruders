import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
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
import { useUserGameId } from "../services/gameService";
import { LoadingScreen } from "./LoadingScreen";
import { GradientPanel } from "../components/shared/gradientPanel";
import { LogoScreen } from "../components/shared/logoScreen";
import { GameButton } from "../components/shared/gameButton";
import { colors } from "../utils/constants";
import { ComputerScreen } from "../components/shared/computerScreen";
import { useSWRConfig } from "swr";

const CELL_COUNT = 4;

export const MainScreen = () => {
    const isFocused = useIsFocused();
    const { player } = React.useContext(AppContext);
    const { width, height } = useWindowDimensions();
    const cellSize = Math.max(36, Math.min(48, (width - 104) / 4));
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { mutate: mutateCache } = useSWRConfig();
    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });
    const [isLoading, setIsLoading] = useState(false);
    const { data: userGameStatus } = useUserGameId(player?.id);
    const redirectedGameId = useRef<string | null>(null);

    useEffect(() => {
        const activeGameId = userGameStatus?.gameId?.trim().toLowerCase();
        if (isFocused && activeGameId && redirectedGameId.current !== activeGameId) {
            redirectedGameId.current = activeGameId;
            navigation.reset({ index: 0, routes: [{ name: 'GameScreen', params: { gameId: activeGameId } }] });
        } else if (!activeGameId) {
            redirectedGameId.current = null;
        }
    }, [isFocused, navigation, userGameStatus?.gameId]);

    const onCreateGame = async () => {
        setIsLoading(true);
        try {
            const status = await POST('/create-game');
            if (status.ok) {
                const createdGameId = status.data.gameId.trim().toLowerCase();
                redirectedGameId.current = createdGameId;
                await mutateCache(['/find-game', player?.id], status.data, { revalidate: false });
                navigation.replace('GameScreen', { gameId: createdGameId });
            }
        } finally {
            setIsLoading(false);
        }
    }

    const onJoinGame = async (gameId: string) => {
        setIsLoading(true);
        try {
            const normalizedGameId = gameId.trim().toLowerCase();
            const status = await POST('/join-game', { gameId: normalizedGameId });
            if (status.ok) {
                const joinedGameId = status.data?.gameId?.trim().toLowerCase() || normalizedGameId;
                redirectedGameId.current = joinedGameId;
                await mutateCache(
                    ['/find-game', player?.id],
                    status.data || { gameId: joinedGameId },
                    { revalidate: false },
                );
                navigation.replace('GameScreen', { gameId: joinedGameId });
            }
        } finally {
            setIsLoading(false);
        }
    }

    const onChangeText = (input: string) => {
        setValue(input);
        if (input.length === 4) {
            return onJoinGame(input);
        }
    }

    return (<Background>
        {isLoading && <LoadingScreen />}
        {!isLoading &&
            <ScrollView contentContainerStyle={styles.outside}>
                <GradientPanel height={Math.max(410, Math.min(620, height - 20))} roundBottom roundTop marginTop={10} marginBottom={10}>
                    <View style={styles.container}>
                        <View style={[styles.logoSlot, { height: Math.max(128, Math.min(220, height * 0.3)) }]}>
                            <LogoScreen text="Join the game or create a new one" />
                        </View>
                        <View style={styles.panelSection}>
                            <ComputerScreen width="94%" maxWidth={430} height={154}>
                                <View style={styles.joinGameContainer}>
                                <Text style={[styles.gameCodeText, { fontSize: Math.max(13, Math.min(17, width / 24)) }]}>ENTER 4-DIGIT GAME CODE</Text>
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
                                            style={[styles.cell, { width: cellSize, height: cellSize + 4, lineHeight: cellSize, fontSize: cellSize * 0.44 }, isFocused && styles.focusCell]}
                                                onLayout={getCellOnLayoutHandler(index)}>
                                                {symbol || (isFocused ? <Cursor /> : null)}
                                            </Text>
                                        )}
                                    />
                                </View>
                                </View>
                            </ComputerScreen>
                            <View style={styles.button}>
                                <GameButton color={colors.amber} size={50} isEnabled labelBottom="Settings"
                                    onPress={() => navigation.navigate('SettingsScreen')} />
                                <GameButton color={colors.greenDigital} size={54} isEnabled labelBottom="Create game"
                                    onPress={() => onCreateGame()} />
                            </View>
                        </View>
                    </View>
                </GradientPanel>
            </ScrollView>
        }

    </Background>);
}

const styles = StyleSheet.create({
    outside: {
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
        paddingHorizontal: 9,
    },
    container: {
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    panelSection: {
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        gap: 8,
    },
    logoSlot: {
        width: "100%",
    },
    joinGameContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
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
        letterSpacing: 1.2,
        fontFamily: 'title',
    },
    root: { flex: 1, padding: 20 },
    title: { textAlign: 'center', fontSize: 30 },
    codeFieldRoot: { marginTop: 5 },
    cell: {
        width: 50,
        height: 60,
        lineHeight: 36,
        fontSize: 24,
        borderWidth: 2,
        borderColor: colors.lightGray1,
        backgroundColor: colors.screenColor,
        textAlign: 'center',
        fontFamily: 'title',
        fontWeight: 'bold',
        color: colors.greenDigital,
        marginHorizontal: 4,
    },
    focusCell: {
        borderColor: colors.greenDigital,
    },
});
