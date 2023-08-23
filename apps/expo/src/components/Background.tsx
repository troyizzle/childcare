import { SafeAreaView } from "react-native";
import { makeStyles } from "@rneui/themed";

type BackgroundProps = {
  children: React.ReactNode;
};

export default function Background({ children }: BackgroundProps) {
  const styles = useStyles();
  return (
    <SafeAreaView style={styles.container}>
      {children}
    </SafeAreaView>
  )
}

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100%",
    backgroundColor: theme.colors.background,
  },
}));

