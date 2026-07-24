import { GameStateResponse, GAME_STATUS } from "../../types/gameServerTypes";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { removePlayer, selectPlayer } from "../../services/gameService";
import { KeyedMutator } from "swr";
import { PlayerLeaderIcon, PlayerLoadingIndicator, PlayerSelectedIcon, ResistenceSpaceman, SpySpaceman, UnknownSpaceman } from "../icons";
import { getMissionSpecification } from "../../utils/game";
import { colors } from "../../utils/constants";

export type PlayerItemProps = {
    playerIndex: string,
    name: string,
    playerRole?: string,
    showRoles: boolean,
    gameState: GameStateResponse,
    mutateGame: KeyedMutator<GameStateResponse>,
    itemWidth?: number,
    itemHeight?: number,
    iconSize?: number,
    nameSize?: number,
    horizontal?: boolean,
};

export const PlayerItem = ({
    playerIndex,
    playerRole,
    name,
    showRoles,
    gameState,
    mutateGame,
    itemWidth = 88,
    itemHeight = 64,
    iconSize = 42,
    nameSize = 16,
    horizontal = false,
}: PlayerItemProps) => {
    const playerNumber = Number(playerIndex);
    const playerIsSelected = gameState.missions[gameState.mission]?.preSelectedPlayers.includes(playerNumber);
    const [isLoading, setIsLoading] = useState(false);
    const missionSpec = getMissionSpecification(gameState);

    const onSelectPlayer = async (playerIndex: number) => {
        if (gameState.status === GAME_STATUS.WAITING_LEADER_TO_SELECT_PLAYERS &&
            gameState.leader === gameState.playerIndex &&
            !gameState.missions[gameState.mission].preSelectedPlayers.includes(playerIndex) &&
            gameState.missions[gameState.mission].preSelectedPlayers.length < missionSpec.players) {
            setIsLoading(true);
            await selectPlayer(playerIndex, gameState, mutateGame);
            setIsLoading(false);
        }
    }

    const onRemovePlayer = async (playerIndex: number) => {
        if (gameState.leader === gameState.playerIndex && gameState.status === GAME_STATUS.WAITING_LEADER_TO_SELECT_PLAYERS) {
            setIsLoading(true);
            await removePlayer(playerIndex, gameState, mutateGame);
            setIsLoading(false);
        }
    }

    return (<TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`Player ${name}${gameState.leader === playerNumber ? ', leader' : ''}${playerIsSelected ? ', selected' : ''}`}
        style={[
            styles.playerItem,
            horizontal && styles.horizontalPlayerItem,
            { width: itemWidth, height: itemHeight },
            gameState.playerIndex === playerNumber && styles.currentPlayer,
        ]}
        onPress={playerIsSelected ? () => onRemovePlayer(playerNumber) : () => onSelectPlayer(playerNumber)}
        key={playerNumber}>
        {!showRoles &&
            <UnknownSpaceman size={iconSize} />
        }
        {!!showRoles &&
            (playerRole ? (playerRole === 'spy' ? <SpySpaceman size={iconSize} /> : <ResistenceSpaceman size={iconSize} />) : <UnknownSpaceman size={iconSize} />)
        }
        {gameState.leader === playerNumber &&
            <PlayerLeaderIcon />
        }
        {playerIsSelected &&
            <PlayerSelectedIcon />
        }
        {isLoading && <PlayerLoadingIndicator />}
        <Text
            style={[
                styles.playerItemName,
                horizontal && styles.horizontalPlayerName,
                { fontSize: nameSize, lineHeight: nameSize + 2 },
            ]}
            numberOfLines={1}
        >
            {name}
        </Text>
    </TouchableOpacity>);
};

const styles = StyleSheet.create({
    playerItem: {
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        margin: 2,
        minWidth: 0,
        borderColor: colors.greenDigital,
        shadowColor: colors.greenDigital,
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 1,
    },
    currentPlayer: {
        borderWidth: 3,
        borderColor: colors.phosphorBright,
        backgroundColor: 'rgba(87, 255, 132, 0.08)',
    },
    horizontalPlayerItem: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingHorizontal: 22,
    },
    playerItemName: {
        color: colors.phosphorBright,
        fontFamily: 'title',
        letterSpacing: 0.3,
        textAlign: 'center',
        flexWrap: 'nowrap',
        textShadowColor: colors.phosphor,
        textShadowRadius: 2,
    },
    horizontalPlayerName: {
        flexShrink: 1,
        marginLeft: 18,
        textAlign: 'left',
    },
});
