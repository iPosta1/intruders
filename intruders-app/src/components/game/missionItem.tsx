import { StyleSheet, Text, View } from "react-native";
import { GameStateResponse, MISSION_ACTION } from "../../types/gameServerTypes";
import { colors } from "../../utils/constants";
import { getGameSpecifications } from "../../utils/game";

export const MissionItem = ({ missionNumber, gameState }: {
    missionNumber: number,
    playersOnTheMission?: number[],
    status: string,
    gameState: GameStateResponse,
}) => {
    const gameSpec = getGameSpecifications(Object.keys(gameState.players).length);
    const missionSpec = gameSpec.missions[missionNumber];
    const needsTwoFails = missionSpec?.fails > 1;
    return (
        <View style={styles.missionItem}>
            <Text style={styles.missionNameText}>{`M${missionNumber}`}</Text>
            <View style={[styles.missionItemCircle, needsTwoFails && styles.twoFailMission]}>
                <Text style={styles.playerCount}>{missionSpec?.players}</Text>
                {needsTwoFails && (
                    <View style={styles.failureBadge}>
                        <Text style={styles.failureBadgeText}>{`${missionSpec.fails}× FAIL`}</Text>
                    </View>
                )}
            </View>
            <View style={styles.missionActionsContainer}>
                {gameState.missions[missionNumber]?.missionActions?.map((action, index) => {
                    const isFailure = action === MISSION_ACTION.FAIL;
                    return (
                        <View
                            key={`${missionNumber}-${index}`}
                            style={{ ...styles.actionItem, borderColor: isFailure ? colors.red : colors.greenDigital }}
                        >
                            <Text style={{ ...styles.actionText, color: isFailure ? colors.red : colors.greenDigital }}>
                                {isFailure ? "X" : action === MISSION_ACTION.SUCCESS ? "OK" : "?"}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    missionItem: {
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        width: 50,
        height: 72,
        flex: 1,
    },
    missionItemCircle: {
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        width: '88%',
        maxWidth: 56,
        minWidth: 42,
        height: 40,
        borderWidth: 1,
        borderColor: colors.greenDigital,
        marginTop: 2,
    },
    missionNameText: {
        color: colors.greenDigital,
        fontSize: 13,
        fontFamily: "basic",
        textAlign: "center",
    },
    twoFailMission: {
        borderColor: colors.amber,
    },
    playerCount: {
        color: colors.greenDigital,
        fontSize: 19,
        fontFamily: "title",
        textAlign: "center",
    },
    failureBadge: {
        position: "absolute",
        left: 2,
        right: 2,
        bottom: 2,
        height: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.screenDeep,
        borderTopWidth: 1,
        borderTopColor: colors.amber,
    },
    failureBadgeText: {
        color: colors.amber,
        fontFamily: "basic",
        fontSize: 8,
        lineHeight: 10,
        letterSpacing: 0.3,
    },
    missionActionsContainer: {
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 2,
        width: 50,
        height: 18,
    },
    actionItem: {
        minWidth: 18,
        height: 18,
        borderWidth: 1,
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
    },
    actionText: {
        fontSize: 11,
        fontFamily: "title",
        textAlign: "center",
    },
});
