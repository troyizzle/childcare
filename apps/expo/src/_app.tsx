import { StatusBar } from "expo-status-bar";
import React from "react";
import { TRPCProvider } from "./utils/trpc";
import { SignInSignUpScreen } from "./screens/signin";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { tokenCache } from "./utils/cache";
import Constants from "expo-constants";
import { createTheme, ThemeProvider, useTheme } from "@rneui/themed";
import ColorSchemeProvider from "./contexts/ColorSchemeProvider";
import Background from "./components/Background";
import { NavigationContainer } from "@react-navigation/native";
import DefaultNavigation from "./navigation/DefaultNavigation";
import { useColorScheme } from "react-native";
import Navigation from "./navigation/Navigation";

export const App = () => {
  const theme = createTheme({
    mode: useColorScheme() === "dark" ? "dark" : "light"
  });

  return (
    <ThemeProvider theme={theme}>
      <Navigation>
        <ColorSchemeProvider>
          <Background>
            <ClerkProvider
              publishableKey={Constants.expoConfig?.extra?.CLERK_PUBLISHABLE_KEY}
              tokenCache={tokenCache}
            >
              <SignedIn>
                <TRPCProvider>
                  <DefaultNavigation />
                  <StatusBar />
                </TRPCProvider>
              </SignedIn>
              <SignedOut>
                <SignInSignUpScreen />
              </SignedOut>
            </ClerkProvider>
          </Background>
        </ColorSchemeProvider>
      </Navigation>
    </ThemeProvider>
  );
};
