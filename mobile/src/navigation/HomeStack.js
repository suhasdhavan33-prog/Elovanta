import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import LessonScreen from '../screens/LessonScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

const headerOptions = {
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.primaryDark,
  headerTitleStyle: { fontWeight: '700' },
};

const HomeStack = () => (
  <Stack.Navigator screenOptions={headerOptions}>
    <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Elovanta' }} />
    <Stack.Screen name="CourseDetail" component={CourseDetailScreen} options={{ title: 'Course' }} />
    <Stack.Screen name="Lesson" component={LessonScreen} options={{ title: 'Lesson' }} />
  </Stack.Navigator>
);

export default HomeStack;
