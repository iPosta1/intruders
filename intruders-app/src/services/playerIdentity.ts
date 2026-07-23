export type PlayerIdentity = {
    id: string;
    name: string;
};

const PLAYER_ID_KEY = 'intruders.playerId';
const PLAYER_NAME_KEY = 'intruders.playerName';

const createPlayerId = () => {
    const cryptoApi = globalThis.crypto as Crypto | undefined;
    if (cryptoApi?.randomUUID) {
        return cryptoApi.randomUUID();
    }

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, character => {
        const random = Math.floor(Math.random() * 16);
        const value = character === 'x' ? random : (random & 0x3) | 0x8;
        return value.toString(16);
    });
};

export const loadPlayerIdentity = (): PlayerIdentity | null => {
    const name = localStorage.getItem(PLAYER_NAME_KEY)?.trim();
    if (!name) {
        return null;
    }

    let id = localStorage.getItem(PLAYER_ID_KEY);
    if (!id) {
        id = createPlayerId();
        localStorage.setItem(PLAYER_ID_KEY, id);
    }

    return { id, name };
};

export const savePlayerName = (name: string): PlayerIdentity => {
    const normalizedName = name.trim().substring(0, 16);
    if (!normalizedName) {
        throw new Error('Please enter your name');
    }

    let id = localStorage.getItem(PLAYER_ID_KEY);
    if (!id) {
        id = createPlayerId();
        localStorage.setItem(PLAYER_ID_KEY, id);
    }
    localStorage.setItem(PLAYER_NAME_KEY, normalizedName);
    return { id, name: normalizedName };
};

export const clearPlayerName = () => {
    localStorage.removeItem(PLAYER_NAME_KEY);
};
