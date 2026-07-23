import { Handler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { GameDao } from '../dao/gameDao';
import { DBItem } from '../types/database';

const DAY = 24 * 60 * 60 * 1000;
const TABLE_INDEX = 'game-id';
export const handler: Handler = async () => {
    const tableName = process.env.TABLE_NAME as string;
    const region = process.env.REGION as string;
    const gameDao = new GameDao(
        DynamoDBDocumentClient.from(new DynamoDBClient({ region }), {
            marshallOptions: { removeUndefinedValues: true },
        }),
        tableName,
        TABLE_INDEX,
    );

    const allTableItems = await gameDao.getAll();
    const gameItems = allTableItems.filter(item => {
        const [type] = item.key.split('$');
        return type === 'game';
    });

    const cleanupGame = async (gameId: string, gameItems: DBItem[]) => {
        console.log(`Performing cleanup for the game ${gameId}`);
        try {
            await gameDao.deleteGameItems(gameId);
            console.log(`Cleanup succeed for the game ${gameId}`);
        } catch (e) {
            console.log(`Failed to cleanup game ${gameId}`);
        }   
    };
    for (const gameItem of gameItems) {
        const currentDate = new Date().getTime();
        if (currentDate - gameItem.creationTime > DAY) {
            const [, gameId] = gameItem.key.split('$');
            await cleanupGame(gameId, gameItems.filter(item => item.gameId === gameId) as any);
        }
    }
    return {
        statusCode: 200,
        body: 'Success',
    };
};

