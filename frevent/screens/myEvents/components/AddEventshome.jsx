import { View, Text, StyleSheet, Animated } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import Ionic from 'react-native-vector-icons/Ionicons'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../features/userSlice'
import { API_URL } from '@env'
import axios from 'axios'


const AddEventshome = ({ route, navigation }) => {

    const [eventData, setEventData] = useState([])
    const userData = useSelector(selectUser)

    const getEvents = async () => {
        const config = {
            headers: {
                'Authorization': `Basic ${userData?.user.token}`,
            }
        }

        axios.get(API_URL + "events/myevents", config).then((response) => {
            console.log(response.data)
            setEventData(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        getEvents()
    }, [])



    //////////////////////////////////////////////////////////
    const spinValue = new Animated.Value(0)
    useEffect(() => {
        Animated.loop(
            Animated.timing(
                spinValue,
                {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true
                }
            )
        ).start()
    })
    const rotate = spinValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: ['-10deg', '10deg', '-10deg']
    })
    //////////////////////////////////////////////////////////


    return (
        <View>
            <TouchableOpacity style={styles.addEvent} onPress={() => navigation.navigate("Add Event")}>
                <Animated.View style={{ transform: [{ rotate }] }}>
                    <Ionic name="add" size={28} color={"white"} />
                </Animated.View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    addEvent: {
        backgroundColor: '#f77f1b',
        height: 50,
        width: 50,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 20,
        top: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 7,

    }
})
export default AddEventshome