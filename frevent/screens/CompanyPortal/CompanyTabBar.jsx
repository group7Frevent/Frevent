import { View, Text, SafeAreaView } from 'react-native'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../../features/userSlice'
import Ionic from 'react-native-vector-icons/Ionicons'
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CompanyEventsScreen from "./CompanyEventsScreen";
import CompanyHomeScreen from "./CompanyHomeScreen";
import CompanySettingsStack from "./CompanySettingsStack";

const Tab = createBottomTabNavigator();

const CompanyTabNavigation = ({setCompanyLogged}) => {
    // Tuodaan tiedot reduxista
    const userData = useSelector(selectUser)
        
    return (

        <Tab.Navigator

            screenOptions={({ route }) => ({

                tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: [
          {
            display: "flex"
          },
          null
        ],

                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'My Events') {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    }  else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }
                    return <Ionic name={iconName} size={size} color={color} />;
                },
            })

            }
        >
            <Tab.Screen name="Home" component={CompanyHomeScreen} />
            <Tab.Screen name="My Events" component={CompanyEventsScreen} />
            <Tab.Screen name="Settings" >
                {props => <CompanySettingsStack {...props} setCompanyLogged={setCompanyLogged}/>}
            </Tab.Screen>
        </Tab.Navigator>

    )


}



export default CompanyTabNavigation
