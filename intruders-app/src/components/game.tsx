import React, { useState } from "react";
import { ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
import { KeyedMutator } from "swr";
import { GameStateResponse } from "../types/gameServerTypes";
import { colors } from "../utils/constants";
import { Background } from "./background";
import { ButtonsCabin } from "./game/buttonsCabin";
import { InfoCabin } from "./game/infoCabin";
import { MissionsCabin } from "./game/missionsCabin";
import { PlayersCabin } from "./game/playersCabin";
import { GradientPanel } from "./shared/gradientPanel";

export const Game = ({ gameState, mutate }: { gameState: GameStateResponse, mutate: KeyedMutator<GameStateResponse> }) => {
    const [showRoles, setShowRoles] = useState(false);
    const { width } = useWindowDimensions();
    const playerCount = Object.keys(gameState.players).length;
    const columns = width < 370 ? 2 : width < 600 ? 3 : 5;
    const playerRows = Math.ceil(playerCount / columns);
    const playersHeight = 58 + playerRows * 70;
    const controlsHeight = width < 370 ? 220 : 178;
    // Panel chrome, section gaps and two-line control labels need their own
    // space. Without this allowance the panel's overflow clips the labels.
    const deviceHeight = playersHeight + 166 + 116 + controlsHeight + 132;

    return (<Background>
        <ScrollView contentContainerStyle={styles.container}>
            <GradientPanel height={deviceHeight} roundTop roundBottom marginTop={5} marginBottom={5}>
                <View style={styles.deviceContent}>
                    <PlayersCabin embedded sectionHeight={playersHeight} gameState={gameState} showRoles={showRoles} mutateGame={mutate} />
                    <View style={styles.separator} />
                    <MissionsCabin embedded gameState={gameState} />
                    <View style={styles.separator} />
                    <InfoCabin embedded gameState={gameState} showRoles={showRoles} />
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
        paddingBottom: 20,
    },
    deviceContent: {
        width: "100%",
        alignItems: "center",
        gap: 8,
    },
    separator: {
        width: "92%",
        height: 1,
        backgroundColor: colors.casingLight,
        opacity: 0.5,
    },
});
