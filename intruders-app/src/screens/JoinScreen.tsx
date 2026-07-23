import { Background } from "../components/background"
import React, { useEffect } from "react";
import { POST } from "../utils/fetch";
import { useTokenId } from "../services/gameService";
import { AppContext } from "../context";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { LoadingScreen } from "./LoadingScreen";

type Props = StackScreenProps<RootStackParamList, 'JoinScreen'>;

export const JoinScreen = ({ route }: Props) => {
    const { user } = React.useContext(AppContext);
    const { data: token } = useTokenId(user);
    const params = route?.params as any;
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        if (token) {
            POST('/join-game', token, {gameId: params.gameId}).then(status => {
                if (status.ok) {
                    navigation.navigate('GameScreen', { gameId: params.gameId });
                } else {
                    navigation.navigate('MainScreen');
                }
            }).catch(() => navigation.navigate('MainScreen'));
        }        
    }, [token]);

    return (<Background><LoadingScreen/></Background>);
}
