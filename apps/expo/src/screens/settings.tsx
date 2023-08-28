import {  Card, ListItem } from "@rneui/themed"
import { View } from "react-native"
import ScreenWrapper from "../components/ScreenWrapper"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { ProfileScreenStackParamList } from "../navigation/DefaultNavigation"

type SettingsScreenProps = NativeStackScreenProps<ProfileScreenStackParamList, "Settings">

export const SettingsScreen = ({ navigation }: SettingsScreenProps) => {
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion

  return (
    <ScreenWrapper>
      <View className="mt-4">
        <Card>
          <ListItem onPress={() => navigation.navigate("Appearance")}>
            <ListItem.Content>
              <ListItem.Title>Appearance</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </Card>
      </View>
    </ScreenWrapper>
  )
}
