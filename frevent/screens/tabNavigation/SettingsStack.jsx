import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProfileSettings from './ProfileSettings';
import SettingsScreen from './SettingsScreen';


const Stack = createNativeStackNavigator();

const SettingsStack = ({setLogged}) => {
  return (
    
      <Stack.Navigator>
        <Stack.Screen name="SettingsScreen" initialParams={{setLogged:setLogged}} component={SettingsScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="profile" component={ProfileSettings}/>
      </Stack.Navigator>
    
  );
};

export default SettingsStack;