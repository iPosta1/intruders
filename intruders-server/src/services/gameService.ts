import { GameDao } from '../dao/gameDao'
import { DBMissionAction, DBRejection, DBVote, DBGame, DBMission, DBPlayer, FinishedGameStatus } from '../types/database';
import {
    GameState, GameStateResponse, GAME_ACTIONS, GAME_STATUS, MissionState, MissionStateResponse, MISSION_ACTION,
    MISSION_STATUS, PlayerInfo, RejectionInfo, ROLE, VOTE
} from '../types/types';
import { checkGameId } from '../utils/decorators';
import { generateGameId, getGameSpecs } from '../utils/gameUtils';

type ParamsMap = { [key: string]: string };

const shuffle = <T>(items: T[]): T[] => {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
    }
    return result;
};

export class GameService {

    constructor(private readonly userId: string, private readonly defaultUserName: string, private readonly gameDao: GameDao) { }

    public async processRequest(action: GAME_ACTIONS, params?: ParamsMap) {
        switch (action) {
            case GAME_ACTIONS.CREATE_GAME:
                return this.createGame();
            case GAME_ACTIONS.JOIN_GAME:
                return this.joinGame(params);
            case GAME_ACTIONS.FIND_GAME:
                return this.findGame();
            case GAME_ACTIONS.KICK_PLAYER:
                return this.kickPlayer(params);
            case GAME_ACTIONS.CHANGE_NAME:
                return this.changeName(params);
            case GAME_ACTIONS.START_GAME:
                return this.startGame(params);
            case GAME_ACTIONS.STATUS:
                return this.status(params);
            case GAME_ACTIONS.LEAVE_GAME:
                return this.leaveGame(params);
            case GAME_ACTIONS.SELECT_PLAYER:
                return this.selectPlayerOnMission(params);
            case GAME_ACTIONS.REMOVE_PLAYER_FROM_MISSION:
                return this.removePlayerFromMission(params);
            case GAME_ACTIONS.SEND_FOR_APPROVAL:
                return this.sendForApproval(params);
            case GAME_ACTIONS.VOTE:
                return this.vote(params);
            case GAME_ACTIONS.ACT_MISSION:
                return this.actMission(params);
            case GAME_ACTIONS.RESTART_GAME:
                return this.restartGame(params);
            default:
                throw new Error('Unknown action');
        }
    }

    protected async createGame(): Promise<GameStateResponse> {
        await this.checkIfUserIsNotAttendingInOtherGames();
        const gameId = generateGameId();
        let existingGame;
        try {
            existingGame = await this.gameDao.getGame(gameId);
        } catch {}
        if (!!existingGame) {
            return this.createGame();
        } else {
            await this.gameDao.createGame(gameId, new Date().getTime(), this.userId, this.defaultUserName);
            return this.status({ gameId });
        }
    }

    @checkGameId()
    protected async joinGame(params: ParamsMap) {
        await this.checkIfUserIsNotAttendingInOtherGames();
        const gameState = await this.loadGameState(params.gameId);
        if (!gameState) {
            throw new Error('The game does not exist');
        }
        if (gameState.status !== GAME_STATUS.WAITING_PLAYERS_TO_JOIN) {
            throw new Error('The game is already started');
        }
        if (this.getGameNumberOfPlayers(gameState) === 10) {
            throw new Error('Only 10 players allowed');
        }
        await this.gameDao.createPlayer(params.gameId, this.userId, this.defaultUserName);
        return this.status(params);
    }

    protected async findGame() {
        const game = await this.gameDao.getPlayerGame(this.userId);
        if (game) {
            return this.status({ gameId: game });
        }
        return null;
    }

    @checkGameId()
    protected async leaveGame(params: ParamsMap) {
        const gameState = await this.loadGameState(params.gameId);
        if (gameState.finished) {
            await this.gameDao.deletePlayer(params.gameId, this.userId);
            return;
        }
        if (gameState.status === GAME_STATUS.WAITING_PLAYERS_TO_JOIN && gameState.creator !== this.userId) {
            await this.gameDao.deletePlayer(params.gameId, this.userId);
        } else {
            console.log('shuld delete game Items');
            await this.gameDao.deleteGameItems(params.gameId);
        }
    }

