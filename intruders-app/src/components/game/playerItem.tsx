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
};

export const PlayerItem = ({
    playerIndex,
    playerRole,
    name,
    showRoles,
    gameState,
    mutateGame
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
        style={{ ...styles.playerItem, borderWidth: gameState.playerIndex === playerNumber ? 4 : 1 }}
        onPress={playerIsSelected ? () => onRemovePlayer(playerNumber) : () => onSelectPlayer(playerNumber)}
        key={playerNumber}>
        {!showRoles &&
            <UnknownSpaceman />
        }
        {!!showRoles &&
            (playerRole ? (playerRole === 'spy' ? <SpySpaceman /> : <ResistenceSpaceman />) : <UnknownSpaceman />)
        }
        {gameState.leader === playerNumber &&
            <PlayerLeaderIcon />
        }
        {playerIsSelected &&
            <PlayerSelectedIcon />
        }
        {isLoading && <PlayerLoadingIndicator />}
        <Text style={styles.playerItemName} numberOfLines={1}>{name}</Text>
    </TouchableOpacity>);
};

const styles = StyleSheet.create({
    playerItem: {
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        margin: 3,
        width: 80,
        height: 55,
        borderColor: colors.greenDigital,
        shadowColor: colors.greenDigital,
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 1,
    },
    playerItemName: {
        color: '#81e35c',
        fontSize: 10,
        textAlign: 'center',
        flexWrap: 'nowrap',
    },
});
