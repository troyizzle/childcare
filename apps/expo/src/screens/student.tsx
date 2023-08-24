import { useUser } from "@clerk/clerk-expo"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Avatar, Button, Card, FAB, Icon, Input, ListItem, Text, useTheme } from "@rneui/themed"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { ActivityIndicator, Alert, Modal, useColorScheme, View } from "react-native"
import ScreenWrapper from "../components/ScreenWrapper"
import { HomeScreenStackParamList } from "../navigation/DefaultNavigation"
import { trpc } from "../utils/trpc"
import { zodResolver } from "@hookform/resolvers/zod"
import { StudentActionLogNewInput, studentActionLogNewSchema } from "@acme/validations/student-action-log"
import DateTimePicker from '@react-native-community/datetimepicker';
import { FlashList } from "@shopify/flash-list"
import { StudentLogsByStudentIdResponse } from "@acme/api/src/router/student"

type StudentScreenProps = NativeStackScreenProps<HomeScreenStackParamList, "Student">
type StudentActionLogType = StudentLogsByStudentIdResponse[number]

export const StudentScreen = ({ route }: StudentScreenProps) => {
  const [actionLogModalVisible, setActionLogModalVisible] = useState(false)
  const [chosenDate, setChosenDate] = useState(new Date())

  const { studentId } = route.params

  const studentLogQuery = trpc.student.logsByStudentId.useQuery({
    studentId,
    date: new Date(chosenDate.getTime() - (chosenDate.getTimezoneOffset() ?? 0) * 60000)
  })

  return (
    <ScreenWrapper>
      <View className="flex flex-row mt-2 p-1">
        <Avatar
          rounded
          size="large"
          source={{ uri: route.params.profilePicture }}
        />
        <View className="flex flex-col grow ml-4">
          <Text h1>{route.params.name}</Text>
          <View className="flex flex-row items-center mt-2">
            <DateTimePicker
              mode="date"
              value={chosenDate}
              timeZoneOffsetInSeconds={3600}
              onChange={(_event, selectedDate) => {
                if (selectedDate) {
                  setChosenDate(selectedDate)
                  studentLogQuery.refetch()
                }
              }}
              themeVariant={useColorScheme() === "dark" ? "dark" : "light"}
            />
          </View>
        </View>
      </View>

      {studentLogQuery.isLoading && (
        <ActivityIndicator size="large" className="mt-5" />
      )}

      {studentLogQuery.error && (
        <View className="mt-5">
          <Text className="text-red-500">Error loading student logs</Text>
        </View>
      )}

      {studentLogQuery.data && (
        <View className="h-full">
          <FlashList
            data={studentLogQuery.data}
            estimatedItemSize={20}
            renderItem={({ item: log }) => (
              <StudentActionLogItem log={log} />
            )}
          />
        </View>
      )}

      {actionLogModalVisible && <NewActionForm studentId={studentId} modalVisible={actionLogModalVisible} setModalVisible={setActionLogModalVisible} />}
      <LogFAB studentId={studentId} setActionLogModalVisible={setActionLogModalVisible} />
    </ScreenWrapper>
  )
}

type LogFABProps = {
  studentId: string
  setActionLogModalVisible: (visible: boolean) => void
}

function LogFAB({ studentId, setActionLogModalVisible }: LogFABProps) {
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const user = useUser().user!
  const [canAddAction, setCanAddAction] = useState(true)

  const userQuery = trpc.user.byId.useQuery({ id: user.id })

  useEffect(() => {
    if (!userQuery.data) return
    const { data } = userQuery

    const roles = data.roles.map(({ role }) => role.name.toLowerCase())

    if (roles.includes("admin")) {
      setCanAddAction(true)
      return
    }

    if (roles.includes("teacher")) {
      if (data.students.find(student => student.id == studentId)) {
        setCanAddAction(true)
        return
      }
    }
  }, [userQuery.data])

  if (!canAddAction) return null

  return (
    <FAB
      placement="right"
      onPress={() => setActionLogModalVisible(true)}
      icon={{ name: "plus", type: "font-awesome" }}
    />
  )
}

