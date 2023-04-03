import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionic from 'react-native-vector-icons/Ionicons'
const CustomHeader = ({ image, fname, lname, navigation: { goBack } }) => {

    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <TouchableOpacity style={{ marginRight: 20, marginLeft: 8 }} onPress={() => goBack()}>
                    <Ionic name="arrow-back-outline" size={28} color={"#f77f1b"} />
                </TouchableOpacity>
                <Image
                    style={styles.profileImg}
                    source={{
                        uri: image,
                    }} />
                <Text style={styles.headerText} >{fname} {lname}</Text>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    profileImg: {
        width: 40,
        height: 40,
        borderRadius: 50 / 2,
        marginRight: 5
    },
    container: {
        flexDirection: 'row',
        alignItems: "flex-end",
        height: 100,
        backgroundColor: "white",
        padding: 5
    },
    headerText: {
        fontSize: 17,
        fontWeight: '500'
    },
    title: {
        flexDirection: 'row',
        alignItems: "center"
    }
})

export default CustomHeader