    @checkGameId()
    protected async changeName(params: ParamsMap) {
        const newName = params.newName?.trim();
        if (!newName) {
            throw new Error('Name is required');
        }
        if (newName.length > 16) {
            throw new Error('Name is too long');
        }
        const game = await this.gameDao.getGame(params.gameId);
        if (!game) {
            throw new Error('The game does not exist');
        }
        await this.gameDao.changeName(params.gameId, this.userId, newName);
    }

    @checkGameId()
    protected async kickPlayer(params: ParamsMap) {
        const game = await this.gameDao.getGame(params.gameId);
        await this.checkIfUserIsAGameOwner(params.gameId, game);
        if (game.status !== GAME_STATUS.WAITING_PLAYERS_TO_JOIN) {
            throw new Error('Cannot kick player when the game has already started');
        }
        await this.gameDao.deletePlayer(params.gameId, params.playerId);
    }

    @checkGameId()
    protected async startGame(params: ParamsMap) {
        const gameState = await this.loadGameState(params.gameId);
        if (gameState.status !== GAME_STATUS.WAITING_PLAYERS_TO_JOIN) {
            throw new Error('Cannot start game right now');
        }
        await this.checkIfUserIsAGameOwner(params.gameId, gameState);
        const players: PlayerInfo[] = Object.keys(gameState.players).map(playerNumber => ({
            id: gameState.players[playerNumber].id,
            name: gameState.players[playerNumber].name,
            role: null as ROLE,
        }));
        if (players.length < 5 || players.length > 10) {
            throw new Error('You need 5-10 players for this game');
        }
        const specs = getGameSpecs(players.length);
        const playersWithRoles = this.shufflePlayersAndAssignRoles(players, specs.spies);
        await this.gameDao.updateGamePlayers(params.gameId, playersWithRoles);
        await this.gameDao.updateGameState(params.gameId, GAME_STATUS.WAITING_LEADER_TO_SELECT_PLAYERS, playersWithRoles.findIndex(player => !!player.isALeader) + 1, 1);
        await this.gameDao.createMission(params.gameId, 1);
    }

    @checkGameId()
    protected async status(params: ParamsMap): Promise<GameStateResponse> {
        const gameState = await this.loadGameState(params.gameId);
        this.checkIfUserHasAccessInTheGameAndGetIndex(gameState);
        return this.gameStateToGameResponse(gameState);
    }


    @checkGameId()
    protected async selectPlayerOnMission(params: ParamsMap) {
        const gameState = await this.getStateAndCheckIfUserCanSelectPlayersOnAMission(params.gameId);
        const mission = await this.gameDao.getMission(params.gameId, gameState.mission);
        const specs = getGameSpecs(this.getGameNumberOfPlayers(gameState));
        if (mission.preSelectedPlayers.length === (specs as any)[gameState.mission].players) {
            throw new Error('Cannot select more players on the mission');
        }
        const playerNumber = Number(params.playerNumber);
        if (!mission.preSelectedPlayers.includes(playerNumber)) {
            mission.preSelectedPlayers.push(playerNumber);
        }
        await this.gameDao.putPreselectedPlayerOnAMission(params.gameId, gameState.mission, mission.preSelectedPlayers);
    }

    @checkGameId()
    protected async removePlayerFromMission(params: ParamsMap) {
        const gameState = await this.getStateAndCheckIfUserCanSelectPlayersOnAMission(params.gameId);
        const mission = await this.gameDao.getMission(params.gameId, gameState.mission);
        const preselectedPlayers = mission.preSelectedPlayers.filter(player => player !== Number(params.playerNumber));
        await this.gameDao.putPreselectedPlayerOnAMission(params.gameId, gameState.mission, preselectedPlayers);
    }

