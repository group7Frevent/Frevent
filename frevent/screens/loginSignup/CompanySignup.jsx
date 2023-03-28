import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from '@env'


const CompanySignup = ({ setShowLogin, setShowCompanySignup }) => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [companyName, setCompanyName] = useState("");
    const [picture, setPicture] = useState('');

    const dispatch = useDispatch();

    const handleSignup = () => {
        // Rekisteröinnin logiikka tähän
        var details = {
            username: userName,
            password: password,
            email: email,
            picture: "jepjep",
            companyname: companyName,
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

        const requestUrl = API_URL + 'auth/register/company'


        axios.post(requestUrl, formBody, config).then((response) => {
            // Login succeed
            console.log(response.data)
            // Tallennetaan tiedot reduxiin
            dispatch(addUser(response.data))
            setLogged(true)
        }).catch((error) => {
            console.log(error)
        })

    };

    return (


        <View style={styles.container}>
            <Text style={styles.title}>Create an account</Text>
            <Image
                source={require('../../assets/regLogo.png')}
                style={styles.logo}
            />
            <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#465881"
                onChangeText={setUserName}
                value={userName}
                autoCapitalize="none"
                maxLength={20}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#465881"
                secureTextEntry={true}
                onChangeText={setPassword}
                value={password}
                autoCapitalize="none"
                maxLength={15}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#465881"
                onChangeText={setEmail}
                value={email}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Company name"
                placeholderTextColor="#465881"
                onChangeText={setCompanyName}
                value={companyName}
                autoCapitalize="none"
                maxLength={20}
            />
            <TouchableOpacity style={styles.button} onPress={handleSignup} color="#fff">
                <Text>Sign up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                setShowCompanySignup(false)
                setShowLogin(true)
            }}
                color="#fff">
                <Text style={styles.bottomtitle}>Already have an account? Log in</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEF9A7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        marginTop: 10,
        height: 50,
        width: 300,
        borderRadius: 15,
        margin: 1,
        paddingLeft: 10,
        color: 'black',
        backgroundColor: '#FAC213',

    },
    button: {
        marginTop: 40,
        height: 50,
        width: 300,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F77E21',
        color: '#fff',
        padding: 10,
        borderRadius: 10,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#465881',
    },
    logo: {
        width: 250, // set the width of the logo to 100 pixels
        height: 200, // set the height of the logo to 100 pixels
        marginBottom: -10, // add some margin at the bottom to separate the logo from the form
    },
    bottomtitle: {
        padding: 10,
        fontWeight: "bold"
    }
});

export default CompanySignup;