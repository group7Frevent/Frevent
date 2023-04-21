import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { addUser, selectUser } from '../features/userSlice';
import Login from './loginSignup/Login';
import Signup from './loginSignup/Signup';
import CompanySignup from './loginSignup/CompanySignup'
import TabNavigation from './tabNavigation/TabNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CompanyTabBar from './CompanyPortal/CompanyTabBar';
import AuthStack from './loginSignup/AuthStack';

const MainScreen = () => {

    // State that navigates to screens
    const [screen, setScreen] = useState("login")

    //  redux
    const dispatch = useDispatch();
    const userData = useSelector(selectUser)


    // Get logged status
    const getLoggedStatus = async () => {

        // Get user data from async storage
        const userData = await AsyncStorage.getItem("userData")
        const parsedJsonData = JSON.parse(userData)

        // If user data exists, set user data to redux and navigate to home screen
        if (parsedJsonData?.token) {
            dispatch(addUser(parsedJsonData))


            if (parsedJsonData.IDcompany) {
                setScreen("companyHome")
            } else {
                setScreen("home")

            }
        }
    }



    useEffect(() => {
        getLoggedStatus()
    }, [])


    useEffect(() => {
        // When user data changes, check if user is logged in
        // If not logged in (no token), navigate to login screen
        if (!userData?.user?.token) {
            setScreen("login")
        } else {
            if (userData?.user?.IDcompany) {
                setScreen("companyHome")
            } else {
                setScreen("home")
            }
        }
    }, [userData])

    // Login screen
    if (screen === "login") {
        return (
            <AuthStack />
        )
    }

    // Home screen
    if (screen === "home") {
        return (
            <TabNavigation />
        )
    }

    // Company home screen
    if (screen === "companyHome") {
        return (
            <CompanyTabBar />
        )
    }
}

export default MainScreen