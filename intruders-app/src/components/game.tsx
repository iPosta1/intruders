import React, { useState } from "react";
import { ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
import { KeyedMutator } from "swr";
import { GameStateResponse, GAME_STATUS } from "../types/gameServerTypes";
import { colors } from "../utils/constants";
import { getMissionSpecification } from "../utils/game";
import { useVisualViewportHeight } from "../utils/useVisualViewportHeight";
import { Background } from "./background";
import { ButtonsCabin } from "./game/buttonsCabin";
import { InfoCabin } from "./game/infoCabin";
import { MissionsCabin } from "./game/missionsCabin";
import { PlayersCabin } from "./game/playersCabin";
import { GradientPanel } from "./shared/gradientPanel";

export const Game = ({ gameState, mutate }: { gameState: GameStateResponse, mutate: KeyedMutator<GameStateResponse> }) => {
    const [showRoles, setShowRoles] = useState(false);
    const { height } = useWindowDimensions();
    const viewportHeight = useVisualViewportHeight(height);
    const shortViewport = viewportHeight < 760;
    const missionsHeight = shortViewport ? 158 : 174;
    const infoHeight = shortViewport ? 104 : 116;
    const missionSpec = getMissionSpecification(gameState);
    const canSendTeam =
        gameState.leader === gameState.playerIndex &&
        gameState.playerAction === GAME_STATUS.SELECT_PLAYERS_ON_MISSION &&
        gameState.missions[gameState.mission].preSelectedPlayers.length === missionSpec.players;
    const hasContextualControls =
        gameState.playerAction === GAME_STATUS.APPROVE_OR_REJECT_PLAYERS ||
        gameState.playerAction === GAME_STATUS.ACT_MISSON ||
        canSendTeam;
    // Exactly fit the physical button plus its two-line label. Contextual
    // controls have a shallow group socket, so they need ten extra pixels.
    const controlsHeight = hasContextualControls
        ? (shortViewport ? 84 : 92)
        : (shortViewport ? 74 : 82);
    const bottomSectionsHeight = missionsHeight + infoHeight + controlsHeight;
    // Compact outer panel padding/borders (37), separators (3), and gaps (36).
    const panelChromeAndGaps = 76;
    // iOS reports a layout viewport that can extend underneath Chrome's bottom
    // toolbar. Size the console from the visual viewport so the entire controls
    // section, including labels, remains visible without scrolling.
    const deviceHeight = Math.max(540, viewportHeight - 30);
    const availablePlayersHeight = deviceHeight - bottomSectionsHeight - panelChromeAndGaps;
    // The player display is the flexible section. It consumes every spare pixel
    // so unused height can never accumulate around the bottom controls.
    const playersHeight = Math.max(150, availablePlayersHeight);

    return (<Background>
        <ScrollView contentContainerStyle={styles.container}>
            <GradientPanel compactBottom height={deviceHeight} roundTop roundBottom marginTop={5} marginBottom={5}>
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
