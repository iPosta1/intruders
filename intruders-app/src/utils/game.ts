import { GameStateResponse, GAME_STATUS } from "../types/gameServerTypes";

export interface MissionSpec {
    fails: number; // number of fails to fail the mission
    players: number; //required number of players for the mission
}

export interface GameSpec {
    spies: number; // number of spies in the game
    missions: { [key: number]: MissionSpec};
}

export const getGameSpecifications = (numberOfPlayers: number): GameSpec => {
    switch (numberOfPlayers) {
        case 5:
            return {
                spies: 2, missions: { 1: { fails: 1, players: 2 }, 2: { fails: 1, players: 3 },
                3: { fails: 1, players: 2 }, 4: { fails: 1, players: 3 }, 5: { fails: 1, players: 3 }}
            };
        case 6:
            return {
                spies: 2, missions: { 1: { fails: 1, players: 2 }, 2: { fails: 1, players: 3 },
                3: { fails: 1, players: 4 }, 4: { fails: 1, players: 3 }, 5: { fails: 1, players: 4 }}
            };
        case 7:
            return {
                spies: 3, missions: { 1: { fails: 1, players: 2 }, 2: { fails: 1, players: 3 },
                3: { fails: 1, players: 3 }, 4: { fails: 2, players: 4 }, 5: { fails: 1, players: 4 }}
            };
        case 8:
            return {
                spies: 3, missions: { 1: { fails: 1, players: 3 }, 2: { fails: 1, players: 4 },
                3: { fails: 1, players: 4 }, 4: { fails: 2, players: 5 }, 5: { fails: 1, players: 5 }}
            };
        case 9:
            return {
                spies: 3, missions: { 1: { fails: 1, players: 3 }, 2: { fails: 1, players: 4 },
                3: { fails: 1, players: 4 }, 4: { fails: 2, players: 5 }, 5: { fails: 1, players: 5 }}
            };
        case 10:
            return {
                spies: 4, missions: { 1: { fails: 1, players: 3 }, 2: { fails: 1, players: 4 },
                3: { fails: 1, players: 4 }, 4: { fails: 2, players: 5 }, 5: { fails: 1, players: 5 }}
            };
        default:
            throw new Error('Invalid number of players. 5-10 players are supported');
    }
}

export const getMissionSpecification = (gameState: GameStateResponse): MissionSpec => {
    const numberOfPlayers = Object.keys(gameState.players).length;
    const gameSpec = getGameSpecifications(numberOfPlayers);
    return gameSpec.missions[gameState.mission];
}

export const GAME_STATE_MAP: { [key: string]: string } = {
    'SELECT_PLAYERS_ON_MISSION': 'Select players for the mission',
    'WAITING_LEADER_TO_SELECT_PLAYERS': 'Leader is selecting players',
    'WAITING_PLAYERS_MISSION_APPROVALS': 'Approve or reject players',
    'APPROVE_OR_REJECT_PLAYERS': 'Approve or reject players',
    'WAITING_MISSION_PLAYERS_TO_FAIL_OR_SUCCESS': 'Players are on the mission',
    'ACT_MISSON': 'Attend the mission'
};

export const mapGameState = (gameStatus: string) => {
    GAME_STATUS.ACT_MISSON
    if (GAME_STATE_MAP[gameStatus]) {
        return GAME_STATE_MAP[gameStatus];
    }
    return gameStatus;
}