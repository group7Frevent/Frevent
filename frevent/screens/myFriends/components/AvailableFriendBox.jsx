import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../features/userSlice';


const AvailableFriendBox = ({ data }) => {

    const userData = useSelector(selectUser)
    const [status, setStatus] = React.useState(data?.status)

    const addFriend = () => {
        var details = {
            friendID: data?.ID,
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
                'Accept': "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
                'Authorization': `Basic ${userData?.user.token}`,
            },
        };
        axios.post(API_URL + 'friends/addfriend/', formBody, config).then(response => {
            console.log(response.data)
            if (response.data == true) {
                console.log("here")
                data.status = "pending"
                setStatus("pending")
            }
        }).catch(error => {
            console.log(error)
        })
    }

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
                    {status == "pending" ?
                        <Text style={{ color: "gray", fontSize: 17 }}>Pending...</Text>
                        : <TouchableOpacity onPress={addFriend}>
                            <Text style={{ color: "orange", fontSize: 17 }}>Add</Text>
                        </TouchableOpacity>
                    }
                </View>
            </View>
            <View style={styles.line} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        alignSelf: 'stretch',
        padding: 5,
        alignItems: "center",
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
        marginRight: 10
    }
});

export default AvailableFriendBox