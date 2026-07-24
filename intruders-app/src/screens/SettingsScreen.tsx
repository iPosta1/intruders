import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { RootStackParamList } from "../../App";
import { Background } from "../components/background";
import { GameButton } from "../components/shared/gameButton";
import { GradientPanel } from "../components/shared/gradientPanel";
import { LogoScreen } from "../components/shared/logoScreen";
import { AppContext } from "../context";
import { useUserGameId } from "../services/gameService";
import { colors } from "../utils/constants";
import { DELETE, PUT } from "../utils/fetch";
import { LoadingScreen } from "./LoadingScreen";

export const SettingsScreen = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { player, setPlayerName } = React.useContext(AppContext);
    const { data: status, mutate, isLoading: userGameIsLoading } = useUserGameId(player?.id);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState(player?.name || '');
    const [saveMessage, setSaveMessage] = useState('');

    const saveName = async () => {
        const nextName = name.trim().substring(0, 16);
        if (!nextName || nextName === player?.name || isLoading) return;
        setSaveMessage('');
        setIsLoading(true);
        try {
            if (status?.gameId) {
                const response = await PUT('/change-name', { gameId: status.gameId, newName: nextName });
                if (!response.ok) {
                    setSaveMessage('NAME UPDATE FAILED — TRY AGAIN');
                    return;
                }
            }
            setPlayerName(nextName);
            await mutate();
            setName(nextName);
            setSaveMessage('IDENTITY SAVED');
        } catch {
            setSaveMessage('CONNECTION LOST — NAME NOT CHANGED');
        } finally {
            setIsLoading(false);
        }
    };

    const leaveTheGame = async () => {
        if (!status?.gameId || isLoading) return;
        setIsLoading(true);
        try {
            const resp = await DELETE(`/leave-game/${status.gameId}`);
            if (resp.ok) {
                await mutate(null);
                navigation.reset({ index: 0, routes: [{ name: 'MainScreen' }] });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const navigateToDefault = () => {
        if (status?.gameId) {
            navigation.replace('GameScreen', { gameId: status.gameId });
        } else {
            navigation.navigate('MainScreen');
        }
    };

    const canEditName = !status?.gameId || status.status === 'WAITING_PLAYERS_TO_JOIN';
    const canSave = canEditName && !isLoading && !!name.trim() && name.trim() !== player?.name;
    const identityEditor = canEditName ? (
        <View style={styles.identityScreen}>
            <Text style={styles.screenEyebrow}>CHANGE NAME</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                maxLength={16}
                onSubmitEditing={saveName}
                style={styles.nameInput}
                placeholder="ENTER NAME"
                placeholderTextColor={colors.lightGray2}
            />
            <Text
                accessibilityRole="alert"
                style={[
                    styles.saveMessage,
                    saveMessage && saveMessage !== 'IDENTITY SAVED' ? styles.saveError : styles.saveSuccess,
                ]}
            >
                {saveMessage || (canSave ? 'NAME MODIFIED — PRESS SAVE' : 'IDENTITY READY')}
            </Text>
        </View>
    ) : undefined;
    const gameStatusPanel = !!status?.gameId ? (
        <View style={styles.gameStatus}>
            <Text style={styles.gameStatusLabel}>CURRENT GAME</Text>
            <Text style={styles.gameCode}>{status.gameId.toUpperCase()}</Text>
            <Text style={styles.gameStatusHint}>LEAVE RETURNS YOU TO THE TITLE SCREEN</Text>
        </View>
    ) : undefined;
    const screenFooter = (
        <View style={styles.screenFooter}>
            {identityEditor}
            {gameStatusPanel}
        </View>
    );

    return (
        <Background>
            {userGameIsLoading ? <LoadingScreen /> :
                <View style={styles.outside}>
                    <GradientPanel roundBottom roundTop marginTop={5} marginBottom={5}>
                        <View style={styles.deviceContent}>
                            <View style={styles.display}>
                                <LogoScreen text="Settings" typewriter footer={screenFooter} />
                            </View>

                            <View style={styles.controls}>
                                {canEditName && (
                                    <GameButton
                                        size={48}
                                        color={colors.greenDigital}
                                        isEnabled={canSave}
                                        labelBottom={isLoading ? "Saving…" : "Save name"}
                                        labelSize={12}
                                        onPress={saveName}
                                    />
                                )}
                                {!!status?.gameId && (
                                    <GameButton
                                        size={48}
                                        color={colors.red}
                                        isEnabled={!isLoading}
                                        labelBottom="Leave game"
                                        labelSize={12}
                                        onPress={leaveTheGame}
                                    />
                                )}
                                <GameButton
                                    size={48}
                                    color={colors.pureWhite}
                                    isEnabled={!isLoading}
                                    labelBottom="Back"
                                    labelSize={12}
                                    onPress={() => navigation.canGoBack() ? navigation.goBack() : navigateToDefault()}
                                />
                            </View>
                        </View>
                    </GradientPanel>
                </View>
            }
        </Background>
    );
};

const styles = StyleSheet.create({
    outside: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        flex: 1,
        width: '100%',
        paddingHorizontal: 9,
        paddingVertical: 5,
    },
    deviceContent: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        gap: 12,
    },
    display: {
        flex: 1,
        width: '100%',
        minHeight: 0,
    },
    screenFooter: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 14,
    },
    identityScreen: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },
    screenEyebrow: {
        color: colors.phosphorBright,
        fontFamily: 'title',
        fontSize: 13,
        letterSpacing: 1.2,
        textAlign: 'center',
    },
    nameInput: {
        width: '100%',
        maxWidth: 340,
        borderWidth: 1,
        borderColor: colors.phosphor,
        backgroundColor: colors.screenDeep,
        color: colors.phosphorBright,
        fontFamily: 'title',
        fontSize: 18,
        letterSpacing: 1.2,
        textAlign: 'center',
        paddingVertical: 7,
        paddingHorizontal: 12,
    },
    saveMessage: {
        minHeight: 18,
        fontFamily: 'basic',
        fontSize: 12,
        letterSpacing: 0.5,
        textAlign: 'center',
    },
    saveSuccess: {
        color: colors.phosphor,
    },
    saveError: {
        color: colors.red,
    },
    gameStatus: {
        width: '92%',
        minHeight: 70,
        maxWidth: 460,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.casingLight,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 8,
        columnGap: 10,
    },
    gameStatusLabel: {
        color: colors.phosphor,
        fontFamily: 'title',
        fontSize: 14,
        letterSpacing: 0.8,
    },
    gameCode: {
        color: colors.phosphorBright,
        fontFamily: 'title',
        fontSize: 18,
        letterSpacing: 2,
    },
    gameStatusHint: {
        width: '100%',
        color: colors.lightGray2,
        fontFamily: 'basic',
        fontSize: 11,
        letterSpacing: 0.4,
        textAlign: 'center',
    },
    controls: {
        height: 100,
        flexShrink: 0,
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
});
