import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddEvent from './components/AddEvent';
const Stack = createNativeStackNavigator();

const MyEventsStack = () => {
    return (
        <Stack.Navigator >
            <Stack.Screen name="Add Event" component={AddEvent} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}

export default MyEventsStack