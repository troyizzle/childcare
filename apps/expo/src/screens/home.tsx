import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { RefreshControl, ScrollView } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import { trpc } from "../utils/trpc";
import { Text, useTheme } from "@rneui/themed";

export const HomeScreen = () => {
  const user = useUser().user!

  const userQuery = trpc.user.byId.useQuery({
    id: user.id
  })

  const { theme: { colors } } = useTheme()

  return (
    <ScreenWrapper>
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
          <Text>{JSON.stringify(userQuery.data)}</Text>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};
