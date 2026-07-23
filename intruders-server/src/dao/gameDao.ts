

import {
    BatchWriteCommand,
    BatchWriteCommandInput,
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
    QueryCommandInput,
    ScanCommand,
    ScanCommandInput,
    UpdateCommand,
    UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { DBGame, DBItem, DBKey, DBMission, DBPlayer, DBRejection, DBVote, DBMissionAction, FinishedGameStatus } from '../types/database';
import { GAME_STATUS, MISSION_ACTION, MISSION_STATUS, PlayerInfo, VOTE } from '../types/types';

type AttributeMap = Record<string, any>;
type BatchWriteItemRequestMap = NonNullable<BatchWriteCommandInput['RequestItems']>;
type WriteRequest = NonNullable<BatchWriteItemRequestMap[string]>[number];

export class GameDao {
    constructor(private readonly client: DynamoDBDocumentClient, private readonly tableName: string, private readonly index: string) { }

    public async getAll() {
        const allItems = await this.scan({
            TableName: this.tableName,
        });
        return allItems;
    }

    public async createGame(gameId: string, timestamp: number, userId: string, name: string): Promise<void> {
        const newGameItem = {
            key: `game$${gameId}`,
            gameId: gameId,
            creator: userId,
            creationTime: timestamp,
            status: GAME_STATUS.WAITING_PLAYERS_TO_JOIN,
            leader: 0,
            mission: 0,
        };
        const newPlayerItem: DBPlayer = {
            key: `player$${userId}`,
            gameId: gameId,
            name: name,
        };
        const requests = [
            { PutRequest: { Item: newGameItem } as any },
            { PutRequest: { Item: newPlayerItem } as any }];
        await this.batchWrite(requests);
    }

    public async finishGame(gameId: string, status: FinishedGameStatus) {
        await this.update({
            key: `game$${gameId}`,
            gameId,
        }, {
            UpdateExpression: 'set #f = :f',
            ExpressionAttributeNames: {
                '#f': 'finished',
            },
            ExpressionAttributeValues: {
                ':f': status,
            }
        });
        const gameItems = await this.getGameItems(gameId);
        const itemsToDelete = gameItems.filter(item => {
            const [type] = item.key.split('$');
            return type !== 'game';
        });
        await this.batchWrite(itemsToDelete.map(item => ({ DeleteRequest: { Key: { key: item.key, gameId: item.gameId } as any } })));
    }

    public async updateGameState(gameId: string, status: GAME_STATUS, leader: number, mission: number) {
        await this.update({
            key: `game$${gameId}`,
            gameId,
        }, {
            UpdateExpression: 'set #st = :st, #le = :le, #mi = :mi',
            ExpressionAttributeNames: {
                '#st': 'status',
                '#le': 'leader',
                '#mi': 'mission',
            },
            ExpressionAttributeValues: {
                ':st': status,
                ':le': leader,
                ':mi': mission,
            }
        });
    }

    public async createMission(gameId: string, missionNumber: number) {
        const missionItem: DBMission = {
            key: `mission$${missionNumber}`,
            gameId: gameId,
            preSelectedPlayers: [],
            status: MISSION_STATUS.SELECTING_PLAYERS,
            playersOnMission: [],
        };
        await this.put(missionItem);
    }

    public async createRejection(gameId: string, rejectionIndex: number, leader: number, mission: number, rejectedPlayers: number[]) {
        const rejectionItem: DBRejection = {
            key: `rejection$${rejectionIndex}`,
            gameId: gameId,
            leader: leader,
            mission: mission,
            rejectedPlayers: rejectedPlayers
        };
        await this.put(rejectionItem);
    }

    public async getMission(gameId: string, missionNumber: number) {
        const mission = await this.get({
            key: `mission$${missionNumber}`,
            gameId: gameId,
        });
        return mission?.Item as DBMission;
    }

    public async putPreselectedPlayerOnAMission(gameId: string, missionNumber: number, preSelectedPlayers: number[]) {
        await this.update({
            key: `mission$${missionNumber}`,
            gameId: gameId,
        }, {
            UpdateExpression: 'set #p = :p',
            ExpressionAttributeNames: {
                '#p': 'preSelectedPlayers',
            },
            ExpressionAttributeValues: {
                ':p': preSelectedPlayers,
            }
        });
    }

    public async updateMissionState(gameId: string, missionNumber: number, status: MISSION_STATUS) {
        await this.update({
            key: `mission$${missionNumber}`,
            gameId: gameId,
        }, {
            UpdateExpression: 'set #s = :s',
            ExpressionAttributeNames: {
                '#s': 'status',
            },
            ExpressionAttributeValues: {
                ':s': status,
            }
        });
    }

    public async resetMissionState(gameId: string, missionNumber: number) {
        await this.update({
            key: `mission$${missionNumber}`,
            gameId: gameId,
        }, {
            UpdateExpression: 'set #s = :s, #pre = :pre, #pla = :pla',
            ExpressionAttributeNames: {
                '#s': 'status',
                '#pre': 'preSelectedPlayers',
                '#pla': 'playersOnMission',
            },
            ExpressionAttributeValues: {
                ':s': MISSION_STATUS.SELECTING_PLAYERS,
                ':pre': [],
                ':pla': [],
            }
        });
    }

    public async initFinalPlayersOnMission(gameId: string, missionNumber: number, playersOnMission: number[]) {
        await this.update({
            key: `mission$${missionNumber}`,
            gameId: gameId,
        }, {
            UpdateExpression: 'set #s = :s, #p = :p',
            ExpressionAttributeNames: {
                '#s': 'status',
                '#p': 'playersOnMission',
            },
            ExpressionAttributeValues: {
                ':s': MISSION_STATUS.ACTING,
                ':p': playersOnMission,
            }
        });
    }

    public async createPlayer(gameId: string, userId: string, name: string): Promise<void> {
        const newPlayerItem: DBPlayer = {
            key: `player$${userId}`,
            gameId: gameId,
            name: name,
        };
        await this.put(newPlayerItem);
    }

    public async deletePlayer(gameId: string, userId: string): Promise<void> {
        await this.delete({ key: `player$${userId}`, gameId: gameId, });
    }

    public async changeName(gameId: string, userId: string, name: string) {
        await this.update({ key: `player$${userId}`, gameId: gameId }, {
            UpdateExpression: 'set #name = :name',
            ExpressionAttributeNames: {
                '#name': 'name',
            },
            ExpressionAttributeValues: {
                ':name': name,
            }
        });
    }

    public async getPlayerGame(userId: string): Promise<string> {
        const games = await this.query<DBPlayer>({
            TableName: this.tableName,
            KeyConditionExpression: '#p = :v',
            ExpressionAttributeNames: {
                '#p': 'key',
            },
            ExpressionAttributeValues: {
                ':v': `player$${userId}`,
            }
        });
        return games.length > 0 ? games[0].gameId : null;
    }

    public async getGame(gameId: string): Promise<DBGame> {
        const item = await this.get({
            key: `game$${gameId}`,
            gameId
        });
        return item?.Item as DBGame;
    }

    public async getPlayer(userId: string, gameId: string): Promise<DBPlayer> {
        const item = await this.get({
            key: `player$${userId}`,
            gameId
        });
        return item?.Item as DBPlayer;
    }

    public async getGameItems(gameId: string) {
        return this.query<DBItem>({
            TableName: this.tableName,
            IndexName: this.index,
            KeyConditionExpression: 'gameId = :g',
            ExpressionAttributeValues: {
                ':g': gameId,
            }
        });
    }

    public async resetGame(gameId: string) {
        const gameItems = await this.getGameItems(gameId);
        const itemsToDelete = gameItems.filter(item => {
            const [type, keyPart1] = item.key.split('$');
            return type !== 'player' && type !== 'game';
        });
        return this.batchWrite(itemsToDelete.map(item => ({ DeleteRequest: { Key: { key: item.key, gameId: item.gameId } as any } })));
    }

    public async deleteGameItems(gameId: string) {
        const gameItems = await this.getGameItems(gameId);
        return this.batchWrite(gameItems.map(item => ({ DeleteRequest: { Key: { key: item.key, gameId: item.gameId } as any } })));
    }

    public async updateGamePlayers(gameId: string, players: PlayerInfo[]) {
        const updateRequests = players.map((playerInfo, playerIndex) => ({
            PutRequest: {
                Item: {
                    key: `player$${playerInfo.id}`,
                    gameId: gameId,
                    gameIndex: playerIndex + 1,
                    name: playerInfo.name,
                    role: playerInfo.role,
                } as any
            }
        }));
        return this.batchWrite(updateRequests);
    }

    public async putVote(gameId: string, missionNumber: number, playerNumber: number, vote: VOTE) {
        const voteItem: DBVote = {
            key: `vote$${missionNumber}$${playerNumber}`,
            gameId: gameId,
            vote: vote,
        };
        await this.put(voteItem);
    }

    public async removeVotes(gameId: string, missionNumber: number, numberOfPlayers: number) {
        const requests = new Array(numberOfPlayers).fill(undefined).map((emptyItem, index) => ({
            DeleteRequest: {
                Key: {
                    key: `vote$${missionNumber}$${index + 1}`,
                    gameId: gameId,
                } as any
            }
        }));
        await this.batchWrite(requests);
    }

    public async putMissionAct(gameId: string, missionNumber: number, playerNumber: number, missionAct: MISSION_ACTION) {
        const actionItem: DBMissionAction = {
            key: `action$${missionNumber}$${playerNumber}`,
            gameId: gameId,
            action: missionAct,
        };
        await this.put(actionItem);
    }

    private put(data: AttributeMap) {
        return this.client.send(new PutCommand({
            TableName: this.tableName,
            Item: { ...data }
        }));
    }

    private get(key: Record<string, any>) {
        return this.client.send(new GetCommand({
            TableName: this.tableName,
            Key: key
        }));
    }

    private delete(key: DBKey) {
        return this.client.send(new DeleteCommand({
            TableName: this.tableName,
            Key: key,
        })).catch(err => {
            console.warn('Delete failed', err);
            throw err;
        });
    }

    private update(key: DBKey, input: Omit<UpdateCommandInput, 'TableName' | 'Key'>) {
        return this.client.send(new UpdateCommand({
            TableName: this.tableName,
            Key: key,
            ...input,
        })).catch(err => {
            console.warn('Update failed', err);
            throw err;
        });
    }

    private async batchWrite(requestList: WriteRequest[]) {
        const chunks = Array.from({ length: Math.ceil(requestList.length / 25) }, (_, index) =>
            requestList.slice(index * 25, index * 25 + 25)
        );
        const batchCalls = chunks.map(async writeRequestsChunk => {
            const batchWriteParams = {
                [this.tableName]: writeRequestsChunk
            }
            await this.executeBatchRequest(batchWriteParams);
        })
        await Promise.all(batchCalls);
    }

    private async executeBatchRequest(requestMap: BatchWriteItemRequestMap) {
        do {
            const result = await this.client.send(new BatchWriteCommand({
                RequestItems: requestMap
            }));
            if (result.UnprocessedItems) {
                requestMap = result.UnprocessedItems;
            } else {
                break;
            }
        } while (Object.values(requestMap).some(entries => entries.length > 0));
    }

    private async query<T>(params: QueryCommandInput) {
        let lastKey;
        const result: T[] = [];

        do {
            params.ExclusiveStartKey = lastKey;
            const data = await this.client.send(new QueryCommand(params));
            lastKey = data.LastEvaluatedKey;
            result.push(...(data.Items || []) as T[]);
        } while (lastKey);
        return result;
    }

    private async scan<T = AttributeMap>(params: ScanCommandInput): Promise<T[]> {
        let list: T[] = [];
        let lastKey;

        do {
            params.ExclusiveStartKey = lastKey;
            const data = await this.client.send(new ScanCommand(params));
            lastKey = data.LastEvaluatedKey;
            list.push(...(data.Items || []) as T[]);
        } while (lastKey);
        return list;
    }
}
