import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'

const FriendBox = ({ data }) => {
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
                        <Text style={styles.sender}>{`${data?.fname} ${data?.lname}`}</Text>
                    </View>
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
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingRight: 10,
        alignItems: "center"
    }
});
export default FriendBox