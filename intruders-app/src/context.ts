import { createContext } from "react";
import { PlayerIdentity } from "./services/playerIdentity";

export const AppContext = createContext({
    player: null as PlayerIdentity | null,
    setPlayerName: (_name: string) => {},
    clearPlayerName: () => {},
});

export const HOST = 'https://intruders.click';
export const SERVER_URL = 'https://pfi1of1wg6.execute-api.us-east-2.amazonaws.com';
