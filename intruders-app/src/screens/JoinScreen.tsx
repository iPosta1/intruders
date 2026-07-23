import { Background } from "../components/background"
import React, { useEffect } from "react";
import { POST } from "../utils/fetch";
import { AppContext } from "../context";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { LoadingScreen } from "./LoadingScreen";

type Props = StackScreenProps<RootStackParamList, 'JoinScreen'>;

export const JoinScreen = ({ route }: Props) => {
    const { player } = React.useContext(AppContext);
    const params = route?.params as any;
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        if (player) {
            POST('/join-game', {gameId: params.gameId}).then(status => {
                if (status.ok) {
                    navigation.replace('GameScreen', { gameId: params.gameId });
                } else {
                    navigation.replace('MainScreen');
                }
            }).catch(() => navigation.replace('MainScreen'));
        }        
    }, [player?.id]);

    return (<Background><LoadingScreen/></Background>);
}
