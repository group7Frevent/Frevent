import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from '../../features/userSlice';
import { API_URL } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from 'expo-checkbox';
import Spinner from 'react-native-loading-spinner-overlay'


const Login = ({ route, navigation }) => { // <- This is the component that is rendered when the user navigates to the login screen
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [checkbox, setCheckbox] = useState(false)
    const [spinner, setSpinner] = useState(false)


    const dispatch = useDispatch(); // <- This is the redux hook that is used to dispatch actions to the redux store
 
    const loginRequest = async () => { // <- This is the function that is called when the user presses the login button, it sends a login request to the backend
        setSpinner(true)
        if (checkbox) { // <- This is the ternary operator, it is used to set the account type based on the checkbox value
            var accountType = "company"
        }
        else {
            var accountType = "user"
        }
        console.log(accountType)  // <- This is the console.log function, it is used to print the account type to the console
        var details = {
            username: userName,
            password: password,
            accountType: accountType
        };


        var formBody = []; // <- This is the form body that is sent to the backend
 
        for (var property in details) { // <- This is the for loop, it is used to iterate over the details object
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }

        formBody = formBody.join("&"); // <- This is the form body that is sent to the backend

        const config = { // <- This is the config object that is sent to the backend, it is used to set the headers
            headers: { 
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
            },
        };



        const requestUrl = API_URL + 'auth/login/' // <- This is the request url that is sent to the backend
        axios.post(requestUrl, formBody, config).then((response) => { // <- This is the axios request that is sent to the backend
            // Login succeed
            console.log(response.data)
            console.log(accountType)
            // Tallennetaan tiedot reduxiin
            AsyncStorage.setItem("userData", JSON.stringify(response?.data)); // <- This is the AsyncStorage function, it is used to store the user data to the device
            dispatch(addUser(response.data)) // <- This is the dispatch function, it is used to dispatch an action to the redux store
            setSpinner(false) // <- This is the setSpinner function, it is used to set the spinner state, which is used to show a loading spinner
        }).catch((error) => {
            console.log(error.response.data) // <- This is the console.log function, it is used to print the error message to the console
            setSpinner(false) 
            if (error.response.data === "wrong username") { // <- This is the if statement, it is used to check if the error message is "wrong username", if it is, it shows an alert
                Alert.alert("Username not found");  // <- This is the Alert.alert function, it is used to show an alert to the user, it takes two parameters, the title and the message
            }
            else {
                Alert.alert("Wrong password"); // <- This is the Alert.alert function, it is used to show an alert to the user, it takes two parameters, the title and the message
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