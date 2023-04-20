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

    const [screen, setScreen] = useState("login")

    // Valmistelee redux
    const dispatch = useDispatch();

    const userData = useSelector(selectUser)


    const getLoggedStatus = async () => {

        const userData = await AsyncStorage.getItem("userData")
        const parsedJsonData = JSON.parse(userData)

        if (parsedJsonData?.token) {
            console.log(parsedJsonData)
            dispatch(addUser(parsedJsonData))


            if (parsedJsonData.IDcompany) {
                setScreen("companyHome")
            } else {
                setScreen("home")

            }
        }
    }



    useEffect(() => {
        //dispatch(addUser({}))
        getLoggedStatus()
    }, [])


    useEffect(() => {
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