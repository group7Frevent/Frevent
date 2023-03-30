import { View, Text } from 'react-native'
import React from 'react'
import PenginRequestBox from './PenginRequestBox'

const PendingRequest = ({ route, navigation }) => {
    const { pending } = route.params
    return (
        <View>
            {pending.map((item, index) => {
                return (
                    <PenginRequestBox data={item} />
                )
            })}
        </View>
    )
}

export default PendingRequest