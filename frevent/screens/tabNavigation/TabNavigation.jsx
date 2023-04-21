import {
    View, Text, SafeAreaView, ViewPropTypes,
} from 'react-native'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../../features/userSlice'
import Ionic from 'react-native-vector-icons/Ionicons'
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./HomeScreen";
import ChatStack from '../chat/ChatStack'

import MyEventsStack from '../myEvents/MyEventsStack'
import SettingsStack from './SettingsStack'



const Tab = createBottomTabNavigator(); // create bottom tab navigator

const TabNavigation = () => {   // Company tab navigation
  
    const userData = useSelector(selectUser) // get user data from redux

    return (

        <Tab.Navigator   // create tab navigator

            screenOptions={({ route }) => ({ // set tab bar options

                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: [
                    {
                        display: "flex"
                    },
                    null
                ],

                tabBarIcon: ({ focused, color, size }) => { // set tab bar icons
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
        >
            <Tab.Screen options={{ headerShown: false }} name="Home" component={HomeScreen} /> 
            <Tab.Screen options={{ headerShown: false }} name="My Events" component={MyEventsStack} />
            <Tab.Screen name="Chat" options={{ headerShown: false }} component={ChatStack} />
            <Tab.Screen name="Settings" component={SettingsStack} />
        </Tab.Navigator>

    )


}



export default TabNavigation
