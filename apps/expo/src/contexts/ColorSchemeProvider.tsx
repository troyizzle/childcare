import { createTheme, ThemeMode, ThemeProvider } from "@rneui/themed";
import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

type ColorSchemeContext = {
  updateTheme: (theme: ThemeMode) => Promise<void>;
  themeMode: ThemeMode;
}

const ColorSchemeContext = createContext({} as ColorSchemeContext);

export function useColorSchemeContext() {
  return useContext(ColorSchemeContext);
}

type ColorSchemeProviderProps = {
  children: React.ReactNode;
};

export default function ColorSchemeProvider({ children }: ColorSchemeProviderProps) {
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");

  useEffect(() => {
    const initTheme = async () => {
      try {
        let savedTheme = await getTheme();

        if (savedTheme) {
          setThemeMode(savedTheme as ThemeMode);
        } else {
          savedTheme = "dark";

          updateTheme(savedTheme as ThemeMode);
        }

        setThemeMode(savedTheme as ThemeMode);
      } catch (e) {
        console.log(e);
      }
    }

    initTheme();

  }, []);

  const updateTheme = async (themeMode: ThemeMode) => {
    try {
      await AsyncStorage.setItem("theme", themeMode);
      setThemeMode(themeMode)
    } catch (e) {
      console.log("ThemeContext#updateTheme", e);
    }
  }

  const getTheme = async () => {
    try {
      return await AsyncStorage.getItem("theme");
    } catch (e) {
      console.log(e);
    }
  }

  const theme = createTheme({
    mode: themeMode
  });

  return (
    <ColorSchemeContext.Provider value={{
      updateTheme,
      themeMode
    }}>

      <ThemeProvider theme={theme}>
      {children}
      </ThemeProvider>
    </ColorSchemeContext.Provider>
  )
}
