import React from 'react';
import Toast from 'react-native-root-toast';
import { SERVER_URL } from '../context';
import { colors } from './constants';
import { loadPlayerIdentity } from '../services/playerIdentity';

export type ServerResponse = {
    ok: boolean,
    data?: any,
};

const makeRequest = async (path: string, type: string, body?: object, silent = false): Promise<ServerResponse> => {
    const player = loadPlayerIdentity();
    if (!player) {
        return { ok: false };
    }
    const headers = {
        'Content-Type': 'application/json',
        'X-Player-Id': player.id,
        'X-Player-Name': encodeURIComponent(player.name),
    };

    let fetchResponse: Response;
    try {
        fetchResponse = await fetch(`${SERVER_URL}${path}`, {
            method: type,
            headers,
            body: body ? JSON.stringify(body) : undefined
        });
    } catch {
        if (!silent) showError('Connection failed. Please try again.');
        return { ok: false };
    }

    const responseText = await fetchResponse.text();
    if (fetchResponse.ok) {
        let data: any = undefined;
        if (responseText) {
            try {
                data = JSON.parse(responseText);
            } catch {
                data = responseText;
            }
        }
        return {
            ok: true,
            data,
        };
    } else {
        if (!silent) showError(parseError(responseText));
        return { ok: false }
    }
}

const showError = (message: string) => Toast.show(message, {
    duration: Toast.durations.LONG,
    animation: true,
    hideOnPress: true,
    position: Toast.positions.TOP,
    shadow: true,
    textColor: colors.greenDigital,
    opacity: 0.8,
    textStyle: {
        fontFamily: 'title',
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'left'
    },
    containerStyle: {
        backgroundColor: colors.screenColor,
        borderRadius: 0,
        borderColor: colors.greenDigital,
        borderWidth: 2,
    }
});

export const GET = async (path: string, options?: { silent?: boolean }) => {
    return makeRequest(path, 'GET', undefined, options?.silent);
}

export const DELETE = async (path: string) => {
    return makeRequest(path, 'DELETE');
}

export const POST = async (path: string, body?: object) => {
    return makeRequest(path, 'POST', body);
}

export const PUT = async (path: string, body?: object) => {
    return makeRequest(path, 'PUT', body);
}

const parseError = (msg: string) => {
    try {
        const errObj = JSON.parse(msg);
        return errObj.error || errObj.message;
    } catch (e) {
        return msg;
    }
}

