import { Button, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { addUser, selectUser } from '../features/userSlice';
import Login from './loginSignup/Login';
import Signup from './loginSignup/Signup';
import CompanySignup from './loginSignup/CompanySignup'
import TabNavigation from './tabNavigation/TabNavigation';
import HomeScreen from './tabNavigation/HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MainScreen = () => {

    const [logged, setLogged] = useState(false)
    const [showLogin, setShowLogin] = useState(true)
    const [showCompanySignup, setShowCompanySignup] = useState(false)

    // Valmistelee redux
    const dispatch = useDispatch();
    
    const getLoggedStatus = async () => {

        const userData = await AsyncStorage.getItem("userData")
        const parsedJsonData = JSON.parse(userData)
        if(parsedJsonData?.token) {
            console.log(parsedJsonData)
            dispatch(addUser(parsedJsonData))
            setLogged(true)
        }
    }
    useEffect(() => {
        getLoggedStatus()
    },[])

    if (logged) {
        // Renderöidään etusivu */
        return (
            <>
                <TabNavigation setLogged={setLogged} />
            </>

        )
    } else {
        if (showLogin) {
            return (
                <Login setLogged={setLogged} setShowRegister={setShowLogin} setShowCompanySignup={setShowCompanySignup} setShowLogin={setShowLogin} />
            )
        }
        else if (showCompanySignup) {
            return (
                <CompanySignup setShowLogin={setShowLogin} setShowCompanySignup={setShowCompanySignup} />
            )
        }
        else {
            return (
                <Signup setLogged={setLogged} setShowLogin={setShowLogin} />
            )
        }
    }
}

export default MainScreen

/*const setTestRedux = () => {
    const testUserData = {
        userID: 23,
        username: "Sepon",
        imageUrl: "http://sddsadsads",
        token: "dsaijdhsiaudhgysuahdsadasdsadadsa",
        type: "user"
    }

    dispatch(addUser(testUserData))}*/


