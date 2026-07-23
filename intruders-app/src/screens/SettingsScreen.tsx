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
        setIsLoading(true);
        const resp = await DELETE(`/leave-game/${status.gameId}`);
        if (resp.ok) {
            mutate(null);
            setIsLoading(false);
            navigation.reset({ index: 0, routes: [{ name: 'MainScreen' }] });
        }
    }

    const navigateToDefault = async () => {
        if (status?.gameId) {
            navigation.replace('GameScreen', { gameId: status.gameId });
        } else {
            navigation.navigate('MainScreen');
        }
    }

    return (<Background>
        {userGameIsLoading ? <LoadingScreen /> :
            <View style={styles.outside}>
                <GradientPanel roundBottom roundTop marginTop={10} marginBottom={10}>
                    <LogoScreen text="Settings" />
                    <View style={styles.menu}>
                        <View style={styles.optionsGroup}>
                            <View style={styles.nameBlock}>
                                <Text style={styles.menuItemText}>PLAYER IDENTITY</Text>
                                <TextInput
                                    value={name}
                                    onChangeText={setName}
                                    maxLength={16}
                                    onSubmitEditing={saveName}
                                    style={styles.nameInput}
                                    placeholder="ENTER NAME"
                                    placeholderTextColor={colors.lightGray2}
                                />
                                {!!saveMessage && <Text
                                    accessibilityRole="alert"
                                    style={[styles.saveMessage, saveMessage === 'IDENTITY SAVED' ? styles.saveSuccess : styles.saveError]}
                                >{saveMessage}</Text>}
                                <GameButton size={46} color={colors.greenDigital} isEnabled={!isLoading && !!name.trim() && name.trim() !== player?.name}
                                    labelBottom={isLoading ? "Saving…" : "Save name"} labelSize={11} onPress={saveName} />
                            </View>
                            {!!status?.gameId &&
                                <View style={styles.optionItemRow}>
                                    <View style={styles.optionItem}><Text style={styles.menuItemText}>Leave current game</Text>
                                        <Text style={styles.menuItemTextSmall}>{` (${status?.gameId})`}</Text>
                                    </View>

                                    <View style={styles.optionItemButton}>
                                        <GameButton size={50} color={colors.red} isEnabled onPress={() => leaveTheGame()} />
                                    </View>
                                </View>
                            }
                        </View>
                        <View style={styles.optionsGroup}>
                            <View style={styles.optionItemRow}>
                                <View style={styles.optionItemButton}>
                                    <GameButton size={50} color={colors.pureWhite} isEnabled labelBottom="Back" labelSize={14}
                                        onPress={() => navigation.canGoBack() ? navigation.goBack() : navigateToDefault()} />
                                </View>
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
    optionsGroup: {
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        width: '100%',
    },
    optionItemRow: {
        alignContent: "center",
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',
        height: 50,
        marginBottom: 10,
    },
    optionItem: {
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        width: '100%'
    },
    optionItemButton: {
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
    },
    menuItemText: {
        fontSize: 16,
        color: colors.lightGray1
    },
    menuItemTextSmall: {
        fontSize: 12,
        color: colors.lightGray1
    },
    menu: {
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    nameBlock: {
        width: '90%',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 16,
    },
    nameInput: {
        width: '100%',
        maxWidth: 300,
        borderWidth: 1,
        borderColor: colors.greenDigital,
        backgroundColor: colors.screenColor,
        color: colors.greenDigital,
        fontFamily: 'title',
        fontSize: 18,
        letterSpacing: 1,
        textAlign: 'center',
        paddingVertical: 12,
        paddingHorizontal: 14,
    },
    saveMessage: {
        minHeight: 18,
        fontFamily: 'basic',
        fontSize: 13,
        letterSpacing: 0.6,
        textAlign: 'center',
    },
    saveSuccess: {
        color: colors.greenDigital,
    },
    saveError: {
        color: colors.red,
    },
    modalStyle: {
        width: '80%',
        backgroundColor: colors.gray1,
        position: 'absolute',
        height: 200,
    }
});
