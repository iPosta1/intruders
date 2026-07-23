import { ActivityIndicator, Image, StyleSheet, View } from "react-native"
import Svg, { Circle, Line, Path, Rect } from "react-native-svg";
import { colors } from "../utils/constants";

const INDICATOR_SIZE = 15;

export const playerUnknownIcon = require('../../assets/pl_unknown.png');
export const playerSpyIcon = require('../../assets/pl_spy.png');
export const playerHumanIcon = require('../../assets/pl_resistence.png');
export const starIcon = require('../../assets/star.png');
export const okIcon = require('../../assets/ok.png');
export const blurIcon = require('../../assets/blur.png');
export const crownIcon = require('../../assets/crown.png')
export const pencilIcon = require('../../assets/edit.png');

const SuitIcon = ({ kind }: { kind: 'unknown' | 'human' | 'alien' }) => {
    const stroke = kind === 'alien' ? colors.amber : colors.phosphorBright;
    return (
        <View style={styles.playerIconStyle}>
            <Svg width="38" height="38" viewBox="0 0 38 38">
                <Path d="M10 16V12C10 5 28 5 28 12V16" fill="none" stroke={stroke} strokeWidth="2" />
                <Rect x="8" y="14" width="22" height="13" rx="5" fill={colors.screenDeep} stroke={stroke} strokeWidth="2" />
                {kind === 'unknown' && (
                    <Path d="M16 18.5C16.6 16.5 21.4 16.5 22 19C22.4 20.8 19 21 19 23M19 25V25.2"
                        fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
                )}
                {kind === 'human' && (
                    <>
                        <Circle cx="15" cy="20" r="1.2" fill={stroke} />
                        <Circle cx="23" cy="20" r="1.2" fill={stroke} />
                        <Path d="M15 23C17 25 21 25 23 23" fill="none" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
                    </>
                )}
                {kind === 'alien' && (
                    <>
                        <Path d="M13 18C15 16 18 17 18 20C16 21 14 21 13 18ZM25 18C23 16 20 17 20 20C22 21 24 21 25 18Z" fill={stroke} />
                        <Line x1="17" y1="24" x2="21" y2="24" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
                    </>
                )}
                <Path d="M13 28V33M25 28V33M13 30H25M17 27V32M21 27V32" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
            </Svg>
        </View>
    );
};

export const UnknownSpaceman = () => <SuitIcon kind="unknown" />;
export const SpySpaceman = () => <SuitIcon kind="alien" />;
export const ResistenceSpaceman = () => <SuitIcon kind="human" />;
export const PlayerLeaderIcon = () =>
    (<Image source={starIcon} style={{ ...styles.absoluteIcon, right: 0, marginRight: 3, marginLeft: 0, left: undefined}}></Image>);
export const PlayerSelectedIcon = () =>
    (<Image source={okIcon} style={styles.absoluteIcon}></Image>);
export const PlayerLoadingIndicator = () => (<ActivityIndicator size="small" color={colors.greenDigital} style={styles.absoluteIcon} />);

const styles = StyleSheet.create({
    absoluteIcon: {
        width: INDICATOR_SIZE,
        height: INDICATOR_SIZE,
        position: "absolute",
        left: 0,
        top: 0,
        marginLeft: 3,
        marginTop: 3,
        tintColor: colors.greenDigital,
    },
    playerIconStyle: {
        height: 38,
        width: 38,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
