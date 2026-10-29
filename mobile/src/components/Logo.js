import { View, Text, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, Path } from 'react-native-svg';
import { colors } from '../theme/colors';

export const LogoMark = ({ size = 36 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0%" stopColor="#FF7A1A" />
        <Stop offset="100%" stopColor="#A83800" />
      </LinearGradient>
    </Defs>
    <Rect x="0" y="0" width="100" height="100" rx="24" fill="url(#grad)" />
    <Rect x="28" y="26" width="14" height="48" rx="6" fill="#ffffff" />
    <Rect x="28" y="26" width="46" height="14" rx="6" fill="#ffffff" />
    <Rect x="28" y="43" width="38" height="14" rx="6" fill="#ffffff" />
    <Rect x="28" y="60" width="46" height="14" rx="6" fill="#ffffff" />
    <Path
      d="M82 10 L85.2 17.5 L93 20 L85.2 22.5 L82 30 L78.8 22.5 L71 20 L78.8 17.5 Z"
      fill={colors.sun}
    />
  </Svg>
);

const Logo = ({ size = 36, withText = true }) => (
  <View style={styles.row}>
    <LogoMark size={size} />
    {withText && <Text style={styles.text}>Elovanta</Text>}
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  text: { fontSize: 20, fontWeight: '700', color: colors.primaryDark, marginLeft: 8 },
});

export default Logo;
