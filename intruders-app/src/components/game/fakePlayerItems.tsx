import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors } from "../../utils/constants";

const FAKE_TEXT = 'This is a fake text, dont read it or you will die! ';

export const getFakePlayerElements = (width: number, players: number, leader: string, mission: number) => {

    const items: any = [];

    const pushSquareBrick = () => {
        items.push((<View style={styles.squareFake1}>
            <View style={styles.vbrick1}></View>
            <View style={styles.vbrick2}></View>
            <View style={styles.vbrick3}></View>
        </View>));
    }

    const pushSquareBrick2 = () => {
        items.push((<View style={styles.squareFake1}>
            <View style={styles.vbrick2}></View>
            <View style={styles.vbrick1}></View>
            <View style={styles.vbrick3}></View>
        </View>));
    }

    const pushFakeText = () => {
        items.push((<View style={styles.fakeStatusLong}>
            <View style={styles.fakeStatusLongUpper}>
                <View style={styles.brick1}></View>
                <View style={styles.brick2}></View>
            </View>
            <View style={styles.fakeStatusLongUpper}>
                <Text style={styles.fakeText}>
                    {`${FAKE_TEXT}${FAKE_TEXT}${FAKE_TEXT}${FAKE_TEXT}${FAKE_TEXT}${FAKE_TEXT}${FAKE_TEXT}`}
                </Text>
            </View>
        </View>));
    }

    const pushFakeText2 = () => {
        items.push((<View style={styles.fakeStatusLong}>
            <View style={styles.fakeStatusLongUpper}>
                <View style={styles.brick3}></View>
                <View style={styles.brick2}></View>
            </View>
            <View style={styles.fakeStatusLongUpper}>
                <Text style={styles.fakeText}>
                    {`${FAKE_TEXT}${FAKE_TEXT}${FAKE_TEXT}${FAKE_TEXT}`}
                </Text>
            </View>
        </View>));
    }

    const pushGameStatus = () => {
        items.push(<View style={styles.leaderStatus}>
            <View style={styles.leaderStatusItem}>
                <Text style={styles.leaderStatusText}>{`Leader: ${leader}`}</Text>
            </View>
            <View style={styles.leaderStatusItem}>
                <Text style={styles.leaderStatusText}>{`Mission: ${mission}`}</Text>
                <View style={styles.caretka} />
            </View>
        </View>);
    }

    switch (players) {
        case 5:
            if (width >= 280 && width < 340) {
                pushSquareBrick();
                pushFakeText();
                pushGameStatus();
            }
            if (width >= 340 && width < 426) {
                pushSquareBrick();
                pushFakeText();
                pushFakeText2();
                pushGameStatus();
            }
            if (width >= 426 && width < 512) {
                pushSquareBrick();
                pushSquareBrick2();
                pushSquareBrick();
                pushFakeText2();
                pushFakeText();
                pushGameStatus();
            }
            if (width >= 512) {
                pushFakeText();
                pushFakeText2();
                pushFakeText();
                pushGameStatus();
            }
            break;
        case 6:
            if (width >= 280 && width < 340) {
                pushFakeText();
                pushGameStatus();
            }
            if (width >= 340 && width < 426) {
                pushFakeText();
                pushFakeText2();
                pushGameStatus();
            }
            if (width >= 426 && width < 512) {
                pushSquareBrick();
                pushSquareBrick2();
                pushFakeText();
                pushFakeText2();
                pushGameStatus();
            }
            if (width >= 512) {
                pushFakeText();
                pushFakeText2();
                pushGameStatus();
            }
            break;
        case 7:
            if (width >= 280 && width < 340) {
                pushSquareBrick();
                pushGameStatus();
            }
            if (width >= 340 && width < 426) {
                pushSquareBrick();
                pushSquareBrick2();
                pushFakeText();
                pushGameStatus();
            }
            if (width >= 426 && width < 512) {
                pushSquareBrick2();
                pushFakeText();
                pushFakeText2();
                pushGameStatus();
            }
            if (width >= 512) {
                pushFakeText();
                pushFakeText2();
                pushGameStatus();
            }
            break;
        case 8:
            if (width >= 280 && width < 340) {
                pushGameStatus();
            }
            if (width >= 340 && width < 426) {
                pushSquareBrick();
                pushFakeText();
                pushGameStatus();
            }
            if (width >= 426 && width < 512) {
                pushFakeText();
                pushFakeText2();
                pushGameStatus();
            }
            if (width >= 512) {
                pushSquareBrick();
                pushSquareBrick2();
                pushFakeText();
                pushFakeText2();
                pushGameStatus();
            }
            break;
        case 9:
            if (width >= 280 && width < 340) {
                pushSquareBrick();
            }
            if (width >= 340 && width < 426) {
                pushFakeText();
                pushGameStatus();
            }
            if (width >= 426 && width < 512) {
                pushSquareBrick2();
                pushSquareBrick();
                pushSquareBrick2();
                pushFakeText();
                pushGameStatus();
            }
            if (width >= 512) {
                pushSquareBrick();
                pushFakeText();
                pushFakeText2();
                pushGameStatus();
            }
            break;
        case 10:
            if (width >= 340 && width < 426) {
                pushSquareBrick2();
                pushSquareBrick();
                pushGameStatus();
            }
            if (width >= 426 && width < 512) {
                pushSquareBrick2();
                pushSquareBrick();
                pushFakeText();
                pushGameStatus();
            }
            if (width >= 512) {
                pushFakeText();
                pushFakeText2();
                pushGameStatus();
            }
            break;
    }

    return items;
}

