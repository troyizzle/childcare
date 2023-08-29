import { useAuth, useUser } from "@clerk/clerk-expo"
import { Avatar, Badge, BadgeProps, Button, Text } from "@rneui/themed"
import { View } from "react-native"
import ScreenWrapper from "../components/ScreenWrapper"
import { trpc } from "../utils/trpc"


export const ProfileScreen = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const user = useUser().user!
  const { signOut } = useAuth()
  const userData = trpc.user.byId.useQuery({ id: user.id })


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
              <View className="flex flex-col space-y-2 ml-4">
                <View>
                  <Text h4 h4Style={{
                    fontWeight: "bold",
                  }}>
                    {user.fullName}
                  </Text>
                </View>

                <View className="flex flex-row justify-between">
                  {userData.data && userData.data.roles.map(({ role }) => (
                    <RoleBadge key={role.id} value={role.name} role={role.name.toLowerCase() as roleColor} />
                  ))}
                </View>
              </View>
            </View>

            {userData.data && userData.data.students.length > 0 && (
              <View>
                <Text h4>Students</Text>
                <Text>{userData.data.students.length}</Text>
              </View>
            )}

            {userData.data && userData.data.children.length > 0 && (
              <View>
                <Text h4>Children</Text>
                <Text>{userData.data.children.length}</Text>
                </View>
            )}
          </View>

          <Button onPress={() => void signOut()}>Sign out</Button>
        </View>
      </View>

    </ScreenWrapper>
  )
}

const roleColors = {
  "admin": "success",
  "teacher": "warning",
  "parent": "primary",
}

type roleColor = keyof typeof roleColors

type RoleBadgeProps = {
  value: string
  role: roleColor
}

function RoleBadge({ value, role }: RoleBadgeProps) {
  const color = roleColors[role] as BadgeProps["status"]

  return (
    <Badge value={value} status={color} />
  )
}
