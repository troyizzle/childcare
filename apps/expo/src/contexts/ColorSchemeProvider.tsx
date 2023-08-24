import { useThemeMode } from "@rneui/themed";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

type ColorSchemeProviderProps = {
  children: React.ReactNode;
};

export default function ColorSchemeProvider({ children }: ColorSchemeProviderProps) {
  const colorScheme = useColorScheme();
  const { setMode } = useThemeMode();

  useEffect(() => {
    console.log("colorScheme", colorScheme);
    setMode(colorScheme == "dark" ? "dark" : "light");
  }, [colorScheme]);

  return (
    <>
      {children}
    </>
  )
}
