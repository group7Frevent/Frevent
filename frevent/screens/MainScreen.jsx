import { Button, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { addUser, selectUser } from '../features/userSlice';
import Login from './loginSignup/Login';
import TabNavigation from './tabNavigation/TabNavigation';


const MainScreen = () => {

    const [logged, setLogged] = useState(false)

    const dispatch = useDispatch();


    if (logged) {
        // Renderöidään etusivu
        return (
            <View>
                <TabNavigation />
            </View>
        )
    } else {
        // Renderöidään login ja signup UI
        //Login ->
        return (
            <Login setLogged={setLogged} />
        )
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
    dispatch(addUser(testUserData))*/