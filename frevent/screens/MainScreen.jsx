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

const MainScreen = () => { // <- This is the component that is rendered when the user navigates to the home screen

    const [screen, setScreen] = useState("login") // <- This is the state that is used to determine which screen is rendered

    const dispatch = useDispatch(); // <- This is the dispatch function that is used to dispatch actions to the redux store

    const userData = useSelector(selectUser) // <- This is the user data that is stored in the redux store, and is used to determine which screen is rendered


    const getLoggedStatus = async () => { // <- This is the function that is used to check if the user is logged in or not

        const userData = await AsyncStorage.getItem("userData") // <- This is the user data that is stored in the async storage
        const parsedJsonData = JSON.parse(userData) // <- This is the parsed user data that is stored in the async storage

        if (parsedJsonData?.token) { // <- This is the if statement that is used to check if the user is logged in or not
            console.log(parsedJsonData)
            dispatch(addUser(parsedJsonData))


            if (parsedJsonData.IDcompany) { // <- This is the if statement that is used to check if the user is a company or not
                setScreen("companyHome")
            } else {
                setScreen("home")

            }
        }
    }



    useEffect(() => {   // <- This is the useEffect hook that is used to check if the user is logged in or not
        getLoggedStatus()
    }, [])


    useEffect(() => { // <- This is the useEffect hook that is used to check if the user is a company or not
        if (!userData?.user?.token) {
            setScreen("login")
        } else {
            if (userData?.user?.IDcompany) {
                setScreen("companyHome")
            } else {
                setScreen("home")
            }
        } 
    }, [userData]) // <- This is the useEffect hook that is used to check if the user is a company or not, and is triggered when the user data is changed


    if (screen === "login") {
        return (
            <AuthStack />
        )
    }

    /*if (screen === "signup") {
        return (
            <Signup setScreen={setScreen} />
        )
    }

    if (screen === "companySignup") {
        return (
            <CompanySignup setScreen={setScreen} />
        )
    }
    */

    if (screen === "home") {
        return (
            <TabNavigation />
        )
    }

    if (screen === "companyHome") {
        return (
            <CompanyTabBar />
        )
    }
}

export default MainScreen