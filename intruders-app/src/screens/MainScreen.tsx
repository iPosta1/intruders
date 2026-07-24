import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TextInput, View, useWindowDimensions } from "react-native";
import { Background } from "../components/background";
import { AppContext } from "../context";
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
import { useSWRConfig } from "swr";

export const MainScreen = () => {
    const isFocused = useIsFocused();
    const { player } = React.useContext(AppContext);
    const { width } = useWindowDimensions();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { mutate: mutateCache } = useSWRConfig();
    const [value, setValue] = useState('');
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
                await Promise.all([
                    mutateCache(['/find-game', player?.id], status.data, { revalidate: false }),
                    mutateCache([`/status/${createdGameId}`, player?.id], status.data, { revalidate: false }),
                ]);
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
                const joinedGameState = status.data || { gameId: joinedGameId };
                await Promise.all([
                    mutateCache(['/find-game', player?.id], joinedGameState, { revalidate: false }),
                    mutateCache([`/status/${joinedGameId}`, player?.id], joinedGameState, { revalidate: false }),
                ]);
                navigation.replace('GameScreen', { gameId: joinedGameId });
            }
        } finally {
            setIsLoading(false);
        }
    }

    const onChangeText = (input: string) => {
        const gameCode = input.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase();
        setValue(gameCode);
        if (gameCode.length === 4) {
            return onJoinGame(gameCode);
        }
    }

    const joinPanel = (
        <View style={styles.joinGameContainer}>
            <View style={styles.codeControl}>
                <Text style={[styles.gameCodeText, { fontSize: Math.max(13, Math.min(17, width / 24)) }]}>
                    ENTER 4-DIGIT GAME CODE
                </Text>
                <TextInput
                    autoCapitalize="characters"
                    autoCorrect={false}
                    maxLength={4}
                    placeholder="CODE"
                    placeholderTextColor={colors.lightGray2}
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType="default"
                    textContentType="name"
                    style={styles.codeInput}
                />
            </View>
        </View>
    );

    return (<Background>
        {isLoading && <LoadingScreen />}
        {!isLoading &&
            <View style={styles.outside}>
                <GradientPanel roundBottom roundTop marginTop={10} marginBottom={10}>
                    <View style={styles.container}>
                        <View style={styles.display}>
                            <LogoScreen
                                text="Join the game or create a new one"
                                typewriter
                                footer={joinPanel}
                            />
                        </View>
                        <View style={styles.buttonArea}>
                            <GameButton color={colors.amber} size={50} isEnabled labelBottom="Settings"
                                onPress={() => navigation.navigate('SettingsScreen')} />
                            <GameButton color={colors.greenDigital} size={54} isEnabled labelBottom="Create game"
                                onPress={() => onCreateGame()} />
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
        width: '100%',
        paddingHorizontal: 9,
    },
    container: {
        alignContent: "center",
        justifyContent: 'flex-start',
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
    joinGameContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    codeControl: {
        width: '90%',
        maxWidth: 340,
        alignItems: 'stretch',
    },
    buttonArea: {
        alignSelf: 'stretch',
        height: 100,
        flexShrink: 0,
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: 'center',
        gap: 8,
    },
    gameCodeText: {
        alignSelf: 'stretch',
        color: colors.lightGray1,
        fontSize: 18,
        letterSpacing: 1.2,
        fontFamily: 'title',
        textAlign: 'left',
    },
    codeInput: {
        alignSelf: 'stretch',
        marginTop: 8,
        borderWidth: 1,
        borderColor: colors.phosphor,
        backgroundColor: 'rgba(0, 8, 4, 0.72)',
        color: colors.phosphorBright,
        fontFamily: 'title',
        fontSize: 24,
        letterSpacing: 9,
        paddingVertical: 11,
        paddingHorizontal: 12,
        textAlign: 'center',
        shadowColor: colors.phosphor,
        shadowOpacity: 0.55,
        shadowRadius: 8,
    },
});
