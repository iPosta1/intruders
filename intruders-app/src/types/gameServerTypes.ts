export enum GAME_STATUS {
    WAITING_PLAYERS_TO_JOIN = 'WAITING_PLAYERS_TO_JOIN',
    WAITING_LEADER_TO_SELECT_PLAYERS = 'WAITING_LEADER_TO_SELECT_PLAYERS',
    WAITING_PLAYERS_MISSION_APPROVALS = 'WAITING_PLAYERS_MISSION_APPROVALS',
    WAITING_MISSION_PLAYERS_TO_FAIL_OR_SUCCESS = 'WAITING_MISSION_PLAYERS_TO_FAIL_OR_SUCCESS',
    GAME_FINISHED = 'GAME_FINISHED',
    //player status
    SELECT_PLAYERS_ON_MISSION = 'SELECT_PLAYERS_ON_MISSION',
    APPROVE_OR_REJECT_PLAYERS = 'APPROVE_OR_REJECT_PLAYERS',
    ACT_MISSON = 'ACT_MISSON',
    START_GAME = 'START_GAME',
    RESTART_GAME = 'RESTART_GAME',
}

export enum ROLE {
    SPY = 'spy',
    RESISTENCE = 'resistence',
}
export enum MISSION_STATUS {
    SELECTING_PLAYERS = 'SELECTING_PLAYERS',
    VOTING = 'VOTING',
    ACTING = 'ACTING',
    MISSION_SUCCEED = 'MISSION_SUCCEED',
    MISSION_FAILED = 'MISSION_FAILED',
}
export enum VOTE {
    APPROVE = 'APPROVE',
    REJECT = 'REJECT',
}
export enum MISSION_ACTION {
    SUCCESS = 'SUCCESS',
    FAIL = 'FAIL',
    UNKNOWN = 'UNKNOWN',
}

export type FinishedGameStatus = {
    players: { [name: string]: ROLE };
    missions: { [misionNumber: string]: MISSION_STATUS };
    winner: ROLE;
    rejections: number;
}

export type MissionStateResponse = {
    votes: VOTE[];
    missionActions?: MISSION_ACTION[];
    status: MISSION_STATUS; // mission status
    preSelectedPlayers: number[]; // preselected players numbers
    playersOnMission?: number[]; //approved players on the mission
};

export type GameStateResponse = {
    missions: { [key: string]: MissionStateResponse };
    playerAction: GAME_STATUS;
    playerIndex: number;
    gameId: string; // uniq id
    creator: string; // who created the game, id of a user
    creationTime: number; // timestamp of creation date
    status: GAME_STATUS; // game status
    leader: number; // index number of player who is a leader, 0 - no leader
    mission: number; // number of mission (1-5), 0 - no mission
    players: { [key: string]: PlayerInfo }; // map of player infos
    rejections: { [key: string]: RejectionInfo }; // map of rejections, key - number of rejection
    finished?: FinishedGameStatus; // short status when the game is finished
};

export interface PlayerInfo {
    id: string; // user id
    name: string; // provided or default name
    role?: ROLE; // generated role
    isALeader?: boolean; // temporary property
    gameIndex?: number; // player index
}

export interface RejectionInfo {
    rejectedPlayers: number[], // leader selection: index numbers of players which were rejected
    leader: number, // who was a leader on this rejection
    mission: number, // number of rejected mission
}