import { GameStateResponse } from "../../types/gameServerTypes";
import React from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import { PlayerItem } from "./playerItem";
import { getFakePlayerElements } from "./fakePlayerItems";
import { KeyedMutator } from "swr";
import { GradientPanel } from "../shared/gradientPanel";
import { ComputerScreen } from "../shared/computerScreen";

export const PlayersCabin = ({ gameState, token, showRoles, mutateGame, }: {
    mutateGame: KeyedMutator<GameStateResponse>, showRoles: boolean,
    gameState?: GameStateResponse, token?: string
}) => {
    const playersCount = Object.keys(gameState.players).length;
    return (<GradientPanel height={360} marginTop={5} roundTop>
        <ComputerScreen width={Dimensions.get("screen").width - 40} height={340} marginTop={10} maxWidth={480}>
            <View style={styles.playerIconsContainer}>
                {Object.keys(gameState.players).map(playerIndex => {
                    return (<PlayerItem
                        playerIndex={playerIndex}
                        name={gameState.players[playerIndex].name}
                        playerRole={gameState.players[playerIndex].role}
                        gameState={gameState}
                        showRoles={showRoles}
                        mutateGame={mutateGame}
                        token={token}
                    />);
                })}
                {getFakePlayerElements(Dimensions.get("screen").width, playersCount, gameState.players[gameState.leader].name, gameState.mission)}
            </View>
        </ComputerScreen>
    </GradientPanel>)
}

const styles = StyleSheet.create({
    playerIconsContainer: {
        flex: 1,
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: 'row',
        flexWrap: 'wrap',
        minHeight: 'max-content',
    },
});