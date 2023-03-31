import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { API_URL } from '@env'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../features/userSlice'
import Ionic from 'react-native-vector-icons/Ionicons'


// trash-outline

const PenginRequestBox = ({ data }) => {
    const [confirm, setConfirm] = useState(false)

    const userData = useSelector(selectUser)

    const confirmRequest = () => {
        var details = {
            friendID: data?.ID
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
                'Authorization': `Basic ${userData?.user.token}`
            },
        };

        axios.post(API_URL + 'friends/acceptfriend', formBody, config)
            .then((response) => {
                if (response.data == true) {
                    setConfirm(true)
                }
            }).catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        console.log(data)
    }, [])


    return (
        <View>
            <View style={styles.container}>

                <Image
                    style={styles.profileImg}
                    source={{
                        uri: data?.picture,
                    }} />
                <View style={styles.texts}>
                    <View style={styles.topRow}>
                        <Text style={styles.userName}>{`${data?.fname} ${data?.lname}`}</Text>
                    </View>
                </View>
                <View style={styles.status}>
                    {confirm ?
                        <Text style={{ color: "gray", fontSize: 17 }}>Confirmed...</Text>
                        : <TouchableOpacity onPress={confirmRequest} >
                            <Text style={{ color: "orange", fontSize: 17 }}>Confirm</Text>
                        </TouchableOpacity>
                    }
                </View>
            </View>
            <View style={styles.line} />
        </View >
    )
}

const ActionContent = () => {
    return (
        <View>
            <Text>
                Delete
            </Text>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        alignSelf: 'stretch',
        alignItems: "center",
        height: 70,
    },
    profileImg: {
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
    },
    userName: {
        fontSize: 20
    },
    texts: {
        paddingLeft: 10,
        flex: 1,
    },
    line: {
        height: 1,
        backgroundColor: 'gray',
        width: "95%",
        borderRadius: 10,
        alignSelf: "center"
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingRight: 10,
        alignItems: "center"
    },
    status: {
        marginRight: 10,
        flexDirection: "row",
        gap: 10
    },

});

export default PenginRequestBox