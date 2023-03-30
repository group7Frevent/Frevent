import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from '../../features/userSlice';
import { API_URL } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from 'expo-checkbox';



const Login = ({ setLogged, setShowRegister, setShowCompanySignup, setShowLogin }) => {
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [checkbox, setCheckbox] = useState(false)


    // Valmistelee redux
    const dispatch = useDispatch();

    const loginRequest = async () => {
        if (checkbox) {
            var accountType = "company"
        }
        else {
            var accountType = "user"
        }
        console.log(accountType)
        var details = {
            username: userName,
            password: password,
            accountType: accountType
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



        const requestUrl = API_URL + 'auth/login/'





        axios.post(requestUrl, formBody, config).then((response) => {
            // Login succeed
            console.log(response.data)
            // Tallennetaan tiedot reduxiin
            AsyncStorage.setItem("userData", JSON.stringify(response?.data));
            dispatch(addUser(response.data))
            setLogged(true)
        }).catch((error) => {
            console.log(error)
            if (error.response.data === "wrong username") {
                Alert.alert("Username not found");
            }
            else {
                Alert.alert("Wrong password");
            }
        })


    }

    return (

        <View style={styles.container}>
            <Text style={styles.title} >Welcome to Frevent</Text>
            <Image style={styles.image} source={require("../../assets/kaverit.png")} />
            <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="grey"
                onChangeText={setUserName}
                value={userName}
                autoCapitalize='none'
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="grey"
                secureTextEntry={true}
                onChangeText={setPassword}
                value={password}
                autoCapitalize='none'
            />
            <CheckBox
                style={styles.checkbox}
                value={checkbox}
                onValueChange={() => setCheckbox(!checkbox)}
                color={checkbox ? 'green' : undefined}
            />
            <TouchableOpacity style={styles.button} onPress={loginRequest} color="#fff">
                <Text style={styles.logintext}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowRegister(false)} color="#fff">
                <Text style={styles.bottomtitle} > No account yet? Register here!</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                setShowCompanySignup(true)
                setShowLogin(false)
            }} color="#fff">
                <Text style={styles.bottomtitle} > Create your company account here!</Text>
            </TouchableOpacity>

        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 60,
        paddingRight: 60,
        backgroundColor: '#FEF9A7',
        alignItems: 'center',
        justifyContent: 'center',

    },
    checkbox: {
        alignSelf: "stretch",
        title: "moro"

    },
    input: {
        alignSelf: 'stretch',
        height: 40,
        marginBottom: 30,
        borderBottomColor: '#F77E21',
        borderBottomWidth: 1,

    },
    button: {
        marginTop: 30,
        borderRadius: 100,
        alignSelf: 'stretch',
        alignItems: 'center',
        backgroundColor: '#F77E21',
        color: '#fff',
        padding: 20,
    },
    image: {
        width: 250,
        height: 200,

    },
    title: {
        marginBottom: 30,
        fontSize: 30,
        paddingBottom: 10,
        borderBottomColor: '#465881',
        borderBottomWidth: 1,
        color: '#465881',

    },
    bottomtitle: {
        padding: 10,
        fontWeight: 'bold'
    },
    logintext: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    }
});
export default Login