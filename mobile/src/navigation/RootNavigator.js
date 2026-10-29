import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import HomeStack from './HomeStack';
import CoursesStack from './CoursesStack';
import SessionsStack from './SessionsStack';
import AccountStack from './AccountStack';
import LoadingView from '../components/LoadingView';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

const ICONS = { Home: '🏠', Courses: '📚', Sessions: '🎥', Account: '🙂' };

const RootNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingView label="Starting Elovanta..." />;

  const canSeeSessions = user?.role === 'student' || user?.role === 'tutor';

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primaryDark,
          tabBarInactiveTintColor: colors.muted,
          tabBarIcon: () => <Text style={{ fontSize: 18 }}>{ICONS[route.name]}</Text>,
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Courses" component={CoursesStack} />
        {canSeeSessions && (
          <Tab.Screen name="Sessions" component={SessionsStack} options={{ title: 'Live Classes' }} />
        )}
        <Tab.Screen name="Account" component={AccountStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
