import { FinishedGameStatus } from "./database";

export enum GAME_ACTIONS {
    CREATE_GAME = 'create-game',
    JOIN_GAME = 'join-game',
    FIND_GAME = 'find-game',
    CHANGE_NAME = 'change-name',
    KICK_PLAYER = 'kick-player',
    START_GAME = 'start-game',
    STATUS = 'status',
    LEAVE_GAME = 'leave-game',
    SELECT_PLAYER = 'select-player',
    REMOVE_PLAYER_FROM_MISSION = 'remove-player-from-mission',
    SEND_FOR_APPROVAL = 'send-for-approval',
    VOTE = 'vote',
    ACT_MISSION = 'act-mission',
    RESTART_GAME = 'restart-game',
}

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
    MISSIOM_FAILED = 'MISSION_FAILED',
}
export enum VOTE {
    APPROVE = 'APPROVE',
    REJECT = 'REJECT',
}
export enum MISSION_ACTION {
    SUCCESS = 'SUCCESS',
    FAIL = 'FAIL',
}

export interface MissionSpec {
    fails: number; // number of fails to fail the mission
    players: number; //required number of players for the mission
}

export interface GameSpec {
    spies: number; // number of spies in the game
    '1': MissionSpec, // mission 1 specifications
    '2': MissionSpec, // mission 2 specifications
    '3': MissionSpec, // mission 3 specifications
    '4': MissionSpec, // mission 4 specifications
    '5': MissionSpec, // mission 5 specifications
}

export interface PlayerInfo {
    id: string; // user id
    name: string; // provided or default name
    role?: ROLE; // generated role
    isALeader?: boolean; // temporary property
    gameIndex?: number; // player index
}

export interface MissionState {
    status: MISSION_STATUS; // mission status
    preSelectedPlayers: number[]; // preselected players numbers
    votes?: { [key: string]: VOTE }; // map of votes: number of player - approve/reject
    playersOnMission?: number[]; //approved players on the mission
    missionActions?: { [key: string]: MISSION_ACTION }; // map of mission actions, number of player - success/fail
}

export interface RejectionInfo {
    rejectedPlayers: number[], // leader selection: index numbers of players which were rejected
    leader: number, // who was a leader on this rejection
    mission: number, // number of rejected mission
}

export interface GameState {
    gameId: string; // uniq id
    creator: string; // who created the game, id of a user
    creationTime: number; // timestamp of creation date
    status: GAME_STATUS; // game status
    leader: number; // index number of player who is a leader, 0 - no leader
    mission: number; // number of mission (1-5), 0 - no mission
    players: { [key: string]: PlayerInfo }; // map of player infos
    missions: { [key: string]: MissionState }; // map of mission states
    rejections: { [key: string]: RejectionInfo }; // map of rejections, key - number of rejection
    finished?: FinishedGameStatus; // short status when the game is finished
}

// remove sensetive info: who approved and who rejected
export type MissionStateResponse = {
    votes: VOTE[];
    missionActions?: MISSION_ACTION[];
} & Omit<MissionState, 'votes' | 'missionActions'>;

// insensetive game state response
// remove role from all players except user's
export type GameStateResponse = {
    missions: { [key: string]: MissionStateResponse };
    playerAction: GAME_STATUS;
    playerIndex: number;
} & Omit<GameState, 'missions'>;

