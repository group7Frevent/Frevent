import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ChatContainer from './components/ChatContainer'
import { NavigationContainer } from "@react-navigation/native";

const ChatStack = () => {
    const Stack = createNativeStackNavigator()
    return (
        <ChatContainer />
    )
}
/*<NavigationContainer>
    <Stack.Navigator >
        <Stack.Screen
            name="Chats"
            options={{ headerShown: false }}
        >
            {(props) =>
                <ChatContainer {...props} />
            }
        </Stack.Screen>

        <Stack.Screen
            name="Barcode"
        >{(props) =>
            <ChatContainer {...props} />}
        </Stack.Screen>
    </Stack.Navigator>
</NavigationContainer>*/

export default ChatStack