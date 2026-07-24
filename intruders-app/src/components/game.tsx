import React, { useState } from "react";
import { ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
import { KeyedMutator } from "swr";
import { GameStateResponse, GAME_STATUS } from "../types/gameServerTypes";
import { colors } from "../utils/constants";
import { getMissionSpecification } from "../utils/game";
import { Background } from "./background";
import { ButtonsCabin } from "./game/buttonsCabin";
import { InfoCabin } from "./game/infoCabin";
import { MissionsCabin } from "./game/missionsCabin";
import { PlayersCabin } from "./game/playersCabin";
import { GradientPanel } from "./shared/gradientPanel";

export const Game = ({ gameState, mutate }: { gameState: GameStateResponse, mutate: KeyedMutator<GameStateResponse> }) => {
    const [showRoles, setShowRoles] = useState(false);
    const { height } = useWindowDimensions();
    const playerCount = Object.keys(gameState.players).length;
    const missionsHeight = 174;
    const infoHeight = 116;
    const missionSpec = getMissionSpecification(gameState);
    const canSendTeam =
        gameState.leader === gameState.playerIndex &&
        gameState.playerAction === GAME_STATUS.SELECT_PLAYERS_ON_MISSION &&
        gameState.missions[gameState.mission].preSelectedPlayers.length === missionSpec.players;
    const hasContextualControls =
        gameState.playerAction === GAME_STATUS.APPROVE_OR_REJECT_PLAYERS ||
        gameState.playerAction === GAME_STATUS.ACT_MISSON ||
        canSendTeam;
    const controlsHeight = hasContextualControls ? 104 : 84;
    const bottomSectionsHeight = missionsHeight + infoHeight + controlsHeight;
    const panelChromeAndGaps = 94;
    const minimumPlayersHeight = playerCount > 6 ? 250 : 210;
    // Include the ScrollView padding and panel margins in the viewport budget.
    const deviceHeight = Math.max(height - 20, bottomSectionsHeight + panelChromeAndGaps + minimumPlayersHeight);
    const playersHeight = deviceHeight - bottomSectionsHeight - panelChromeAndGaps;

    return (<Background>
        <ScrollView contentContainerStyle={styles.container}>
            <GradientPanel height={deviceHeight} roundTop roundBottom marginTop={5} marginBottom={5}>
                <View style={styles.deviceContent}>
                    <PlayersCabin embedded sectionHeight={playersHeight} gameState={gameState} showRoles={showRoles} mutateGame={mutate} />
                    <View style={styles.separator} />
                    <MissionsCabin embedded sectionHeight={missionsHeight} gameState={gameState} />
                    <View style={styles.separator} />
                    <InfoCabin embedded sectionHeight={infoHeight} gameState={gameState} showRoles={showRoles} />
                    <View style={styles.separator} />
                    <ButtonsCabin embedded sectionHeight={controlsHeight} gameState={gameState} setShowRoles={setShowRoles} showRoles={showRoles} mutateGame={mutate} />
                </View>
            </GradientPanel>
        </ScrollView>
    </Background>);
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignContent: "center",
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 9,
        paddingTop: 5,
        paddingBottom: 5,
    },
    deviceContent: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        gap: 6,
    },
    separator: {
        width: "92%",
        height: 1,
        backgroundColor: colors.casingLight,
        opacity: 0.5,
    },
});
