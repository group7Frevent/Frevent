import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux'
import { selectUser } from '../../features/userSlice'
//import { useNavigation } from '@react-navigation/native';
import { API_URL } from "@env"
import { useDispatch } from "react-redux";
import { addUser } from '../../features/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as  ImagePicker from 'expo-image-picker'
import { firebase } from '../../config'
import { Linking, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const SettingsScreen = ({ route, navigation }) => { // <- This is the component that is rendered when the user navigates to the settings screen
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null)
  const [picture, setPicture] = useState('');
  const userData = useSelector(selectUser)
  //const navigation = useNavigation();
  const [uploading, setUploading] = useState(false);

  const goToNotifSettings = () => { // <- This is the function that is called when the user presses the button, it opens the notification settings
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:notifications');
    } else {
      Linking.sendIntent("android.settings.NOTIFICATION_SETTINGS");
    }
  };

  const goToLocSettings = () => { // <- This is the function that is called when the user presses the button, it opens the location settings
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:location');
    } else {
      Linking.sendIntent("android.settings.LOCATION_SOURCE_SETTINGS");
    }
  };
 
  useEffect(() => { // <- This is the effect hook
    image && uploadImage()

  }, [image])

 
  const dispatch = useDispatch(); // <- This is the redux hook that is used to dispatch actions to the redux store

  //////////////////////////////////////////

  const pickImage = async () => { // <- This is the function that is called when the user presses the button, it launches the image library
    // No permission request is neccessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,

    });


    const source = { uri: result.assets[0].uri }; // <- This is the uri of the image that the user selected
    console.log(source);
    setImage(source);

  };
  const uploadImage = async () => { // <- This is the function that is called when the user presses the button, it launches the image library
    setUploading(true);
    const response = await fetch(image.uri)
    const blob = await response.blob();
    const filename = image.uri.substring(image.uri.lastIndexOf('/') + 1);
    const ref = firebase.storage().ref().child(filename);
    ref.put(blob).then(() => {
      ref.getDownloadURL().then((url) => {
        setPicture(url);
        //console.log(url)
        changePicture(url);
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


  const changePicture = (pic) => { // <- This is the function that is called when the user presses the button, it launches the image library, it sends the image to the backend, and updates the redux store
    console.log(pic)
    var details = {
      picture: pic,
    };
    var formBody = [];

    console.log(details) // <- This is the object that is sent to the backend
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }

    formBody = formBody.join("&"); // <- This is the form body that is sent to the backend, it contains the image
 
    const config = { // <- This is the config object that is sent to the backend, it contains the authorization token
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        'Authorization': `Basic ${userData?.user.token}`   // user authorization
      },
    };

    axios.put(API_URL + 'settings/update/userpicture/', formBody, config) // <- This is the axios request that is sent to the backend, it contains the form body and the config object
      .then(response => {
        console.log(response.data);
        dispatch(addUser(response.data))
      })
      .catch(error => {
        console.log(error);
      });


  };

  const handleLogout = async () => { // <- This is the function that is called when the user presses the button, it logs the user out, and clears the redux store
    await AsyncStorage.removeItem("userData"); 
    dispatch(addUser({}))
  };


  useEffect(() => { // <- This is the effect hook, it sets the username state to the username that is stored in the redux store
    setUsername(userData.user.username)
  }, [userData.user.username])

//styles
  return (
    <View style={{ flex: 1 }}> 
      <ScrollView style={{ backgroundColor: '#FEF9A7', flex: 1 }}>
        <View style={{ padding: 10, width: '100%', backgroundColor: '#FAC213', height: 100 }}>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Image
            style={styles.profileImg}
            source={{
              uri: userData.user.picture,
            }} ></Image>
          <Text style={{ fontSize: 25, fontWeight: 'bold', padding: 10 }}>{username}</Text>
        </View>
        <View style={{
          alignSelf: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          backgroundColor: '#FAC213',
          width: '90%',
          padding: 20,
          paddingbottom: 22,
          borderRadius: 10,
          shadowOpacity: 80,
          elevation: 15,
          marginTop: 10,
        }}>
          <Image source={require('../../assets/user.png')}
            style={{ width: 25, height: 25 }}></Image>
          <TouchableOpacity onPress={pickImage} >
            <Text style={styles.button}>Change profile picture</Text>
          </TouchableOpacity>
        </View>

        <View style={{
          alignSelf: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          backgroundColor: '#FAC213',
          width: '90%',
          padding: 20,
          paddingbottom: 22,
          borderRadius: 10,
          shadowOpacity: 100,
          elevation: 15,
          marginTop: 15,
        }}>
          <Image source={require('../../assets/profilesettings.png')}
            style={{ width: 25, height: 25 }}></Image>
          <TouchableOpacity onPress={() => navigation.navigate("profile")}>
            <Text style={styles.button}>Profile settings</Text>
          </TouchableOpacity>
        </View>

        <View style={{
          alignSelf: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          backgroundColor: '#FAC213',
          width: '90%',
          padding: 20,
          paddingbottom: 22,
          borderRadius: 10,
          shadowOpacity: 80,
          elevation: 5,
          marginTop: 15,
        }}>
          <Image source={require('../../assets/notification.png')} 
            style={{ width: 25, height: 25 }}></Image>
          <TouchableOpacity onPress={goToNotifSettings}>
            <Text style={styles.button}>Notification settings</Text>
          </TouchableOpacity>
        </View>

        <View style={{
          alignSelf: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          backgroundColor: '#FAC213',
          width: '90%',
          padding: 20,
          paddingbottom: 22,
          borderRadius: 10,
          shadowOpacity: 80,
          elevation: 15,
          marginTop: 15,

        }}>
          <Image source={require('../../assets/settings.png')}
            style={{ width: 25, height: 25 }}></Image>
          <TouchableOpacity onPress={goToLocSettings}>
            <Text style={styles.button}>Location settings</Text>
          </TouchableOpacity>

        </View>
        <TouchableOpacity onPress={handleLogout}
          style={{
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            backgroundColor: '#fff',
            width: '90%',
            padding: 20,
            paddingbottom: 22,
            borderRadius: 10,
            shadowOpacity: 40,
            elevation: 5,
            marginTop: 20,
            marginBottom: 15,
            backgroundColor: '#000'
          }}
        >
          <Text style={{ fontSize: 15, color: '#fff', fontWeight: 'bold', marginLeft: 10 }}>Logout</Text>

        </TouchableOpacity>



      </ScrollView>
    </View>

  );
};


const styles = StyleSheet.create({
  profileImg: {
    width: 140,
    height: 140,
    borderRadius: 100,
    marginTop: -70,
  },
  button: {
    fontSize: 16,
    color: '#000',
    marginLeft: 10,

  }

});

export default SettingsScreen;

