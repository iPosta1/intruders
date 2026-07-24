import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { GameStateResponse, MISSION_STATUS } from "../../types/gameServerTypes";
import React from "react";
import { MissionItem } from "./missionItem";
import { GameButton } from "../shared/gameButton";
import { GradientPanel } from "../shared/gradientPanel";
import { ComputerScreen } from "../shared/computerScreen";
import { colors } from "../../utils/constants";

export const MissionsCabin = ({ gameState, embedded = false, sectionHeight }: {
    gameState?: GameStateResponse,
    embedded?: boolean,
    sectionHeight?: number,
}) => {
    const { width } = useWindowDimensions();
    return (
        <GradientPanel embedded={embedded} height={embedded ? sectionHeight || 174 : 210} reverse>
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
            <ComputerScreen embedded={embedded} width="100%" height={112} marginTop={7} maxWidth={520}>
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
                <Text
                    numberOfLines={1}
                    style={[styles.rejectionsLable, width < 430 && styles.compactRejectionsLabel]}
                >
                    REJECTION TRACK
                </Text>
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
        width: "92%",
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
        width: "100%",
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        maxWidth: 480,
        marginTop: 4,
        flexDirection: 'row',
    },
    rejectionsLable: {
        fontFamily: 'title',
        fontSize: 19,
        color: colors.phosphorBright,
        letterSpacing: 0.8,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        textShadowColor: 'rgba(124,255,155,0.75)',
        textShadowRadius: 6,
        textShadowOffset: { width: 0, height: 0 },
    },
    compactRejectionsLabel: {
        fontSize: 14,
        letterSpacing: 0.2,
        marginRight: 3,
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
        height: 78,
        width: '100%',
    }
});
