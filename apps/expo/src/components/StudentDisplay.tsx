import { Student } from ".prisma/client"
import { UserByIdResponse } from "@acme/api/src/router/user"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Avatar, ListItem } from "@rneui/themed"
import { FlashList } from "@shopify/flash-list"
import { Dimensions, TouchableOpacity, View } from "react-native"
import { HomeScreenStackParamList } from "../navigation/DefaultNavigation"

type StudentNavigation = NativeStackScreenProps<HomeScreenStackParamList, "Main">['navigation']

type StudentDisplayProps = {
  user: UserByIdResponse
  navigation: StudentNavigation
}

export default function StudentDisplay({ user, navigation }: StudentDisplayProps) {
  return (
    <View style={{ height: 200, width: Dimensions.get("screen").width }}>
      <ChildrenFlashList data={user.students.map((c) => c)} navigation={navigation} />
    </View>
  )
}

type ChildrenFlashListProps = {
  data: Student[]
  navigation: StudentNavigation
}

function ChildrenFlashList({ data, navigation }: ChildrenFlashListProps) {
  return (
    <FlashList
      data={data}
      estimatedItemSize={20}
      ItemSeparatorComponent={() => <View className="h-2 " />}
      renderItem={({ item: student }) => (
        <TouchableOpacity onPress={() => navigation.navigate("Student", {
          studentId: student.id,
          name: `${student.firstName} ${student.lastName}`,
          profilePicture: student.profilePicture,
        })}
        >
          <StudentListItem student={student} />
        </ TouchableOpacity>
      )}
    />
  )
}

function StudentListItem({ student }: { student: Student }) {
  return (
    <ListItem bottomDivider>
      <Avatar
        rounded
        source={{ uri: student.profilePicture }}
      />
      <ListItem.Content>
        <ListItem.Title>{student.firstName} {student.lastName}</ListItem.Title>
      </ListItem.Content>
    </ListItem>
  )
}
