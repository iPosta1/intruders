import { useIsFocused, useNavigation } from "@react-navigation/native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import React, { useEffect, useRef } from "react";
import { RootStackParamList } from "../../App";
import { Background } from "../components/background";
import { Game } from "../components/game";
import { Lobby } from "../components/game/lobby";
import { GameResult } from "../components/gameResult";
import { AppContext } from "../context";
import { useGameStatus } from "../services/gameService";
import { GAME_STATUS } from "../types/gameServerTypes";
import { LoadingScreen } from "./LoadingScreen";
import { useSWRConfig } from "swr";

type Props = StackScreenProps<RootStackParamList, 'GameScreen'>;

export const GameScreen = ({ route }: Props) => {
    useIsFocused();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { player } = React.useContext(AppContext);
    const params = route?.params as any;
    const { mutate: mutateCache } = useSWRConfig();
    const redirectingToMain = useRef(false);
    const gameId = String(params.gameId || '').trim().toLowerCase();

    const { data: gameStatus, isLoading, mutate } = useGameStatus(gameId, player?.id);

    useEffect(() => {
        if (!isLoading && gameStatus === null && !redirectingToMain.current) {
            redirectingToMain.current = true;
            Promise.all([
                mutateCache(['/find-game', player?.id], null, { revalidate: false }),
                mutateCache([`/status/${gameId}`, player?.id], null, { revalidate: false }),
            ]).finally(() => {
                navigation.reset({ index: 0, routes: [{ name: 'MainScreen' }] });
            });
        }
    }, [gameId, gameStatus, isLoading, mutateCache, navigation, player?.id]);

    return (!gameStatus ? <LoadingScreen/> : (gameStatus?.status === GAME_STATUS.WAITING_PLAYERS_TO_JOIN ? <Lobby gameState={gameStatus} mutate={mutate} /> :
        (gameStatus?.status === GAME_STATUS.GAME_FINISHED ? <GameResult gameState={gameStatus} /> : <Game gameState={gameStatus} mutate={mutate}/>)));
}
