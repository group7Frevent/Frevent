import { Button, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { addUser, selectUser } from '../features/userSlice';

const MainScreen = () => {
    const dispatch = useDispatch();


    const setTestRedux = () => {
        const testUserData = {
            userID: 23,
            username: "Sepon",
            imageUrl: "http://sddsadsads",
            token: "dsaijdhsiaudhgysuahdsadasdsadadsa",
            type: "user"
        }
        dispatch(addUser(testUserData))
    }

    return (
        <View style={styles.container}>
            <Text>Testi</Text>
            <Button
                onPress={setTestRedux}
                title="Add"
            />
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});


export default MainScreen