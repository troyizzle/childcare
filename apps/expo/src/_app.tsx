import { StatusBar } from "expo-status-bar";
import React from "react";
import { TRPCProvider } from "./utils/trpc";
import { SignInSignUpScreen } from "./screens/signin";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { tokenCache } from "./utils/cache";
import Constants from "expo-constants";
import ColorSchemeProvider from "./contexts/ColorSchemeProvider";
import Background from "./components/Background";
import DefaultNavigation from "./navigation/DefaultNavigation";
import Navigation from "./navigation/Navigation";
import FlashMessage from "react-native-flash-message";

export const App = () => {
  return (
    <ColorSchemeProvider>
      <Navigation>
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
      </Navigation>
      <FlashMessage position="bottom" />
    </ColorSchemeProvider >
  );
};
