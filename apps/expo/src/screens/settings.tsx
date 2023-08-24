import { useUser } from "@clerk/clerk-expo"
import { Text } from "@rneui/themed"
import ScreenWrapper from "../components/ScreenWrapper"

export const SettingsScreen = () => {
  const user = useUser().user!

  return (
    <ScreenWrapper>
      <Text h1>{user.fullName}</Text>
    </ScreenWrapper>
  )
}
