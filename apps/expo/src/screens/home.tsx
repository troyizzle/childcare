import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { RefreshControl, ScrollView, View } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import { trpc } from "../utils/trpc";
import { Text, useTheme } from "@rneui/themed";
import StudentDisplay from "../components/StudentDisplay";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeScreenStackParamList } from "../navigation/DefaultNavigation";

type HomeProps = NativeStackScreenProps<HomeScreenStackParamList, "Home">

export const HomeScreen = ({ navigation }: HomeProps) => {
  const user = useUser().user!

  const userQuery = trpc.user.byId.useQuery({
    id: user.id
  })

  const { theme: { colors } } = useTheme()

  return (
    <ScreenWrapper>
      <View className="m-4">
        <Text h1>Home</Text>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={userQuery.isFetching}
              onRefresh={() => userQuery.refetch()}
              tintColor={colors.primary}
            />
          }
        >
          {userQuery.data && (
            <StudentDisplay user={userQuery.data} navigation={navigation} />
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};
