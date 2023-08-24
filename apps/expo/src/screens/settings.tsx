import { useUser } from "@clerk/clerk-expo"
import { Text } from "@rneui/themed"
import ScreenWrapper from "../components/ScreenWrapper"

export const SettingsScreen = () => {
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const user = useUser().user!

  return (
    <ScreenWrapper>
      <Text h1>{user.fullName}</Text>
    </ScreenWrapper>
  )
}