    @checkGameId()
    protected async sendForApproval(params: ParamsMap) {
        const gameState = await this.getStateAndCheckIfUserCanSelectPlayersOnAMission(params.gameId);
        const numberOfPlayers = this.getGameNumberOfPlayers(gameState);
        const gameSpec = getGameSpecs(numberOfPlayers);
        if (gameState.missions[gameState.mission]?.preSelectedPlayers.length !== (gameSpec as any)[gameState.mission.toString()].players) {
            throw new Error('Not enough players on mission');
        }
        await this.gameDao.updateGameState(params.gameId, GAME_STATUS.WAITING_PLAYERS_MISSION_APPROVALS, gameState.leader, gameState.mission);
        await this.gameDao.updateMissionState(params.gameId, gameState.mission, MISSION_STATUS.VOTING);
    }

    @checkGameId()
    protected async vote(params: ParamsMap) {
        if (params.vote !== VOTE.APPROVE && params.vote !== VOTE.REJECT) {
            throw new Error('Invalid vote');
        }
        const gameState = await this.loadGameState(params.gameId);
        const userPlayerIndex = this.checkIfUserHasAccessInTheGameAndGetIndex(gameState);
        if (gameState.status !== GAME_STATUS.WAITING_PLAYERS_MISSION_APPROVALS) {
            throw new Error('This action is not allowed on the current mission stage');
        }
        gameState.missions[gameState.mission].votes[userPlayerIndex] = params.vote;
        await this.gameDao.putVote(params.gameId, gameState.mission, Number(userPlayerIndex), params.vote);
        if (this.getGameNumberOfPlayers(gameState) === Object.keys(gameState.missions[gameState.mission].votes).length) {
            await this.executeVotesCalculation(gameState);
        }
    }

    @checkGameId()
    protected async actMission(params: ParamsMap) {
        const gameState = await this.loadGameState(params.gameId);
        const userPlayerIndex = Number(await this.checkIfUserHasAccessInTheGameAndGetIndex(gameState));
        if (gameState.status !== GAME_STATUS.WAITING_MISSION_PLAYERS_TO_FAIL_OR_SUCCESS) {
            throw new Error('This action is not allowed on the current mission stage');
        }
        if (!gameState.missions[gameState.mission].playersOnMission.includes(userPlayerIndex)) {
            throw new Error('You can not participate in this mission');
        }
        if (gameState.missions[gameState.mission].missionActions[userPlayerIndex]) {
            throw new Error('You have already acted on this mission');
        }
        if (params.action === MISSION_ACTION.FAIL && gameState.players[userPlayerIndex].role !== ROLE.SPY) {
            throw new Error('Only a spy can fail a mission');
        }
        await this.gameDao.putMissionAct(params.gameId, gameState.mission, userPlayerIndex, params.action as MISSION_ACTION);
        gameState.missions[gameState.mission].missionActions[userPlayerIndex] = params.action as MISSION_ACTION;
        const gameSpec = getGameSpecs(this.getGameNumberOfPlayers(gameState));
        if ((gameSpec as any)[gameState.mission.toString()].players === Object.keys(gameState.missions[gameState.mission].missionActions).length) {
            await this.executeMission(gameState);
        }
    }

    @checkGameId()
    protected async restartGame(params: ParamsMap) {
        await this.checkIfUserIsAGameOwner(params.gameId);
        await this.gameDao.resetGame(params.gameId);
        await this.gameDao.updateGameState(params.gameId, GAME_STATUS.WAITING_PLAYERS_TO_JOIN, 0, 0);
        await this.startGame({ gameId: params.gameId });
    }

