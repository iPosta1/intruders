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
    // Account for the device shell, screen padding and per-item margins so
    // the calculated column count is also the column count that renders.
    const availableWidth = Math.max(240, Math.min(width - 96, 500));
    const embeddedHeight = sectionHeight || 250;
    const gridHeightWithHeader = Math.max(80, embeddedHeight - 44);
    const onePlayerPerRow =
        gridHeightWithHeader >= count * 60 &&
        embeddedHeight / availableWidth >= 1.05;
    const oneRowItemWidth = availableWidth / Math.max(1, count);
    const columns = onePlayerPerRow
        ? 1
        : oneRowItemWidth >= 78
        ? count
        : width < 330 ? 2 : width < 600 ? 3 : Math.min(5, count);
    const rows = Math.ceil(count / columns);
    const showStatusBar = gridHeightWithHeader >= rows * 48;
    const gridHeight = Math.max(80, embeddedHeight - (showStatusBar ? 44 : 12));
    const panelHeight = Math.max(290, Math.min(330, height * 0.36));
    const cellWidth = availableWidth / columns;
    const cellHeight = gridHeight / rows;
    const itemWidth = onePlayerPerRow
        ? Math.min(380, Math.floor(cellWidth) - 16)
        : Math.max(64, Math.floor(cellWidth) - 10);
    const itemHeight = Math.max(40, Math.min(onePlayerPerRow ? 140 : 112, Math.floor(cellHeight) - 4));
    const iconSize = Math.max(
        onePlayerPerRow ? 30 : 22,
        Math.min(onePlayerPerRow ? 56 : 50, itemHeight - 28, itemWidth - 18),
    );
    const nameSize = Math.max(
        onePlayerPerRow ? 12 : 10,
        Math.min(onePlayerPerRow ? 20 : 17, Math.floor(Math.min(itemWidth / 5.6, itemHeight / 5))),
    );
    return (<GradientPanel embedded={embedded} height={embedded ? embeddedHeight : panelHeight} marginTop={embedded ? 0 : 5} roundTop>
        <ComputerScreen embedded={embedded} width="100%" height={embedded ? embeddedHeight : panelHeight - 58} marginTop={embedded ? 0 : 8} maxWidth={520}>
            {showStatusBar && (
                <View style={styles.statusBar}>
                    <Text numberOfLines={1} style={[styles.statusText, styles.leaderText]}>{`LEADER  ${gameState.players[gameState.leader].name}`}</Text>
                    <Text numberOfLines={1} style={styles.statusText}>{`MISSION  ${gameState.mission}`}</Text>
                </View>
            )}
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
                        itemHeight={itemHeight}
                        iconSize={iconSize}
                        nameSize={nameSize}
                        horizontal={onePlayerPerRow}
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
