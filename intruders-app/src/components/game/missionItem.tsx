import { Dimensions, StyleSheet, Text, View } from "react-native";
import { GameStateResponse, MISSION_ACTION, MISSION_STATUS } from "../../types/gameServerTypes";
import { colors } from "../../utils/constants";
import { getGameSpecifications, getMissionSpecification } from "../../utils/game";

export const MissionItem = ({ missionNumber, gameState }: {
    missionNumber: number,
    playersOnTheMission?: number[],
    status: string,
    gameState: GameStateResponse,
}) => {
    const gameSpec = getGameSpecifications(Object.keys(gameState.players).length);
    return (
        <View style={styles.missionItem}>
            <Text style={styles.missionNameText} >{`Mission ${missionNumber}`}</Text>
            <View style={{ ...styles.missionItemCircle, width: Dimensions.get("screen").width <= 280 ? 40 : 50 }}>
                <View style={styles.numberOfFails}>
                    {gameSpec.missions[missionNumber]?.fails > 1 &&
                        <Text style={styles.numberOfFailsText}>{`${gameSpec.missions[missionNumber]?.fails} fails`}</Text>
                    }
                </View>
                <Text style={{ ...styles.missionNameText, fontSize: 20 }}>{gameSpec.missions[missionNumber]?.players}</Text>
            </View>
            <View style={styles.missionActionsContainer}>
                {gameState.missions[missionNumber]?.missionActions?.map(action => (
                    <View style={{ ...styles.actionItem, borderColor: action === MISSION_ACTION.FAIL ? colors.red : colors.greenDigital }}>
                        <Text style={{ ...styles.actionText, color: action === MISSION_ACTION.FAIL ? colors.red : colors.greenDigital }}>{
                            action === MISSION_ACTION.FAIL ? 'X' : (action === MISSION_ACTION.SUCCESS ? '✓' : '?')
                        }</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    missionItem: {
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 60,
        flex: 1,
    },
    missionItemCircle: {
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 35,
        borderWidth: 1,
        borderColor: colors.greenDigital,
        marginTop: 2,
    },
    missionNameText: {
        color: colors.greenDigital,
        fontSize: 8,
        textAlign: 'center',
    },
    numberOfFails: {
        position: "absolute",
        top: 0,
        marginTop: 0,
    },
    numberOfFailsText: {
        color: colors.greenDigital,
        fontSize: 8,
    },
    missionActionsContainer: {
        flexDirection: 'row',
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
        width: 40,
        height: 12,
    },
    actionItem: {
        width: 8,
        height: 12,
        borderWidth: 1,
        borderColor: colors.greenDigital,
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionText: {
        color: colors.greenDigital,
        fontSize: 8,
        textAlign: 'center',
    },
});