    private async loadGameState(gameId: string): Promise<GameState> {
        let game: DBGame = null;
        const playersMap: { [key: string]: PlayerInfo } = {};
        const voteMap: { [missionKey: string]: { [key: string]: VOTE } } = {};
        const missionActionsMap: { [missionKey: string]: { [key: string]: MISSION_ACTION } } = {};
        const missions: DBMission[] = [];
        const rejectionsMap: { [key: string]: RejectionInfo } = {};
        const gameItems = await this.gameDao.getGameItems(gameId);
        let playerNumber = 0;
        gameItems.forEach(item => {
            const [type, keyPart1, keyPart2] = item.key.split('$');
            switch (type) {
                case 'game':
                    game = item as DBGame;
                    return;
                case 'mission':
                    missions.push(item as DBMission);
                    return;
                case 'vote':
                    if (!voteMap[keyPart1]) {
                        voteMap[keyPart1] = {};
                    }
                    voteMap[keyPart1][keyPart2] = (item as DBVote).vote;
                    return;
                case 'action':
                    if (!missionActionsMap[keyPart1]) {
                        missionActionsMap[keyPart1] = {};
                    }
                    missionActionsMap[keyPart1][keyPart2] = (item as DBMissionAction).action;
                    return;
                case 'rejection':
                    rejectionsMap[keyPart1] = {
                        leader: (item as DBRejection).leader,
                        mission: (item as DBRejection).mission,
                        rejectedPlayers: (item as DBRejection).rejectedPlayers,
                    };
                    return;
                case 'player':
                    playerNumber++;
                    playersMap[(item as DBPlayer).gameIndex || playerNumber] = {
                        name: (item as DBPlayer).name,
                        id: keyPart1,
                        role: (item as DBPlayer)?.role,
                    }
                    return;
                default:
                    return;

            }
        });
        if (!game) {
            throw new Error('The game cannot be found');
        }
        const missionMap: { [key: string]: MissionState } = {};
        missions.forEach(dbMission => {
            const [, missionNumber] = dbMission.key.split('$');
            missionMap[missionNumber] = {
                status: dbMission.status,
                preSelectedPlayers: dbMission.preSelectedPlayers,
                votes: voteMap[missionNumber] || {},
                playersOnMission: dbMission.playersOnMission,
                missionActions: missionActionsMap[missionNumber] || {},
            }
        });
        return {
            gameId,
            creationTime: game.creationTime,
            creator: game.creator,
            leader: game.leader,
            mission: game.mission,
            missions: missionMap,
            players: playersMap,
            rejections: rejectionsMap,
            status: game.status,
            finished: game.finished,
        };
    }

    private gameStateToGameResponse(gameState: GameState): GameStateResponse {
        const missions: { [key: string]: MissionStateResponse } = {};
        if (!!gameState.finished) {
            return {
                gameId: gameState.gameId,
                finished: gameState.finished,
                status: GAME_STATUS.GAME_FINISHED,
            } as any;
        }
        Object.keys(gameState.missions).forEach(missionNumber => {
            missions[missionNumber] = {
                status: gameState.missions[missionNumber].status,
                playersOnMission: gameState.missions[missionNumber].playersOnMission,
                preSelectedPlayers: gameState.missions[missionNumber].preSelectedPlayers,
                missionActions: Object.keys(gameState.missions[missionNumber].missionActions)
                    .map(playerId =>
                        gameState.missions[missionNumber].status === MISSION_STATUS.MISSIOM_FAILED ||
                        gameState.missions[missionNumber].status === MISSION_STATUS.MISSION_SUCCEED
                            ? gameState.missions[missionNumber].missionActions[playerId]
                            : MISSION_ACTION.UNKNOWN
                    ),
                votes: Object.keys(gameState.missions[missionNumber].votes).map(playerId => gameState.missions[missionNumber].votes[playerId])
            }
        });
        const players: { [key: string]: PlayerInfo } = {};
        const userPlayerIndex = Object.keys(gameState.players).find(playerIndex => gameState.players[playerIndex].id === this.userId);
        const userPlayerIsASpy = gameState.players[userPlayerIndex]?.role === ROLE.SPY;
        Object.keys(gameState.players).forEach(playerIndex => {
            players[playerIndex] = {
                id: gameState.players[playerIndex].id,
                name: gameState.players[playerIndex].name,
                role: (userPlayerIndex === playerIndex.toString() || userPlayerIsASpy) ? gameState.players[playerIndex]?.role : undefined,
            };
        });
        return {
            ...gameState,
            missions,
            playerIndex: Number(userPlayerIndex),
            players: players,
            playerAction: this.getPlayerAction(gameState, Number(userPlayerIndex)),
        }
    }

    private shufflePlayersAndAssignRoles(players: PlayerInfo[], numberOfSpies: number) {
        let shuffledPlayers = shuffle(players);
        shuffledPlayers[0].isALeader = true;
        shuffledPlayers = shuffle(shuffledPlayers);
        shuffledPlayers.forEach((player, index) => {
            player.role = index < numberOfSpies ? ROLE.SPY : ROLE.RESISTENCE;
        });
        return shuffle(shuffledPlayers);
    }

