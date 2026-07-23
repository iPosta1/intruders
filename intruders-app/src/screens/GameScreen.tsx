import { useIsFocused, useNavigation } from "@react-navigation/native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { RootStackParamList } from "../../App";
import { Background } from "../components/background";
import { Game } from "../components/game";
import { Lobby } from "../components/game/lobby";
import { GameResult } from "../components/gameResult";
import { AppContext } from "../context";
import { useGameStatus, useTokenId } from "../services/gameService";
import { GAME_STATUS } from "../types/gameServerTypes";
import { LoadingScreen } from "./LoadingScreen";

type Props = StackScreenProps<RootStackParamList, 'GameScreen'>;

export const GameScreen = ({ route }: Props) => {
    useIsFocused();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { user } = React.useContext(AppContext);
    const params = route?.params as any;

    const { data: token } = useTokenId(user);
    const { data: gameStatus, isLoading: isGameStateLoading, mutate } = useGameStatus(params.gameId, token);

    useEffect(() => {
        if (gameStatus === null) {
            navigation.navigate('MainScreen');
        }
    }, [gameStatus]);

    return (!gameStatus ? <LoadingScreen/> : (gameStatus?.status === GAME_STATUS.WAITING_PLAYERS_TO_JOIN ? <Lobby gameState={gameStatus} /> :
        (gameStatus?.status === GAME_STATUS.GAME_FINISHED ? <GameResult gameState={gameStatus} token={token}/> : <Game gameState={gameStatus} token={token} mutate={mutate}/>)));
}
