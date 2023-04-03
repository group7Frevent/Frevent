import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../features/userSlice'
import axios from 'axios'
import { API_URL } from "@env"
import FriendBox from './FriendBox'
import { TouchableOpacity } from 'react-native'
import { useIsFocused } from "@react-navigation/native";
import CustomHeader2 from './CustomHeader2'

const MyFriendsFeed = ({ navigation }) => {
    const [friends, setFriends] = useState([])

    const userData = useSelector(selectUser)

    const getFriends = async () => {
        try {
            var config = {
                headers: {
                    'Authorization': `Basic ${userData?.user.token}`   // user authorization
                }
            }
            const response = await axios.get(API_URL + 'friends/myfriends/', config)
            setFriends(response.data)

        }
        catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        getFriends()

    }, [useIsFocused])
    return (
        <View>
            <CustomHeader2 navigation={navigation} />
            {friends && friends.map((data, index) => {
                return (
                    <TouchableOpacity onPress={() => navigation.navigate("fiendFriends")}>
                        <FriendBox data={data} />
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}

export default MyFriendsFeed