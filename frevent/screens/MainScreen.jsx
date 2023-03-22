import { Button, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { addUser, selectUser } from '../features/userSlice';
import Login from './loginSignup/Login';
import Signup from './loginSignup/Signup';
import CompanySignup from './loginSignup/CompanySignup'
import TabNavigation from './tabNavigation/TabNavigation';
import HomeScreen from './tabNavigation/HomeScreen';

const MainScreen = () => {

    const [logged, setLogged] = useState(false)
    const [showLogin, setShowLogin] = useState(true)
    const [showCompanySignup, setShowCompanySignup] = useState(false)

    const dispatch = useDispatch();


    if (logged) {
        // Renderöidään etusivu */
        return (
            <>
                <TabNavigation />
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


