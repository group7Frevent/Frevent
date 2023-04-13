import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddEvent from './components/AddEvent';
import ChoosePeople from './components/ChoosePeople';
import AddEventshome from './components/AddEventshome';
const Stack = createNativeStackNavigator();

const MyEventsStack = () => {
    return (
        <Stack.Navigator >
            <Stack.Screen name="My Events home" component={AddEventshome} />
            <Stack.Screen name="Add Event" component={AddEvent} />
            <Stack.Screen name="Choose people" component={ChoosePeople} />
        </Stack.Navigator>
    )
}

export default MyEventsStack