import { StudentByIdResponse } from "@acme/api/src/router/student";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Card, Icon, Text, useTheme } from "@rneui/themed";
import { ActivityIndicator, Linking, ScrollView, View } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import { HomeScreenStackParamList } from "../navigation/DefaultNavigation";
import { trpc } from "../utils/trpc";

type StudentProfileScreenProps = NativeStackScreenProps<HomeScreenStackParamList, "StudentProfile">

export const StudentProfileScreen = ({ route }: StudentProfileScreenProps) => {
  const studentQuery = trpc.student.byId.useQuery({
    id: route.params.studentId
  })

  return (
    <ScreenWrapper>
      <View className="p-4">
        {studentQuery.isLoading && (
          <ActivityIndicator size="large" color={useTheme().theme.colors.primary} />
        )}

        <ScrollView>
          {studentQuery.data?.contactInfos.map((contactInfo) => (
            <ContactInfoCard key={contactInfo.id} contactInfo={contactInfo} />
          ))}
        </ScrollView>
      </View>
    </ScreenWrapper>
  )
}

type ContactInfoCardProps = {
  contactInfo: NonNullable<StudentByIdResponse>["contactInfos"][number]
}

function ContactInfoCard({ contactInfo }: ContactInfoCardProps) {
  const { theme: { colors } } = useTheme()

  const contactActions = [
    {
      onPress: () => {
        Linking.openURL(`tel:${contactInfo.phone}`)
      },
      icon: "phone",
    },
    {
      onPress: () => {
        Linking.openURL(`sms:${contactInfo.phone}`)
      },
      icon: "message",
    },
    {
      onPress: () => {
        Linking.openURL(`mailto:${contactInfo.email}`)
      },
      icon: "email",
    }
  ]

  return (
    <View>
      <Card
        containerStyle={{
          backgroundColor: colors.background,
        }}
      >
        <Card.Title h4>{contactInfo.firstName} {contactInfo.lastName}</Card.Title>
        <Text h4 style={{ textAlign: 'center', fontWeight: "500" }}>
          {contactInfo.relationship}
        </Text>
        <Card.Divider />
        <View className="flex flex-row items-center justify-between">
          {contactActions.map((action) => (
            <Button
              key={action.icon}
              type="clear"
              size="lg"
              className="p-4"
              onPress={action.onPress}
              >
                <Icon name={action.icon} size={24} />
              </Button>
          ))}
        </View>
      </Card>
    </View>
  )
}
