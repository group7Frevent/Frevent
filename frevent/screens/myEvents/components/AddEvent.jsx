import { View, Text, Dimensions, StyleSheet, Button, TouchableOpacity, ScrollView, Modal } from 'react-native'
import React, { useState } from 'react'
import GoogleLocation from './GoogleLocation'
import { TextInput } from 'react-native';
import DatePicker from 'react-native-modern-datepicker'
import { getToday, getFormatedDate } from 'react-native-modern-datepicker'


const AddEvent = () => {

    const today = new Date();

    const startDate = getFormatedDate(today.setDate(today.getDate()), "YYYY/MM/DD");

    const [location, setLocation] = useState(null);
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(startDate);


    return (
        <View style={styles.container}>
            <ScrollView>

                <Text style={styles.texts}>Event name</Text>
                <TextInput style={styles.textInput}
                    placeholder="Event name"
                />

                <Text style={styles.texts}>Description</Text>
                <TextInput style={styles.textInput}
                    placeholder="Event description"
                />


                <Text style={styles.texts}>Date & Time</Text>
                <TouchableOpacity style={styles.inviteButton} onPress={() => setOpen(!open)}>
                    <Text style={{ marginLeft: 10, fontSize: 15 }}>{date}</Text>
                </TouchableOpacity>

                <Text style={styles.texts}>Invite people</Text>
                <TouchableOpacity style={styles.inviteButton}>
                    <Text style={styles.texts}>Choose people to invite</Text>

                </TouchableOpacity>
                <Text style={styles.texts}>Location</Text>
                <GoogleLocation setLocation={setLocation} width={Dimensions.get('window').width - 20} />
                <TouchableOpacity style={styles.submitButton}>
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
        backgroundColor: '#FEF9A7',
        gap: 10,
    },
    textInput: {
        height: 50,
        backgroundColor: '#FAC213',
        borderRadius: 3,
        paddingLeft: 5,
    },
    texts: {
        fontSize: 20,
    },
    inviteButton: {
        borderRadius: 3,
        height: 50,
        justifyContent: 'center',
        backgroundColor: '#FAC213',

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
    }

})

export default AddEvent