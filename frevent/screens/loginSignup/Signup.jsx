import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity, Image, SafeAreaView, Alert, ScrollView } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from '../../features/userSlice';
import * as  ImagePicker from 'expo-image-picker'
import { firebase } from '../../config'


const Signup = ({ setShowLogin, setLogged }) => {
    
    const [userName, setUserName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [birthDay, setBirthday] = useState('');
    const [picture, setPicture] = useState('');
    
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    

        const pickImage = async () => {
            // No permission request is neccessary for launching the image library
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
                
            });
            

            const source = { uri: result.assets[0].uri };
            console.log(source);
            setImage(source);
        
        };
        const uploadImage = async () => {
            setUploading(true);
            const response = await fetch(image.uri)
            const blob = await response.blob();
            const filename = image.uri.substring(image.uri.lastIndexOf('/') + 1);
            var ref = firebase.storage().ref().child(filename).put(blob)
            const url= await ref.getDownloadURL().catch((error)=>console.log(error))
            console.log(ref)
            try {
                await ref;

                console.log(url);
            } catch (e) {
                console.log(e);
            }
            setUploading(false);
            Alert.alert(
                'Photo uploaded!'
            );
            setImage(null);
        };
    
        
    
    




    // Valmistelee redux
    const dispatch = useDispatch();



    const handleSignup = () => {
        // Rekisteröinnin logiikka tähän
        console.log("here")
        var details = {
            username: userName,
            password: password,
            fname: firstName,
            lname: lastName,
            email: email,
            birthdate: birthDay,
            picture: "jepjep",
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

        const requestUrl = 'https://restapi-dot-frevent.ew.r.appspot.com/auth/register/user'


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

        <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
        
            <Text style={styles.title}>Create an account</Text>
            <Image
                source={require('../../assets/regLogo.png')}
                style={styles.logo}
            />
            <TextInput
                style={styles.input}
                placeholder="UserName"
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
                placeholder="First Name"
                placeholderTextColor="#465881"
                onChangeText={setFirstName}
                value={firstName}
                autoCapitalize="none"
                maxLength={30}
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                placeholderTextColor="#465881"
                onChangeText={setLastName}
                value={lastName}
                autoCapitalize="none"
                maxLength={50}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#465881"
                onChangeText={setEmail}
                value={email}
                autoCapitalize="none"
            />

            <TextInputMask
                style={styles.input}
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
            
            <TouchableOpacity style={styles.selectButton} onPress={pickImage}>
                <Text>Select Image</Text>
            </TouchableOpacity>

            <View style={styles.imageContainer}>
            {image && <Image source={{ uri: image.uri }} style={{ width: 200, height: 200 }} />}
        
            </View> 
            

            <TouchableOpacity style={styles.button} onPress={ uploadImage} color="#fff">
                <Text style={styles.buttonText}>Sign up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowLogin(true)} color="#fff">
                <Text style={styles.bottomtitle}>Already have an account? Log in</Text>
            </TouchableOpacity>
        
        </View>
        </ScrollView>
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
        color: 'white',
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
        padding: 10
    },
    selectButton: {
        borderRadius:5,
        width:150,
        height: 40,
        backgroundColor:'blue',
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadButton: {
        borderRadius: 5,
        width:150,
        height: 40,
        backgroundColor:'red',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight:'bold'
    },
    imageContainer: {
        marginTop:30,
        marginBottom:50,
        alignItems: 'center',
    }
    
});

export default Signup;