import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, Icon } from "@rneui/themed";
import { HomeScreen } from '../screens/home';
import { SettingsScreen } from '../screens/settings';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StudentScreen } from '../screens/student';
import { StudentProfileScreen } from '../screens/student-profile';

export type HomeScreenStackParamList = {
  Home: undefined
  Student: { studentId: string, name: string, profilePicture: string }
  StudentProfile: { studentId: string }
}

const HomeScreenStackNav = createNativeStackNavigator<HomeScreenStackParamList>()

function HomeScreenNavigation() {
  return (
    <HomeScreenStackNav.Navigator>
      <HomeScreenStackNav.Screen name="Home" component={HomeScreen} options={{
        headerShown: false,
      }} />
      <HomeScreenStackNav.Screen
        name="Student"
        component={StudentScreen}
        options={({ navigation, route }) => ({
          headerTitle: () => (
            <Button
              type="clear"
              onPress={() => navigation.navigate("StudentProfile", {
                studentId: route.params.studentId
              })}
              title={route.params.name}
            />
          )
        })}
      />

      <HomeScreenStackNav.Screen
        name="StudentProfile"
        component={StudentProfileScreen}
        options={{ title: "Student Profile" }}
      />
    </HomeScreenStackNav.Navigator>
  )
}

export type DefaultStackParamList = {
  Main: undefined;
  Settings: undefined;
}

const Tab = createBottomTabNavigator<DefaultStackParamList>();

export default function DefaultNavigation() {
  return (
    <Tab.Navigator
    screenOptions={{
      headerShown: false,
    }}
    >
      <Tab.Screen name="Main" component={HomeScreenNavigation} options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="home" color={color} size={size} />
        ),
      }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="settings" color={color} size={size} />
        ),
      }} />
    </Tab.Navigator>
  )
}
