import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

const headerOptions = {
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.primaryDark,
  headerTitleStyle: { fontWeight: '700' },
};

const AccountStack = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={headerOptions}>
      {user ? (
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'My Account' }} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Sign Up' }} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AccountStack;
