import { ActivityIndicator, Image, StyleSheet } from "react-native"
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

export const UnknownSpaceman = () => <Image source={playerUnknownIcon} resizeMode="contain" style={styles.playerIconStyle} />;
export const SpySpaceman = () => <Image source={playerSpyIcon} resizeMode="contain" style={styles.playerIconStyle} />;
export const ResistenceSpaceman = () => <Image source={playerHumanIcon} resizeMode="contain" style={styles.playerIconStyle} />;
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
        height: 42,
        width: 42,
    }
});
