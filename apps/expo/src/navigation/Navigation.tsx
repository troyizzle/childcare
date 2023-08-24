import { NavigationContainer } from "@react-navigation/native";
import { useTheme } from "@rneui/themed";

type NavigationProps = {
  children: React.ReactNode;
};

export default function Navigation({ children }: NavigationProps) {
  const { theme} = useTheme();
  const { colors } = theme;

  return (
    <NavigationContainer
      theme={{
        colors: {
          primary: colors.primary,
          background: colors.background,
          card: colors.white,
          text: colors.black,
          border: colors.white,
          notification: colors.primary,
        },
        dark: theme.mode === 'dark',
      }}
    >
      {children}
    </NavigationContainer>
  )
}
