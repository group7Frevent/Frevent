import { View, Text, StyleSheet, KeyboardAvoidingView, Touchable, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import ChatBubbleRight from './ChatBubbleRight';
import ChatBubbleLeft from './ChatBubbleLeft';
import { ScrollView } from 'react-native';
import { socket } from '../../../socket';
import { useSelector } from 'react-redux'
import { selectUser } from '../../../features/userSlice'
import axios from 'axios';
import { TextInput } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements'
import CustomHeader from './CustomHeader';
import { API_URL } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from "moment";

const Conversation = ({ route, navigation }) => {

    // Get conversationID from route params
    const { conversationID, conversationdata } = route.params;
    // Get user data from redux
    const userData = useSelector(selectUser)
    // Init all variables
    const [conv, setConv] = useState([])
    const [msg, setMsg] = useState("")
    const scrollViewRef = useRef();
    const height = useHeaderHeight()


    // Get conversation
    const getConversation = (senderID, toID) => {
        const config = {
            headers: {
                Authorization: `Basic ${userData.user.token}`,
            },
        };

        axios.get(API_URL + "messages/getmsg/" + senderID + "/" + toID, config)
            .then(response => {
                AsyncStorage.setItem(`${userData.user.ID}/${conversationID}`, JSON.stringify(response?.data));
                setConv(response.data)

            })

    }

    // Get conversations from async storage
    const getAsyncData = async () => {
        const conv = await AsyncStorage.getItem(`${userData.user.ID}/${conversationID}`)
        setConv(JSON.parse(conv))

    }

    useEffect(() => {
        getAsyncData()
        getConversation(userData.user.ID, conversationID)
    }, [])


    useEffect(() => {
        // Listen for new messages
        socket.on("getMSG", (data) => {
            //setConv(data)
            getConversation(userData.user.ID, conversationID)
            //setTestIfThisWorks(data.message)
        })
    }, [socket])


    // Send message
    const sendMsg = () => {

        function addHours(date, hours) {
            date.setHours(date.getHours() + hours);

            return date;
        }
        const date = new Date();

        const newDate = addHours(date, 3);


        const data = {
            message: msg,
            timestamp: newDate,
            toID: conversationID,
            senderID: userData.user.ID
        }

        // Send message to server
        socket.emit("send_message", data)
        setConv([...conv, data])
        setMsg("")
    }

    // Render
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container}>
                <CustomHeader navigation={navigation} image={conversationdata?.picture} fname={conversationdata?.fname} lname={conversationdata?.lname} />
                <KeyboardAvoidingView
                    style={styles.keybAvoidcontainer}
                    behavior={Platform.OS === "ios" ? "padding" : ""}
                    keyboardVerticalOffset={height}
                >

                    <ScrollView style={styles.bubblesContainer}
                        ref={scrollViewRef}
                        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                    >


                        {conv && conv.map((data, index) => {
                            if (data.senderID === userData.user.ID) {
                                return (
                                    <ChatBubbleRight text={data.message} timestamp={data.timestamp} key={index} />
                                )
                            } else {
                                return (
                                    <ChatBubbleLeft text={data.message} timestamp={data.timestamp} key={index} />
                                )
                            }
                        })}


                    </ScrollView>
                    <View style={styles.textInputContainer}>
                        <TextInput
                            style={styles.textInput}
                            value={msg}
                            onChangeText={setMsg}
                            placeholder="Write a message..."
                        />
                        <TouchableOpacity onPress={sendMsg}>
                            <Text style={styles.sendBtn}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>



            </View>
        </View>
    )
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: "blue",
    },
    bubblesContainer: {
        flex: 1,

        marginBottom: 5
        //flexDirection: 'column-reverse'
    },
    keybAvoidcontainer: {
        flex: 1,
    },
    textInput: {
        fontSize: 16,
        paddingLeft: 20,
        padding: 10,
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#CBCBCB",
        borderColor: "#ACACAC",
        borderWidth: 1,
        borderRadius: 50 / 3,
    },
    textInputContainer: {
        height: 50,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        padding: 5,
        gap: 10,

    },
    sendBtn: {
        color: "blue",
        fontSize: 17,
        marginRight: 5
    }
});
export default Conversation