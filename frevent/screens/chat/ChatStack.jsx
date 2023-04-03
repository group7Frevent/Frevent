import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import ChatContainer from './components/ChatContainer'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Conversation from './components/Conversation';
import CustomHeader from './components/CustomHeader';
import FindFriends from './components/FindFriends';
import PendingRequest from './components/PendingRequest';

const Stack = createNativeStackNavigator();


const ChatStack = () => {

    return (
        <Stack.Navigator >
            <Stack.Screen name="Chats" component={ChatContainer} options={{ headerShown: false }} />
            <Stack.Screen
                name="Conversation"
                component={Conversation}
                options={{ headerShown: false }}
            />
            <Stack.Screen name="fiendFriends" component={FindFriends} options={{ headerShadowVisible: false }} />
            <Stack.Screen name="pendingrequests" component={PendingRequest} options={{ headerShadowVisible: false }} />
        </Stack.Navigator>
    )
}


export default ChatStack