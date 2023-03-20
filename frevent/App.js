import { StatusBar } from 'expo-status-bar';
import { Provider } from "react-redux";
import MainScreen from './screens/MainScreen';
import { store } from "./store";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <MainScreen />
        <StatusBar style="auto" />
      </Provider>
    </NavigationContainer>
  );
}


