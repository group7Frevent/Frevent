import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux'
import { selectUser } from '../../features/userSlice'
import { useNavigation } from '@react-navigation/native';


const SettingsScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const userData = useSelector(selectUser)
  const navigation = useNavigation();

  const handleSaveChanges = () => {

    var details = {
      username: username,
      password: password,
      ID: userData.user.ID,
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

    axios.put('http://84.250.31.253:3000/settings/update/user/', formBody, config)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);  
      });
  };

  const handleLogout = () => {
    //väliaikaisesti hakee käyttäjän id:n reduxista
    console.log(userData.user.ID + userData.user.username)
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
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    width: '100%',
    textAlign: 'center',
  },
});

export default SettingsScreen;

