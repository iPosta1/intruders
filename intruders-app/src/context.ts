import { createContext } from "react";
import { PlayerIdentity } from "./services/playerIdentity";

export const AppContext = createContext({
    player: null as PlayerIdentity | null,
    setPlayerName: (_name: string) => {},
    clearPlayerName: () => {},
});

export const HOST = 'http://intru-manual-1158751084.us-east-2.elb.amazonaws.com';
export const SERVER_URL = 'https://pfi1of1wg6.execute-api.us-east-2.amazonaws.com';
