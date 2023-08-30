import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Avatar, Button, Icon } from "@rneui/themed";
import { HomeScreen } from '../screens/home';
import { SettingsScreen } from '../screens/settings';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StudentScreen } from '../screens/student';
import { StudentProfileScreen } from '../screens/student-profile';
import { ProfileScreen } from '../screens/profile';
import { useUser } from '@clerk/clerk-expo';
import { AppearanceScreen } from '../screens/appearance';

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

export type ProfileScreenStackParamList = {
  ProfileScreen: undefined
  Settings: undefined
  Appearance: undefined
}

const ProfileScreenStackNav = createNativeStackNavigator<ProfileScreenStackParamList>()

function ProfileScreenNavigation() {
  return (
    <ProfileScreenStackNav.Navigator>
      <ProfileScreenStackNav.Screen name="ProfileScreen" component={ProfileScreen}
        options={({ navigation }) => ({
          headerTitle: "",
          headerRight: () => (
            <Icon
              name="settings"
              onPress={() => navigation.navigate("Settings")}
              size={24}
            />
          )
        })}
      />
      <ProfileScreenStackNav.Screen name="Settings" component={SettingsScreen} />

      <ProfileScreenStackNav.Screen name="Appearance" component={AppearanceScreen} />
    </ProfileScreenStackNav.Navigator>
  )
}

export type DefaultStackParamList = {
  Main: undefined;
  Profile: undefined;
}

const Tab = createBottomTabNavigator<DefaultStackParamList>();

export default function DefaultNavigation() {
  const { user } = useUser()

  if (!user) {
    return null
  }

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
      <Tab.Screen name="Profile" component={ProfileScreenNavigation} options={{
        tabBarIcon: ({ color, size }) => (
          <Avatar
            rounded
            source={{ uri: user.imageUrl }}
            size={size}
            avatarStyle={{ borderColor: color, borderWidth: 1 }}
          />
        ),
      }} />
    </Tab.Navigator>
  )
}
