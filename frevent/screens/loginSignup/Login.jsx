import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image} from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from '../../features/userSlice';
import MainScreen from '../MainScreen';



const Login = ({ setLogged, setShowRegister }) => {
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


        const requestUrl = 'http://192.168.0.66:3000/auth/login/'



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
            <Text style={styles.title} >Welcome to Frevent</Text>
            <Image style={styles.image} source={require("../../assets/kaverit.png")}/>
            <TextInput
                style={styles.input}
                placeholder="Username"

                onChangeText={setUserName}
                value={userName}
                autoCapitalize='none'
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="black"
                secureTextEntry={true}
                onChangeText={setPassword}
                value={password}
                autoCapitalize='none'
            />
            <TouchableOpacity style={styles.button} onPress={loginRequest} color="#fff">
                <Text>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowRegister(false)} color="#fff">
                <Text style={styles.bottomtitle} > No account yet? Register here</Text>
            </TouchableOpacity>

        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEF9A7',
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
        backgroundColor: "#FAC213"
        
    },
    button: {
        marginTop: 40,
        height: 50,
        width: 300,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F77E21",
        color: "#fff",
        padding: 10,
        borderRadius: 10,
    },
    image: {
        width: 250, 
        height: 200,
        
    },
    title: {
        fontSize:30,
        fontWeight: 'bold',
        color: "#465881"

    },
    bottomtitle: {
        padding: 10
    }
});

export default Login