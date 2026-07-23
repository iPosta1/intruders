import { useIsFocused, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { Image, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../../App";
import { Background } from "../components/background";
import { GameButton } from "../components/shared/gameButton";
import { GradientPanel } from "../components/shared/gradientPanel";
import { LogoScreen } from "../components/shared/logoScreen";
import { AppContext } from "../context";
import { logout } from "../services/authService";
import { useTokenId, useUserGameId } from "../services/gameService";
import { colors } from "../utils/constants";
import { DELETE, GET } from "../utils/fetch";
import { LoadingScreen } from "./LoadingScreen";

export const SettingsScreen = () => {
    useIsFocused();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { user } = React.useContext(AppContext);
    const { data: token } = useTokenId(user);
    const { data: status, mutate, isLoading: userGameIsLoading } = useUserGameId(token);
    mutate();
    const [isLoading, setIsLoading] = useState(false);

    const leaveTheGame = async () => {
        setIsLoading(true);
        const resp = await DELETE(`/leave-game/${status.gameId}`, token);
        if (resp.ok) {
            mutate(null);
            setIsLoading(false);
            navigation.navigate('MainScreen');
        }
    }

    const navigateToDefault = async () => {
        if (status?.ok && !!status?.gameId) {
            navigation.navigate('GameScreen', { gameId: status.gameId });
        } else {
            navigation.navigate('MainScreen');
        }
    }

    return (<Background>
        {isLoading || userGameIsLoading ? <LoadingScreen /> :
            <View style={styles.outside}>
                <GradientPanel roundBottom roundTop marginTop={10} marginBottom={10}>
                    <LogoScreen text="Settings" />
                    <View style={styles.menu}>
                        <View style={styles.optionsGroup}>
                            <View style={styles.optionItemRow}>
                                <View style={styles.optionItem}><Text style={styles.menuItemText}>Log out</Text>
                                    <Text style={styles.menuItemTextSmall}>{` (${user?.email})`}</Text></View>
                                <View style={styles.optionItemButton}>
                                    <GameButton size={50} color={colors.pureWhite} isEnabled onPress={() => logout()} />
                                </View>
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
    modalStyle: {
        width: '80%',
        backgroundColor: colors.gray1,
        position: 'absolute',
        height: 200,
    }
});
