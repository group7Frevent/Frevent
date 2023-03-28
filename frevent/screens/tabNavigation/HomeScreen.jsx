import { Button, StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState, useContext } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../../features/userSlice'
import axios from 'axios';
import dayjs from "dayjs";

const HomeScreen = () => {


    //const { user, setUser } = useContext(UserContext)                                          
    const [visibleEvents, setVisibleEvents] = useState([])
    const [eventTitle, setEventTitle] = useState('')
    const [eventDescription, setEventDescription] = useState('')
    const [eventTime, setEventTime] = useState(new Date) 

    

    const userData = useSelector(selectUser)
   const getData = async () => {

        try {
            var config = {
                headers: {
                   // 'Authorization': `Basic ${user.token}`   // user authorization
                }
            }
            const response = await axios.get('http://192.168.0.66:3000/events/getevents/'+userData?.user.ID)
            response.app
            console.log(response.data)
            setVisibleEvents(response.data)

      setVisibleEvents(response.data)
    }
    catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getData()
  }, [])


  return (
    <ScrollView style={styles.scrollView}>
    <View style={styles.container}>
      <Text style = {styles.title} >Welcome to Frevent</Text>
      
      {visibleEvents.map((data, index) => {
        return(
      <View key = {index} style = {styles.event}>
        <Text style = {styles.title} >{data.Tapahtuma}</Text>
        <Text style = {styles.description}>{data.Kuvaus}</Text>
          <View style = {styles.lowerPart}>
            <View style = {{flex:1,}}>
              <Text style = {styles.startTime}>{dayjs(data.Ajankohta).format("D MMM YYYY")}, {data.Paikka}</Text>
              <Text style = {styles.attendees}>{data.Osallistujia} attending</Text>
            </View>
            <View>
            <TouchableOpacity style={styles.button} /*onPress={loginRequest}*/ color="#fff">
                <Text>Attend</Text>
            </TouchableOpacity>
            </View>
          </View>
      </View>)
      
      })}
      
    </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF9A7',
    alignItems: 'center',
    justifyContent: 'center',

  },
  event: {
    marginTop: 20,
    borderRadius: 10,
    marginRight: 15,
    marginLeft: 15,
    padding: 10,
    backgroundColor: "#FAC213",
    width: '90%',


  },
  button: {
    alignItems: "center",
    backgroundColor: "#F77E21",
    color: "#fff",
    padding: 8,
    paddingRight: 20,
    paddingLeft: 20,
    marginTop: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D61C4E"
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#D61C4E"

  },
  description: {
    fontSize: 13,
    color: "black",
    fontWeight: '500'

  },
  startTime: {
    fontSize: 13,
    color: "black",
    marginTop: 3,

  },
  lowerPart: {
    flexDirection: "row"

  },
  attendees: {
    fontSize: 13,
    color: "#D61C4E",
    marginTop: 5,


  },

  bottomtitle: {
    padding: 10
  }
});

export default HomeScreen