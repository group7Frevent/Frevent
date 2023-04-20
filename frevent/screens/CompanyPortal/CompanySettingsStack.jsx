import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CompanyProfileSettings from './CompanyProfileSettings';
import CompanySettingsScreen from './CompanySettingsScreen';


const Stack = createNativeStackNavigator();

const CompanySettingsStack = () => {
  return (

    <Stack.Navigator>
      <Stack.Screen name="CompanySettingsScreen" component={CompanySettingsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Companyprofile" component={CompanyProfileSettings} />
    </Stack.Navigator>

  );
};

export default CompanySettingsStack;