import { Dimensions, StyleSheet, Text, View } from "react-native";
import { GameStateResponse, MISSION_STATUS } from "../../types/gameServerTypes";
import React from "react";
import { MissionItem } from "./missionItem";
import { GameButton } from "../shared/gameButton";
import { GradientPanel } from "../shared/gradientPanel";
import { ComputerScreen } from "../shared/computerScreen";
import { colors } from "../../utils/constants";

export const MissionsCabin = ({ gameState }: { gameState?: GameStateResponse }) => {
    return (
        <GradientPanel height={150} reverse>
            <View style={styles.missionsIndicatorContainer}>
                {Array.from({ length: 5 }, (val, index) => index + 1).map(missionIndex => {
                    const buttonColor = gameState.missions[missionIndex]?.status === MISSION_STATUS.MISSION_SUCCEED ? colors.green :
                        (gameState.missions[missionIndex]?.status === MISSION_STATUS.MISSION_FAILED ? colors.red : '#fff');
                    const isEnabled = gameState.missions[missionIndex]?.status === MISSION_STATUS.MISSION_FAILED ||
                        gameState.missions[missionIndex]?.status === MISSION_STATUS.MISSION_SUCCEED || missionIndex === gameState.mission
                    return (<View style={styles.indicatorItem}>
                        <GameButton size={20} color={buttonColor} round indicator isEnabled={isEnabled} />
                    </View>)
                })}
            </View>
            <ComputerScreen width={Dimensions.get("screen").width - 40} height={100} marginTop={7} maxWidth={480}>
                <View style={styles.missionsList}>
                    {Array.from({ length: 5 }, (val, index) => index + 1).map(missionIndex => (<MissionItem
                        missionNumber={missionIndex}
                        status={gameState.missions[missionIndex]?.status}
                        playersOnTheMission={gameState.missions[missionIndex]?.playersOnMission}
                        gameState={gameState}
                    />))}
                </View>
            </ComputerScreen>
            <View style={styles.rejectionsContainer}>
                <Text style={styles.rejectionsLable}>Rejections track</Text>
                {Array.from({ length: 5 }, (val, index) => index + 1).map(rejectionIndex => (<View style={styles.rejectionItem}>
                    <GameButton size={20} color={!!gameState.rejections[rejectionIndex]?.mission ? '#bc1e13' : '#fff'} round indicator
                        isEnabled={!!gameState.rejections[rejectionIndex]?.mission} />
                </View>))}
            </View>
        </GradientPanel>
    )
};

const styles = StyleSheet.create({
    missionsIndicatorContainer: {
        width: Dimensions.get("screen").width - 80,
        height: 15,
        alignContent: "center",
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: 440,
        flexDirection: 'row',
        paddingLeft: 3,
        paddingRight: 3,
    },
    indicatorItem: {
        width: 50,
        height: 20,
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    rejectionsContainer: {
        width: Dimensions.get("screen").width - 40,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        maxWidth: 480,
        marginTop: 5,
        flexDirection: 'row',
    },
    rejectionsLable: {
        fontSize: 14,
        color: colors.lightGray1,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
    },
    rejectionItem: {
        width: 20,
        height: 20,
        marginLeft: 5,
    },
    missionsList: {
        flex: 1,
        alignContent: "center",
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 3,
        paddingRight: 3,
        height: 68,
        width: '100%',
    }
});
