import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux'
import { selectUser } from '../../features/userSlice'
//import { useNavigation } from '@react-navigation/native';
import { API_URL } from "@env"
import { useDispatch } from "react-redux";

const CompanyProfileSettings = () => { // <- This is the component that is rendered when the user navigates to the settings screen
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const userData = useSelector(selectUser)

  const handleSaveChanges = () => {  // <- This is the function that is called when the user presses the button, it sends a request to the backend to update the user's details

    var details = {  // <- This is the object that is sent to the backend
      username: username,
      password: password,
      IDcompany: userData.user.IDcompany,
    };

    var formBody = []; // <- This is the form body that is sent to the backend

    for (var property in details) { 
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }

    formBody = formBody.join("&"); // <- This is the form body that is sent to the backend

    const config = { // <- This is the config object that is sent to the backend
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    axios.put(API_URL + 'settings/update/company/', formBody, config) // <- This is the axios request that is sent to the backend
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>New Username</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <Text style={styles.label}>New Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity onPress={handleSaveChanges}>
        <Text style={styles.button}>Save Changes</Text>
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
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    width: '100%',
    textAlign: 'center',
  }
});

export default CompanyProfileSettings;