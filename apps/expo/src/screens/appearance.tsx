import ScreenWrapper from "../components/ScreenWrapper"
import { Card, ListItem, ThemeMode } from "@rneui/themed"
import { View } from "react-native"
import { useColorSchemeContext } from "../contexts/ColorSchemeProvider";

export const AppearanceScreen = () => {
  const { themeMode, updateTheme } = useColorSchemeContext()

  const selections = [
    {
      title: "Light",
      mode: "light",
      description: "Light theme",
    },
    {
      title: "Dark",
      mode: "dark",
      description: "Dark theme",
    },
  ]

  return (
    <ScreenWrapper>
      <Card containerStyle={{ borderRadius: 8 }}>
        {selections.map((selection, index) => (
          <ListItem
            key={index}
            bottomDivider={index !== selections.length - 1}
            onPress={() => updateTheme(selection.mode as ThemeMode)}
          >
            <ListItem.Content>
              <ListItem.Title>{selection.title}</ListItem.Title>
            </ListItem.Content>

            <ListItem.CheckBox
              iconType="material-community"
              checkedIcon="check-circle"
              uncheckedIcon="circle-outline"
              checked={themeMode === selection.mode}
            />
          </ListItem>
        ))}
      </Card>
    </ScreenWrapper >
  )
}
