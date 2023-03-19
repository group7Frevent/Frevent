import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import ChatBox from './ChatBox';
import io from 'socket.io-client'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../features/userSlice'
import axios from 'axios';

const socket = io.connect("http://192.168.0.100:3002")


const ChatContainer = () => {

    // Init all variables
    const [converstions, setConverstions] = useState([])

    const [receivedMsg, setReceivedMsg] = useState("")

    const userData = useSelector(selectUser)
    socket.emit('storeClientInfo', { customId: userData.user.ID });


    useState(() => {

        // Get all conversations......
        axios.get("http://192.168.0.100:3000/messages/friends/" + userData.user.ID).then((response) => {
            response.data.sort((a, b) => {
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.


                // If date is "Undefined" convert it to null
                if (!a.timestamp) {
                    a.timestamp = new Date(null)
                    console.log(a.timestamp)
                }
                return new Date(b.timestamp) - new Date(a.timestamp);

            }
            )
            //console.log(response.data)
            setConverstions(response.data)
        })
    }, [])


    /*
    useEffect(() => {

        socket.on("getMSG", (data) => {
            console.log("deviceID :" + userData.user.ID + " " + data.sendTo + " " + data.message)
            setReceivedMsg(data.message)
            console.log(data.message)
        })
    }, [socket]) */


    return (
        <View style={styles.container}>
            <SafeAreaView>

                {converstions.map((data, index) => {
                    return (
                        <TouchableOpacity key={index}>
                            <ChatBox data={data} />
                        </TouchableOpacity>
                    )
                })}
                <Text>This id: {userData.user.ID}</Text>
                <Text>{receivedMsg}</Text>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40
    }
});




export default ChatContainer