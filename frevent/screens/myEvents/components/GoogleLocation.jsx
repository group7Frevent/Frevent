import { View, Text } from 'react-native'
import React from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { GOOGLE_MAP_API_KEY } from '@env'
import { ScrollView, Dimensions } from 'react-native'


const GoogleLocation = ({ width, setLocation }) => {
    return (
        <ScrollView horizontal={false} style={{ flex: 1, width: '100%', height: '100%' }} keyboardShouldPersistTaps='always'>
            <ScrollView horizontal={true} style={{ flex: 1, width: '100%', height: '100%' }} keyboardShouldPersistTaps='always'>
                <View style={{ width: width }}>
                    <GooglePlacesAutocomplete
                        placeholder='Search'
                        onPress={(data, details = null) => {
                            //console.log(data, details)
                            setLocation(data, details);
                        }}
                        onFail={error => console.error(error)}
                        query={{
                            key: GOOGLE_MAP_API_KEY,
                            language: 'fi',
                        }}
                    />
                </View>
            </ScrollView>
        </ScrollView>
    )
}

export default GoogleLocation