    private getPlayerAction(gameState: GameState, playerIndex: number): GAME_STATUS {
        const isALeader = gameState.leader === playerIndex;
        if (gameState.status === GAME_STATUS.WAITING_LEADER_TO_SELECT_PLAYERS && gameState.leader === playerIndex) {
            return isALeader ? GAME_STATUS.SELECT_PLAYERS_ON_MISSION : GAME_STATUS.WAITING_LEADER_TO_SELECT_PLAYERS;
        } else if (gameState.status === GAME_STATUS.WAITING_PLAYERS_MISSION_APPROVALS) {
            return GAME_STATUS.APPROVE_OR_REJECT_PLAYERS;
        } else if (gameState.status === GAME_STATUS.WAITING_MISSION_PLAYERS_TO_FAIL_OR_SUCCESS) {
            return gameState.missions[gameState.mission].playersOnMission.includes(playerIndex) &&
                !gameState.missions[gameState.mission].missionActions[playerIndex] ? GAME_STATUS.ACT_MISSON :
                GAME_STATUS.WAITING_MISSION_PLAYERS_TO_FAIL_OR_SUCCESS;
        } else if (gameState.status === GAME_STATUS.WAITING_PLAYERS_TO_JOIN) {
            return isALeader ? GAME_STATUS.START_GAME : GAME_STATUS.WAITING_PLAYERS_TO_JOIN;
        } else if (gameState.status === GAME_STATUS.GAME_FINISHED) {
            return isALeader ? GAME_STATUS.RESTART_GAME : GAME_STATUS.GAME_FINISHED;
        } else {
            return gameState.status;
        }
    }

    private async executeVotesCalculation(gameState: GameState) {
        const numberOfPlayers = this.getGameNumberOfPlayers(gameState);
        const votes = Object.keys(gameState.missions[gameState.mission].votes).map(playerIndex => gameState.missions[gameState.mission].votes[playerIndex]);
        const approvals = votes.filter(vote => vote === VOTE.APPROVE).length;
        const rejects = votes.filter(vote => vote === VOTE.REJECT).length;
        if (approvals > rejects) {
            await this.gameDao.updateGameState(gameState.gameId, GAME_STATUS.WAITING_MISSION_PLAYERS_TO_FAIL_OR_SUCCESS,
                gameState.leader, gameState.mission);
            await this.gameDao.initFinalPlayersOnMission(gameState.gameId, gameState.mission, gameState.missions[gameState.mission].preSelectedPlayers);
        } else {
            const currentNumberOfRejections = Object.keys(gameState.rejections).length;
            gameState.rejections[(currentNumberOfRejections + 1).toString()] = {
                leader: gameState.leader,
                mission: gameState.mission,
                rejectedPlayers: gameState.missions[gameState.mission].playersOnMission,
            };
            const numberOfRejections = currentNumberOfRejections + 1;
            if (numberOfRejections === 5) {
                await this.finishGame(gameState, ROLE.SPY);
            } else {
                await this.gameDao.createRejection(gameState.gameId, numberOfRejections, gameState.leader, gameState.mission,
                    gameState.missions[gameState.mission].playersOnMission);
                await this.gameDao.resetMissionState(gameState.gameId, gameState.mission);
                await this.gameDao.removeVotes(gameState.gameId, gameState.mission, numberOfPlayers);
                await this.gameDao.updateGameState(gameState.gameId, GAME_STATUS.WAITING_LEADER_TO_SELECT_PLAYERS, this.getNextLeader(gameState), gameState.mission);
            }
        }
    }

