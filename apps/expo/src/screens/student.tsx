import { useUser } from "@clerk/clerk-expo"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Avatar, Button, Card, FAB, Icon, Input, ListItem, Text, useTheme } from "@rneui/themed"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { ActivityIndicator, Alert, Modal, Platform, View } from "react-native"
import ScreenWrapper from "../components/ScreenWrapper"
import { HomeScreenStackParamList } from "../navigation/DefaultNavigation"
import { trpc } from "../utils/trpc"
import { zodResolver } from "@hookform/resolvers/zod"
import { StudentActionLogNewInput, studentActionLogNewSchema } from "@acme/validations/student-action-log"
import DateTimePicker from '@react-native-community/datetimepicker';
import { FlashList } from "@shopify/flash-list"
import { StudentLogsByStudentIdResponse } from "@acme/api/src/router/student"
import { useColorSchemeContext } from "../contexts/ColorSchemeProvider"
import { showMessage } from "react-native-flash-message"

type StudentScreenProps = NativeStackScreenProps<HomeScreenStackParamList, "Student">
type StudentActionLogType = StudentLogsByStudentIdResponse[number]

export const StudentScreen = ({ route }: StudentScreenProps) => {
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === "ios")
  const [actionLogModalVisible, setActionLogModalVisible] = useState(false)
  const [chosenDate, setChosenDate] = useState(new Date())
  const { themeMode } = useColorSchemeContext()

  const { studentId } = route.params

  const studentLogQuery = trpc.student.logsByStudentId.useQuery({
    studentId,
    date: new Date(chosenDate)
  })

  return (
    <ScreenWrapper>
      <View className="flex flex-row mt-2 p-1">
        <Avatar
          rounded
          size="large"
          source={{ uri: route.params.profilePicture }}
        />
        <View className="flex flex-col grow ml-4 mr-2 flex-wrap">
          <Text h2>{route.params.name}</Text>
          <View className="flex flex-row items-center mt-2">
          {Platform.OS === "android" && (
            <Button
              onPress={() => setShowDatePicker(true)}
              size="sm"
              title="Change date"
            />
            )}
            {showDatePicker && (
              <DateTimePicker
                mode="date"
                display="default"
                value={chosenDate}
                themeVariant={themeMode}
                onChange={(_event, selectedDate) => {
                  if (selectedDate) {
                    setChosenDate(selectedDate)
                    studentLogQuery.refetch()
                  }

                  if(Platform.OS === "android") {
                    setShowDatePicker(false)
                  }
                }}
              />
            )}
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
              <StudentActionLogItem studentLog={log} />
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
  const [canAddAction, setCanAddAction] = useState(true)
  const  { user } = useUser()

  const userQuery = trpc.user.byId.useQuery({ id: user.id as string }, {
    enabled: !!user?.id
  })

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

  if (!user) {
    return null
  }

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
      showMessage({
        message: "Action was successfully logged",
        type: "success"
      })
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
  studentLog: StudentActionLogType
}

function StudentActionLogItem({ studentLog }: StudentActionLogItemProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <ListItem.Accordion
      noIcon={!studentLog.notes}
      bottomDivider
      content={
        <ListItem.Content>
          <ListItem.Title>
            {formattedLogName(studentLog)}
          </ListItem.Title>
          <ListItem.Subtitle>
            {studentLog.teacher?.firstName} {studentLog.teacher?.lastName}
          </ListItem.Subtitle>
        </ListItem.Content>
      }
      isExpanded={expanded}
      onPress={() => !studentLog.notes ? null : setExpanded(!expanded)}
    >
      <ListItem
        bottomDivider
      >
        <ListItem.Content>
          <ListItem.Title>
            {studentLog.notes}
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
