import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const ChatBubbleRight = ({ text, timestamp }) => {
    return (
        <View style={{
            backgroundColor: "#f77f1b",
            padding: 10,
            marginLeft: '45%',
            borderRadius: 5,
            //marginBottom: 15,
            marginTop: 5,
            marginRight: "5%",
            maxWidth: '50%',
            alignSelf: 'flex-end',
            //maxWidth: 500,

            borderRadius: 20,
        }} >


            <Text style={{ fontSize: 16, color: "#fff", }} >{text}</Text>
            <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 10, color: "#fff", }} >{timestamp && timeSince(new Date(timestamp))}</Text>
            </View>
            <View style={styles.rightArrow}></View>

            <View style={styles.rightArrowOverlap}></View>



        </View>
    )
}
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


const styles = StyleSheet.create({
    rightArrow: {
        position: "absolute",
        backgroundColor: "#f77f1b",
        //backgroundColor:"red",
        width: 20,
        height: 25,
        bottom: 0,
        borderBottomLeftRadius: 25,
        right: -10
    },

    rightArrowOverlap: {
        position: "absolute",
        backgroundColor: "#eeeeee",
        //backgroundColor:"green",
        width: 20,
        height: 35,
        bottom: -6,
        borderBottomLeftRadius: 18,
        right: -20

    },

    /*Arrow head for recevied messages*/
    leftArrow: {
        position: "absolute",
        backgroundColor: "#dedede",
        //backgroundColor:"red",
        width: 20,
        height: 25,
        bottom: 0,
        borderBottomRightRadius: 25,
        left: -10
    },

    leftArrowOverlap: {
        position: "absolute",
        backgroundColor: "#eeeeee",
        //backgroundColor:"green",
        width: 20,
        height: 35,
        bottom: -6,
        borderBottomRightRadius: 18,
        left: -20

    },
})


export default ChatBubbleRight