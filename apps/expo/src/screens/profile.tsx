import { useAuth, useUser } from "@clerk/clerk-expo"
import { Avatar, Button, Text } from "@rneui/themed"
import { View } from "react-native"
import ScreenWrapper from "../components/ScreenWrapper"


export const ProfileScreen = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const user = useUser().user!
  const { signOut } = useAuth()

  return (
    <ScreenWrapper>
      <View className="p-4">
        <View className="flex flex-col min-h-[95%]">
          <View className="flex-grow">
            <View className="flex flex-row">
              <Avatar
                size="large"
                source={{ uri: user.imageUrl }}
                rounded
              />
              <View className="flex flex-col ml-4 mt-2">
                <Text h4 h4Style={{
                  fontWeight: "bold",
                }}>
                  {user.fullName}</Text>
                <Text className="text-gray-500">{user?.phoneNumbers?.[0]?.phoneNumber}</Text>
              </View>
            </View>
          </View>

          <Button onPress={() => void signOut()}>Sign out</Button>
        </View>
      </View>

    </ScreenWrapper>
  )
}
