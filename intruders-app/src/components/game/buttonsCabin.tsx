import { StyleSheet, useWindowDimensions, View } from "react-native";
import { GameStateResponse, GAME_STATUS, MISSION_ACTION, VOTE } from "../../types/gameServerTypes";
import React, { useEffect, useState } from "react";
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
    embedded?: boolean,
    sectionHeight?: number,
};

export const ButtonsCabin = ({ gameState, setShowRoles, mutateGame, showRoles, embedded = false, sectionHeight }: ButtonsCabinProps) => {
    const missionSpec = getMissionSpecification(gameState);
    const { width, height } = useWindowDimensions();
    const buttonSize = width <= 360 || height <= 640 ? 44 : 48;
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [approvalLoading, setApprovalLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionSubmitted, setActionSubmitted] = useState(false);
    useEffect(() => setActionSubmitted(false), [gameState.mission]);
    const canAct = gameState.playerAction === GAME_STATUS.ACT_MISSON && !actionSubmitted;
    const canSendForApproval = gameState.leader === gameState.playerIndex && gameState.playerAction === GAME_STATUS.SELECT_PLAYERS_ON_MISSION &&
        gameState.missions[gameState.mission].preSelectedPlayers.length === missionSpec.players;
    const canVote = gameState.playerAction === GAME_STATUS.APPROVE_OR_REJECT_PLAYERS;

    const onSendForApproval = async () => {
        setApprovalLoading(true);
        try {
            await sendForApproval(gameState, mutateGame);
        } finally {
            setApprovalLoading(false);
        }
    }

    const onVote = async (v: VOTE) => {
        await vote(v, gameState, mutateGame);
    }

    const onAct = async (action: MISSION_ACTION) => {
        setActionLoading(true);
        try {
            const submitted = await act(action, gameState, mutateGame);
            if (submitted) setActionSubmitted(true);
        } finally {
            setActionLoading(false);
        }
    }

    return (<GradientPanel embedded={embedded} height={embedded ? sectionHeight || 178 : 178} reverse roundBottom>
        <View style={styles.buttonContainer}>
            <GameButton labelBottom="Settings" round size={buttonSize} color={'#fff'}
                isEnabled onPress={() => navigation.navigate('SettingsScreen')} />
            <GameButton labelBottom="Show your role" size={buttonSize} color={showRoles ? 'orange' : colors.pureWhite} isEnabled
                onPress={() => setShowRoles(!showRoles)}/>
            {canVote && <GameButtonGroup>
                <GameButton labelBottom="Approve" size={buttonSize} color={colors.greenDigital} isEnabled={canVote} onPress={() => onVote(VOTE.APPROVE)} />
                <GameButton labelBottom="Reject" size={buttonSize} color={colors.red} isEnabled={canVote} onPress={() => onVote(VOTE.REJECT)} />
            </GameButtonGroup>}
            {canAct && <GameButtonGroup>
                <GameButton labelBottom="Success" size={buttonSize} color={colors.greenDigital}
                    isEnabled={canAct && !actionLoading} onPress={() => onAct(MISSION_ACTION.SUCCESS)} onPressIn={() => { }} />
                <GameButton labelBottom="Fail" size={buttonSize} color={colors.red}
                    isEnabled={canAct && !actionLoading} onPress={() => onAct(MISSION_ACTION.FAIL)} />
            </GameButtonGroup>}
            {canSendForApproval && <GameButton labelBottom="Send team" round size={buttonSize} color={colors.greenDigital}
                isEnabled={canSendForApproval && !approvalLoading} onPress={onSendForApproval} />
            }
        </View>
    </GradientPanel>);
}

const styles = StyleSheet.create({
    buttonContainer: {
        alignContent: "flex-start",
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexDirection: 'row',
        marginBottom: 5,
        paddingTop: 10,
        flexWrap: 'wrap',
        width: "100%",
        flex: 1,
        gap: 4,
    }
});
