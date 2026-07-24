import { StyleSheet, Text, View } from "react-native";
import { GameStateResponse, GAME_STATUS, VOTE } from "../../types/gameServerTypes";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { MissionItem } from "./missionItem";
import { GameButton } from "../shared/gameButton";
import { mapGameState } from "../../utils/game";
import { GradientPanel } from "../shared/gradientPanel";
import { ComputerScreen } from "../shared/computerScreen";
import { AnimatedCursor } from "../shared/animatedCursor";
import { colors } from "../../utils/constants";

const TypewriterLine = ({ text, delay = 180, showCursor = true }: {
    text: string,
    delay?: number,
    showCursor?: boolean,
}) => {
    const [visibleText, setVisibleText] = useState('');

    useEffect(() => {
        setVisibleText('');
        let index = 0;
        let typingTimer: ReturnType<typeof setInterval> | undefined;
        const startTimer = setTimeout(() => {
            typingTimer = setInterval(() => {
                index += 1;
                setVisibleText(text.slice(0, index));
                if (index >= text.length && typingTimer) clearInterval(typingTimer);
            }, 46);
        }, delay);

        return () => {
            clearTimeout(startTimer);
            if (typingTimer) clearInterval(typingTimer);
        };
    }, [delay, text]);

    return (
        <View style={styles.gameStatusContainer}>
            <Text style={styles.gameStatusText} numberOfLines={1}>
                {visibleText}{showCursor && <AnimatedCursor inline />}
            </Text>
        </View>
    );
};

export const InfoCabin = ({ gameState, showRoles, embedded = false, sectionHeight }: {
    gameState?: GameStateResponse,
    showRoles: boolean,
    embedded?: boolean,
    sectionHeight?: number,
}) => {
    const statusText = mapGameState(gameState.playerAction);
    const roleText = gameState.players[gameState.playerIndex].role === 'spy' ? 'an alien spy' : 'a human';

    return (
        <GradientPanel embedded={embedded} height={embedded ? sectionHeight || 116 : 160}>
            <ComputerScreen embedded={embedded} width="100%" height={embedded ? (sectionHeight || 116) - 12 : 104} maxWidth={520}>
                <View style={styles.softwareContainer}>
                    {!showRoles
                        ? <TypewriterLine text={statusText} />
                        : <>
                            <View style={styles.gameStatusContainer}>
                                <Text style={styles.gameStatusText} numberOfLines={1}>You are:</Text>
                            </View>
                            <View style={styles.gameStatusContainer}>
                                <Text style={styles.gameStatusText} numberOfLines={1}>{roleText}</Text>
                            </View>
                        </>
                    }
                    {
                        !showRoles && (gameState.status === GAME_STATUS.WAITING_PLAYERS_MISSION_APPROVALS ||
                            gameState.status === GAME_STATUS.WAITING_MISSION_PLAYERS_TO_FAIL_OR_SUCCESS) ? // TODO status
                            <View style={styles.missionInfoContainer}>
                                {
                                    gameState.missions[gameState.mission].votes.map((vote, index) =>
                                    (<View style={styles.actionItem} key={`${vote}-${index}`}>
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
});
