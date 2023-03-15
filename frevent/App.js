import { StatusBar } from 'expo-status-bar';
import { Provider } from "react-redux";
import MainScreen from './screens/MainScreen';
import { store } from "./store";

export default function App() {
  return (
    <Provider store={store}>
      <MainScreen />
      <StatusBar style="auto" />
    </Provider>
  );
}

