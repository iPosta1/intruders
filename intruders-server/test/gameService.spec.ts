import { GameDao } from "../src/dao/gameDao";
import { GameService } from "../src/services/gameService";
import { GAME_ACTIONS, GAME_STATUS, MISSION_ACTION, MISSION_STATUS, ROLE, VOTE } from "../src/types/types";
import { mockClass } from "./utils";

describe('Game service tests', () => {
    let gameDAO: jest.Mocked<GameDao>;
    const userId = 'test-user-id';
    const defaultUserName = 'default-test-user-name';

    beforeEach(() => {
        gameDAO = mockClass([
            'changeName',
            'createGame',
            'createMission',
            'createPlayer',
            'createRejection',
            'deleteGameItems',
            'deletePlayer',
            'finishGame',
            'getGame',
            'getGameItems',
            'getMission',
            'getPlayer',
            'getPlayerGame',
            'initFinalPlayersOnMission',
            'putMissionAct',
            'putPreselectedPlayerOnAMission',
            'putVote',
            'removeVotes',
            'resetGame',
            'resetMissionState',
            'updateGamePlayers',
            'updateGameState',
            'updateMissionState',
        ]);
    });

    // CREATE_GAME tests
    it('Should call create game when user is not attending in other games', async () => {
        gameDAO.getPlayerGame.mockResolvedValue(null);
        gameDAO.createGame.mockResolvedValue();
        gameDAO.getGameItems.mockResolvedValue(Promise.resolve([
            {
                key: `game$gameId`,
                gameId: 'gameId',
                creator: userId,
                creationTime: new Date().getTime(),
                status: GAME_STATUS.WAITING_PLAYERS_TO_JOIN,
                leader: 0,
                mission: 0,
            },
            {
                key: `player$${userId}`,
                gameId: 'gameId',
                name: defaultUserName,
            }
        ]));

        const statusResult = await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.CREATE_GAME);
        expect(gameDAO.createGame).toHaveBeenCalledWith(expect.any(String), expect.any(Number), "test-user-id", "default-test-user-name");
        expect(statusResult).toEqual({
            "creationTime": expect.any(Number),
            "creator": "test-user-id",
            "gameId": expect.any(String),
            "leader": 0,
            "mission": 0,
            "missions": {},
            "playerAction": GAME_STATUS.WAITING_PLAYERS_TO_JOIN,
            "playerIndex": 1,
            "players": {
                "1": {
                    "id": "test-user-id",
                    "name": "default-test-user-name"
                }
            },
            "rejections": {},
            "status": GAME_STATUS.WAITING_PLAYERS_TO_JOIN
        });
    });

    it('Should throw error on create game when user is attending in other games', async () => {
        gameDAO.getPlayerGame.mockResolvedValue(Promise.resolve('test-id'));
        gameDAO.createGame.mockResolvedValue();
        try {
            await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.CREATE_GAME);
        } catch (e) {
            expect((e as any).message).toBe('User is already attending to another game');
        }
        expect(gameDAO.createGame).not.toHaveBeenCalled();
    });

    // JOIN_GAME tests
    it('Should throw error on join game when user is attending in other games', async () => {
        gameDAO.getPlayerGame.mockResolvedValue(Promise.resolve('test-id'));
        try {
            await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.JOIN_GAME, {gameId: 'idqz'});
        } catch (e) {
            expect((e as any).message).toBe('User is already attending to another game');
        }
        expect(gameDAO.createPlayer).not.toHaveBeenCalled();
    });

    it('Should throw error on join game when gameId is not valid', async () => {
        gameDAO.getPlayerGame.mockResolvedValue(Promise.resolve('test-id'));
        try {
            await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.JOIN_GAME, {gameId: 'invalid'});
        } catch (e) {
            expect((e as any).message).toBe('GameId is not provided or is not valid');
        }
        expect(gameDAO.createPlayer).not.toHaveBeenCalled();
    });

    it('Should join game', async () => {
        gameDAO.getPlayerGame.mockResolvedValue(Promise.resolve(null));
        gameDAO.createPlayer.mockResolvedValue(Promise.resolve());
        gameDAO.getGameItems.mockResolvedValue(Promise.resolve([
            {
                key: `game$gameId`,
                gameId: 'gameId',
                creator: 'some-mf',
                creationTime: new Date().getTime(),
                status: GAME_STATUS.WAITING_PLAYERS_TO_JOIN,
                leader: 0,
                mission: 0,
            },
            {
                key: `player$some-mf`,
                gameId: 'gameId',
                name: 'mf-name',
            },
            {
                key: `player$${userId}`,
                gameId: 'gameId',
                name: defaultUserName,
            }
        ]));
        const response = await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.JOIN_GAME, {gameId: 'idqz'});
        expect(gameDAO.createPlayer).toHaveBeenCalledWith("idqz", "test-user-id", "default-test-user-name");
        expect(response).toEqual({
            "creationTime": expect.any(Number),
            "creator": "some-mf",
            "gameId": expect.any(String),
            "leader": 0,
            "mission": 0,
            "missions": {},
            "playerAction": GAME_STATUS.WAITING_PLAYERS_TO_JOIN,
            "playerIndex": 2,
            "players": {
                "1": {
                    "id": "some-mf",
                    "name": "mf-name"
                },
                "2": {
                    "id": "test-user-id",
                    "name": "default-test-user-name"
                }
            },
            "rejections": {},
            "status": GAME_STATUS.WAITING_PLAYERS_TO_JOIN
        });
    });

    // FIND_GAME tests
    it('Should find players game', async () => {
        gameDAO.getPlayerGame.mockResolvedValue(Promise.resolve('idqz'));
        gameDAO.getGameItems.mockResolvedValue(Promise.resolve([
            {
                key: `game$gameId`,
                gameId: 'gameId',
                creator: 'some-mf',
                creationTime: new Date().getTime(),
                status: GAME_STATUS.WAITING_PLAYERS_TO_JOIN,
                leader: 0,
                mission: 0,
            },
            {
                key: `player$some-mf`,
                gameId: 'gameId',
                name: 'mf-name',
            },
            {
                key: `player$${userId}`,
                gameId: 'gameId',
                name: defaultUserName,
            }
        ]));
        const response = await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.FIND_GAME);
        expect((response as any).gameId).toEqual('idqz');
    });

    //LEAVE_GAME tests
    it('Should remove player when not an owner leaves the game and game is not started', async () => {
        gameDAO.getGameItems.mockResolvedValue(Promise.resolve([
            {
                key: `game$gameId`,
                gameId: 'gameId',
                creator: 'some-mf',
                creationTime: new Date().getTime(),
                status: GAME_STATUS.WAITING_PLAYERS_TO_JOIN,
                leader: 0,
                mission: 0,
            },
            {
                key: `player$some-mf`,
                gameId: 'gameId',
                name: 'mf-name',
            },
            {
                key: `player$${userId}`,
                gameId: 'gameId',
                name: defaultUserName,
            }
        ]));
        gameDAO.deletePlayer.mockResolvedValue(Promise.resolve());
        await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.LEAVE_GAME, {gameId: 'idqz'});
        expect(gameDAO.deletePlayer).toHaveBeenCalledWith("idqz", "test-user-id");
    });

    it('Should delete all game items when an owner leaves the game and game is not started', async () => {
        gameDAO.getGameItems.mockResolvedValue(Promise.resolve([
            {
                key: `game$gameId`,
                gameId: 'gameId',
                creator: userId,
                creationTime: new Date().getTime(),
                status: GAME_STATUS.WAITING_PLAYERS_TO_JOIN,
                leader: 0,
                mission: 0,
            },
            {
                key: `player$some-mf`,
                gameId: 'gameId',
                name: 'mf-name',
            },
            {
                key: `player$${userId}`,
                gameId: 'gameId',
                name: defaultUserName,
            }
        ]));
        gameDAO.deleteGameItems.mockResolvedValue(Promise.resolve());
        await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.LEAVE_GAME, {gameId: 'idqz'});
        expect(gameDAO.deleteGameItems).toHaveBeenCalledWith("idqz");
    });

    it('Should delete all game items when somebody leaves the game that has already started', async () => {
        gameDAO.getGameItems.mockResolvedValue(Promise.resolve([
            {
                key: `game$gameId`,
                gameId: 'gameId',
                creator: 'some-mf',
                creationTime: new Date().getTime(),
                status: GAME_STATUS.SELECT_PLAYERS_ON_MISSION,
                leader: 2,
                mission: 1,
            },
            {
                key: `player$some-mf`,
                gameId: 'gameId',
                name: 'mf-name',
            },
            {
                key: `player$${userId}`,
                gameId: 'gameId',
                name: defaultUserName,
            }
        ]));
        gameDAO.deleteGameItems.mockResolvedValue(Promise.resolve());
        await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.LEAVE_GAME, {gameId: 'idqz'});
        expect(gameDAO.deleteGameItems).toHaveBeenCalledWith("idqz");
    });

    it('Should do nothing when somebody leaves a game and the game is finished', async () => {
        gameDAO.getGameItems.mockResolvedValue(Promise.resolve([
            {
                key: `game$gameId`,
                gameId: 'gameId',
                creator: 'some-mf',
                creationTime: new Date().getTime(),
                status: GAME_STATUS.SELECT_PLAYERS_ON_MISSION,
                leader: 2,
                mission: 1,
                finished: {
                    players: {}
                }
            } as any,
        ]));
        gameDAO.deleteGameItems.mockResolvedValue(Promise.resolve());
        gameDAO.deletePlayer.mockResolvedValue(Promise.resolve());
        await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.LEAVE_GAME, {gameId: 'idqz'});
        expect(gameDAO.deleteGameItems).not.toHaveBeenCalled();
        expect(gameDAO.deletePlayer).not.toHaveBeenCalled();
    });

    //CHANGE_NAME tests
    it('Should change name when the game is not started', async () => {
        gameDAO.getGame.mockResolvedValue(Promise.resolve({
            gameId: 'idqz',
            status: GAME_STATUS.WAITING_PLAYERS_TO_JOIN,
        } as any));
        gameDAO.changeName.mockResolvedValue(Promise.resolve());
        await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.CHANGE_NAME, {gameId: 'idqz', newName: 'loshara'});
        expect(gameDAO.changeName).toHaveBeenCalledWith('idqz', userId, 'loshara');
    });

    it('Should throw error on changing name with invalid one', async () => {
        gameDAO.getGame.mockResolvedValue(Promise.resolve({
            gameId: 'idqz',
            status: GAME_STATUS.WAITING_PLAYERS_TO_JOIN,
        } as any));
        gameDAO.changeName.mockResolvedValue(Promise.resolve());
        try {
            await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.CHANGE_NAME, {gameId: 'idqz', newName: 'super duper long name mfacsdfsdfsdsdcsdds'});
        } catch (e) {
            expect((e as any).message).toBe('Name is too long');
        }
        expect(gameDAO.changeName).not.toHaveBeenCalled();
    });

    it('Should throw error on changing name when the game is already started', async () => {
        gameDAO.getGame.mockResolvedValue(Promise.resolve({
            gameId: 'idqz',
            status: GAME_STATUS.WAITING_LEADER_TO_SELECT_PLAYERS,
        } as any));
        gameDAO.changeName.mockResolvedValue(Promise.resolve());
        try {
            await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.CHANGE_NAME, {gameId: 'idqz', newName: 'loh'});
        } catch (e) {
            expect((e as any).message).toBe('Cannot change name when the game has already started');
        }
        expect(gameDAO.changeName).not.toHaveBeenCalled();
    });

    //CHANGE_NAME tests
    it('Should throw error on kicking player by not an owner', async () => {
        gameDAO.getGame.mockResolvedValue(Promise.resolve({
            gameId: 'idqz',
            status: GAME_STATUS.WAITING_PLAYERS_TO_JOIN,
            creator: 'some-noname',
        } as any));
        gameDAO.deletePlayer.mockResolvedValue(Promise.resolve());
        try {
            await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.KICK_PLAYER, {gameId: 'idqz', playerId: 'some-noname'});
        } catch (e) {
            expect((e as any).message).toBe('You are not a game owner');
        }
    });

    it('Should throw error on kicking player after the game has started', async () => {
        gameDAO.getGame.mockResolvedValue(Promise.resolve({
            gameId: 'idqz',
            status: GAME_STATUS.WAITING_LEADER_TO_SELECT_PLAYERS,
            creator: userId,
        } as any));
        gameDAO.deletePlayer.mockResolvedValue(Promise.resolve());
        try {
            await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.KICK_PLAYER, {gameId: 'idqz', playerId: 'some-noname'});
        } catch (e) {
            expect((e as any).message).toBe('Cannot kick player when the game has already started');
        }
    });

    it('Should kick player by the owner', async () => {
        gameDAO.getGame.mockResolvedValue(Promise.resolve({
            gameId: 'idqz',
            status: GAME_STATUS.WAITING_PLAYERS_TO_JOIN,
            creator: userId,
        } as any));
        gameDAO.deletePlayer.mockResolvedValue(Promise.resolve());
        await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.KICK_PLAYER, {gameId: 'idqz', playerId: 'some-noname'});
        expect(gameDAO.deletePlayer).toHaveBeenCalledWith("idqz", "some-noname");
    });

    //START_GAME tests
    it('Should throw error on starting game when the game has already started', async () => {
        gameDAO.getGameItems.mockResolvedValue(Promise.resolve([
            {
                key: `game$gameId`,
                gameId: 'gameId',
                creator: 'some-mf',
                creationTime: new Date().getTime(),
                status: GAME_STATUS.SELECT_PLAYERS_ON_MISSION,
                leader: 2,
                mission: 1,
            },
            {
                key: `player$some-mf`,
                gameId: 'gameId',
                name: 'mf-name',
            },
            {
                key: `player$${userId}`,
                gameId: 'gameId',
                name: defaultUserName,
            }
        ]));
        try {
            await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.START_GAME, {gameId: 'idqz'});
        } catch (e) {
            expect((e as any).message).toBe('Cannot start game right now');
        }
    });

    it('Should throw error on starting game by not the owner', async () => {
        gameDAO.getGameItems.mockResolvedValue(Promise.resolve([
            {
                key: `game$gameId`,
                gameId: 'gameId',
                creator: 'some-mf',
                creationTime: new Date().getTime(),
                status: GAME_STATUS.WAITING_PLAYERS_TO_JOIN,
                leader: 2,
                mission: 1,
            },
            {
                key: `player$some-mf`,
                gameId: 'gameId',
                name: 'mf-name',
            },
            {
                key: `player$${userId}`,
                gameId: 'gameId',
                name: defaultUserName,
            }
        ]));
        try {
            await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.START_GAME, {gameId: 'idqz'});
        } catch (e) {
            expect((e as any).message).toBe('You are not a game owner');
        }
    });

    it('Should throw error on starting the game when there are less than 5 persons', async () => {
        gameDAO.getGameItems.mockResolvedValue(Promise.resolve([
            {
                key: `game$gameId`,
                gameId: 'gameId',
                creator: userId,
                creationTime: new Date().getTime(),
                status: GAME_STATUS.WAITING_PLAYERS_TO_JOIN,
                leader: 2,
                mission: 1,
            },
            {
                key: `player$some-mf`,
                gameId: 'gameId',
                name: 'mf-name',
            },
            {
                key: `player$${userId}`,
                gameId: 'gameId',
                name: defaultUserName,
            }
        ]));
        try {
            await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.START_GAME, {gameId: 'idqz'});
        } catch (e) {
            expect((e as any).message).toBe('You need 5-10 players for this game');
        }
    });

    it('Should start the game', async () => {
        gameDAO.getGameItems.mockResolvedValue(Promise.resolve([
            {
                key: `game$idqz`,
                gameId: 'idqz',
                creator: userId,
                creationTime: new Date().getTime(),
                status: GAME_STATUS.WAITING_PLAYERS_TO_JOIN,
                leader: 2,
                mission: 1,
            },
            {
                key: `player$some-mf`,
                gameId: 'idqz',
                name: 'mf-name',
            },
            {
                key: `player$loshok1`,
                gameId: 'idqz',
                name: 'loshok1',
            },
            {
                key: `player$loshok2`,
                gameId: 'idqz',
                name: 'loshok2',
            },
            {
                key: `player$loshok3`,
                gameId: 'idqz',
                name: 'loshok3',
            },
            {
                key: `player$$loshok4`,
                gameId: 'idqz',
                name: 'loshok4',
            }
        ]));
        gameDAO.updateGamePlayers.mockResolvedValue(Promise.resolve());
        gameDAO.updateGameState.mockResolvedValue(Promise.resolve());
        gameDAO.createMission.mockResolvedValue(Promise.resolve());
        await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.START_GAME, {gameId: 'idqz'});
        expect(gameDAO.updateGamePlayers).toHaveBeenCalledWith('idqz', expect.any(Array));
        expect(gameDAO.updateGameState).toHaveBeenCalledWith('idqz', GAME_STATUS.WAITING_LEADER_TO_SELECT_PLAYERS, expect.any(Number), 1);
        expect(gameDAO.createMission).toHaveBeenCalledWith('idqz', 1);
    });

    //SELECT_PLAYER tests
    it('Should put player on a mission', async () => {
        gameDAO.getGameItems.mockResolvedValue(Promise.resolve([
            {
                key: `game$idqz`,
                gameId: 'idqz',
                creator: userId,
                creationTime: new Date().getTime(),
                status: GAME_STATUS.WAITING_LEADER_TO_SELECT_PLAYERS,
                leader: 1,
                mission: 1,
            },
            {
                key: `player$${userId}`,
                gameId: 'idqz',
                name: 'mf-name',
                gameIndex: 1,
            },
            {
                key: `player$loshok1`,
                gameId: 'idqz',
                name: 'loshok1',
                gameIndex: 2,
            },
            {
                key: `player$loshok2`,
                gameId: 'idqz',
                name: 'loshok2',
                gameIndex: 3,
            },
            {
                key: `player$loshok3`,
                gameId: 'idqz',
                name: 'loshok3',
                gameIndex: 4,
            },
            {
                key: `player$loshok4`,
                gameId: 'idqz',
                name: 'loshok4',
                gameIndex: 5,
            },
            {
                key: 'mission$1',
                gameId: 'idqz',
                status: MISSION_STATUS.SELECTING_PLAYERS,
                preSelectedPlayers: [],
            }
        ]));
        gameDAO.getMission.mockResolvedValue(Promise.resolve({preSelectedPlayers: [1]} as any));
        gameDAO.putPreselectedPlayerOnAMission.mockResolvedValue(Promise.resolve());
        await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.SELECT_PLAYER, {gameId: 'idqz', playerNumber: '2'});
        expect(gameDAO.putPreselectedPlayerOnAMission).toHaveBeenCalledWith('idqz', 1, [1, 2]);
    });

    it('Should remove preselectd player', async () => {
        gameDAO.getGameItems.mockResolvedValue(Promise.resolve([
            {
                key: `game$idqz`,
                gameId: 'idqz',
                creator: userId,
                creationTime: new Date().getTime(),
                status: GAME_STATUS.WAITING_LEADER_TO_SELECT_PLAYERS,
                leader: 1,
                mission: 1,
            },
            {
                key: `player$${userId}`,
                gameId: 'idqz',
                name: 'mf-name',
                gameIndex: 1,
            },
            {
                key: `player$loshok1`,
                gameId: 'idqz',
                name: 'loshok1',
                gameIndex: 2,
            },
            {
                key: `player$loshok2`,
                gameId: 'idqz',
                name: 'loshok2',
                gameIndex: 3,
            },
            {
                key: `player$loshok3`,
                gameId: 'idqz',
                name: 'loshok3',
                gameIndex: 4,
            },
            {
                key: `player$loshok4`,
                gameId: 'idqz',
                name: 'loshok4',
                gameIndex: 5,
            },
            {
                key: 'mission$1',
                gameId: 'idqz',
                status: MISSION_STATUS.SELECTING_PLAYERS,
                preSelectedPlayers: [2],
            }
        ]));
        gameDAO.getMission.mockResolvedValue(Promise.resolve({preSelectedPlayers: [1, 2]} as any));
        gameDAO.putPreselectedPlayerOnAMission.mockResolvedValue(Promise.resolve());
        await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.REMOVE_PLAYER_FROM_MISSION, {gameId: 'idqz', playerNumber: '2'});
        expect(gameDAO.putPreselectedPlayerOnAMission).toHaveBeenCalledWith('idqz', 1, [1]);
    });

    it('Should throw error when the game is not in state selecting players', async () => {
        gameDAO.getGameItems.mockResolvedValue(Promise.resolve([
            {
                key: `game$idqz`,
                gameId: 'idqz',
                creator: userId,
                creationTime: new Date().getTime(),
                status: GAME_STATUS.WAITING_MISSION_PLAYERS_TO_FAIL_OR_SUCCESS,
                leader: 1,
                mission: 1,
            },
            {
                key: `player$${userId}`,
                gameId: 'idqz',
                name: 'mf-name',
                gameIndex: 1,
            },
            {
                key: `player$loshok1`,
                gameId: 'idqz',
                name: 'loshok1',
                gameIndex: 2,
            },
            {
                key: `player$loshok2`,
                gameId: 'idqz',
                name: 'loshok2',
                gameIndex: 3,
            },
            {
                key: `player$loshok3`,
                gameId: 'idqz',
                name: 'loshok3',
                gameIndex: 4,
            },
            {
                key: `player$loshok4`,
                gameId: 'idqz',
                name: 'loshok4',
                gameIndex: 5,
            },
            {
                key: 'mission$1',
                gameId: 'idqz',
                status: MISSION_STATUS.SELECTING_PLAYERS,
                preSelectedPlayers: [],
            }
        ]));
        gameDAO.putPreselectedPlayerOnAMission.mockResolvedValue(Promise.resolve());
        try {
            await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.SELECT_PLAYER, {gameId: 'idqz', playerNumber: '2'});
        } catch (e) {
            expect((e as any).message).toBe('Invalid action');
        }
        expect(gameDAO.putPreselectedPlayerOnAMission).not.toHaveBeenCalled();
    });

    it('Should throw error when the mission is not in state selecting players', async () => {
        gameDAO.getGameItems.mockResolvedValue(Promise.resolve([
            {
                key: `game$idqz`,
                gameId: 'idqz',
                creator: userId,
                creationTime: new Date().getTime(),
                status: GAME_STATUS.WAITING_LEADER_TO_SELECT_PLAYERS,
                leader: 1,
                mission: 1,
            },
            {
                key: `player$${userId}`,
                gameId: 'idqz',
                name: 'mf-name',
                gameIndex: 1,
            },
            {
                key: `player$loshok1`,
                gameId: 'idqz',
                name: 'loshok1',
                gameIndex: 2,
            },
            {
                key: `player$loshok2`,
                gameId: 'idqz',
                name: 'loshok2',
                gameIndex: 3,
            },
            {
                key: `player$loshok3`,
                gameId: 'idqz',
                name: 'loshok3',
                gameIndex: 4,
            },
            {
                key: `player$loshok4`,
                gameId: 'idqz',
                name: 'loshok4',
                gameIndex: 5,
            },
            {
                key: 'mission$1',
                gameId: 'idqz',
                status: MISSION_STATUS.MISSIOM_FAILED,
                preSelectedPlayers: [],
            }
        ]));
        gameDAO.putPreselectedPlayerOnAMission.mockResolvedValue(Promise.resolve());
        try {
            await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.SELECT_PLAYER, {gameId: 'idqz', playerNumber: '2'});
        } catch (e) {
            expect((e as any).message).toBe('Action is not allowed on this mission stage');
        }
        expect(gameDAO.putPreselectedPlayerOnAMission).not.toHaveBeenCalled();
    });

    it('Should throw error on selecting players if user is not a leader', async () => {
        gameDAO.getGameItems.mockResolvedValue(Promise.resolve([
            {
                key: `game$idqz`,
                gameId: 'idqz',
                creator: userId,
                creationTime: new Date().getTime(),
                status: GAME_STATUS.WAITING_LEADER_TO_SELECT_PLAYERS,
                leader: 2,
                mission: 1,
            },
            {
                key: `player$${userId}`,
                gameId: 'idqz',
                name: 'mf-name',
                gameIndex: 1,
            },
            {
                key: `player$loshok1`,
                gameId: 'idqz',
                name: 'loshok1',
                gameIndex: 2,
            },
            {
                key: `player$loshok2`,
                gameId: 'idqz',
                name: 'loshok2',
                gameIndex: 3,
            },
            {
                key: `player$loshok3`,
                gameId: 'idqz',
                name: 'loshok3',
                gameIndex: 4,
            },
            {
                key: `player$loshok4`,
                gameId: 'idqz',
                name: 'loshok4',
                gameIndex: 5,
            },
            {
                key: 'mission$1',
                gameId: 'idqz',
                status: MISSION_STATUS.SELECTING_PLAYERS,
                preSelectedPlayers: [],
            }
        ]));
        gameDAO.putPreselectedPlayerOnAMission.mockResolvedValue(Promise.resolve());
        try {
            await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.SELECT_PLAYER, {gameId: 'idqz', playerNumber: '2'});
        } catch (e) {
            expect((e as any).message).toBe('Only leader can select players on a mission');
        }
        expect(gameDAO.putPreselectedPlayerOnAMission).not.toHaveBeenCalled();
    });

    //SEND_FOR_APPROVAL tests
    it('Should throw error on sending players on approval when user is not a leader', async () => {
        gameDAO.getGameItems.mockResolvedValue(Promise.resolve([
            {
                key: `game$idqz`,
                gameId: 'idqz',
                creator: userId,
                creationTime: new Date().getTime(),
                status: GAME_STATUS.WAITING_LEADER_TO_SELECT_PLAYERS,
                leader: 2,
                mission: 1,
            },
            {
                key: `player$${userId}`,
                gameId: 'idqz',
                name: 'mf-name',
                gameIndex: 1,
            },
            {
                key: `player$loshok1`,
                gameId: 'idqz',
                name: 'loshok1',
                gameIndex: 2,
            },
            {
                key: `player$loshok2`,
                gameId: 'idqz',
                name: 'loshok2',
                gameIndex: 3,
            },
            {
                key: `player$loshok3`,
                gameId: 'idqz',
                name: 'loshok3',
                gameIndex: 4,
            },
            {
                key: `player$loshok4`,
                gameId: 'idqz',
                name: 'loshok4',
                gameIndex: 5,
            },
            {
                key: 'mission$1',
                gameId: 'idqz',
                status: MISSION_STATUS.SELECTING_PLAYERS,
                preSelectedPlayers: [1, 2],
            }
        ]));
        try {
            await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.SEND_FOR_APPROVAL, {gameId: 'idqz', playerNumber: '2'});
        } catch (e) {
            expect((e as any).message).toBe('Only leader can select players on a mission');
        }
        expect(gameDAO.updateGameState).not.toHaveBeenCalled();
        expect(gameDAO.updateMissionState).not.toHaveBeenCalled();
    });

    it('Should throw error on sending players on approval when not enough players selected', async () => {
        gameDAO.getGameItems.mockResolvedValue(Promise.resolve([
            {
                key: `game$idqz`,
                gameId: 'idqz',
                creator: userId,
                creationTime: new Date().getTime(),
                status: GAME_STATUS.WAITING_LEADER_TO_SELECT_PLAYERS,
                leader: 1,
                mission: 1,
            },
            {
                key: `player$${userId}`,
                gameId: 'idqz',
                name: 'mf-name',
                gameIndex: 1,
            },
            {
                key: `player$loshok1`,
                gameId: 'idqz',
                name: 'loshok1',
                gameIndex: 2,
            },
            {
                key: `player$loshok2`,
                gameId: 'idqz',
                name: 'loshok2',
                gameIndex: 3,
            },
            {
                key: `player$loshok3`,
                gameId: 'idqz',
                name: 'loshok3',
                gameIndex: 4,
            },
            {
                key: `player$loshok4`,
                gameId: 'idqz',
                name: 'loshok4',
                gameIndex: 5,
            },
            {
                key: 'mission$1',
                gameId: 'idqz',
                status: MISSION_STATUS.SELECTING_PLAYERS,
                preSelectedPlayers: [1],
            }
        ]));
        try {
            await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.SEND_FOR_APPROVAL, {gameId: 'idqz'});
        } catch (e) {
            expect((e as any).message).toBe('Not enough players on mission');
        }
        expect(gameDAO.updateGameState).not.toHaveBeenCalled();
        expect(gameDAO.updateMissionState).not.toHaveBeenCalled();
    });

    it('Should send players for approvals', async () => {
        gameDAO.getGameItems.mockResolvedValue(Promise.resolve([
            {
                key: `game$idqz`,
                gameId: 'idqz',
                creator: userId,
                creationTime: new Date().getTime(),
                status: GAME_STATUS.WAITING_LEADER_TO_SELECT_PLAYERS,
                leader: 1,
                mission: 1,
            },
            {
                key: `player$${userId}`,
                gameId: 'idqz',
                name: 'mf-name',
                gameIndex: 1,
            },
            {
                key: `player$loshok1`,
                gameId: 'idqz',
                name: 'loshok1',
                gameIndex: 2,
            },
            {
                key: `player$loshok2`,
                gameId: 'idqz',
                name: 'loshok2',
                gameIndex: 3,
            },
            {
                key: `player$loshok3`,
                gameId: 'idqz',
                name: 'loshok3',
                gameIndex: 4,
            },
            {
                key: `player$loshok4`,
                gameId: 'idqz',
                name: 'loshok4',
                gameIndex: 5,
            },
            {
                key: 'mission$1',
                gameId: 'idqz',
                status: MISSION_STATUS.SELECTING_PLAYERS,
                preSelectedPlayers: [1, 2],
            }
        ]));
        gameDAO.updateGameState.mockResolvedValue(Promise.resolve());
        gameDAO.updateMissionState.mockResolvedValue(Promise.resolve());
        await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.SEND_FOR_APPROVAL, {gameId: 'idqz'});
        expect(gameDAO.updateGameState).toHaveBeenCalledWith("idqz", "WAITING_PLAYERS_MISSION_APPROVALS", 1, 1);
        expect(gameDAO.updateMissionState).toHaveBeenCalledWith("idqz", 1, "VOTING");
    });

    //VOTE tests
    it('Should throw error on voting for the game you are not attending', async () => {
        gameDAO.getGameItems.mockResolvedValue(Promise.resolve([
            {
                key: `game$idqz`,
                gameId: 'idqz',
                creator: userId,
                creationTime: new Date().getTime(),
                status: GAME_STATUS.WAITING_PLAYERS_MISSION_APPROVALS,
                leader: 1,
                mission: 1,
            },
            {
                key: `player$loshok0`,
                gameId: 'idqz',
                name: 'mf-name',
                gameIndex: 1,
            },
            {
                key: `player$loshok1`,
                gameId: 'idqz',
                name: 'loshok1',
                gameIndex: 2,
            },
            {
                key: `player$loshok2`,
                gameId: 'idqz',
                name: 'loshok2',
                gameIndex: 3,
            },
            {
                key: `player$loshok3`,
                gameId: 'idqz',
                name: 'loshok3',
                gameIndex: 4,
            },
            {
                key: `player$loshok4`,
                gameId: 'idqz',
                name: 'loshok4',
                gameIndex: 5,
            },
            {
                key: 'mission$1',
                gameId: 'idqz',
                status: MISSION_STATUS.VOTING,
                preSelectedPlayers: [1, 2],
                playersOnMission: [1, 2]
            }
        ]));

        try {
            await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.VOTE, {gameId: 'idqz', vote: 'REJECT'});
        } catch (e) {
            expect((e as any).message).toBe('User does not participate in this game');
        }
    });

    it('Should throw error on voting for the game in an another state', async () => {
        gameDAO.getGameItems.mockResolvedValue(Promise.resolve([
            {
                key: `game$idqz`,
                gameId: 'idqz',
                creator: userId,
                creationTime: new Date().getTime(),
                status: GAME_STATUS.WAITING_MISSION_PLAYERS_TO_FAIL_OR_SUCCESS,
                leader: 1,
                mission: 1,
            },
            {
                key: `player$${userId}`,
                gameId: 'idqz',
                name: 'mf-name',
                gameIndex: 1,
            },
            {
                key: `player$loshok1`,
                gameId: 'idqz',
                name: 'loshok1',
                gameIndex: 2,
            },
            {
                key: `player$loshok2`,
                gameId: 'idqz',
                name: 'loshok2',
                gameIndex: 3,
            },
            {
                key: `player$loshok3`,
                gameId: 'idqz',
                name: 'loshok3',
                gameIndex: 4,
            },
            {
                key: `player$loshok4`,
                gameId: 'idqz',
                name: 'loshok4',
                gameIndex: 5,
            },
            {
                key: 'mission$1',
                gameId: 'idqz',
                status: MISSION_STATUS.VOTING,
                preSelectedPlayers: [1, 2],
                playersOnMission: [1, 2]
            }
        ]));

        try {
            await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.VOTE, {gameId: 'idqz', vote: 'APPROVE'});
        } catch (e) {
            expect((e as any).message).toBe('This action is not allowed on the current mission stage');
        }
    });

    it('Should just put vote', async () => {
        gameDAO.getGameItems.mockResolvedValue(Promise.resolve([
            {
                key: `game$idqz`,
                gameId: 'idqz',
                creator: userId,
                creationTime: new Date().getTime(),
                status: GAME_STATUS.WAITING_PLAYERS_MISSION_APPROVALS,
                leader: 1,
                mission: 1,
            },
            {
                key: `player$${userId}`,
                gameId: 'idqz',
                name: 'mf-name',
                gameIndex: 1,
            },
            {
                key: `player$loshok1`,
                gameId: 'idqz',
                name: 'loshok1',
                gameIndex: 2,
            },
            {
                key: `player$loshok2`,
                gameId: 'idqz',
                name: 'loshok2',
                gameIndex: 3,
            },
            {
                key: `player$loshok3`,
                gameId: 'idqz',
                name: 'loshok3',
                gameIndex: 4,
            },
            {
                key: `player$loshok4`,
                gameId: 'idqz',
                name: 'loshok4',
                gameIndex: 5,
            },
            {
                key: 'mission$1',
                gameId: 'idqz',
                status: MISSION_STATUS.VOTING,
                preSelectedPlayers: [1, 2],
                playersOnMission: [1, 2]
            }
        ]));

        gameDAO.updateGameState.mockResolvedValue(Promise.resolve());
        gameDAO.putVote.mockResolvedValue(Promise.resolve());
        await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.VOTE, {gameId: 'idqz', vote: 'APPROVE'});
        expect(gameDAO.updateGameState).not.toHaveBeenCalled();
        expect(gameDAO.putVote).toHaveBeenCalledWith("idqz", 1, 1, "APPROVE");
    });

    it('Should put last vote and trigger next stage', async () => {
        gameDAO.getGameItems.mockResolvedValue(Promise.resolve([
            {
                key: `game$idqz`,
                gameId: 'idqz',
                creator: userId,
                creationTime: new Date().getTime(),
                status: GAME_STATUS.WAITING_PLAYERS_MISSION_APPROVALS,
                leader: 1,
                mission: 1,
            },
            {
                key: `player$${userId}`,
                gameId: 'idqz',
                name: 'mf-name',
                gameIndex: 1,
            },
            {
                key: `player$loshok1`,
                gameId: 'idqz',
                name: 'loshok1',
                gameIndex: 2,
            },
            {
                key: `player$loshok2`,
                gameId: 'idqz',
                name: 'loshok2',
                gameIndex: 3,
            },
            {
                key: `player$loshok3`,
                gameId: 'idqz',
                name: 'loshok3',
                gameIndex: 4,
            },
            {
                key: `player$loshok4`,
                gameId: 'idqz',
                name: 'loshok4',
                gameIndex: 5,
            },
            {
                key: 'mission$1',
                gameId: 'idqz',
                status: MISSION_STATUS.VOTING,
                preSelectedPlayers: [1, 2],
                playersOnMission: [1, 2]
            },
            {
                key: 'vote$1$2',
                gameId: 'idqz',
                vote: VOTE.APPROVE,
            },
            {
                key: 'vote$1$3',
                gameId: 'idqz',
                vote: VOTE.APPROVE,
            },
            {
                key: 'vote$1$4',
                gameId: 'idqz',
                vote: VOTE.APPROVE,
            },
            {
                key: 'vote$1$5',
                gameId: 'idqz',
                vote: VOTE.APPROVE,
            },
        ]));

        gameDAO.updateGameState.mockResolvedValue(Promise.resolve());
        gameDAO.putVote.mockResolvedValue(Promise.resolve());
        gameDAO.initFinalPlayersOnMission.mockResolvedValue(Promise.resolve());
        await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.VOTE, {gameId: 'idqz', vote: 'APPROVE'});
        expect(gameDAO.updateGameState).toHaveBeenCalledWith("idqz", "WAITING_MISSION_PLAYERS_TO_FAIL_OR_SUCCESS", 1, 1);
        expect(gameDAO.putVote).toHaveBeenCalledWith("idqz", 1, 1, "APPROVE");
        expect(gameDAO.initFinalPlayersOnMission).toHaveBeenCalledWith("idqz", 1, [1, 2]);
    });

    it('Should put last vote and create rejection', async () => {
        gameDAO.getGameItems.mockResolvedValue(Promise.resolve([
            {
                key: `game$idqz`,
                gameId: 'idqz',
                creator: userId,
                creationTime: new Date().getTime(),
                status: GAME_STATUS.WAITING_PLAYERS_MISSION_APPROVALS,
                leader: 1,
                mission: 1,
            },
            {
                key: `player$${userId}`,
                gameId: 'idqz',
                name: 'mf-name',
                gameIndex: 1,
            },
            {
                key: `player$loshok1`,
                gameId: 'idqz',
                name: 'loshok1',
                gameIndex: 2,
            },
            {
                key: `player$loshok2`,
                gameId: 'idqz',
                name: 'loshok2',
                gameIndex: 3,
            },
            {
                key: `player$loshok3`,
                gameId: 'idqz',
                name: 'loshok3',
                gameIndex: 4,
            },
            {
                key: `player$loshok4`,
                gameId: 'idqz',
                name: 'loshok4',
                gameIndex: 5,
            },
            {
                key: 'mission$1',
                gameId: 'idqz',
                status: MISSION_STATUS.VOTING,
                preSelectedPlayers: [1, 2],
                playersOnMission: [1, 2]
            },
            {
                key: 'vote$1$2',
                gameId: 'idqz',
                vote: VOTE.REJECT,
            },
            {
                key: 'vote$1$3',
                gameId: 'idqz',
                vote: VOTE.REJECT,
            },
            {
                key: 'vote$1$4',
                gameId: 'idqz',
                vote: VOTE.APPROVE,
            },
            {
                key: 'vote$1$5',
                gameId: 'idqz',
                vote: VOTE.APPROVE,
            },
        ]));
        gameDAO.updateGameState.mockResolvedValue(Promise.resolve());
        gameDAO.putVote.mockResolvedValue(Promise.resolve());
        gameDAO.createRejection.mockResolvedValue(Promise.resolve());
        gameDAO.resetMissionState.mockResolvedValue(Promise.resolve());
        gameDAO.removeVotes.mockResolvedValue(Promise.resolve());

        await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.VOTE, {gameId: 'idqz', vote: 'REJECT'});
        expect(gameDAO.updateGameState).toHaveBeenCalledWith("idqz", "WAITING_LEADER_TO_SELECT_PLAYERS", 2, 1);
        expect(gameDAO.putVote).toHaveBeenCalledWith("idqz", 1, 1, "REJECT");
        expect(gameDAO.createRejection).toHaveBeenCalledWith("idqz", 1, 1, 1, [1, 2]);
        expect(gameDAO.resetMissionState).toHaveBeenCalledWith("idqz", 1);
        expect(gameDAO.removeVotes).toHaveBeenCalledWith("idqz", 1, 5);
    });

    it('Should put last vote, create last rejection and finish game', async () => {
        gameDAO.getGameItems.mockResolvedValue(Promise.resolve([
            {
                key: `game$idqz`,
                gameId: 'idqz',
                creator: userId,
                creationTime: new Date().getTime(),
                status: GAME_STATUS.WAITING_PLAYERS_MISSION_APPROVALS,
                leader: 1,
                mission: 1,
            },
            {
                key: `player$${userId}`,
                gameId: 'idqz',
                name: 'mf-name',
                gameIndex: 1,
                role: ROLE.SPY,
            },
            {
                key: `player$loshok1`,
                gameId: 'idqz',
                name: 'loshok1',
                gameIndex: 2,
                role: ROLE.SPY,
            },
            {
                key: `player$loshok2`,
                gameId: 'idqz',
                name: 'loshok2',
                gameIndex: 3,
                role: ROLE.RESISTENCE,
            },
            {
                key: `player$loshok3`,
                gameId: 'idqz',
                name: 'loshok3',
                gameIndex: 4,
                role: ROLE.RESISTENCE,
            },
            {
                key: `player$loshok4`,
                gameId: 'idqz',
                name: 'loshok4',
                gameIndex: 5,
                role: ROLE.RESISTENCE,
            },
            {
                key: 'mission$1',
                gameId: 'idqz',
                status: MISSION_STATUS.VOTING,
                preSelectedPlayers: [1, 2],
                playersOnMission: [1, 2]
            },
            {
                key: 'vote$1$2',
                gameId: 'idqz',
                vote: VOTE.REJECT,
            },
            {
                key: 'vote$1$3',
                gameId: 'idqz',
                vote: VOTE.REJECT,
            },
            {
                key: 'vote$1$4',
                gameId: 'idqz',
                vote: VOTE.APPROVE,
            },
            {
                key: 'vote$1$5',
                gameId: 'idqz',
                vote: VOTE.APPROVE,
            },
            {
                key: 'rejection$1',
                gameId: 'idqz',
                rejectedPlayers: [1, 3],
                leader: 1,
                mission: 1,
            },
            {
                key: 'rejection$2',
                gameId: 'idqz',
                rejectedPlayers: [1, 3],
                leader: 1,
                mission: 1,
            },
            {
                key: 'rejection$3',
                gameId: 'idqz',
                rejectedPlayers: [1, 3],
                leader: 1,
                mission: 1,
            },
            {
                key: 'rejection$4',
                gameId: 'idqz',
                rejectedPlayers: [1, 3],
                leader: 1,
                mission: 1,
            },
        ]));
        gameDAO.updateGameState.mockResolvedValue(Promise.resolve());
        gameDAO.putVote.mockResolvedValue(Promise.resolve());
        gameDAO.createRejection.mockResolvedValue(Promise.resolve());
        gameDAO.resetMissionState.mockResolvedValue(Promise.resolve());
        gameDAO.removeVotes.mockResolvedValue(Promise.resolve());
        gameDAO.finishGame.mockResolvedValue(Promise.resolve());

        await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.VOTE, {gameId: 'idqz', vote: 'REJECT'});
        expect(gameDAO.putVote).toHaveBeenCalledWith("idqz", 1, 1, "REJECT");
        expect(gameDAO.updateGameState).not.toHaveBeenCalled();
        expect(gameDAO.createRejection).not.toHaveBeenCalled();
        expect(gameDAO.resetMissionState).not.toHaveBeenCalled();
        expect(gameDAO.removeVotes).not.toHaveBeenCalled();
        expect(gameDAO.finishGame).toHaveBeenCalledWith("idqz", {
            "missions": {
                "1": "VOTING"
            },
            "players": {
                "loshok1": "spy",
                "loshok2": "resistence",
                "loshok3": "resistence",
                "loshok4": "resistence",
                "mf-name": "spy"
            },
            "rejections": 5,
            "winner": "spy"
        });
    });

    //ACT_MISSION tests
    it('Should throw error on acting mission when player is not atteding to the game', async () => {
        gameDAO.getGameItems.mockResolvedValue(Promise.resolve([
            {
                key: `game$idqz`,
                gameId: 'idqz',
                creator: userId,
                creationTime: new Date().getTime(),
                status: GAME_STATUS.WAITING_MISSION_PLAYERS_TO_FAIL_OR_SUCCESS,
                leader: 1,
                mission: 1,
            },
            {
                key: `player$sdf`,
                gameId: 'idqz',
                name: 'mf-name',
                gameIndex: 1,
            },
            {
                key: `player$loshok1`,
                gameId: 'idqz',
                name: 'loshok1',
                gameIndex: 2,
            },
            {
                key: `player$loshok2`,
                gameId: 'idqz',
                name: 'loshok2',
                gameIndex: 3,
            },
            {
                key: `player$loshok3`,
                gameId: 'idqz',
                name: 'loshok3',
                gameIndex: 4,
            },
            {
                key: `player$loshok4`,
                gameId: 'idqz',
                name: 'loshok4',
                gameIndex: 5,
            },
            {
                key: 'mission$1',
                gameId: 'idqz',
                status: MISSION_STATUS.ACTING,
                preSelectedPlayers: [1, 2],
                playersOnMission: [1, 2]
            }
        ]));

        try {
            await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.ACT_MISSION, {gameId: 'idqz', action: 'FAIL'});
        } catch (e) {
            expect((e as any).message).toBe('User does not participate in this game');
        }
    });

    it('Should throw error on acting mission when player is not atteding to the game', async () => {
        gameDAO.getGameItems.mockResolvedValue(Promise.resolve([
            {
                key: `game$idqz`,
                gameId: 'idqz',
                creator: userId,
                creationTime: new Date().getTime(),
                status: GAME_STATUS.WAITING_LEADER_TO_SELECT_PLAYERS,
                leader: 1,
                mission: 1,
            },
            {
                key: `player$${userId}`,
                gameId: 'idqz',
                name: 'mf-name',
                gameIndex: 1,
            },
            {
                key: `player$loshok1`,
                gameId: 'idqz',
                name: 'loshok1',
                gameIndex: 2,
            },
            {
                key: `player$loshok2`,
                gameId: 'idqz',
                name: 'loshok2',
                gameIndex: 3,
            },
            {
                key: `player$loshok3`,
                gameId: 'idqz',
                name: 'loshok3',
                gameIndex: 4,
            },
            {
                key: `player$loshok4`,
                gameId: 'idqz',
                name: 'loshok4',
                gameIndex: 5,
            },
            {
                key: 'mission$1',
                gameId: 'idqz',
                status: MISSION_STATUS.ACTING,
                preSelectedPlayers: [1, 2],
                playersOnMission: [1, 2]
            }
        ]));

        try {
            await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.ACT_MISSION, {gameId: 'idqz', action: 'FAIL'});
        } catch (e) {
            expect((e as any).message).toBe('This action is not allowed on the current mission stage');
        }
    });

    it('Should throw error on acting mission when player is not selected', async () => {
        gameDAO.getGameItems.mockResolvedValue(Promise.resolve([
            {
                key: `game$idqz`,
                gameId: 'idqz',
                creator: userId,
                creationTime: new Date().getTime(),
                status: GAME_STATUS.WAITING_MISSION_PLAYERS_TO_FAIL_OR_SUCCESS,
                leader: 1,
                mission: 1,
            },
            {
                key: `player$${userId}`,
                gameId: 'idqz',
                name: 'mf-name',
                gameIndex: 1,
            },
            {
                key: `player$loshok1`,
                gameId: 'idqz',
                name: 'loshok1',
                gameIndex: 2,
            },
            {
                key: `player$loshok2`,
                gameId: 'idqz',
                name: 'loshok2',
                gameIndex: 3,
            },
            {
                key: `player$loshok3`,
                gameId: 'idqz',
                name: 'loshok3',
                gameIndex: 4,
            },
            {
                key: `player$loshok4`,
                gameId: 'idqz',
                name: 'loshok4',
                gameIndex: 5,
            },
            {
                key: 'mission$1',
                gameId: 'idqz',
                status: MISSION_STATUS.ACTING,
                preSelectedPlayers: [3, 2],
                playersOnMission: [3, 2]
            }
        ]));

        try {
            await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.ACT_MISSION, {gameId: 'idqz', action: 'FAIL'});
        } catch (e) {
            expect((e as any).message).toBe('You can not participate in this mission');
        }
    });

    it('Should just act mission', async () => {
        gameDAO.getGameItems.mockResolvedValue(Promise.resolve([
            {
                key: `game$idqz`,
                gameId: 'idqz',
                creator: userId,
                creationTime: new Date().getTime(),
                status: GAME_STATUS.WAITING_MISSION_PLAYERS_TO_FAIL_OR_SUCCESS,
                leader: 1,
                mission: 1,
            },
            {
                key: `player$${userId}`,
                gameId: 'idqz',
                name: 'mf-name',
                gameIndex: 1,
            },
            {
                key: `player$loshok1`,
                gameId: 'idqz',
                name: 'loshok1',
                gameIndex: 2,
            },
            {
                key: `player$loshok2`,
                gameId: 'idqz',
                name: 'loshok2',
                gameIndex: 3,
            },
            {
                key: `player$loshok3`,
                gameId: 'idqz',
                name: 'loshok3',
                gameIndex: 4,
            },
            {
                key: `player$loshok4`,
                gameId: 'idqz',
                name: 'loshok4',
                gameIndex: 5,
            },
            {
                key: 'mission$1',
                gameId: 'idqz',
                status: MISSION_STATUS.ACTING,
                preSelectedPlayers: [1, 2],
                playersOnMission: [1, 2]
            },
        ]));
        gameDAO.updateMissionState.mockResolvedValue(Promise.resolve());
        gameDAO.updateGameState.mockResolvedValue(Promise.resolve());
        gameDAO.putMissionAct.mockResolvedValue(Promise.resolve());
        await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.ACT_MISSION, {gameId: 'idqz', action: 'SUCCESS'});
        expect(gameDAO.putMissionAct).toHaveBeenCalledWith("idqz", 1, 1, "SUCCESS");
        expect(gameDAO.updateMissionState).not.toHaveBeenCalled();
        expect(gameDAO.updateGameState).not.toHaveBeenCalled();
    });

    it('Should act mission and succeed', async () => {
        gameDAO.getGameItems.mockResolvedValue(Promise.resolve([
            {
                key: `game$idqz`,
                gameId: 'idqz',
                creator: userId,
                creationTime: new Date().getTime(),
                status: GAME_STATUS.WAITING_MISSION_PLAYERS_TO_FAIL_OR_SUCCESS,
                leader: 1,
                mission: 1,
            },
            {
                key: `player$${userId}`,
                gameId: 'idqz',
                name: 'mf-name',
                gameIndex: 1,
            },
            {
                key: `player$loshok1`,
                gameId: 'idqz',
                name: 'loshok1',
                gameIndex: 2,
            },
            {
                key: `player$loshok2`,
                gameId: 'idqz',
                name: 'loshok2',
                gameIndex: 3,
            },
            {
                key: `player$loshok3`,
                gameId: 'idqz',
                name: 'loshok3',
                gameIndex: 4,
            },
            {
                key: `player$loshok4`,
                gameId: 'idqz',
                name: 'loshok4',
                gameIndex: 5,
            },
            {
                key: 'mission$1',
                gameId: 'idqz',
                status: MISSION_STATUS.ACTING,
                preSelectedPlayers: [1, 2],
                playersOnMission: [1, 2]
            },
            {
                key: 'action$1$2',
                gameId: 'idqz',
                action: MISSION_ACTION.SUCCESS
            }
        ]));
        gameDAO.updateMissionState.mockResolvedValue(Promise.resolve());
        gameDAO.updateGameState.mockResolvedValue(Promise.resolve());
        gameDAO.putMissionAct.mockResolvedValue(Promise.resolve());
        gameDAO.createMission.mockResolvedValue(Promise.resolve());
        await new GameService(userId, defaultUserName, gameDAO).processRequest(GAME_ACTIONS.ACT_MISSION, {gameId: 'idqz', action: 'SUCCESS'});
        expect(gameDAO.putMissionAct).toHaveBeenCalledWith("idqz", 1, 1, "SUCCESS");
        expect(gameDAO.updateMissionState).toHaveBeenCalledWith("idqz", 1, "MISSION_SUCCEED");
        expect(gameDAO.updateGameState).toHaveBeenCalledWith("idqz", "WAITING_LEADER_TO_SELECT_PLAYERS", 2, 2);
        expect(gameDAO.createMission).toHaveBeenCalledWith("idqz", 2);
    });

});