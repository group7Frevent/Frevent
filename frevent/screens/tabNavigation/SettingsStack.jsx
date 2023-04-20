import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileSettings from './ProfileSettings';
import SettingsScreen from './SettingsScreen';


const Stack = createNativeStackNavigator();

const SettingsStack = () => {
  return (

    <Stack.Navigator>
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="profile" component={ProfileSettings} />
    </Stack.Navigator>

  );
};

export default SettingsStack;