import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { KeyedMutator } from "swr";
import { GameStateResponse } from "../types/gameServerTypes";
import { colors } from "../utils/constants";
import { Background } from "./background";
import { ButtonsCabin } from "./game/buttonsCabin";
import { InfoCabin } from "./game/infoCabin";
import { MissionsCabin } from "./game/missionsCabin";
import { PlayersCabin } from "./game/playersCabin";

export const Game = ({ gameState, mutate }: { gameState: GameStateResponse, mutate: KeyedMutator<GameStateResponse> }) => {
    const [showRoles, setShowRoles] = useState(false);

    return (<Background>
        <View style={styles.container}>
            <PlayersCabin gameState={gameState} showRoles={showRoles} mutateGame={mutate} />
            <MissionsCabin gameState={gameState}></MissionsCabin>
            <InfoCabin gameState={gameState} showRoles={showRoles}></InfoCabin>
            <ButtonsCabin gameState={gameState} setShowRoles={setShowRoles} showRoles={showRoles} mutateGame={mutate}></ButtonsCabin>
        </View>
    </Background>);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
});