const styles = StyleSheet.create({
    squareFake1: {
        alignContent: "center",
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexDirection: 'row',
        margin: 3,
        opacity: 1,
        width: 80,
        height: 55,
        paddingRight: 3,
    },
    vbrick1: {
        height: 40,
        width: 20,
        backgroundColor: colors.greenDigital,
        marginLeft: 3,
        shadowColor: colors.greenDigital,
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 1,
    },
    vbrick2: {
        height: 50,
        width: 20,
        backgroundColor: colors.greenDigital,
        marginLeft: 3,
        shadowColor: colors.greenDigital,
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 1,
    },
    vbrick3: {
        height: 25,
        width: 20,
        backgroundColor: colors.greenDigital,
        marginLeft: 3,
        shadowColor: colors.greenDigital,
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 1,
    },
    fakeStatusLong: {
        marginTop: 4,
        height: 55,
        maxWidth: 420,
        width: Dimensions.get("screen").width - 100,
        borderWidth: 1,
        borderColor: colors.greenDigital,
        shadowColor: colors.greenDigital,
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 1,
    },
    fakeStatusLongUpper: {
        flexDirection: 'row',
        alignContent: "center",
        justifyContent: 'flex-start',
        alignItems: 'center',
        flex: 1,
    },
    brick1: {
        width: 50,
        backgroundColor: colors.greenDigital,
        height: 15,
        marginLeft: 5,
        marginTop: 5,
        padding: 5,
        shadowColor: colors.greenDigital,
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 1,
    },
    brick2: {
        flex: 1,
        backgroundColor: colors.greenDigital,
        height: 15,
        marginLeft: 5,
        marginTop: 5,
        marginRight: 5,
        padding: 5,
        shadowColor: colors.greenDigital,
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 1,
    },
    brick3: {
        width: 150,
        backgroundColor: colors.greenDigital,
        height: 15,
        marginLeft: 5,
        marginTop: 5,
        padding: 5,
        shadowColor: colors.greenDigital,
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 1,
    },
    fakeText: {
        fontSize: 7,
        color: colors.greenDigital,
        fontFamily: 'title',
        marginLeft: 5,
        marginRight: 5,
    },
    leaderStatus: {
        marginTop: 4,
        height: 55,
        maxWidth: 420,
        width: Dimensions.get("screen").width - 100,
        borderWidth: 1,
        borderColor: colors.greenDigital,
        shadowColor: colors.greenDigital,
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 1,
    },
    leaderStatusItem: {
        flexDirection: 'row',
        alignContent: "center",
        justifyContent: 'flex-start',
        alignItems: 'center',
        flex: 1,
    },
    leaderStatusText: {
        color: colors.greenDigital,
        fontFamily: 'title',
        fontSize: 12,
        marginLeft: 5
    },
    caretka: {
        width: 8,
        height: 10,
        backgroundColor: colors.greenDigital,
        marginLeft: 5,
        marginTop: 1,
        shadowColor: colors.greenDigital,
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 1,
    },
});
