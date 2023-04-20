
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity, Image, SafeAreaView, Alert, ScrollView } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from '../../features/userSlice';

import * as  ImagePicker from 'expo-image-picker'
import { firebase } from '../../config'
import { API_URL } from '@env'



import AsyncStorage from '@react-native-async-storage/async-storage'; // <- This is the library that is used to store data locally


const Signup = ({ route, navigation }) => { // <- This is the component that is rendered when the user navigates to the signup screen
    const [userName, setUserName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [birthDay, setBirthday] = useState('');
    const [picture, setPicture] = useState('');

    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => { // <- This is the effect hook
        image && uploadImage()

    }, [image])


    const pickImage = async () => { // <- This is the function that is called when the user presses the button, it opens the image picker
        // No permission request is neccessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,

        });


        const source = { uri: result.assets[0].uri }; // <- This is the image that is selected by the user, it is stored in the state
        console.log(source);
        setImage(source);

    };
    const uploadImage = async () => { // <- This is the function that is called when the user presses the button, it uploads the image to the firebase storage
        setUploading(true);
        const response = await fetch(image.uri)
        const blob = await response.blob();
        const filename = image.uri.substring(image.uri.lastIndexOf('/') + 1);
        const ref = firebase.storage().ref().child(filename);
        ref.put(blob).then(() => {
            ref.getDownloadURL().then((url) => {
                setPicture(url); // <- This is the download URL of the image
                setUploading(false);
            }).catch((error) => {
                console.log(error);
                setUploading(false);
            });
        }).catch((error) => {
            console.log(error);
            setUploading(false);
        });
    };








    const dispatch = useDispatch(); // <- This is the dispatch function that is used to dispatch actions to the redux store



    const handleSignup = () => { // <- This is the function that is called when the user presses the signup button

        var details = {
            username: userName,
            password: password,
            fname: firstName,
            lname: lastName,
            email: email,
            birthdate: birthDay,
            picture: picture,
            accountType: "user"
        };

        var formBody = []; // <- This is the form body that is sent to the backend
 
        for (var property in details) { // <- This is the loop that is used to create the form body
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }

        formBody = formBody.join("&"); // <- This is the form body that is sent to the backend

        const config = { // <- This is the configuration of the request
            headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
            },
        };

        const requestUrl = API_URL + 'auth/register/user' // <- This is the url of the backend


        axios.post(requestUrl, formBody, config).then((response) => { // <- This is the axios request that is sent to the backend
            // Login succeed
            //console.log(response.data)
            // Tallennetaan tiedot reduxiin
            AsyncStorage.setItem("userData", JSON.stringify(response?.data[0]));
            dispatch(addUser(response.data[0]))
        }).catch((error) => {
            console.log(error)
        })

    };
    // styles for the component start here after the return statement
    return (

        <View style={styles.container}>

            <Text style={styles.title}>Create an account</Text>

            <TextInput
                style={styles.input}
                placeholder="UserName"
                underlineColorAndroid={'transparent'}
                placeholderTextColor="#465881"
                onChangeText={setUserName}
                value={userName}
                autoCapitalize="none"
                maxLength={20}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                underlineColorAndroid={'transparent'}
                placeholderTextColor="#465881"
                secureTextEntry={true}
                onChangeText={setPassword}
                value={password}
                autoCapitalize="none"
                maxLength={15}
            />
            <TextInput
                style={styles.input}
                placeholder="First Name"
                underlineColorAndroid={'transparent'}
                placeholderTextColor="#465881"
                onChangeText={setFirstName}
                value={firstName}
                autoCapitalize="none"
                maxLength={30}
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                underlineColorAndroid={'transparent'}
                placeholderTextColor="#465881"
                onChangeText={setLastName}
                value={lastName}
                autoCapitalize="none"
                maxLength={50}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                type={'email'}
                underlineColorAndroid={'transparent'}
                placeholderTextColor="#465881"
                onChangeText={setEmail}
                value={email}
                autoCapitalize="none"
            />

            <TextInputMask
                style={styles.input}
                underlineColorAndroid={'transparent'}
                type={'datetime'}
                options={{
                    format: 'YYYY.MM.DD'
                }}
                placeholder="Date of Birth"
                placeholderTextColor="#465881"
                onChangeText={setBirthday}
                value={birthDay}
                autoCapitalize="none"
            />

            <TouchableOpacity style={styles.selectButton} onPress={pickImage} >
                <Text style={styles.uploadText}> Select profile picture</Text>
            </TouchableOpacity>

            <View style={styles.imageContainer}>
                {image ? <Text style={styles.uploadedText}>Image uploaded</Text> : null}

            </View>


            <TouchableOpacity style={styles.button} onPress={handleSignup} color="#fff">
                <Text style={styles.buttonText}>Sign up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()} color="#fff">
                <Text style={styles.bottomtitle}>Already have an account? Log in</Text>
            </TouchableOpacity>


        </View>

    );

};



const styles = StyleSheet.create({
    container: {
        alignSelf: 'stretch',
        flex: 1,
        paddingLeft: 60,
        paddingRight: 60,
        backgroundColor: '#FEF9A7',
        justifyContent: 'center',
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
    title: {
        marginBottom: 30,
        fontSize: 24,
        paddingBottom: 10,
        borderBottomColor: '#465881',
        borderBottomWidth: 1,
        color: '#465881',
    },
    logo: {
        width: 250, // set the width of the logo to 100 pixels
        height: 200, // set the height of the logo to 100 pixels
        marginBottom: -10, // add some margin at the bottom to separate the logo from the form
    },
    bottomtitle: {
        padding: 10
    },
    selectButton: {
        marginLeft: 25,
        marginBottom: 20,
        borderRadius: 5,
        width: 200,
        height: 25,
        backgroundColor: '#465881',
        alignSelf: 'stretch',
        alignItems: 'center',
    },
    uploadText: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold'
    },
    uploadedText: {
        color: '#465881',
        fontSize: 17,
        marginRight: 25,
    },

    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    imageContainer: {
        marginTop: 0,
        marginBottom: 0,
        alignItems: 'center',
    },
    bottomtitle: {
        padding: 10,
        marginLeft: 20,
        fontSize: 15,
    }

});

export default Signup;