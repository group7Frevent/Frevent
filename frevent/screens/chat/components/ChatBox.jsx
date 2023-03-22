import { View, Text, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'

const ChatBox = ({ data, unread }) => {

    // Init date var
    const [date, setDate] = useState(Date)

    // Convert date to since text 
    useEffect(() => {
        setDate(timeSince(new Date(data.timestamp)))
    })
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
                        <Text style={styles.sender}>{data?.username}</Text>
                        {unread > 0 &&
                            <View style={styles.numberBox}>
                                <Text>{unread}</Text>
                            </View>
                        }
                    </View>
                    <View style={styles.msgAndClock}>
                        <Text>{data?.message ? data?.message : "Start chatting!"}</Text>
                        <Text style={unread > 0 ? { color: "#f77f1b", fontWeight: 700 } : {}}>{date !== "NaN seconds ago" && date}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.line} />
        </View>
    )
}


// Function that returns date since text
function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 50) {
        return "NaN seconds ago";
    }

    if (interval > 1) {
        return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
}

// Styles
const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        alignSelf: 'stretch',
        padding: 5
    },
    profileImg: {
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
    },
    msgAndClock: {
        flexDirection: "row",
        flex: 1,
        justifyContent: "space-between",
        paddingRight: 10
    },
    sender: {
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
    numberBox: {
        backgroundColor: "#f77f1b",
        height: 20,
        width: 20,
        borderRadius: 20 / 2,
        justifyContent: "center",
        alignItems: "center"
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingRight: 10,
        alignItems: "center"
    }
});

export default ChatBox