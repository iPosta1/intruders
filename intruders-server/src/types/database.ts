import { GAME_STATUS, MISSION_ACTION, MISSION_STATUS, ROLE, VOTE } from "./types";

export type DBKey = {
    key: string; // primary
    gameId: string; // sort
};

export type DBPlayer = {
    name: string;
    gameIndex?: number;
    role?: ROLE;
} & DBKey;

export type FinishedGameStatus = {
    players: { [name: string]: ROLE };
    missions: { [misionNumber: string]: MISSION_STATUS };
    winner: ROLE;
    rejections: number;
}

export type DBGame = {
    creator: string;
    creationTime: number;
    status: GAME_STATUS;
    leader: number;
    mission: number;
    finished?: FinishedGameStatus;
} & DBKey;

export type DBMission = {
    status: MISSION_STATUS;
    preSelectedPlayers: number[];
    playersOnMission?: number[];
} & DBKey;

export type DBVote = {
    vote: VOTE;
} & DBKey;

export type DBMissionAction = {
    action: MISSION_ACTION;
} & DBKey;

export type DBRejection = {
    rejectedPlayers: number[],
    leader: number,
    mission: number,
} & DBKey;

export type DBItem = DBGame | DBMission | DBMissionAction | DBVote | DBPlayer | DBRejection;

