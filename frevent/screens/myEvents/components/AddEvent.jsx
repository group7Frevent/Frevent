import { View, Text, Dimensions, StyleSheet, Button, TouchableOpacity, ScrollView, Modal, Image } from 'react-native'
import React, { useState } from 'react'
import GoogleLocation from './GoogleLocation'
import { TextInput } from 'react-native';
import DatePicker from 'react-native-modern-datepicker'
import { getToday, getFormatedDate } from 'react-native-modern-datepicker'
import { useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../features/userSlice';
import { API_URL } from '@env'


const AddEvent = ({ navigation, route }) => {

    // Add event modal

    // Userdata
    const userData = useSelector(selectUser)

    // Date
    const today = new Date();

    const startDate = getFormatedDate(today.setDate(today.getDate()), "YYYY/MM/DD  HH:MM");

    const [location, setLocation] = useState(null);
    const [eventName, setEventName] = useState("");
    const [description, setDescription] = useState("");


    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(startDate);
    const [choosedPeople, setChoosedPeople] = useState([]);
    const [myFriends, setMyFriends] = useState([]);
    const [howManyChecked, setHowManyChecked] = useState(0);


    // Navigation to choose people screen
    const navigateToChoosePeople = () => {
        if (choosedPeople.length > 0) {
            navigation.navigate("Choose people", { data: choosedPeople })
        } else {
            navigation.navigate("Choose people", { data: myFriends })
        }
    }

    /////////////////////////////

    // Get available friends and send them to choose people screen
    const getAvailableFriends = async () => {

        const config = {
            headers: {
                'Authorization': `Basic ${userData?.user.token}`,
            },
        };

        axios.get(API_URL + "friends/myFriends", config).then((response) => {
            setMyFriends(response.data)
        })
    }

    useEffect(() => {
        getAvailableFriends()
    }, [])

    /////////////////////////////

    // Get data from choose people screen
    useEffect(() => {
        if (route.params?.data) {
            //console.log(route.params.data)
            setHowManyChecked(route.params?.howManyChecked)
            setChoosedPeople(route.params.data)
        }
    }, [route.params?.howManyChecked])


    // Submit event
    const submit = async () => {
        //console.log(location.place_id)

        const invites = choosedPeople.filter((item) => item.checked == true).map((item) => item.ID)

        // Check if user is company or customer
        if (userData.user.IDcompany) {
            var details = {
                eventName: eventName,
                eventDate: date,
                eventDescription: description,
                eventLocation: location.description,
                eventType: "com",
            };
        } else {
            var details = {
                eventName: eventName,
                eventDate: date,
                eventDescription: description,
                eventLocation: location.description,
                eventType: "cus",
                invites: JSON.stringify(invites)
            };
        }



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

        if (userData.user.IDcompany) {
            axios.post(API_URL + 'events/postCompanyEvent', formBody, config).then((response) => {
                if (response.data?.affectedRows > 0) {
                    navigation.navigate("My Events")
                }

            }).catch((error) => {
                console.log(error.data)
            })
        } else {
            axios.post(API_URL + 'events/postUserEvent', formBody, config).then((response) => {
                if (response.data?.affectedRows > 0) {
                    navigation.goBack()
                }

            }).catch((error) => {
                console.log(error)
            })
        }

    }

    return (
        <View style={styles.container}>
            <ScrollView
                keyboardShouldPersistTaps='always'>
                <Text style={styles.texts}>Location</Text>
                <GoogleLocation setLocation={setLocation} width={Dimensions.get('window').width - 20} />

                <Text style={styles.texts}>Event name</Text>
                <TextInput style={styles.textInput}
                    placeholder="Event name"
                    maxLength={30}
                    value={eventName}
                    onChangeText={setEventName}
                    placeholderTextColor="#000"
                />

                <Text style={styles.texts}>Description</Text>
                <TextInput style={styles.textInput}
                    placeholder="Event description"
                    maxLength={100}
                    multiline={true}
                    value={description}
                    onChangeText={setDescription}
                    placeholderTextColor="#000"
                />


                <Text style={styles.texts}>Date & Time</Text>
                <TouchableOpacity style={styles.inviteButton} onPress={() => setOpen(!open)}>
                    <Text style={{ marginLeft: 10, fontSize: 15 }}>{date}</Text>
                </TouchableOpacity>
                {!userData.user.IDcompany &&
                    <>
                        <Text style={styles.texts}>Invite people</Text>
                        <TouchableOpacity
                            style={styles.choosePeople}
                            onPress={navigateToChoosePeople}
                        >
                            {howManyChecked > 0 ?
                                choosedPeople.map((item, index) => {
                                    if (item.checked) {
                                        return (

                                            <Image
                                                key={index}
                                                style={styles.profileImg}
                                                source={{
                                                    uri: item?.picture,
                                                }} />

                                        )
                                    }
                                })
                                :
                                <>

                                    <TouchableOpacity
                                        style={styles.choosePeople}
                                        onPress={navigateToChoosePeople}
                                    >
                                        <Text style={styles.texts}>Choose people to invite</Text>
                                    </TouchableOpacity>
                                </>
                            }
                        </TouchableOpacity>
                    </>
                }

                <TouchableOpacity style={styles.submitButton}
                    onPress={() => submit()}
                >
                    <Text style={styles.texts}>Submit</Text>
                </TouchableOpacity>

            </ScrollView>

            <Modal
                visible={open}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>


                        <DatePicker
                            minimumDate={startDate}
                            selected={date}
                            onSelectedChange={date => setDate(date)}
                            options={{ mainColor: "tomato" }}
                        />


                        <TouchableOpacity onPress={() => setOpen(!open)}>
                            <Text >Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </Modal>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        gap: 10,
    },
    textInput: {
        minHeight: 50,
        backgroundColor: 'white',
        borderRadius: 3,
        paddingLeft: 5,
        fontSize: 15,
        fontWeight: 'semibold',

    },
    texts: {
        fontSize: 20,
    },
    inviteButton: {
        borderRadius: 3,
        height: 50,
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingLeft: 5,
    },
    submitButton: {
        backgroundColor: 'white',
        borderRadius: 3,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'tomato',
        marginTop: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        width: "90%",
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    profileImg: {
        width: 40,
        height: 40,
        borderRadius: 40 / 2,
    },
    choosePeople: {
        borderRadius: 3,
        backgroundColor: 'white',
        padding: 10,
        flexDirection: 'row',
        gap: 10,
    }

})

export default AddEvent