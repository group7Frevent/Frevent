import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-navigation'

const HomeScreenHeader = () => {
    return (
        <View style={styles.container} >
            <SafeAreaView>
                <Text style={styles.textStyles}>Upcoming events</Text>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 100,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
    },
    textStyles: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "#D61C4E",
    }
})

export default HomeScreenHeader