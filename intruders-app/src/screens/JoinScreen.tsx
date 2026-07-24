import { Background } from "../components/background"
import React, { useEffect, useRef } from "react";
import { POST } from "../utils/fetch";
import { AppContext } from "../context";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { LoadingScreen } from "./LoadingScreen";
import { useSWRConfig } from "swr";

type Props = StackScreenProps<RootStackParamList, 'JoinScreen'>;

export const JoinScreen = ({ route }: Props) => {
    const { player } = React.useContext(AppContext);
    const params = route?.params as any;
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { mutate: mutateCache } = useSWRConfig();
    const joinStarted = useRef(false);
    const normalizedGameId = String(params.gameId || '').trim().toLowerCase();

    useEffect(() => {
        if (player && normalizedGameId && !joinStarted.current) {
            joinStarted.current = true;
            POST('/join-game', { gameId: normalizedGameId }).then(async status => {
                if (status.ok) {
                    const joinedGameId = status.data?.gameId?.trim().toLowerCase() || normalizedGameId;
                    await mutateCache(
                        ['/find-game', player.id],
                        status.data || { gameId: joinedGameId },
                        { revalidate: false },
                    );
                    navigation.replace('GameScreen', { gameId: joinedGameId });
                } else {
                    navigation.replace('MainScreen');
                }
            }).catch(() => navigation.replace('MainScreen'));
        }
    }, [mutateCache, navigation, normalizedGameId, player]);

    return (<Background><LoadingScreen/></Background>);
}
