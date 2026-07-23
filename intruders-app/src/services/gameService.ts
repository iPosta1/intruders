import { User } from 'firebase/auth';
import React from 'react';
import useSWR, { KeyedMutator } from 'swr';
import { GameStateResponse, MISSION_ACTION, VOTE } from '../types/gameServerTypes';
import { DELETE, GET, POST, ServerResponse } from '../utils/fetch';

const extractBody = (promise: Promise<ServerResponse>) => promise.then((serverResponse) => {
    if (serverResponse.ok) {
        return serverResponse.data;
    } else {
        return null;
    }
});

export const getIdToken = async (user: User) => {
    const token = await user.getIdToken();
    return token;
}

export function useTokenId(user: User) {
    const { data: token } = useSWR(user ? [`/token`, user] : null, ([path, user]) => getIdToken(user),
        { refreshInterval: 0, dedupingInterval: 5000 });
    return { data: token };
}


export function useGameStatus(gameId: string, token: string) {
    const { data, error, isLoading, mutate } = useSWR(token ? [`/status/${gameId}`, token] : null, ([path, token]) => extractBody(GET(path, token)),
        { refreshInterval: 3000, dedupingInterval: 3000 });
    return {
        data, isLoading, mutate, error
    };
}

export function useUserGameId(token: string) {
    const { data, isLoading, mutate } = useSWR(token ? [`/find-game`, token] : null, ([path, token]) => extractBody(GET(path, token)),
        { refreshInterval: 0, dedupingInterval: 5000 });
    return {
        data, isLoading, mutate
    };
}

export const selectPlayer = async (playerIndex: number, token: string, gameState: GameStateResponse, mutate?: KeyedMutator<GameStateResponse>) => {
    const resp = await POST('/select-player', token, { gameId: gameState.gameId, playerNumber: playerIndex });
    if (resp.ok && mutate) {
        gameState.missions[gameState.mission]?.preSelectedPlayers?.push(playerIndex);
        mutate(gameState);
    }
}

export const removePlayer = async (playerIndex: number, token: string, gameState: GameStateResponse, mutate?: KeyedMutator<GameStateResponse>) => {
    const resp = await DELETE(`/remove-player-from-mission/${gameState.gameId}/${playerIndex}`, token);
    if (resp.ok && mutate) {
        const currentMission = gameState.missions[gameState.mission];
        currentMission.preSelectedPlayers = currentMission.preSelectedPlayers.filter(player => player !== playerIndex);
        mutate(gameState);
    }
}

export const sendForApproval = async (token: string, gameState: GameStateResponse, mutate?: KeyedMutator<GameStateResponse>) => {
    const resp = await POST('/send-for-approval', token, { gameId: gameState.gameId });
    if (resp.ok && mutate) {
        mutate();
    }
}

export const vote = async (vote: VOTE, token: string, gameState: GameStateResponse, mutate?: KeyedMutator<GameStateResponse>) => {
    const resp = await POST('/vote', token, { gameId: gameState.gameId, vote: vote });
    if (resp.ok && mutate) {
        mutate();
    }
}

export const act = async (action: MISSION_ACTION, token: string, gameState: GameStateResponse, mutate?: KeyedMutator<GameStateResponse>) => {
    const resp = await POST('/act-mission', token, { gameId: gameState.gameId, action: action });
    if (resp.ok && mutate) {
        gameState.missions[gameState.mission].missionActions.push(action);
        mutate(gameState);
    }
}
