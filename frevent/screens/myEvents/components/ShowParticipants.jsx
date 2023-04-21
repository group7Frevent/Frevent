import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { API_URL } from '@env'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../features/userSlice'
import ChatBox from '../../chat/components/ChatBox'

const ShowParticipants = ({ route, navigation }) => {

    // Show participants in event

    const userData = useSelector(selectUser)

    const [participants, setParticipants] = useState([])

    // Get participants
    const getParticipants = async () => {
        const config = {
            headers: {
                'Authorization': `Basic ${userData?.user.token}`,
            }
        }

        axios.get(API_URL + "events/getAttendees/" + route.params.eventID, config).then((response) => {
            setParticipants(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }


    // Get participants for company
    const getParticipantsCompany = async () => {
        const config = {
            headers: {
                'Authorization': `Basic ${userData?.user.token}`,
            }
        }
        axios.get(API_URL + "events/getAttendees/company/" + route.params.eventID, config).then((response) => {
            setParticipants(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }


    useEffect(() => {
        // Check if user is company
        if (userData.user.IDcompany) {
            getParticipantsCompany()
        } else {
            getParticipants()
        }
    }, [])
    return (
        <View>
            {participants.map((participant, index) => {
                return (
                    <ChatBox
                        data={participant}
                        key={index}
                        showParticipants={true}
                    />
                )
            })}
        </View>
    )
}

export default ShowParticipants

const styles = StyleSheet.create({})