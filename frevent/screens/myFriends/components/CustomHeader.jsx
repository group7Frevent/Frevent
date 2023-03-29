import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import Ionic from 'react-native-vector-icons/Ionicons'
import SvgUri from 'react-native-svg-uri';
import img from './assets/addFriend.png'
import { TouchableOpacity } from 'react-native';

const CustomHeader = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>My Friends</Text>
            <TouchableOpacity onPress={() => navigation.navigate("fiendFriends")}>
                <Image
                    style={styles.profileImg}
                    source={img} />
            </TouchableOpacity>
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
    }
})
export default CustomHeader