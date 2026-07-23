import { Dimensions, StyleSheet, View } from "react-native";
import { GameStateResponse, GAME_STATUS, MISSION_ACTION, VOTE } from "../../types/gameServerTypes";
import React, { useState } from "react";
import { GameButtonGroup, GameButton } from "../shared/gameButton";;
import { getMissionSpecification, mapGameState } from "../../utils/game";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../App";
import { sendForApproval, vote, act } from "../../services/gameService";
import { KeyedMutator } from "swr";
import { GradientPanel } from "../shared/gradientPanel";
import { colors } from "../../utils/constants";

type ButtonsCabinProps = {
    gameState?: GameStateResponse,
    setShowRoles: (param: boolean) => void,
    showRoles: boolean;
    mutateGame: KeyedMutator<GameStateResponse>,
};

export const ButtonsCabin = ({ gameState, setShowRoles, mutateGame, showRoles }: ButtonsCabinProps) => {
    const missionSpec = getMissionSpecification(gameState);
    const buttonSize = Dimensions.get("screen").width <= 340 || Dimensions.get("screen").height <= 640 ? 30 : 40;
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [approvalLoading, setApprovalLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const canAct = gameState.playerAction === GAME_STATUS.ACT_MISSON;
    const canSendForApproval = gameState.leader === gameState.playerIndex && gameState.playerAction === GAME_STATUS.SELECT_PLAYERS_ON_MISSION &&
        gameState.missions[gameState.mission].preSelectedPlayers.length === missionSpec.players;
    const canVote = gameState.playerAction === GAME_STATUS.APPROVE_OR_REJECT_PLAYERS;

    const onSendForApproval = async () => {
        setApprovalLoading(true);
        await sendForApproval(gameState, mutateGame);
        setApprovalLoading(false);
    }

    const onVote = async (v: VOTE) => {
        await vote(v, gameState, mutateGame);
    }

    const onAct = async (action: MISSION_ACTION) => {
        setActionLoading(true);
        await act(action, gameState, mutateGame);
        setActionLoading(false);
    }

    return (<GradientPanel reverse roundBottom>
        <View style={styles.buttonContainer}>
            <GameButton labelBottom="Settings" round size={buttonSize} color={'#fff'}
                isEnabled onPress={() => navigation.navigate('SettingsScreen')} />
            <GameButton labelBottom="Show your role" size={buttonSize} color={showRoles ? 'orange' : colors.pureWhite} isEnabled
                onPress={() => setShowRoles(!showRoles)}/>
            <GameButtonGroup>
                <GameButton labelBottom="Approve" size={buttonSize} color={colors.greenDigital} isEnabled={canVote} onPress={() => onVote(VOTE.APPROVE)} />
                <GameButton labelBottom="Reject" size={buttonSize} color={colors.red} isEnabled={canVote} onPress={() => onVote(VOTE.REJECT)} />
            </GameButtonGroup>
            <GameButtonGroup>
                <GameButton labelBottom="Success" size={buttonSize} color={colors.greenDigital}
                    isEnabled={canAct && !actionLoading} onPress={() => onAct(MISSION_ACTION.SUCCESS)} onPressIn={() => { }} />
                <GameButton labelBottom="Fail" size={buttonSize} color={colors.red}
                    isEnabled={canAct && !actionLoading} onPress={() => onAct(MISSION_ACTION.FAIL)} />
            </GameButtonGroup>
            <GameButton labelBottom="Send for approval" round size={buttonSize} color={'#fff'}
                isEnabled={canSendForApproval && !approvalLoading} onPress={onSendForApproval} />
        </View>
    </GradientPanel>);
}

const styles = StyleSheet.create({
    buttonContainer: {
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 5,
        paddingTop: 5,
        flexWrap: 'wrap',
        flex: 1,
    }
});
