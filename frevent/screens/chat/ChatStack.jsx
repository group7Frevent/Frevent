import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import ChatContainer from './components/ChatContainer'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Conversation from './components/Conversation';
import CustomHeader from './components/CustomHeader';

const Stack = createNativeStackNavigator();


const ChatStack = () => {

    return (
        <Stack.Navigator >
            <Stack.Screen name="Chats" component={ChatContainer} />
            <Stack.Screen
                name="Conversation"
                component={Conversation}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
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