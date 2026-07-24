import { StyleSheet, Text, View } from "react-native";
import { GameStateResponse, GAME_STATUS, VOTE } from "../../types/gameServerTypes";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { MissionItem } from "./missionItem";
import { GameButton } from "../shared/gameButton";
import { mapGameState } from "../../utils/game";
import { GradientPanel } from "../shared/gradientPanel";
import { ComputerScreen } from "../shared/computerScreen";
import { AnimatedCursor } from "../shared/animatedCursor";
import { colors } from "../../utils/constants";

export const InfoCabin = ({ gameState, showRoles, embedded = false, sectionHeight }: {
    gameState?: GameStateResponse,
    showRoles: boolean,
    embedded?: boolean,
    sectionHeight?: number,
}) => {
    return (
        <GradientPanel embedded={embedded} height={embedded ? sectionHeight || 116 : 160}>
            <ComputerScreen embedded={embedded} width="100%" height={embedded ? (sectionHeight || 116) - 12 : 104} maxWidth={520}>
                <View style={styles.softwareContainer}>
                    {!showRoles ?
                        <View style={styles.gameStatusContainer}>
                            <Text style={styles.gameStatusText} numberOfLines={1}>{mapGameState(gameState.playerAction)}</Text>
                            <AnimatedCursor style={styles.cursor} />
                        </View> :
                        <View style={styles.gameStatusContainer}>
                            <Text style={styles.gameStatusText} numberOfLines={1}>{'You are:'}</Text>
                        </View>
                    }
                    {!!showRoles &&
                        <View style={styles.gameStatusContainer}>
                            <Text style={styles.gameStatusText} numberOfLines={1}>
                                {gameState.players[gameState.playerIndex].role === 'spy' ? 'an alien spy' : 'a human'}
                            </Text>
                        </View>
                    }
                    {
                        !showRoles && (gameState.status === GAME_STATUS.WAITING_PLAYERS_MISSION_APPROVALS ||
                            gameState.status === GAME_STATUS.WAITING_MISSION_PLAYERS_TO_FAIL_OR_SUCCESS) ? // TODO status
                            <View style={styles.missionInfoContainer}>
                                {
                                    gameState.missions[gameState.mission].votes.map(vote =>
                                    (<View style={styles.actionItem}>
                                        <Text style={styles.actionItemText}>{vote === VOTE.APPROVE ? '✓' : 'X'}</Text>
                                    </View>))
                                }

                            </View> : <View style={styles.missionInfoContainer} />
                    }
                </View>
            </ComputerScreen>
        </GradientPanel>
    )
}

const styles = StyleSheet.create({
    softwareContainer: {
        flex: 1,
        maxWidth: 440,
        width: "100%",
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 3,
        paddingRight: 3,
        marginTop: 3,
        marginBottom: 3,
        height: '100%'
    },
    gameStatusContainer: {
        flex: 1,
        flexDirection: 'row',
        alignContent: "center",
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    gameStatusText: {
        flex: 1,
        fontFamily: 'title',
        fontSize: 15,
        color: colors.greenDigital,
        marginTop: 5,
        textShadowColor: 'rgba(124,255,155,0.85)',
        textShadowRadius: 7,
        textShadowOffset: { width: 0, height: 0 },
    },
    missionInfoContainer: {
        flex: 1,
        flexDirection: 'row',
        alignContent: "flex-start",
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    actionItem: {
        height: 18,
        borderWidth: 1,
        borderColor: colors.greenDigital,
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 3,
    },
    actionItemText: {
        fontSize: 12,
        color: colors.greenDigital,
        textAlign: 'center',
        textShadowColor: 'rgba(124,255,155,0.8)',
        textShadowRadius: 5,
        textShadowOffset: { width: 0, height: 0 },
    },
    cursor: {
        width: 8,
        height: 10,
        backgroundColor: colors.greenDigital,
        marginLeft: 5,
        marginTop: 3,
        shadowColor: colors.greenDigital,
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 1,
    },
});
