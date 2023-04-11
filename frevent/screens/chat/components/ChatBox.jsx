import { View, Text, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import CheckBox from 'expo-checkbox';

const ChatBox = ({ data, unread, events, checkbox, setToChecked, checkedIndex }) => {

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
                    <View style={!events ? styles.topRow : styles.textIfEvents}>
                        <Text style={styles.sender}>{data?.fname} {data?.lname}</Text>
                        {unread > 0 &&
                            <View style={styles.numberBox}>
                                <Text>{unread}</Text>
                            </View>
                        }
                    </View>
                    {!events &&
                        <View style={styles.msgAndClock}>
                            <Text>{data?.message ? data?.message : "Start chatting!"}</Text>
                            <Text style={unread > 0 ? { color: "#f77f1b", fontWeight: 700 } : {}}>{date !== "NaN seconds ago" && date}</Text>
                        </View>
                    }
                </View>
                {events &&
                    <View style={styles.checkboxContainer}>
                        <CheckBox
                            style={styles.checkbox} // style for the container
                            value={checkbox} // boolean value
                            onValueChange={() => setToChecked(checkedIndex)}
                            color={checkbox ? 'green' : undefined} // custom color for unchecked state
                        />
                    </View>
                }
            </View>
            <View style={styles.line} />
        </View>
    )
}


// Function that returns date since text
function timeSince(date) {

    function addHours(date, hours) {
        date.setHours(date.getHours() + hours);

        return date;
    }

    const date2 = new Date();

    const newDate = addHours(date2, 2);

    var seconds = Math.floor((newDate - date) / 1000);
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
    textIfEvents: {
        paddingLeft: 10,
        flex: 1,
        justifyContent: "center"
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
    },
    checkbox: {
        alignSelf: 'center',
    },
    checkboxContainer: {
        alignContent: "center",
        justifyContent: "center",

    }
});

export default ChatBox