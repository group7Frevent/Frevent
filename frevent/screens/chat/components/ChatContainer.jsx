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

const ChatContainer = ({ navigation }) => {

    const isFocused = useIsFocused();
    // Init all variables
    const [converstions, setConverstions] = useState([])

    const [receivedMsg, setReceivedMsg] = useState("")

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
            setConverstions(response.data)
        })
    }


    useState(() => {
        socket.emit('storeClientInfo', { customId: userData.user.ID });


        // Get all conversations......
        getConversations()
    }, [socket])



    useEffect(() => {
        getConversations()
    }, [isFocused])

    const navigateToChat = (data) => {


        const config = {
            headers: {
                Authorization: `Basic ${userData.user.token}`,
            },
        };
        console.log(userData.user.token)
        axios.put(API_URL + "messages/setSeen/" + userData.user.ID + "/" + data.ID, {}, config)
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
            })

        navigation.navigate("Chat", {
            conversationID: data.ID,
            conversationdata: data
        })
    }


    return (
        <View style={styles.container}>
            <ScrollView style={styles.ScrollView}>

                {converstions.map((data, index) => {
                    return (
                        <TouchableOpacity key={index} onPress={() => navigateToChat(data)}>
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