import React from 'react';
import Toast from 'react-native-root-toast';
import { SERVER_URL } from '../context';
import { colors } from './constants';
import "setimmediate";

export type ServerResponse = {
    ok: boolean,
    data?: any,
};

const makeRequest = async (path: string, type: string, token: string, body?: object): Promise<ServerResponse> => {
    const headers = {
        authorization: token,
        'Content-Type': 'application/json',
    };

    const fetchResponse = await fetch(`${SERVER_URL}${path}`, {
        method: type,
        headers,
        body: body ? JSON.stringify(body) : undefined
    });
    if (fetchResponse.status === 200) {
        const data = await fetchResponse.json();
        return {
            ok: true,
            data: data,
        };
    } else {
        const msg = await fetchResponse.text();
        Toast.show(parseError(msg), {
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
        return { ok: false }
    }
}

export const GET = async (path: string, token: string) => {
    return makeRequest(path, 'GET', token);
}

export const DELETE = async (path: string, token: string) => {
    return makeRequest(path, 'DELETE', token);
}

export const POST = async (path: string, token: string, body?: object) => {
    return makeRequest(path, 'POST', token, body);
}

export const PUT = async (path: string, token: string, body?: object) => {
    return makeRequest(path, 'PUT', token, body);
}

const parseError = (msg: string) => {
    try {
        const errObj = JSON.parse(msg);
        return errObj.error || errObj.message;
    } catch (e) {
        return msg;
    }
}

