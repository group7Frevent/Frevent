import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from '../../features/userSlice';
import { API_URL } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from 'expo-checkbox';
import Spinner from 'react-native-loading-spinner-overlay'


const Login = ({ route, navigation }) => {
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [checkbox, setCheckbox] = useState(false)
    const [spinner, setSpinner] = useState(false)

    // Valmistelee redux
    const dispatch = useDispatch();

    const loginRequest = async () => {
        setSpinner(true)
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
            console.log(accountType)
            // Tallennetaan tiedot reduxiin
            AsyncStorage.setItem("userData", JSON.stringify(response?.data));
            dispatch(addUser(response.data))
            setSpinner(false)
        }).catch((error) => {
            console.log(error.response.data)
            setSpinner(false)
            if (error.response.data === "wrong username") {
                Alert.alert("Username not found");
            }
            else {
                Alert.alert("Wrong password");
            }
        })




    }

    return (
        <>
            <Spinner
                visible={spinner}
                textContent={'Loading...'}
                textStyle={styles.spinnerTextStyle}
            />
            <View style={styles.container}>

                <Image style={styles.image} source={require("../../assets/FreventLogo.png")} />
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

                <Text style={styles.checkboxtext}>Check this box if using a company account!</Text>
                <CheckBox
                    style={styles.checkbox} // style for the container
                    value={checkbox} // boolean value
                    onValueChange={() => setCheckbox(!checkbox)} // toggle checkbox
                    color={checkbox ? 'green' : undefined} // custom color for unchecked state
                />

                <TouchableOpacity style={styles.button} onPress={loginRequest} color="#fff">
                    <Text style={styles.logintext}>Log In</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Signup")} color="#fff">
                    <Text style={styles.bottomtitle} > No account yet? Register here!</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("CompanySignup")} color="#fff">
                    <Text style={styles.bottomtitle} > Create your company account here!</Text>
                </TouchableOpacity>

            </View>
        </>

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
    checkboxtext: {
        alignSelf: 'stretch',
        height: 20,
        fontWeight: 'bold',
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
        width: 300,
        height: 100,


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