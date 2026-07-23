import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { GameDao } from '../dao/gameDao';
import { GameService } from '../services/gameService';
import { getActionByRequestPath } from '../utils/gameUtils';

const TABLE_INDEX = 'game-id';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {


    console.log(`Event: ${JSON.stringify(event, null, 2)}`);

    const playerId = event.headers['x-player-id'] || event.headers['X-Player-Id'];
    const encodedPlayerName = event.headers['x-player-name'] || event.headers['X-Player-Name'];
    let playerName = '';
    try {
        playerName = decodeURIComponent(encodedPlayerName || '').trim();
    } catch {
        playerName = '';
    }

    if (!playerId || !/^[a-zA-Z0-9-]{8,64}$/.test(playerId) || !playerName || playerName.length > 16) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Valid X-Player-Id and X-Player-Name headers are required' }),
        }
    }

    const tableName = process.env.TABLE_NAME as string;
    const region = process.env.REGION as string;
    const gameDao = new GameDao(
        DynamoDBDocumentClient.from(new DynamoDBClient({ region }), {
            marshallOptions: { removeUndefinedValues: true },
        }),
        tableName,
        TABLE_INDEX,
    );

    try {
        const bodyParameters = event.body ? JSON.parse(event.body) : {};
        const requestParams = { ...bodyParameters, ...event.pathParameters };
        const action = getActionByRequestPath((event as any).rawPath);
        const result = await new GameService(playerId, playerName, gameDao).processRequest(action, requestParams);
        return {
            statusCode: 200,
            body: JSON.stringify(result || {}),
        }
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: (e as any).message}),
        }
    }
};
