import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddEvent from './components/AddEvent';
import ChoosePeople from './components/ChoosePeople';
const Stack = createNativeStackNavigator();

const MyEventsStack = () => {
    return (
        <Stack.Navigator >
            <Stack.Screen name="Add Event" component={AddEvent} options={{ headerShown: false }} />
            <Stack.Screen name="Choose people" component={ChoosePeople} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}

export default MyEventsStack