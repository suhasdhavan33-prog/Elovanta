import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CoursesScreen from '../screens/CoursesScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import LessonScreen from '../screens/LessonScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

const headerOptions = {
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.primaryDark,
  headerTitleStyle: { fontWeight: '700' },
};

const CoursesStack = () => (
  <Stack.Navigator screenOptions={headerOptions}>
    <Stack.Screen name="CoursesList" component={CoursesScreen} options={{ title: 'Courses' }} />
    <Stack.Screen name="CourseDetail" component={CourseDetailScreen} options={{ title: 'Course' }} />
    <Stack.Screen name="Lesson" component={LessonScreen} options={{ title: 'Lesson' }} />
  </Stack.Navigator>
);

export default CoursesStack;
