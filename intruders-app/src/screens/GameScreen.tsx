import { useIsFocused, useNavigation } from "@react-navigation/native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { RootStackParamList } from "../../App";
import { Background } from "../components/background";
import { Game } from "../components/game";
import { Lobby } from "../components/game/lobby";
import { GameResult } from "../components/gameResult";
import { AppContext } from "../context";
import { useGameStatus } from "../services/gameService";
import { GAME_STATUS } from "../types/gameServerTypes";
import { LoadingScreen } from "./LoadingScreen";

type Props = StackScreenProps<RootStackParamList, 'GameScreen'>;

export const GameScreen = ({ route }: Props) => {
    useIsFocused();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { player } = React.useContext(AppContext);
    const params = route?.params as any;

    const { data: gameStatus, isLoading, mutate } = useGameStatus(params.gameId, player?.id);

    useEffect(() => {
        if (!isLoading && gameStatus === null) {
            navigation.reset({ index: 0, routes: [{ name: 'MainScreen' }] });
        }
    }, [gameStatus, isLoading, navigation]);

    return (!gameStatus ? <LoadingScreen/> : (gameStatus?.status === GAME_STATUS.WAITING_PLAYERS_TO_JOIN ? <Lobby gameState={gameStatus} mutate={mutate} /> :
        (gameStatus?.status === GAME_STATUS.GAME_FINISHED ? <GameResult gameState={gameStatus} /> : <Game gameState={gameStatus} mutate={mutate}/>)));
}
