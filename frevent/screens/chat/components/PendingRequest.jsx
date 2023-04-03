import { View, Text, StyleSheet, TouchableOpacity, TouchableHighlight } from 'react-native'
import React, { useEffect, useState } from 'react'
import PenginRequestBox from './PenginRequestBox'
import { SwipeListView } from 'react-native-swipe-list-view';
import { API_URL } from '@env'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../features/userSlice'
import axios from 'axios'


const PendingRequest = ({ route, navigation }) => {
    const { pending } = route.params
    const [listData, setListData] = useState([])

    const userData = useSelector(selectUser)

    useEffect(() => {
        const emptyArray = []
        pending.map((item, index) =>
            emptyArray.push({ key: `${index}`, ...item }))
        setListData(emptyArray)
    }, [])

    const closeRow = (rowMap, rowKey) => {
        console.log(rowKey)
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };


    ////////////////////////////////////////////////////////////////////////
    const deleteRequest = (rowMap, rowKey, item) => {
        var details = {
            friendID: item?.ID
        };

        //console.log(item?.ID)
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

        axios.post(API_URL + 'friends/removefriend', formBody, config)
            .then((response) => {
                if (response.data == true) {
                    closeRow(rowMap, rowKey);
                    const newData = [...listData];
                    const prevIndex = listData.findIndex(item => item.key === rowKey);
                    newData.splice(prevIndex, 1);
                    setListData(newData);
                }
            }).catch((error) => {
                console.log(error)
            })

    }


    ////////////////////////////////////////////////////////////////////////
    const deleteRow = (rowMap, rowKey, item) => {
        deleteRequest(rowMap, rowKey, item);

    };


    const renderItem = data => (
        <TouchableHighlight
            style={styles.rowFront}
            underlayColor={'#AAA'}
        >

            <PenginRequestBox data={data.item} />
        </TouchableHighlight>
    );

    const renderHiddenItem = (data, rowMap) => (
        <View style={styles.rowBack}>

            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={() => deleteRow(rowMap, data.item.key, data.item)}
            >
                <Text style={styles.backTextWhite}>Delete</Text>
            </TouchableOpacity>
        </View>
    );
    return (
        <View>
            <SwipeListView
                data={listData}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                leftOpenValue={0}
                rightOpenValue={-75}
                previewRowKey={'0'}
                previewOpenValue={-40}
                previewOpenDelay={3000}
                disableRightSwipe
            />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    backTextWhite: {
        color: '#FFF',
    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        paddingLeft: 15,
        height: 70,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: 'red',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        backgroundColor: 'tomato',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },
});

export default PendingRequest