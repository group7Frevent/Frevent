import { View, Text, SafeAreaView } from 'react-native'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../../features/userSlice'

const TabNavigation = () => {
    // Tuodaan tiedot reduxista
    const userData = useSelector(selectUser)

    return (
        <View >
            <SafeAreaView>
                <Text>TabNavigation</Text>
            </SafeAreaView>
        </View>
    )


}



export default TabNavigation