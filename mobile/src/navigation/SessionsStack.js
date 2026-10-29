import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SessionsScreen from '../screens/SessionsScreen';
import LiveClassRoomScreen from '../screens/LiveClassRoomScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

const SessionsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: colors.surface },
      headerTintColor: colors.primaryDark,
      headerTitleStyle: { fontWeight: '700' },
    }}
  >
    <Stack.Screen name="SessionsList" component={SessionsScreen} options={{ title: 'Live Classes' }} />
    <Stack.Screen
      name="LiveClassRoom"
      component={LiveClassRoomScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default SessionsStack;
