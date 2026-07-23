import { GameSpec, GAME_ACTIONS } from '../types/types';

const LOWER_CASE_CHARACTERS = 'abcdefghijklmnopqrstuvwxyz';

export const getGameSpecs = (numberOfPlayers: number): GameSpec => {
    switch (numberOfPlayers) {
        case 5:
            return {
                spies: 2, '1': { fails: 1, players: 2 }, '2': { fails: 1, players: 3 },
                '3': { fails: 1, players: 2 }, '4': { fails: 1, players: 3 }, '5': { fails: 1, players: 3 }
            };
        case 6:
            return {
                spies: 2, '1': { fails: 1, players: 2 }, '2': { fails: 1, players: 3 },
                '3': { fails: 1, players: 4 }, '4': { fails: 1, players: 3 }, '5': { fails: 1, players: 4 }
            };
        case 7:
            return {
                spies: 3, '1': { fails: 1, players: 2 }, '2': { fails: 1, players: 3 },
                '3': { fails: 1, players: 3 }, '4': { fails: 2, players: 4 }, '5': { fails: 1, players: 4 }
            };
        case 8:
            return {
                spies: 3, '1': { fails: 1, players: 3 }, '2': { fails: 1, players: 4 },
                '3': { fails: 1, players: 4 }, '4': { fails: 2, players: 5 }, '5': { fails: 1, players: 5 }
            };
        case 9:
            return {
                spies: 3, '1': { fails: 1, players: 3 }, '2': { fails: 1, players: 4 },
                '3': { fails: 1, players: 4 }, '4': { fails: 2, players: 5 }, '5': { fails: 1, players: 5 }
            };
        case 10:
            return {
                spies: 4, '1': { fails: 1, players: 3 }, '2': { fails: 1, players: 4 },
                '3': { fails: 1, players: 4 }, '4': { fails: 2, players: 5 }, '5': { fails: 1, players: 5 }
            };
        default:
            throw new Error('Invalid number of players. 5-10 players are supported');
    }
}

export const generateGameId = (length: number = 4) => {
    let resultId = '';
    for (let i = 0; i < length; i++) {
        resultId += LOWER_CASE_CHARACTERS.charAt(Math.floor(Math.random() * LOWER_CASE_CHARACTERS.length));
    }
    return resultId;
}

export const getActionByRequestPath = (rawPath: string) => {
    const [, path] = rawPath.split('/');
    return path as GAME_ACTIONS;
}
