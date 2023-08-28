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
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const user = useUser().user!

  const { data, isLoading, refetch, isRefetching } = trpc.user.byId.useQuery({
    id: user.id
  })


  const { theme: { colors } } = useTheme()

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
