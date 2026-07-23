import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, Share, Dimensions, TextInput, ActivityIndicator } from "react-native";
import { RootStackParamList } from "../../../App";
import { GameStateResponse } from "../../types/gameServerTypes";
import { Background } from "../background";
import { QRCodeSVG } from 'qrcode.react';
import { AppContext, HOST } from "../../context";
import { useGameStatus } from "../../services/gameService";
import { DELETE, POST, PUT, ServerResponse } from "../../utils/fetch";
import { KeyedMutator } from "swr";
import { colors } from "../../utils/constants";
import { LoadingScreen } from "../../screens/LoadingScreen";
import { GradientPanel } from "../shared/gradientPanel";
import { ComputerScreen } from "../shared/computerScreen";
import { AnimatedCursor } from "../shared/animatedCursor";
import { GameButton } from "../shared/gameButton";
import { crownIcon, pencilIcon } from "../icons";

const NameTextInput = ({ initialValue, onSubmit, onNameChanged, gameState, mutate }: {
    initialValue: string,
    onSubmit: () => void,
    onNameChanged: (name: string) => void,
    gameState: GameStateResponse,
    mutate: KeyedMutator<GameStateResponse>,
}) => {
    const [nameValue, setNameValue] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <View style={styles.inputContainer}>
            <View style={styles.inputInput}>
                <TextInput
                    autoFocus={true}
                    maxLength={16}
                    style={styles.inputStyle}
                    value={nameValue}
                    defaultValue={nameValue}
                    onChangeText={setNameValue}
                />
            </View>
            <View style={styles.inputButton}>
                {!isLoading &&
                    <TouchableOpacity onPress={() => {
                        setIsLoading(true);
                        PUT('/change-name', { newName: nameValue || initialValue, gameId: gameState.gameId }).then((resp) => {
                            setIsLoading(false);
                            if (!!resp.ok) {
                                const updatedName = nameValue || initialValue;
                                gameState.players[gameState.playerIndex].name = updatedName;
                                onNameChanged(updatedName);
                                mutate(gameState);
                            }
                            onSubmit();
                        });
                    }}>
                        <Text style={styles.inputOk}>OK</Text>
                    </TouchableOpacity>
                }
                {isLoading &&
                    <ActivityIndicator size="small" color={colors.greenDigital} style={{ marginLeft: -7 }} />
                }
            </View>


        </View>
    );
};

export const Lobby = ({ gameState }: { gameState: GameStateResponse }) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const gameLink = `${HOST}/join/${gameState.gameId}`;
    const { player, setPlayerName } = React.useContext(AppContext);
    const [isNameEdited, setIsNameEdited] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { mutate } = useGameStatus(gameState.gameId, player?.id);
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
                <View style={styles.outside}>
                    <GradientPanel roundBottom roundTop marginTop={10} marginBottom={10}>
                        <ComputerScreen width={Dimensions.get("screen").width - 40} marginTop={10} maxWidth={480} maxHeight={400}>
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
                        <ComputerScreen width={Dimensions.get("screen").width - 40} marginTop={10} maxWidth={480}>
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
                                                        {!!isUserPlayer &&
                                                            (!!isNameEdited ?
                                                                <NameTextInput
                                                                    onSubmit={() => setIsNameEdited(false)}
                                                                    onNameChanged={setPlayerName}
                                                                    initialValue={gameState.players[index]?.name}
                                                                    gameState={gameState}
                                                                    mutate={mutate}
                                                                /> : <Text style={styles.playerText} numberOfLines={1}>
                                                                    {gameState.players[index]?.name}
                                                                </Text>)
                                                        }
                                                    </View>
                                                    {
                                                        isUserPlayer && !isNameEdited &&
                                                        <TouchableOpacity onPress={() => setIsNameEdited(true)}>
                                                            <Image source={pencilIcon}
                                                                style={{ height: 15, width: 15, tintColor: colors.greenDigital, marginRight: 3 }}></Image>
                                                        </TouchableOpacity>
                                                    }
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
                </View>
        }
    </Background>);
}

const styles = StyleSheet.create({
    outside: {
        alignContent: "center",
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
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
        fontSize: 16,
    },
    titleCodeText: {
        color: colors.greenDigital,
        fontFamily: 'title',
        fontSize: 12,
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
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignContent: "center",
        alignItems: "center",
        marginBottom: 10,
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
        fontSize: 10,
        marginLeft: 3,
    },
    close: {
        fontFamily: 'title',
        color: colors.greenDigital,
        fontWeight: 'bold',
        fontSize: 12,
        textAlign: 'center',
        marginLeft: 5,
        marginRight: 3,
    },

    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
    },
    inputButton: {
        width: 30,
        alignItems: 'flex-end',
        marginRight: 3,
    },
    inputInput: {
        flex: 1,
    },
    inputStyle: {
        marginLeft: 3,
        color: colors.greenDigital,
        fontSize: 12,
        textAlign: 'left',
        flex: 1,
        alignItems: 'stretch'
    },
    inputOk: {
        fontFamily: 'title',
        fontWeight: 'bold',
        color: colors.greenDigital,
        fontSize: 12,
        textAlign: 'left',
        marginLeft: 3,
        marginTop: 3,
    }
});
