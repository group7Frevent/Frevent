import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from '../../features/userSlice';
import MainScreen from '../MainScreen';

const Login = ({ setLogged }) => {
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")

    // Valmistelee redux
    const dispatch = useDispatch();

    const loginRequest = async () => {

        var details = {
            username: userName,
            password: password,
            accountType: "user"
        };

        var formBody = [];

        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }

        formBody = formBody.join("&");

        const config = {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
            },
        };

        const requestUrl = 'http://84.250.31.253:3000/auth/login/'


        axios.post(requestUrl, formBody, config).then((response) => {
            // Login succeed
            console.log(response.data)
            // Tallennetaan tiedot reduxiin
            dispatch(addUser(response.data))
            setLogged(true)
        }).catch((error) => {
            console.log(error)
        })


    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="User Name"
                placeholderTextColor="#b5b5b5"
                onChangeText={setUserName}
                value={userName}
                autoCapitalize='none'
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#b5b5b5"
                secureTextEntry={true}
                onChangeText={setPassword}
                value={password}
                autoCapitalize='none'
            />
            <TouchableOpacity style={styles.button} onPress={loginRequest} color="#fff">
                <Text>Log In</Text>
            </TouchableOpacity>

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
    input: {
        marginTop: 20,
        height: 50,
        width: 300,
        borderRadius: 10,
        margin: 1,
        paddingLeft: 10,
        color: "white",
        backgroundColor: "#465881"
    },
    button: {
        marginTop: 40,
        height: 50,
        width: 300,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#465881",
        color: "#fff",
        padding: 10,
        borderRadius: 10,
    },
});

export default Login