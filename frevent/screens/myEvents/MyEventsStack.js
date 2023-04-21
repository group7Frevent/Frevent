import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddEvent from './components/AddEvent';
import ChoosePeople from './components/ChoosePeople';
import AddEventshome from './components/AddEventshome';
import ShowParticipants from './components/ShowParticipants';
const Stack = createNativeStackNavigator();

const MyEventsStack = () => {
    // Stack navigator for my events screen
    return (
        <Stack.Navigator >
            <Stack.Screen name="My Events home" component={AddEventshome} />
            <Stack.Screen name="Add Event" component={AddEvent} />
            <Stack.Screen name="Choose people" component={ChoosePeople} />
            <Stack.Screen name="Show participants" component={ShowParticipants} />
        </Stack.Navigator>
    )
}

export default MyEventsStack