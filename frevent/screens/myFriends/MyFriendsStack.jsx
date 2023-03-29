import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyFriendsFeed from './components/MyFriendsFeed';
import FindFriends from './components/FindFriends';
const Stack = createNativeStackNavigator();


const MyFriendsStack = () => {
    return (
        <Stack.Navigator >
            <Stack.Screen name="friendsFeed" component={MyFriendsFeed} options={{ headerShown: false }} />
            <Stack.Screen name="fiendFriends" component={FindFriends} />
        </Stack.Navigator>
    )
}

export default MyFriendsStack