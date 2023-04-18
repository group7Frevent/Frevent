import { View, Text, StyleSheet, Animated, Image, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import Ionic from 'react-native-vector-icons/Ionicons'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../features/userSlice'
import { API_URL } from '@env'
import axios from 'axios'
import createOpenLink from 'react-native-open-maps';
import dayjs from "dayjs";
import { useIsFocused } from '@react-navigation/native'
import Spinner from 'react-native-loading-spinner-overlay'

const AddEventshome = ({ route, navigation }) => {

    const [eventData, setEventData] = useState([])
    const userData = useSelector(selectUser)
    const isFocused = useIsFocused();
    const [spinner, setSpinner] = useState(false)
    ////////////////////////////////////////////////////////

    const getEvents = async () => {
        const config = {
            headers: {
                'Authorization': `Basic ${userData?.user.token}`,
            }
        }

        axios.get(API_URL + "events/myevents", config).then((response) => {
            setEventData(response.data)
            setSpinner(false)
        }).catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        setSpinner(true)
        getEvents()
    }, [isFocused])



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

    const deleteEvent = async (eventID) => {
        const config = {
            headers: {
                'Authorization': `Basic ${userData?.user.token}`,
            }
        }

        Alert.alert('Are you sure?', 'Are you sure you want to delete this event?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'OK', onPress: () => {

                    axios.delete(API_URL + "events/deleteEvent/" + eventID, config).then((response) => {
                        console.log(response.data)
                        if (response.data == "Event deleted") {
                            getEvents()
                        }
                    }).catch((error) => {
                        console.log(error.response.data)
                    })
                }
            },
        ]);

    }

    return (
        <View>
            <Spinner
                visible={spinner}
                textContent={'Loading...'}
                textStyle={styles.spinnerTextStyle}
            />
            <TouchableOpacity style={styles.addEvent} onPress={() => navigation.navigate("Add Event")}>
                <Animated.View style={{ transform: [{ rotate }] }}>
                    <Ionic name="add" size={28} color={"white"} />
                </Animated.View>
            </TouchableOpacity>
            <ScrollView>

                {eventData.map((data, index) => {
                    console.log(data)
                    return (
                        <View key={index} style={styles.event}>
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ flex: 1 }}>

                                    <View style={styles.upperPart}>
                                        <View style={{ flex: 1, }}>
                                            <Text style={styles.title}>{data.eventname}</Text>
                                            <Text style={styles.description}>{data?.description}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.lowerPart}>
                                        <View>
                                            <Text style={styles.startTime}>{dayjs(data.date).format("D MMM YYYY, H:mm")}, </Text>
                                            <TouchableOpacity onPress={() => createOpenLink({ query: data.location, provider: "google" })}>
                                                <Text>{data.location} <Ionic name={'locate'} size={15} color={'black'} /></Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => navigation.navigate("Show participants", { eventID: data.IDUserEvents })}>
                                                <Text style={styles.attendees}>{data.attendees} attending</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.buttonContainer}>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.creatorContainer}>
                                    <TouchableOpacity onPress={() => deleteEvent(data.IDUserEvents)}>
                                        <Ionic name="trash" size={28} color={"red"} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>)

                })}
            </ScrollView>
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
        zIndex: 1,
        elevation: 7,

    },
    container: {
        flex: 1,
        backgroundColor: '#FEF9A7',
        alignItems: 'center',
        justifyContent: 'center',

    },
    event: {
        marginTop: 20,
        borderRadius: 10,
        marginRight: 15,
        marginLeft: 15,
        padding: 10,
        backgroundColor: "#FAC213",
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "#D61C4E",

    },
    description: {
        fontSize: 13,
        color: "black",
        fontWeight: '500'

    },
    startTime: {
        fontSize: 13,
        color: "black",
        marginTop: 3,

    },
    lowerPart: {
        flexDirection: "row",
        //backgroundColor: 'red',
        paddingTop: 5,

    },
    upperPart: {
        flexDirection: "row",
        //backgroundColor: 'yellow',

    },
    creatorContainer: {
        justifyContent: 'center',
        maxWidth: '30%',
        paddingLeft: 5,
        alignItems: 'center',
    },

    buttonContainer: {
        // backgroundColor: 'blue',
        flexDirection: 'column-reverse',
        paddingBottom: 5,
        paddingLeft: 5,
        width: '33%',
    },

    attendees: {
        fontSize: 13,
        color: "#D61C4E",
        marginTop: 5,
    },

    bottomtitle: {
        padding: 10
    },
    scrollView: {
        flex: 1,
        alignSelf: 'stretch',
    },
    header: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    btnNormal: {
        alignItems: "center",
        backgroundColor: "#F77E21",
        color: "#fff",
        padding: 8,
        paddingRight: 10,
        paddingLeft: 10,
        marginTop: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#D61C4E",
        activeOpacity: 1,
    },

    btnPressed: {
        alignItems: "center",
        backgroundColor: '#15bf34',
        color: "#fff",
        padding: 8,
        paddingRight: 10,
        paddingLeft: 10,
        marginTop: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "green",
        activeOpacity: 1,
    },

    creatorPic: {
        width: 30,
        height: 30,
        borderRadius: 20,
    },

})
export default AddEventshome