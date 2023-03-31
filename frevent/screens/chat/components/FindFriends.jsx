import { View, Text, StyleSheet, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '@env'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../features/userSlice'
import Spinner from 'react-native-loading-spinner-overlay';
import { ScrollView } from 'react-native'
import AvailableFriendBox from './AvailableFriendBox'
import Ionic from 'react-native-vector-icons/Ionicons'

const FindFriends = () => {

    const userData = useSelector(selectUser)
    const [availableUsers, setAvailableUsers] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [search, setSearch] = useState('')

    const getAvailableUsers = async () => {


        var config = {
            headers: {
                'Authorization': `Basic ${userData?.user.token}`   // user authorization
            }
        }
        console.log(API_URL + 'friends/notfriends/')

        const reqUrl = API_URL + 'friends/notfriends/'
        axios.get(reqUrl, config).then(response => {
            setAvailableUsers(response.data)
            setFilteredData(response.data)
        }).catch(error => {
            console.log(error)
        })
    }

    useEffect(() => {
        getAvailableUsers()
    }, [])


    const filterData = (e) => {
        const searchWord = e;
        setSearch(searchWord);
        const tempArray = availableUsers

        const newFilter = tempArray.filter((val) => {
            //console.log(val.fname.toLowerCase() + " " + val.lname.toLowerCase())
            return val.searchname = val.fname.toLowerCase() + " " + val.lname.toLowerCase();
        });

        const secondFilter = newFilter.filter((val) => {
            return val.searchname.includes(searchWord.toLowerCase());
        })


        if (searchWord === "") {
            setFilteredData(availableUsers);
        } else {
            setFilteredData(secondFilter);
        }
    };

    const clearSearch = () => {
        setSearch('')
        setFilteredData(availableUsers)
    }

    return (
        <View>
            <Spinner
                visible={availableUsers.length < 1}
                textContent={'Loading...'}
                textStyle={styles.spinnerTextStyle}
            />

            <View style={styles.searchbarHeader}>
                <View style={styles.searchbar} >
                    <View style={styles.searchbarIconAndText}>
                        <Ionic name="search" size={24} color={"black"} />
                        <TextInput
                            style={styles.searchbarinput}
                            placeholder="Find friends"
                            value={search}
                            onChangeText={filterData}

                        />
                    </View>
                    {search.length > 0 &&
                        <Ionic name="close" size={24} color={"black"} onPress={clearSearch} style={{ justifyContent: 'flex-end' }} />}
                </View>
            </View>
            <ScrollView>

                {filteredData && filteredData.map((data, index) => {
                    return (
                        <AvailableFriendBox data={data} key={index} />
                    )
                })}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    spinnerTextStyle: {
        color: '#FFF'
    },
    searchbarHeader: {
        height: 50,
        backgroundColor: 'white',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: '#171717',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        paddingHorizontal: 20,
        width: '100%',
    },
    searchbar: {
        height: 35,
        backgroundColor: '#F2F2F2',
        borderRadius: 10,
        paddingLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    searchbarinput: {

    },
    searchbarIconAndText: {
        flexDirection: 'row',
        gap: 10,
    }
})

export default FindFriends