    private async executeMission(gameState: GameState) {
        const numberOfPlayers = this.getGameNumberOfPlayers(gameState);
        const gameSpec = getGameSpecs(numberOfPlayers);
        const numberOfFails = Object.keys(gameState.missions[gameState.mission].missionActions)
            .map(playerIndex => gameState.missions[gameState.mission].missionActions[playerIndex])
            .filter(failOrSuccess => failOrSuccess === MISSION_ACTION.FAIL).length;
        if (numberOfFails >= (gameSpec as any)[gameState.mission].fails) {
            await this.gameDao.updateMissionState(gameState.gameId, gameState.mission, MISSION_STATUS.MISSIOM_FAILED);
            gameState.missions[gameState.mission].status = MISSION_STATUS.MISSIOM_FAILED;
        } else {
            await this.gameDao.updateMissionState(gameState.gameId, gameState.mission, MISSION_STATUS.MISSION_SUCCEED);
            gameState.missions[gameState.mission].status = MISSION_STATUS.MISSION_SUCCEED;
        }
        let successMissions = 0;
        let failedMissions = 0;
        Object.keys(gameState.missions).forEach(missionNumber => {
            if (gameState.missions[missionNumber].status === MISSION_STATUS.MISSIOM_FAILED) {
                failedMissions++;
            } else if (gameState.missions[missionNumber].status === MISSION_STATUS.MISSION_SUCCEED) {
                successMissions++;
            }
        });
        
        if (successMissions > 2) {
            await this.finishGame(gameState, ROLE.RESISTENCE);
        } else if (failedMissions > 2) {
            await this.finishGame(gameState, ROLE.SPY);
        } else {
            await this.gameDao.createMission(gameState.gameId, gameState.mission + 1);
            await this.gameDao.updateGameState(gameState.gameId, GAME_STATUS.WAITING_LEADER_TO_SELECT_PLAYERS, this.getNextLeader(gameState), gameState.mission + 1);
        }
    }

    private async finishGame(gameState: GameState, role: ROLE) {
        const players: { [name: string]: ROLE } = {};
        const missions: { [mission: string]: MISSION_STATUS } = {};
        Object.keys(gameState.players).forEach(playerIndex => {
            players[gameState.players[playerIndex].name] = gameState.players[playerIndex].role;
        });
        Object.keys(gameState.missions).forEach(missionNumber => {
            missions[missionNumber] = gameState.missions[missionNumber].status;
        });
        const finishedGameStatus: FinishedGameStatus = {
            rejections: Object.keys(gameState.rejections).length,
            winner: role,
            players, missions
        };
        await this.gameDao.finishGame(gameState.gameId, finishedGameStatus);
    }

    private getGameNumberOfPlayers(gameState: GameState) {
        return Object.keys(gameState.players).length;
    }

    private getNextLeader(gameState: GameState) {
        return gameState.leader === this.getGameNumberOfPlayers(gameState) ? 1 : gameState.leader + 1;
    }

    private async getStateAndCheckIfUserCanSelectPlayersOnAMission(gameId: string): Promise<GameState> {
        const gameState = await this.loadGameState(gameId);
        if (gameState.status !== GAME_STATUS.WAITING_LEADER_TO_SELECT_PLAYERS) {
            throw new Error('Invalid action');
        }
        if (gameState.missions[gameState.mission].status !== MISSION_STATUS.SELECTING_PLAYERS) {
            throw new Error('Action is not allowed on this mission stage');
        }
        const userPlayerIndex = this.checkIfUserHasAccessInTheGameAndGetIndex(gameState);
        if (Number(userPlayerIndex) !== gameState.leader) {
            throw new Error('Only leader can select players on a mission');
        }
        return gameState;
    }

    private checkIfUserHasAccessInTheGameAndGetIndex(gameState: GameState) {
        const userPlayerIndex = Object.keys(gameState.players).find(playerIndex => gameState.players[playerIndex].id === this.userId);
        if (!userPlayerIndex) {
            throw new Error('User does not participate in this game');
        }
        return userPlayerIndex;
    }

    private async checkIfUserIsNotAttendingInOtherGames() {
        const game = await this.gameDao.getPlayerGame(this.userId);
        if (game) {
            throw new Error('User is already attending to another game');
        }
    }

    private async checkIfUserIsAGameOwner(gameId: string, gameState?: GameState | DBGame) {
        const game = gameState ? gameState : (await this.gameDao.getGame(gameId));
        if (game.creator !== this.userId) {
            throw new Error('You are not a game owner');
        }
    }
}

