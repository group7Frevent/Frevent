import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from '@env'
import * as  ImagePicker from 'expo-image-picker'
import { firebase } from '../../config'
import { addUser } from '../../features/userSlice';


const CompanySignup = ({ route, navigation }) => {      // registration for companies
    const [userName, setUserName] = useState('');     
    const [password, setPassword] = useState('');   
    const [email, setEmail] = useState('');               
    const [companyName, setCompanyName] = useState("");
    const [picture, setPicture] = useState('');
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => { // <- This is the effect hook
        image && uploadImage()

    }, [image])


    const pickImage = async () => { // <- This is the function that is called when the user presses the button, it launches the image library
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
    const uploadImage = async () => {  // <- This is the function that is called when the user presses the button, it uploads the image to the firebase storage
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



    const dispatch = useDispatch(); // <- This is the dispatch function that is used to dispatch actions to the store

    const handleSignup = () => { // <- This is the function that is called when the user presses the button, it sends the registration request to the backend
        // Rekisteröinnin logiikka tähän
        var details = {   // <- This is the object that is sent to the backend
            username: userName,
            password: password,
            email: email,
            picture: picture,
            companyname: companyName,
        };

        var formBody = []; // <- This is the form body that is sent to the backend

        for (var property in details) { // <- This is the loop that is used to create the form body
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }

        formBody = formBody.join("&"); // <- This is the form body that is sent to the backend

        const config = { // <- This is the configuration object that is sent to the backend
            headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
            },
        };

        const requestUrl = API_URL + 'auth/register/company' // <- This is the URL of the backend


        axios.post(requestUrl, formBody, config).then((response) => { // <- This is the axios request that is sent to the backend
            // Login succeed
            console.log(response.data)
            // Tallennetaan tiedot reduxiin
            dispatch(addUser(response.data))
        }).catch((error) => {
            console.log(error)
        })

    };

    return (

        // This is the view that is rendered
        <View style={styles.container}>  
            <Text style={styles.title}>Create an account</Text>

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
                type="email"
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
            <TouchableOpacity style={styles.selectButton} onPress={pickImage} >
                <Text style={styles.uploadText}> Select profile picture</Text>
            </TouchableOpacity>

            <View style={styles.imageContainer}>
                {image ? <Text style={styles.uploadedText}>Image uploaded</Text> : null}

            </View>

            <TouchableOpacity style={styles.button} onPress={handleSignup} color="#fff">
                <Text style={styles.buttontextsign}>Sign up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()}
                color="#fff">
                <Text style={styles.bottomtitle}>Already have an account? Log in</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignSelf: 'stretch',
        flex: 1,
        paddingTop: 40,
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
        padding: 10,
        fontWeight: "bold"
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
    buttontextsign: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    }
});

export default CompanySignup;