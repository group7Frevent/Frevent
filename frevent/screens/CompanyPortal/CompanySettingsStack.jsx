import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CompanyProfileSettings from './CompanyProfileSettings';
import CompanySettingsScreen from './CompanySettingsScreen';


const Stack = createNativeStackNavigator(); // create stack navigator
 
const CompanySettingsStack = () => { // Company settings stack
  return (

    <Stack.Navigator>
      <Stack.Screen name="CompanySettingsScreen" component={CompanySettingsScreen} options={{ headerShown: false }} /> 
      <Stack.Screen name="Companyprofile" component={CompanyProfileSettings} />
    </Stack.Navigator>

  );
};

export default CompanySettingsStack;