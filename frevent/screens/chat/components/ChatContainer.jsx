import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import ChatBox from './ChatBox';
import { useSelector } from 'react-redux'
import { selectUser } from '../../../features/userSlice'
import axios from 'axios';
import { ScrollView } from 'react-native';
import { socket } from '../../../socket';
import { useIsFocused } from "@react-navigation/native";
import { API_URL } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatContainer = ({ navigation }) => {

    const isFocused = useIsFocused();
    // Init all variables
    const [converstions, setConverstions] = useState([])


    const userData = useSelector(selectUser)

    const getConversations = () => {
        axios.get(API_URL + "messages/friends/" + userData.user.ID).then((response) => {

            response.data.sort((a, b) => {
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                // If date is "Undefined" convert it to null
                if (!a.timestamp) {
                    a.timestamp = new Date(null)
                }

                if (!b.timestamp) {
                    b.timestamp = new Date(null)
                }
                return new Date(b.timestamp) - new Date(a.timestamp);

            }
            )
            AsyncStorage.setItem(userData.user.username, JSON.stringify(response?.data));
            setConverstions(response.data)
        })
    }


    const getAsyncData = async () => {


        const conversations = await AsyncStorage.getItem(userData.user.username)
        setConverstions(JSON.parse(conversations))

    }
    const connectToSocket = async () => {
        await socket.emit('storeClientInfo', { customId: userData.user.ID });
    }
    useState(() => {
        connectToSocket()
        getAsyncData()
        // Get all conversations......
        getConversations()
    }, [socket])

    

    useEffect(() => {
        getAsyncData()
        getConversations()
    }, [isFocused])

    const navigateToChat = (data) => {


        const config = {
            headers: {
                Authorization: `Basic ${userData.user.token}`,
            },
        };
        console.log(API_URL)
        axios.put(API_URL + "messages/setSeen/" + data.ID + "/" + userData.user.ID, {}, config)
            .then((response) => {
                response.data.sort((a, b) => {
                    // Turn your strings into dates, and then subtract them
                    // to get a value that is either negative, positive, or zero.

                    // If date is "Undefined" convert it to null
                    if (!a.timestamp) {
                        a.timestamp = new Date(null)
                    }

                    if (!b.timestamp) {
                        b.timestamp = new Date(null)
                    }
                    return new Date(b.timestamp) - new Date(a.timestamp);

                }
                )
                setConverstions(response.data)
            }).catch((e) => {
                console.log(e.response.data)
            })
        //console.log("here" + userData.user.ID + data.ID + userData.user.token)
        navigation.navigate("Conversation", {
            conversationID: data.ID,
            conversationdata: data
        })
    }


    return (
        <View style={styles.container}>
            <ScrollView style={styles.ScrollView}>

                {converstions && converstions.map((data, index) => {
                    return (
                        <TouchableOpacity key={index} onPress={() => {
                            setConverstions([])
                            navigateToChat(data)
                        }}>
                            <ChatBox data={data} unread={data.unread} />
                        </TouchableOpacity>
                    )
                })}

            </ScrollView>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});




export default ChatContainer