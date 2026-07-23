import { Context, APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { parse } from 'path';
import { GameDao } from '../dao/gameDao';
import { GameService } from '../services/gameService';
import { getActionByRequestPath } from '../utils/gameUtils';

const TABLE_INDEX = 'game-id';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {


    console.log(`Event: ${JSON.stringify(event, null, 2)}`);

    if (!event.requestContext.authorizer?.lambda?.userId || !event.requestContext.authorizer?.lambda?.username) {
        return {
            statusCode: 403,
            body: 'Unauthorized',
        }
    }

    const tableName = process.env.TABLE_NAME as string;
    const region = process.env.REGION as string;
    const gameDao = new GameDao(new DocumentClient({ region }), tableName, TABLE_INDEX);

    try {
        const bodyParameters = event.body ? JSON.parse(event.body) : {};
        const requestParams = { ...bodyParameters, ...event.pathParameters };
        const action = getActionByRequestPath((event as any).rawPath);
        const result = await new GameService(event.requestContext.authorizer.lambda.userId,
            event.requestContext.authorizer.lambda.username.substring(0, 16), gameDao).processRequest(action, requestParams);
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
