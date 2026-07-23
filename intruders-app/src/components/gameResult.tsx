import { GameStateResponse, MISSION_STATUS, ROLE } from "../types/gameServerTypes";
import React, { useState } from "react";
import { Background } from "./background";
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { GradientPanel } from "./shared/gradientPanel";
import { ComputerScreen } from "./shared/computerScreen";
import { colors } from "../utils/constants";
import { GameButton } from "./shared/gameButton";
import { AnimatedCursor } from "./shared/animatedCursor";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { DELETE } from "../utils/fetch";
import { LoadingScreen } from "../screens/LoadingScreen";

export const GameResult = ({ gameState }: { gameState: GameStateResponse }) => {

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { height } = useWindowDimensions();
    const [isLeaving, setIsLeaving] = useState(false);
    const winner = gameState.finished.winner === ROLE.SPY ? 'ALIEN SPIES' : 'HUMAN RESISTANCE';

    const exitResult = async () => {
        if (isLeaving) return;
        setIsLeaving(true);
        const response = await DELETE(`/leave-game/${gameState.gameId}`);
        if (response.ok) {
            navigation.reset({ index: 0, routes: [{ name: 'MainScreen' }] });
            return;
        }
        setIsLeaving(false);
    };

    if (isLeaving) return <LoadingScreen />;

    return (
        <Background>
            <ScrollView contentContainerStyle={styles.container}>
                <GradientPanel height={Math.max(620, Math.min(820, height - 18))} marginTop={5} marginBottom={5} roundTop roundBottom>
                    <ComputerScreen width="100%" height={Math.max(480, Math.min(650, height - 150))} marginTop={8} marginBottom={12} maxWidth={520}>
                        <View style={styles.screenContainer}>
                            <View style={styles.screenItem}>
                                <View style={styles.screenItem}>
                                    <View style={styles.screenItemRow}>
                                        <Text style={styles.winnerText}>{`${winner} WIN`}</Text>
                                        <AnimatedCursor />
                                    </View>
                                </View>
                                <View style={styles.screenItemRow}>
                                    <Text style={styles.textStyle}>Missions:</Text>
                                    {Object.keys(gameState.finished.missions).map(missionNumber =>
                                    (
                                        <View key={missionNumber} style={{
                                            ...styles.missionStatus,
                                            borderColor: gameState.finished.missions[missionNumber] === MISSION_STATUS.MISSION_FAILED ?
                                                colors.red : colors.greenDigital
                                        }}>
                                            <Text style={{
                                                ...styles.textStyle, color: gameState.finished.missions[missionNumber] === MISSION_STATUS.MISSION_FAILED ?
                                                    colors.red : colors.greenDigital
                                            }}>{`${gameState.finished.missions[missionNumber] === MISSION_STATUS.MISSION_FAILED ? 'X' : 'V'}`}</Text>
                                        </View>
                                    ))}
                                </View>
                                <View style={styles.screenItem}>
                                    <Text style={styles.textStyle}>Players:</Text>
                                    {Object.keys(gameState.finished.players).map(playerName =>
                                    (<View key={playerName} style={styles.screenItemRow}>
                                        <Text style={styles.textStyle}>{`${playerName}: `}</Text>
                                        <Text style={{
                                            ...styles.textStyle,
                                            color: gameState.finished.players[playerName] === ROLE.SPY ? colors.red : colors.greenDigital
                                        }}>{gameState.finished.players[playerName] === ROLE.SPY ? 'ALIEN SPY' : 'HUMAN'}</Text>
                                    </View>))}
                                </View>
                            </View>
                        </View>
                    </ComputerScreen>
                    <View style={styles.button}>
                        <GameButton labelBottom="Exit results" size={50} labelSize={13} color={colors.amber} isEnabled onPress={exitResult} />
                    </View>
                </GradientPanel>
            </ScrollView>
        </Background>)
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 9,
    },
    button: {
        height: 100,
    },
    screenContainer: {
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        width: '100%',
        flex: 1,
    },
    screenItemRow: {
        alignContent: "flex-start",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flexDirection: 'row',
        marginTop: 10,
    },
    screenItem: {
        marginTop: 10,
        alignContent: "flex-start",
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    textStyle: {
        color: colors.greenDigital,
        fontFamily: 'title',
        fontSize: 12,
        textAlign: 'left'
    },
    winnerText: {
        color: colors.phosphorBright,
        fontFamily: 'title',
        fontSize: 19,
        letterSpacing: 1,
        textAlign: 'center',
    },
    missionStatus: {
        width: 12,
        height: 16,
        borderWidth: 1,
        borderColor: colors.greenDigital,
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 3,
    },
});
