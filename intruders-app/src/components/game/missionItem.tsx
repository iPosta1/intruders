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
            <View style={styles.missionItemCircle}>
                <Text style={styles.playerCount}>{missionSpec?.players}</Text>
                {needsTwoFails && <Text style={styles.failRequirement}>/{missionSpec.fails}</Text>}
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
        backgroundColor: 'rgba(0,0,0,0.16)',
        shadowColor: colors.phosphor,
        shadowOpacity: 0.3,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 0 },
    },
    missionNameText: {
        color: colors.phosphorBright,
        fontSize: 17,
        lineHeight: 20,
        fontFamily: "title",
        letterSpacing: 0.4,
        marginBottom: 3,
        textAlign: "center",
        textShadowColor: 'rgba(124,255,155,0.75)',
        textShadowRadius: 6,
        textShadowOffset: { width: 0, height: 0 },
    },
    playerCount: {
        color: colors.greenDigital,
        fontSize: 19,
        fontFamily: "title",
        textAlign: "center",
        textShadowColor: 'rgba(124,255,155,0.85)',
        textShadowRadius: 6,
        textShadowOffset: { width: 0, height: 0 },
    },
    failRequirement: {
        position: 'absolute',
        right: 3,
        bottom: 2,
        color: colors.greenDigital,
        fontSize: 10,
        lineHeight: 11,
        fontFamily: "title",
        textShadowColor: 'rgba(124,255,155,0.75)',
        textShadowRadius: 4,
        textShadowOffset: { width: 0, height: 0 },
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
        textShadowColor: 'rgba(124,255,155,0.75)',
        textShadowRadius: 4,
        textShadowOffset: { width: 0, height: 0 },
    },
});
