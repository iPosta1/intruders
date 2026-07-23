import { GameStateResponse } from "../../types/gameServerTypes";
import React from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { PlayerItem } from "./playerItem";
import { KeyedMutator } from "swr";
import { GradientPanel } from "../shared/gradientPanel";
import { ComputerScreen } from "../shared/computerScreen";
import { colors } from "../../utils/constants";

export const PlayersCabin = ({ gameState, showRoles, mutateGame, embedded = false, sectionHeight }: {
    mutateGame: KeyedMutator<GameStateResponse>, showRoles: boolean,
    gameState?: GameStateResponse,
    embedded?: boolean,
    sectionHeight?: number,
}) => {
    const { width, height } = useWindowDimensions();
    const count = Object.keys(gameState.players).length;
    const columns = width < 370 ? 2 : width < 600 ? 3 : 5;
    const availableWidth = Math.min(width - 104, 470);
    const itemWidth = Math.max(72, Math.floor(availableWidth / columns) - 6);
    const panelHeight = Math.max(290, Math.min(330, height * 0.36));
    const embeddedHeight = sectionHeight || 250;
    return (<GradientPanel embedded={embedded} height={embedded ? embeddedHeight : panelHeight} marginTop={embedded ? 0 : 5} roundTop>
        <ComputerScreen embedded={embedded} width="100%" height={embedded ? embeddedHeight : panelHeight - 58} marginTop={embedded ? 0 : 8} maxWidth={520}>
            <View style={styles.statusBar}>
                <Text numberOfLines={1} style={[styles.statusText, styles.leaderText]}>{`LEADER  ${gameState.players[gameState.leader].name}`}</Text>
                <Text numberOfLines={1} style={styles.statusText}>{`MISSION  ${gameState.mission}`}</Text>
            </View>
            <View style={styles.playerIconsContainer}>
                {Object.keys(gameState.players).map(playerIndex => {
                    return (<PlayerItem
                        playerIndex={playerIndex}
                        name={gameState.players[playerIndex].name}
                        playerRole={gameState.players[playerIndex].role}
                        gameState={gameState}
                        showRoles={showRoles}
                        mutateGame={mutateGame}
                        itemWidth={itemWidth}
                    />);
                })}
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
        paddingVertical: 6,
        width: '100%',
    },
    statusBar: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: colors.greenDigital,
        paddingBottom: 6,
        paddingHorizontal: 4,
    },
    statusText: {
        color: colors.greenDigital,
        fontFamily: "title",
        fontSize: 14,
        flexShrink: 0,
    },
    leaderText: {
        flex: 1,
        minWidth: 0,
        marginRight: 8,
    },
});
