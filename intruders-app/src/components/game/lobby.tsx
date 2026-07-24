import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, Share, useWindowDimensions } from "react-native";
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
    const waitingMessage = 'WAITING FOR PLAYERS';
    const [visibleWaitingMessage, setVisibleWaitingMessage] = useState('');
    const userIsAGameOwner = gameState.creator === player?.id;
    const canStartTheGame = !!userIsAGameOwner && Object.keys(gameState.players).length > 4;
    const qrSize = Math.max(82, Math.min(118, height * 0.14));
    const titleFontSize = Math.max(14, Math.min(18, width / 25));
    const titleTypewriterWidth = Math.min(width - 88, waitingMessage.length * titleFontSize * 0.82 + 16);

    useEffect(() => {
        setVisibleWaitingMessage('');
        let index = 0;
        let typingTimer: ReturnType<typeof setInterval> | undefined;
        const startTimer = setTimeout(() => {
            typingTimer = setInterval(() => {
                index += 1;
                setVisibleWaitingMessage(waitingMessage.slice(0, index));
                if (index >= waitingMessage.length && typingTimer) clearInterval(typingTimer);
            }, 58);
        }, 320);

        return () => {
            clearTimeout(startTimer);
            if (typingTimer) clearInterval(typingTimer);
        };
    }, []);

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

    const PlayerSlot = ({ index }: { index: number }) => {
        const slotPlayer = gameState.players[index];
        const isUserPlayer = slotPlayer?.id === player?.id;
        const isCreator = slotPlayer?.id === gameState.creator;

        return (
            <View style={[styles.playerItemContainer, isUserPlayer && styles.currentPlayerSlot]}>
                <View style={styles.slotNumber}>
                    <Text style={styles.slotNumberText}>{index}</Text>
                </View>
                <View style={styles.slotContent}>
                    <View style={styles.nameContainer}>
                        {isCreator && <Image source={crownIcon} style={styles.crown} />}
                        <Text
                            numberOfLines={1}
                            style={[styles.playerText, !slotPlayer?.name && styles.emptyText]}
                        >
                            {slotPlayer?.name || 'EMPTY'}
                        </Text>
                    </View>
                    {!isUserPlayer && userIsAGameOwner && !!slotPlayer?.id &&
                        <TouchableOpacity style={styles.kickButton} onPress={() => onRemovePlayer(slotPlayer.id)}>
                            <Text style={styles.close}>KICK</Text>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        );
    };

    return (<Background>
        {!!isLoading ? <LoadingScreen /> :
            <View style={styles.outside}>
                <GradientPanel roundBottom roundTop marginTop={10} marginBottom={10}>
                    <View style={styles.container}>
                        <View style={styles.display}>
                            <ComputerScreen fill>
                                <View style={styles.screenContent}>
                                    <View style={styles.titleContainer}>
                                        <Text
                                            numberOfLines={1}
                                            style={[styles.titleText, { fontSize: titleFontSize, width: titleTypewriterWidth }]}
                                        >
                                            {visibleWaitingMessage}<AnimatedCursor inline />
                                        </Text>
                                        <Text style={styles.titleCodeText}>GAME CODE</Text>
                                        <Text style={styles.titleCode}>
                                            {gameState.gameId.toUpperCase().split('').join(' ')}
                                        </Text>
                                    </View>
                                    <View style={styles.qrContainer}>
                                        <View style={styles.qrFrame}>
                                            <QRCodeSVG
                                                value={gameLink}
                                                size={qrSize}
                                                bgColor={colors.screenDeep}
                                                fgColor={colors.phosphorBright}
                                            />
                                        </View>
                                    </View>
                                    <Text style={styles.playersLabel}>PLAYER SLOTS</Text>
                                    <View style={styles.playerContainer}>
                                        {Array.from({ length: 5 }, (_, row) => (
                                            <View style={styles.row} key={row}>
                                                <PlayerSlot index={row * 2 + 1} />
                                                <PlayerSlot index={row * 2 + 2} />
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </ComputerScreen>
                        </View>
                        <View style={styles.buttonsContainer}>
                            <GameButton labelBottom="Settings" isEnabled color={colors.pureWhite} size={50} onPress={() => navigation.navigate('SettingsScreen')} />
                            <GameButton labelBottom="Share join link" isEnabled color={colors.pureWhite} size={50} onPress={() => onShare()} />
                            <GameButton labelBottom="Start the game" isEnabled={canStartTheGame} color={colors.greenDigital} size={50} onPress={() => onStartGame()} />
                        </View>
                    </View>
                </GradientPanel>
            </View>
        }
    </Background>);
}

const styles = StyleSheet.create({
    outside: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        width: '100%',
        paddingHorizontal: 9,
    },
    container: {
        flex: 1,
        width: '100%',
        minWidth: 0,
        alignItems: 'center',
        gap: 10,
    },
    display: {
        flex: 1,
        width: '100%',
        minHeight: 0,
    },
    screenContent: {
        flex: 1,
        width: '100%',
        minHeight: 0,
        alignItems: 'center',
        paddingHorizontal: 3,
        paddingVertical: 2,
    },
    playerContainer: {
        justifyContent: "space-between",
        flex: 1,
        width: '100%',
        minHeight: 0,
        gap: 5,
    },
    titleContainer: {
        alignItems: 'center',
        width: '100%',
        flexShrink: 0,
    },
    qrContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 1,
        minHeight: 86,
        paddingVertical: 7,
    },
    qrFrame: {
        padding: 5,
        borderWidth: 1,
        borderColor: colors.phosphor,
        backgroundColor: 'rgba(0, 8, 4, 0.72)',
        shadowColor: colors.phosphor,
        shadowOpacity: 0.5,
        shadowRadius: 8,
    },
    titleText: {
        color: colors.phosphorBright,
        fontFamily: 'title',
        letterSpacing: 1,
        textAlign: 'left',
        textShadowColor: colors.phosphor,
        textShadowRadius: 7,
    },
    titleCodeText: {
        marginTop: 4,
        color: colors.lightGray1,
        fontFamily: 'basic',
        fontSize: 11,
        letterSpacing: 1.2,
        textAlign: 'center',
    },
    titleCode: {
        color: colors.phosphorBright,
        fontFamily: 'title',
        fontSize: 18,
        letterSpacing: 2,
        textAlign: 'center',
        textShadowColor: colors.phosphor,
        textShadowRadius: 6,
    },
    playersLabel: {
        width: '100%',
        marginBottom: 5,
        color: colors.lightGray1,
        fontFamily: 'basic',
        fontSize: 11,
        letterSpacing: 1.2,
        textAlign: 'left',
    },
    row: {
        flexDirection: 'row',
        flex: 1,
        width: '100%',
        minHeight: 30,
        gap: 6,
    },
    playerItemContainer: {
        flexDirection: 'row',
        alignItems: "center",
        flex: 1,
        borderWidth: 1,
        borderColor: colors.phosphor,
        backgroundColor: 'rgba(0, 8, 4, 0.72)',
        paddingRight: 5,
        shadowColor: colors.phosphor,
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    currentPlayerSlot: {
        borderWidth: 2,
        borderColor: colors.phosphorBright,
        shadowOpacity: 0.7,
    },
    buttonsContainer: {
        height: 100,
        flexShrink: 0,
        width: "100%",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center",
        gap: 4,
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: "center",
        flex: 1,
        width: '100%',
        minWidth: 0,
        paddingHorizontal: 5,
    },
    slotContent: {
        flex: 1,
        alignSelf: 'stretch',
        minWidth: 0,
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    slotNumber: {
        alignSelf: 'stretch',
        width: 20,
        minWidth: 20,
        maxWidth: 20,
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 1,
        borderRightColor: colors.phosphor,
        backgroundColor: 'rgba(112, 255, 145, 0.07)',
    },
    slotNumberText: {
        color: colors.phosphorBright,
        fontFamily: 'title',
        fontSize: 10,
        letterSpacing: 0,
    },
    crown: {
        height: 10,
        width: 10,
        marginRight: 4,
        tintColor: colors.phosphorBright,
    },
    playerText: {
        flexShrink: 1,
        color: colors.phosphorBright,
        fontFamily: 'title',
        fontSize: 13,
        letterSpacing: 0.5,
    },
    emptyText: {
        color: colors.lightGray2,
        opacity: 0.52,
    },
    kickButton: {
        minHeight: 17,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
        borderTopWidth: 1,
        borderTopColor: colors.phosphor,
        backgroundColor: 'rgba(112, 255, 145, 0.09)',
    },
    close: {
        fontFamily: 'title',
        color: colors.phosphorBright,
        fontSize: 9,
        letterSpacing: 0.7,
        textShadowColor: colors.phosphor,
        textShadowRadius: 5,
    },

});
