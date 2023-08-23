import { SafeAreaView } from "react-native";
import Background from "./Background";

type ScreenWrapperProps = {
  children: React.ReactNode;
};

export default function ScreenWrapper({ children }: ScreenWrapperProps) {
  return (
    <SafeAreaView>
      <Background>
        {children}
      </Background>
    </SafeAreaView>
  )
}
