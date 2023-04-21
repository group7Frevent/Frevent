import { View, Text, StyleSheet, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionic from 'react-native-vector-icons/Ionicons'
import { TouchableOpacity } from 'react-native';
import axios from 'axios'

import { API_URL } from '@env'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../features/userSlice'
import { useIsFocused } from "@react-navigation/native";


const CustomHeader2 = ({ navigation }) => {

    // This component shows if there is pending friend requests, button to add new friends 

    const isFocused = useIsFocused();

    const [pendingRequests, setPendingRequests] = useState(0)
    const [pendingRequestsArray, setPendingRequestsArray] = useState([])
    // Get user data from redux
    const userData = useSelector(selectUser)

    var config = {
        headers: {
            'Authorization': `Basic ${userData?.user.token}`   // user authorization
        }
    }

    // Get pending friend requests
    const getFriendRequests = async () => {
        axios.get(API_URL + 'friends/getpendingrequests', config)
            .then(response => {
                setPendingRequestsArray(response.data)
                setPendingRequests(response.data.length)
            }).catch(error => {
                console.log(error)
            })
    }


    useEffect(() => {
        getFriendRequests()
    }, [isFocused])

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>My Friends</Text>

            <View style={styles.rightSide}>
                <TouchableOpacity onPress={() => navigation.navigate("pendingrequests", {
                    pending: pendingRequestsArray
                })}>
                    {pendingRequests > 0 &&
                        <View style={styles.numberBox}>
                            <Text>{pendingRequests}</Text>
                        </View>
                    }
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Find friends")}>
                    <Ionic name="person-add" size={24} color={"tomato"} />
                </TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: "flex-end",
        justifyContent: "space-between",
        height: 100,
        backgroundColor: "white",
        padding: 5,
        paddingLeft: 10,
        paddingRight: 15
    },
    headerText: {
        fontSize: 20,
    },
    profileImg: {
        height: 30,
        width: 30
    },
    numberBox: {
        backgroundColor: "tomato",
        height: 25,
        width: 25,
        borderRadius: 25 / 2,
        justifyContent: "center",
        alignItems: "center"
    },
    rightSide: {
        flexDirection: "row",
        gap: 20,
    }
})
export default CustomHeader2