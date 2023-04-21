import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Login';
import Signup from './Signup';
import CompanySignup from './CompanySignup';
import { Text } from 'react-native';

const Stack = createNativeStackNavigator(); // create stack navigator

const AuthStack = () => { // Company settings stack
    return (
        <Stack.Navigator >
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
            <Stack.Screen name="CompanySignup" component={CompanySignup} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}

export default AuthStack