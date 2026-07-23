import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Share, useWindowDimensions } from "react-native";
import { RootStackParamList } from "../../../App";
import { GameStateResponse } from "../../types/gameServerTypes";
import { Background } from "../background";
import { QRCodeSVG } from 'qrcode.react';
import { AppContext, HOST } from "../../context";
import { DELETE, POST } from "../../utils/fetch";
import { KeyedMutator } from "swr";
import { colors } from "../../utils/constants";
import { LoadingScreen } from "../../screens/LoadingScreen";
import { GradientPanel } from "../shared/gradientPanel";
import { ComputerScreen } from "../shared/computerScreen";
import { AnimatedCursor } from "../shared/animatedCursor";
import { GameButton } from "../shared/gameButton";
import { crownIcon } from "../icons";

export const Lobby = ({ gameState, mutate }: {
    gameState: GameStateResponse,
    mutate: KeyedMutator<GameStateResponse>,
}) => {
    const { width, height } = useWindowDimensions();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const gameLink = `${HOST}/join/${gameState.gameId}`;
    const { player } = React.useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);
    const userIsAGameOwner = gameState.creator === player?.id;
    const canStartTheGame = !!userIsAGameOwner && Object.keys(gameState.players).length > 4;

    const onShare = async () => {
        try {
            const result = await Share.share({
                url: gameLink,
                title: 'Join alien intruders game',
                message: 'Join a spy game',
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert((error as any).message);
        }
    };

    const onRemovePlayer = async (playerId: string) => {
        const resp = await DELETE(`/kick-player/${gameState.gameId}/${playerId}`);
        if (resp.ok) {
            const index = Object.keys(gameState.players).find(playerIndex => gameState.players[playerIndex].id === playerId);
            delete gameState.players[index];
            mutate(gameState);
        }
    }

    const onStartGame = async () => {
        setIsLoading(true);
        await POST('/start-game', { gameId: gameState.gameId });
        mutate();
        setIsLoading(false);
    }

    return (<Background>
        {
            !!isLoading ? <LoadingScreen /> :
                <ScrollView contentContainerStyle={styles.outside}>
                    <GradientPanel height={Math.max(650, Math.min(820, height - 20))} roundBottom roundTop marginTop={10} marginBottom={10}>
                        <ComputerScreen width="100%" height={Math.max(235, Math.min(300, height * 0.34))} marginTop={8} maxWidth={520}>
                            <View style={styles.titleContainer}>
                                <Text style={styles.titleText}>Waiting for players to join</Text>
                                <Text style={styles.titleCodeText}>{`Game code: `}
                                    <Text style={styles.titleCode}>{gameState.gameId.toUpperCase().split('').join(' ')}</Text>
                                    <AnimatedCursor /></Text>

                            </View>
                            <View style={styles.qrContainer}>
                                <QRCodeSVG value={gameLink} bgColor={colors.screenColor} fgColor={colors.greenDigital} />
                            </View>
                        </ComputerScreen>
                        <ComputerScreen width="100%" height={Math.max(230, Math.min(270, height * 0.3))} marginTop={8} maxWidth={520}>
                            <View style={styles.playerContainer}>
                                {
                                    Array.from({ length: 5 }, (val, index) => index + 1).map(val => {
                                        const index1 = val * 2 - 1;
                                        const index2 = val * 2;
                                        const isUser1Player = gameState.players[index1]?.id === player?.id;
                                        const isUser2Player = gameState.players[index2]?.id === player?.id;
                                        const PlayerElement = ({ index, isUserPlayer }: { index: number, isUserPlayer: boolean }) => {
                                            return (<View style={styles.column}>

                                                <View style={isUserPlayer ? { ...styles.playerItemContainer, borderStyle: 'dashed' } : styles.playerItemContainer}>
                                                    <View style={styles.nameContainer}>
                                                        <Text style={styles.playerText}>{index}</Text>
                                                        {gameState.players[index]?.id === gameState.creator &&
                                                            <Image source={crownIcon} style={{ height: 8, width: 8, marginLeft: 3, tintColor: colors.greenDigital }} />
                                                        }
                                                        {!isUserPlayer &&
                                                            (!!gameState.players[index]?.name ?
                                                                <Text style={styles.playerText}>
                                                                    {gameState.players[index].name}
                                                                </Text> : <Text style={{ ...styles.playerText, opacity: 0.3 }}>empty</Text>)
                                                        }
                                                        {!!isUserPlayer && <Text style={styles.playerText} numberOfLines={1}>
                                                            {gameState.players[index]?.name}
                                                        </Text>}
                                                    </View>
                                                    {
                                                        !isUserPlayer && userIsAGameOwner && !!gameState.players[index]?.id &&
                                                        <TouchableOpacity onPress={() => onRemovePlayer(gameState.players[index]?.id)}>
                                                            <Text style={styles.close}>kick</Text>
                                                        </TouchableOpacity>
                                                    }

                                                </View>
                                            </View>);
                                        }
                                        return (<View style={styles.row} key={val}>
                                            <PlayerElement index={index1} isUserPlayer={isUser1Player} />
                                            <PlayerElement index={index2} isUserPlayer={isUser2Player} />
                                        </View>);
                                    })
                                }
                            </View>
                        </ComputerScreen>
                        <View style={styles.buttonsContainer}>
                            <GameButton labelBottom="Settings" isEnabled color={colors.pureWhite} size={50} onPress={() => navigation.navigate('SettingsScreen')} />
                            <GameButton labelBottom="Share join link" isEnabled color={colors.pureWhite} size={50} onPress={() => onShare()} />
                            {/* <GameButton labelBottom="Leave the game" isEnabled color={colors.pureWhite} size={50} /> */}
                            <GameButton labelBottom="Start the game" isEnabled={canStartTheGame} color={colors.greenDigital} size={50} onPress={() => onStartGame()} />
                        </View>
                    </GradientPanel>
                </ScrollView>
        }
    </Background>);
}

const styles = StyleSheet.create({
    outside: {
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
        paddingHorizontal: 9,
    },
    playerContainer: {
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 5,
        flex: 1.5,
        width: '100%',
        maxHeight: 300,
    },
    titleContainer: {
        alignContent: "center",
        justifyContent: 'space-around',
        alignItems: 'center',
        flex: 1,
    },
    qrContainer: {
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        flex: 2,
    },
    titleText: {
        color: colors.greenDigital,
        fontFamily: 'title',
        fontSize: 18,
        letterSpacing: 1,
    },
    titleCodeText: {
        color: colors.greenDigital,
        fontFamily: 'title',
        fontSize: 13,
        textAlign: 'center'
    },
    titleCode: {
        color: colors.greenDigital,
        fontFamily: 'title',
        fontSize: 14,
        textAlign: 'center'
    },
    row: {
        flexDirection: 'row',
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        width: '100%',
        maxWidth: 480,
    },
    column: {
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
        height: 25,
    },
    playerItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: "center",
        alignItems: "center",
        flex: 1,
        alignSelf: 'stretch',
        borderWidth: 1,
        borderColor: colors.greenDigital,
    },
    buttonsContainer: {
        minHeight: 86,
        width: "100%",
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignContent: "center",
        alignItems: "center",
        marginBottom: 4,
        marginTop: 5,
    },
    nameContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignContent: "center",
        alignItems: "center",
        flex: 1,
    },
    playerText: {
        color: colors.greenDigital,
        fontFamily: 'title',
        fontSize: 14,
        letterSpacing: 0.4,
        marginLeft: 3,
    },
    close: {
        fontFamily: 'title',
        color: colors.greenDigital,
        fontWeight: 'bold',
        fontSize: 13,
        textAlign: 'center',
        marginLeft: 5,
        marginRight: 3,
    },

});
