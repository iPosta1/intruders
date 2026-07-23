import useSWR, { KeyedMutator } from 'swr';
import { GameStateResponse, MISSION_ACTION, VOTE } from '../types/gameServerTypes';
import { DELETE, GET, POST, ServerResponse } from '../utils/fetch';

const extractBody = (promise: Promise<ServerResponse>) => promise.then(serverResponse =>
    serverResponse.ok ? serverResponse.data : null
);

export function useGameStatus(gameId: string, playerId: string) {
    const { data, error, isLoading, mutate } = useSWR(
        gameId && playerId ? [`/status/${gameId}`, playerId] : null,
        ([path]) => extractBody(GET(path)),
        { refreshInterval: 3000, dedupingInterval: 3000 },
    );
    return { data, isLoading, mutate, error };
}

export function useUserGameId(playerId: string) {
    const { data, isLoading, mutate } = useSWR(
        playerId ? ['/find-game', playerId] : null,
        ([path]) => extractBody(GET(path)),
        { refreshInterval: 0, dedupingInterval: 5000 },
    );
    return { data, isLoading, mutate };
}

export const selectPlayer = async (
    playerIndex: number,
    gameState: GameStateResponse,
    mutate?: KeyedMutator<GameStateResponse>,
) => {
    const resp = await POST('/select-player', { gameId: gameState.gameId, playerNumber: playerIndex });
    if (resp.ok && mutate) {
        gameState.missions[gameState.mission]?.preSelectedPlayers?.push(playerIndex);
        mutate(gameState);
    }
};

export const removePlayer = async (
    playerIndex: number,
    gameState: GameStateResponse,
    mutate?: KeyedMutator<GameStateResponse>,
) => {
    const resp = await DELETE(`/remove-player-from-mission/${gameState.gameId}/${playerIndex}`);
    if (resp.ok && mutate) {
        const currentMission = gameState.missions[gameState.mission];
        currentMission.preSelectedPlayers = currentMission.preSelectedPlayers.filter(player => player !== playerIndex);
        mutate(gameState);
    }
};

export const sendForApproval = async (
    gameState: GameStateResponse,
    mutate?: KeyedMutator<GameStateResponse>,
) => {
    const resp = await POST('/send-for-approval', { gameId: gameState.gameId });
    if (resp.ok && mutate) {
        mutate();
    }
};

export const vote = async (voteValue: VOTE, gameState: GameStateResponse, mutate?: KeyedMutator<GameStateResponse>) => {
    const resp = await POST('/vote', { gameId: gameState.gameId, vote: voteValue });
    if (resp.ok && mutate) {
        mutate();
    }
};

export const act = async (
    action: MISSION_ACTION,
    gameState: GameStateResponse,
    mutate?: KeyedMutator<GameStateResponse>,
) => {
    const resp = await POST('/act-mission', { gameId: gameState.gameId, action });
    if (resp.ok && mutate) {
        gameState.missions[gameState.mission].missionActions.push(action);
        mutate(gameState);
    }
};
