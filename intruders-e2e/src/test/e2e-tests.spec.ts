import * as request from 'request-promise';
const SERVER_URL = process.env.SERVER_URL || 'https://pfi1of1wg6.execute-api.us-east-2.amazonaws.com';

const sendRequest = async (method: string, path: string, userToken: string, body?: any) => {
    console.log(`${method} ${path}`);
    const resp = await request({
        method: method,
        url: `${SERVER_URL}${path}`,
        json: true,
        body: body,
        headers: {
            authorization: userToken,
        }
    });
    return resp;
}

describe('Game service e2e tests', () => {
    const USER_TOKENS = process.env.USER_TOKENS as string;
    const tokensArray = USER_TOKENS.split(',');
    const [
        user1Token,
        user2Token,
        user3Token,
        user4Token,
        user5Token,
        user6Token,
        user7Token,
        user8Token,
        user9Token,
        user10Token,
    ] = tokensArray;
    const usersMap = {
        loshok1id: user1Token,
        loshok2id: user2Token,
        loshok3id: user3Token,
        loshok4id: user4Token,
        loshok5id: user5Token,
        loshok6id: user6Token,
        loshok7id: user7Token,
        loshok8id: user8Token,
        loshok9id: user9Token,
        loshok10id: user10Token,
    };

    describe('Scenario 1', () => {


        const state = {
            gameId: '',
            '1': '',
            '2': '',
            '3': '',
            '4': '',
            '5': '',
            spyNumber: 0,
            leaderToken: '',
            lastLeader: 0,
            nonSpies: [] as number[],
        };

        const findASpy = async (lastIndex: number = 0) => {
            if (lastIndex > 4) {
                throw new Error('Spy was not found. Something is wrong');
            }
            const gameStatus = await sendRequest('GET', `/status/${state.gameId}`, state[lastIndex + 1]);
            const spyIndex = Object.keys(gameStatus.players).find(playerNumber => gameStatus.players[playerNumber].role === 'spy');
            if (spyIndex) {
                state.spyNumber = Number(spyIndex);
                return;
            } else {
                return findASpy(lastIndex + 1)
            }
        }

        it('User 1 create a game', async () => {
            const gameStatus = await sendRequest('POST', '/create-game', user1Token);
            state.gameId = gameStatus.gameId;
            expect(gameStatus.status).toEqual('WAITING_PLAYERS_TO_JOIN');
            expect(gameStatus.mission).toEqual(0);
            expect(gameStatus.leader).toEqual(0);
            expect(gameStatus.players['1']).toBeDefined();
        });

        it('User 1 changes his name', async () => {
            await sendRequest('PUT', '/change-name', user1Token, { gameId: state.gameId, newName: 'e2e-pridurok' });
            const gameStatus = await sendRequest('GET', `/status/${state.gameId}`, user1Token);
            expect(gameStatus.players['1'].name).toBe('e2e-pridurok');
        });

        it('Users join the game', async () => {
            await sendRequest('POST', '/join-game', user2Token, { gameId: state.gameId });
            await sendRequest('POST', '/join-game', user3Token, { gameId: state.gameId });
            await sendRequest('POST', '/join-game', user4Token, { gameId: state.gameId });
            await sendRequest('POST', '/join-game', user5Token, { gameId: state.gameId });
            const gameStatus = await sendRequest('GET', `/status/${state.gameId}`, user1Token);
            expect(gameStatus.status).toEqual('WAITING_PLAYERS_TO_JOIN');
            expect(gameStatus.players['2']).toBeDefined();
            expect(gameStatus.players['3']).toBeDefined();
            expect(gameStatus.players['4']).toBeDefined();
            expect(gameStatus.players['5']).toBeDefined();
        });

        it('Leader starts the game', async () => {
            await sendRequest('POST', '/start-game', user1Token, { gameId: state.gameId });
            const gameStatus = await sendRequest('GET', `/status/${state.gameId}`, user1Token);
            state.leaderToken = usersMap[gameStatus.players[gameStatus.leader].id];
            state[1] = usersMap[gameStatus.players['1'].id];
            state[2] = usersMap[gameStatus.players['2'].id];
            state[3] = usersMap[gameStatus.players['3'].id];
            state[4] = usersMap[gameStatus.players['4'].id];
            state[5] = usersMap[gameStatus.players['5'].id];
            state.lastLeader = gameStatus.leader;
            expect(gameStatus.status).toBe('WAITING_LEADER_TO_SELECT_PLAYERS');
            expect(gameStatus.missions['1']).toBeDefined();
            expect(gameStatus.players[gameStatus.playerIndex].role).toBeDefined();
            expect(gameStatus.leader).not.toBe(0);
            expect(gameStatus.mission).not.toBe(0);
        });

        it('Leader selects players for the first mission', async () => {
            await sendRequest('POST', '/select-player', state.leaderToken, { gameId: state.gameId, playerNumber: 1 });
            await sendRequest('POST', '/select-player', state.leaderToken, { gameId: state.gameId, playerNumber: 3 });
            const gameStatus = await sendRequest('GET', `/status/${state.gameId}`, user1Token);
            expect(gameStatus.missions['1'].preSelectedPlayers).toEqual([1, 3]);
        });

        it('Show throw error on selecting more players than allowed', async () => {
            let message;
            try {
                await sendRequest('POST', '/select-player', state.leaderToken, { gameId: state.gameId, playerNumber: 4 });
            } catch (e) {
                message = e.message
            }
            expect(message).toContain('Cannot select more players on the mission');
        });

        it('Leader removes a player from the mission', async () => {
            await sendRequest('DELETE', `/remove-player-from-mission/${state.gameId}/3`, state.leaderToken);
            const gameStatus = await sendRequest('GET', `/status/${state.gameId}`, user1Token);
            expect(gameStatus.missions['1'].preSelectedPlayers).toEqual([1]);
        });

        it('Leader selects a player on the mission and sends for approval', async () => {
            await sendRequest('POST', '/select-player', state.leaderToken, { gameId: state.gameId, playerNumber: 2 });
            await sendRequest('POST', '/send-for-approval', state.leaderToken, { gameId: state.gameId });
            const gameStatus = await sendRequest('GET', `/status/${state.gameId}`, user1Token);
            expect(gameStatus.missions['1'].status).toEqual('VOTING');
        });

        it('Players vote', async () => {
            await sendRequest('POST', '/vote', user1Token, { gameId: state.gameId, vote: 'APPROVE' });
            await sendRequest('POST', '/vote', user2Token, { gameId: state.gameId, vote: 'APPROVE' });
            await sendRequest('POST', '/vote', user3Token, { gameId: state.gameId, vote: 'APPROVE' });
            await sendRequest('POST', '/vote', user4Token, { gameId: state.gameId, vote: 'APPROVE' });
            // user 1 revotes
            await sendRequest('POST', '/vote', user1Token, { gameId: state.gameId, vote: 'REJECT' });
            const gameStatus = await sendRequest('GET', `/status/${state.gameId}`, user1Token);
            const votes = gameStatus.missions['1'].votes;
            expect(votes.filter(vote => vote === 'APPROVE').length).toEqual(3);
            expect(votes.filter(vote => vote === 'REJECT').length).toEqual(1);
        });

        it('Last player votes, selected players should go on the mission', async () => {
            await sendRequest('POST', '/vote', user5Token, { gameId: state.gameId, vote: 'APPROVE' });
            const gameStatus = await sendRequest('GET', `/status/${state.gameId}`, user1Token);
            expect(gameStatus.missions['1'].status).toEqual('ACTING');
            expect(gameStatus.missions['1'].playersOnMission).toEqual([1, 2]);
        });

        it('Player 1 acts on the mission, actions should be invisible', async () => {
            await sendRequest('POST', '/act-mission', state[1], { gameId: state.gameId, action: 'SUCCESS' });
            const gameStatus = await sendRequest('GET', `/status/${state.gameId}`, user1Token);
            expect(gameStatus.missions['1'].missionActions).toEqual(undefined);
        });

        it('Player 2 acts on the mission, mission should succeed', async () => {
            await sendRequest('POST', '/act-mission', state[2], { gameId: state.gameId, action: 'SUCCESS' });
            const gameStatus = await sendRequest('GET', `/status/${state.gameId}`, user1Token);
            expect(gameStatus.missions['1'].missionActions).toEqual(['SUCCESS', 'SUCCESS']);
            expect(gameStatus.missions['1'].status).toEqual('MISSION_SUCCEED');
            expect(gameStatus.leader).toEqual(state.lastLeader === 5 ? 1 : state.lastLeader + 1);
            state.lastLeader = gameStatus.leader;
            state.leaderToken = usersMap[gameStatus.players[gameStatus.leader].id];
            await findASpy();
        });

        it('Next leader selects 2 players on a mission (with a spy) and tries to send for approval (3 is requered)', async () => {
            state.nonSpies = [1, 2, 3, 4, 5].filter(item => item !== state.spyNumber);
            await sendRequest('POST', '/select-player', state.leaderToken, { gameId: state.gameId, playerNumber: state.spyNumber });
            await sendRequest('POST', '/select-player', state.leaderToken, { gameId: state.gameId, playerNumber: state.nonSpies[0] });

            const gameStatus = await sendRequest('GET', `/status/${state.gameId}`, user1Token);
            expect(gameStatus.missions['2'].preSelectedPlayers).toEqual([state.spyNumber, state.nonSpies[0]]);

            let message;
            try {
                await sendRequest('POST', '/send-for-approval', state.leaderToken, { gameId: state.gameId });
            } catch (e) {
                message = e.message
            }
            expect(message).toContain('Not enough players on mission');
        });

        it('Select 3rd player on the mission and sends for approval', async () => {
            await sendRequest('POST', '/select-player', state.leaderToken, { gameId: state.gameId, playerNumber: state.nonSpies[1] });
            await sendRequest('POST', '/send-for-approval', state.leaderToken, { gameId: state.gameId });
            const gameStatus = await sendRequest('GET', `/status/${state.gameId}`, user1Token);
            expect(gameStatus.missions['2'].status).toEqual('VOTING');
        });

        it('Players reject selected players', async () => {
            await sendRequest('POST', '/vote', state[1], { gameId: state.gameId, vote: 'REJECT' });
            await sendRequest('POST', '/vote', state[2], { gameId: state.gameId, vote: 'REJECT' });
            await sendRequest('POST', '/vote', state[3], { gameId: state.gameId, vote: 'REJECT' });
            await sendRequest('POST', '/vote', state[4], { gameId: state.gameId, vote: 'REJECT' });
            await sendRequest('POST', '/vote', state[5], { gameId: state.gameId, vote: 'REJECT' });
            const gameStatus = await sendRequest('GET', `/status/${state.gameId}`, user1Token);
            expect(gameStatus.missions['2'].status).toEqual('SELECTING_PLAYERS');
            expect(gameStatus.leader).toEqual(state.lastLeader === 5 ? 1 : state.lastLeader + 1);
            state.lastLeader = gameStatus.leader;
            state.leaderToken = usersMap[gameStatus.players[gameStatus.leader].id];
        });

        it('Select three players on the mission and sends for approval', async () => {
            await sendRequest('POST', '/select-player', state.leaderToken, { gameId: state.gameId, playerNumber: state.spyNumber });
            await sendRequest('POST', '/select-player', state.leaderToken, { gameId: state.gameId, playerNumber: state.nonSpies[0] });
            await sendRequest('POST', '/select-player', state.leaderToken, { gameId: state.gameId, playerNumber: state.nonSpies[1] });
            await sendRequest('POST', '/send-for-approval', state.leaderToken, { gameId: state.gameId });
            const gameStatus = await sendRequest('GET', `/status/${state.gameId}`, user1Token);
            expect(gameStatus.missions['2'].status).toEqual('VOTING');
        });

        it('Players approves players on the mission', async () => {
            await sendRequest('POST', '/vote', state[1], { gameId: state.gameId, vote: 'APPROVE' });
            await sendRequest('POST', '/vote', state[2], { gameId: state.gameId, vote: 'APPROVE' });
            await sendRequest('POST', '/vote', state[3], { gameId: state.gameId, vote: 'APPROVE' });
            await sendRequest('POST', '/vote', state[4], { gameId: state.gameId, vote: 'REJECT' });
            await sendRequest('POST', '/vote', state[5], { gameId: state.gameId, vote: 'REJECT' });
            const gameStatus = await sendRequest('GET', `/status/${state.gameId}`, user1Token);
            expect(gameStatus.missions['2'].status).toEqual('ACTING');
        });

        it('3 players succeed the mission', async () => {
            await sendRequest('POST', '/act-mission', state[state.spyNumber], { gameId: state.gameId, action: 'FAIL' });
            await sendRequest('POST', '/act-mission', state[state.nonSpies[0]], { gameId: state.gameId, vote: 'SUCCESS' });
            await sendRequest('POST', '/act-mission', state[state.nonSpies[1]], { gameId: state.gameId, vote: 'SUCCESS' });
            const gameStatus = await sendRequest('GET', `/status/${state.gameId}`, user1Token);
            expect(gameStatus.missions['2'].status).toEqual('MISSION_FAILED');
            expect(gameStatus.missions['3'].status).toEqual('SELECTING_PLAYERS');
            expect(gameStatus.leader).toEqual(state.lastLeader === 5 ? 1 : state.lastLeader + 1);
            state.lastLeader = gameStatus.leader;
            state.leaderToken = usersMap[gameStatus.players[gameStatus.leader].id];
        });

        it('Leader selects 2 players on the mission and sends for approval', async () => {
            await sendRequest('POST', '/select-player', state.leaderToken, { gameId: state.gameId, playerNumber: 1 });
            await sendRequest('POST', '/select-player', state.leaderToken, { gameId: state.gameId, playerNumber: 2 });
            await sendRequest('POST', '/send-for-approval', state.leaderToken, { gameId: state.gameId });
            const gameStatus = await sendRequest('GET', `/status/${state.gameId}`, user1Token);
            expect(gameStatus.missions['3'].status).toEqual('VOTING');
        });

        it('Players vote', async () => {
            await sendRequest('POST', '/vote', state[1], { gameId: state.gameId, vote: 'APPROVE' });
            await sendRequest('POST', '/vote', state[2], { gameId: state.gameId, vote: 'APPROVE' });
            await sendRequest('POST', '/vote', state[3], { gameId: state.gameId, vote: 'APPROVE' });
            await sendRequest('POST', '/vote', state[4], { gameId: state.gameId, vote: 'REJECT' });
            await sendRequest('POST', '/vote', state[5], { gameId: state.gameId, vote: 'APPROVE' });
            const gameStatus = await sendRequest('GET', `/status/${state.gameId}`, user1Token);
            expect(gameStatus.missions['3'].status).toEqual('ACTING');
        });

        it('Players act, mission succeed', async () => {
            await sendRequest('POST', '/act-mission', state[1], { gameId: state.gameId, action: 'SUCCESS' });
            await sendRequest('POST', '/act-mission', state[2], { gameId: state.gameId, action: 'SUCCESS' });
            const gameStatus = await sendRequest('GET', `/status/${state.gameId}`, user1Token);
            expect(gameStatus.missions['3'].status).toEqual('MISSION_SUCCEED');
            expect(gameStatus.leader).toEqual(state.lastLeader === 5 ? 1 : state.lastLeader + 1);
            state.lastLeader = gameStatus.leader;
            state.leaderToken = usersMap[gameStatus.players[gameStatus.leader].id];
        });

        it('Leader selects players, players approve, players act, mission succeed, game is finished', async () => {
            await sendRequest('POST', '/select-player', state.leaderToken, { gameId: state.gameId, playerNumber: 1 });
            await sendRequest('POST', '/select-player', state.leaderToken, { gameId: state.gameId, playerNumber: 2 });
            await sendRequest('POST', '/select-player', state.leaderToken, { gameId: state.gameId, playerNumber: 3 });
            await sendRequest('POST', '/send-for-approval', state.leaderToken, { gameId: state.gameId });
            await sendRequest('POST', '/vote', state[1], { gameId: state.gameId, vote: 'APPROVE' });
            await sendRequest('POST', '/vote', state[2], { gameId: state.gameId, vote: 'APPROVE' });
            await sendRequest('POST', '/vote', state[3], { gameId: state.gameId, vote: 'APPROVE' });
            await sendRequest('POST', '/vote', state[4], { gameId: state.gameId, vote: 'APPROVE' });
            await sendRequest('POST', '/vote', state[5], { gameId: state.gameId, vote: 'APPROVE' });
            await sendRequest('POST', '/act-mission', state[1], { gameId: state.gameId, action: 'SUCCESS' });
            await sendRequest('POST', '/act-mission', state[2], { gameId: state.gameId, action: 'SUCCESS' });
            await sendRequest('POST', '/act-mission', state[3], { gameId: state.gameId, action: 'SUCCESS' });
            const gameStatus = await sendRequest('GET', `/status/${state.gameId}`, user1Token);
            expect(gameStatus.finished.winner).toEqual('resistence');
            expect(gameStatus.finished.missions).toEqual({
                '1': 'MISSION_SUCCEED',
                '2': 'MISSION_FAILED',
                '3': 'MISSION_SUCCEED',
                '4': 'MISSION_SUCCEED'
            });
        });

        afterAll(async () => {
            try {
                await sendRequest('DELETE', `/leave-game/${state.gameId}`, user1Token);
            } catch (e) {
                console.log(e);
            }
        });

    });

});