type NewActionFormProps = {
  studentId: string
  modalVisible: boolean
  setModalVisible: (visible: boolean) => void
}

function NewActionForm({ studentId, modalVisible, setModalVisible }: NewActionFormProps) {
  const { theme: { colors } } = useTheme();

  const actionQuery = trpc.action.all.useQuery(undefined, {
    enabled: modalVisible
  })

  const { control, formState, handleSubmit, getValues, setValue } = useForm<StudentActionLogNewInput>({
    resolver: zodResolver(studentActionLogNewSchema),
    defaultValues: { studentId }
  })

  const utils = trpc.useContext();

  const { mutate } = trpc.student.createLog.useMutation({
    onSuccess: async () => {
      setModalVisible(false)
      await utils.student.logsByStudentId.invalidate()
    },
    onError: (error) => {
      Alert.alert("Error", error.message)
    }
  })

  function submitForm(data: StudentActionLogNewInput) {
    mutate(data)
  }

  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      presentationStyle="formSheet"
      onRequestClose={() => setModalVisible(false)}
    >
      <View
        className="h-full"
        style={{ backgroundColor: colors.background }}
      >
        <View className="flex flex-row justify-between p-2">
          <Button
            color="primary"
            type="clear"
            onPress={() => setModalVisible(false)}
            title="Cancel"
          />
          <Button
            disabled={!formState.isValid || formState.isSubmitting}
            onPress={handleSubmit(submitForm)}
            loading={formState.isSubmitting}
            color="primary"
            radius="md"
            title="Submit"
          />
        </View>
        <Card>
          <Card.Title h3>What did you do?</Card.Title>
          <Card.Divider />
          <View className="flex flex-col gap-2 items-center" style={{
            width: "100%",
          }}>
            <View className="w-full h-24">
              <Controller
                control={control}
                name="notes"
                render={({ field: { onChange, value } }) => (
                  <Input
                    value={value}
                    onChangeText={onChange}
                    placeholder="Please feel free to add any notes here."
                    multiline
                    style={{ height: "100%" }}
                  />
                )}
              />
            </View>

            {actionQuery.data?.map((action, index) => (
              <ListItem
                style={{
                  width: "100%"
                }}
                key={action.id}
                bottomDivider={index !== actionQuery.data.length - 1}
                onPress={() => {
                  setValue("actionId", action.id, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true
                  })
                }}
              >
                <ListItem.Content>
                  <ListItem.Title>{action.name}</ListItem.Title>
                </ListItem.Content>
                {getValues("actionId") === action.id && (
                  <Icon name="check" />
                )}
              </ListItem>
            ))}
          </View>
        </Card>
      </View>
    </Modal>
  )
}


type StudentActionLogItemProps = {
  log: StudentActionLogType
}

function StudentActionLogItem({ log }: StudentActionLogItemProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <ListItem.Accordion
      noIcon={!log.notes}
      bottomDivider
      content={
        <ListItem.Content>
          <ListItem.Title>
            {formattedLogName(log)}
          </ListItem.Title>
          <ListItem.Subtitle>
            {log.teacher?.firstName} {log.teacher?.lastName}
          </ListItem.Subtitle>
        </ListItem.Content>
      }
      isExpanded={expanded}
      onPress={() => !log.notes ? null : setExpanded(!expanded)}
    >
      <ListItem
        bottomDivider
      >
        <ListItem.Content>
          <ListItem.Title>
            {log.notes}
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
    </ListItem.Accordion>

  )
}

function formattedLogName(log: StudentActionLogType) {
  const formattedDate = new Intl.DateTimeFormat('default',
    {
      hour12: true,
      hour: 'numeric',
      minute: 'numeric'
    }).format(log.createdAt)

  return `${log.action.name} as ${formattedDate}`
}