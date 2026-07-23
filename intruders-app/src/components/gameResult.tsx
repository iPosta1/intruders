import { GameStateResponse, MISSION_STATUS, ROLE } from "../types/gameServerTypes";
import React from "react";
import { Background } from "./background";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { GradientPanel } from "./shared/gradientPanel";
import { ComputerScreen } from "./shared/computerScreen";
import { colors } from "../utils/constants";
import { GameButton } from "./shared/gameButton";
import { AnimatedCursor } from "./shared/animatedCursor";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";

export const GameResult = ({ gameState }: { gameState: GameStateResponse }) => {

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    return (
        <Background>
            <View style={styles.container}>
                <GradientPanel marginTop={5} marginBottom={5} roundTop roundBottom>
                    <ComputerScreen width={Dimensions.get("screen").width - 40} marginTop={10} marginBottom={20} maxWidth={480}>
                        <View style={styles.screenContainer}>
                            <View style={styles.screenItem}>
                                <View style={styles.screenItem}>
                                    <View style={styles.screenItemRow}>
                                        <Text style={styles.textStyle}>{`Winner: ${gameState.finished.winner}`}</Text>
                                        <AnimatedCursor />
                                    </View>
                                </View>
                                <View style={styles.screenItemRow}>
                                    <Text style={styles.textStyle}>Missions:</Text>
                                    {Object.keys(gameState.finished.missions).map(missionNumber =>
                                    (
                                        <View style={{
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
                                    (<View style={styles.screenItemRow}>
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
                        <GameButton labelBottom="Exit" size={50} labelSize={16} color={colors.pureWhite} isEnabled onPress={() =>
                            navigation.navigate('MainScreen')} />
                    </View>
                </GradientPanel>
            </View>
        </Background>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
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
