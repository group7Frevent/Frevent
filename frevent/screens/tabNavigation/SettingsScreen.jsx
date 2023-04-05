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

const SettingsScreen = ({ route, navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null)
  const [picture, setPicture] = useState('');
  const userData = useSelector(selectUser)
  //const navigation = useNavigation();
  const [uploading, setUploading] = useState(false);
  const { setLogged } = route.params;

  useEffect(() => {
    image && uploadImage()

  }, [image])

  // Valmistelee redux
  const dispatch = useDispatch();

  //////////////////////////////////////////

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


  const changePicture = (pic) => {
    console.log(pic)
    var details = {
      picture: pic,
    };
    var formBody = [];

    console.log(details)
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
        'Authorization': `Basic ${userData?.user.token}`   // user authorization
      },
    };

    axios.put(API_URL + 'settings/update/userpicture/', formBody, config)
      .then(response => {
        console.log(response.data);
        dispatch(addUser(response.data))
      })
      .catch(error => {
        console.log(error);
      });


  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userData");
    dispatch(addUser({}))
    setLogged(false)
  };


  return (

    <View style={styles.container}>

      <View style={styles.imageContainer}>
        <Image
          style={styles.profileImg}
          source={{
            uri: userData.user.picture,
          }} />
      </View>
      <TouchableOpacity style={styles.selectButton} onPress={pickImage} >
        <Text style={styles.uploadText}> Change profile picture</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>navigation.navigate("profile")}>
        <Text style={styles.button}>Profile settings</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.button}>Logout</Text>
      </TouchableOpacity>


    </View>

  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    width: '100%',
  },
  button: {
    backgroundColor: 'tomato',
    color: 'black',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    width: '100%',
    textAlign: 'center',
    marginTop: 10,
  },
  profileImg: {
    width: 100,
    height: 100,
  }
});

export default SettingsScreen;

