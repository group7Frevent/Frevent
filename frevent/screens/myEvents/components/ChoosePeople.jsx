import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native';
import { useState } from 'react';
import ChatBox from '../../chat/components/ChatBox';

const ChoosePeople = ({ route, navigation }) => {

    // Get data from route params
    const [data, setData] = useState(route.params?.data)

    // Force refresh for component
    const [forceRefresh, setForceRefresh] = useState(Math.floor(Math.random() * 1000))

    const save = () => {
        navigation.navigate({
            name: 'Add Event',
            params: {
                data: data,
                howManyChecked: data.filter(item => item.checked).length
            },
            merge: true,
        })
    }

    // Set checked to true or false
    const setToChecked = (index) => {
        let temp = data;
        temp[index].checked = !temp[index].checked;
        setData(temp)
        // Force refresh for component
        setForceRefresh(Math.floor(Math.random() * 1000))
    }

    return (
        <View style={styles.container}>

            <View key={forceRefresh}>
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 90 }} >

                    {data?.map((item, index) => {
                        return (
                            <TouchableOpacity onPress={() => setToChecked(index)} key={index}>
                                <ChatBox
                                    data={item}
                                    events={true}
                                    checkbox={item.checked}
                                    setToChecked={setToChecked}
                                    checkedIndex={index}
                                />
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
            </View>
            <TouchableOpacity onPress={() => save()} style={styles.button}>
                <Text style={styles.buttonTxt}>save</Text>
            </TouchableOpacity>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    button: {
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#FAC213',
        width: '90%',
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
        marginTop: 15,
        position: 'absolute',
        bottom: 10,
    },
    buttonTxt: {
        fontSize: 20,
        color: '#000',

    }
})
export default ChoosePeople