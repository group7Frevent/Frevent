import { View, Text, SafeAreaView } from 'react-native'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../../features/userSlice'
import Ionic from 'react-native-vector-icons/Ionicons'
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import EventsScreen from "./EventsScreen";
import FriendsScreen from "./FriendsScreen";
import SettingsScreen from "./SettingsScreen";
import HomeScreen from "./HomeScreen";
import ChatStack from '../chat/ChatStack'

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
    // Tuodaan tiedot reduxista
    const userData = useSelector(selectUser)

    return (

        <Tab.Navigator

            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'My Events') {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    } else if (route.name === 'Friends') {
                        iconName = focused ? 'people' : 'people-outline';
                    } else if (route.name === 'Chat') {
                        iconName = focused ? 'md-chatbubbles' : 'md-chatbubbles-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }
                    return <Ionic name={iconName} size={size} color={color} />;
                },
            })

            }
            tabBarOptions={{
                style: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                },
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray',
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="My Events" component={EventsScreen} />
            <Tab.Screen name="Friends" component={FriendsScreen} />
            <Tab.Screen options={{ headerShown: false }} name="Chat" component={ChatStack} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>

    )


}



export default TabNavigation
