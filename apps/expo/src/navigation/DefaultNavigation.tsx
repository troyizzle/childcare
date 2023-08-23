import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTheme } from "@rneui/themed";
import { HomeScreen } from '../screens/home';

function Main() {
  const { theme: { colors } } = useTheme();

  type DrawerParamList = {
    HomeScreen: undefined;
  }

  const Drawer = createDrawerNavigator<DrawerParamList>()

  return (
    <Drawer.Navigator
      initialRouteName="HomeScreen"
    >
      <Drawer.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerTitle: '',
          headerStyle: {
            backgroundColor: colors.background
          },
        }}
      />
    </Drawer.Navigator>
  )
}

export type DefaultStackParamList = {
  Main: undefined;
}

const DefaultStack = createNativeStackNavigator<DefaultStackParamList>();

export default function DefaultNavigation() {
  return (
    <DefaultStack.Navigator>
      <DefaultStack.Screen
        name="Main"
        component={Main}
        options={{ headerShown: false }}
      />
    </DefaultStack.Navigator>
  )
}
