import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { ActivityIndicator, RefreshControl, ScrollView, View } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import { trpc } from "../utils/trpc";
import { Text, useTheme } from "@rneui/themed";
import StudentDisplay from "../components/StudentDisplay";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeScreenStackParamList } from "../navigation/DefaultNavigation";

type HomeProps = NativeStackScreenProps<HomeScreenStackParamList, "Home">

export const HomeScreen = ({ navigation }: HomeProps) => {
  const { user } = useUser()
  const { theme: { colors } } = useTheme()

  const { data, isLoading, refetch, isRefetching } = trpc.user.byId.useQuery({
    id: user?.id as string
  }, {
    enabled: !!user?.id
  })

  if (!user) {
    return (
      <ScreenWrapper>
        <View className="m-4">
          <Text h1>Home</Text>
          <Text>You are not logged in.</Text>
        </View>
      </ScreenWrapper>
    )
  }



  return (
    <ScreenWrapper>
      <View className="m-4">
        <Text h1>Home</Text>
        <ScrollView
          className="h-full"
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => refetch()}
              tintColor={colors.primary}
            />
          }
        >

          {isLoading && (
            <ActivityIndicator size="large" color={colors.primary} />
          )}

          {data && (
            <StudentDisplay user={data} navigation={navigation} />
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};
