import { Button, StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState, useContext } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../../features/userSlice'
import axios from 'axios';
import dayjs from "dayjs";
import {API_URL} from "@env"

const CompanyHomeScreen = () => {


    //const { user, setUser } = useContext(UserContext)                                          
    const [visibleEvents, setVisibleEvents] = useState([])
    const [eventTitle, setEventTitle] = useState('')
    const [eventDescription, setEventDescription] = useState('')
    const [eventTime, setEventTime] = useState(new Date) 

    

    const userData = useSelector(selectUser)
   const getData = async () => {
      console.log(userData?.user.token)
        try {
            var config = {
                headers: {
                    'Authorization': `Basic ${userData?.user.token}`   // user authorization
                }
            }
            console.log(API_URL + 'events/getevents/')
            const response = await axios.get(API_URL + 'events/getevents/', config)
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

  const kissa = [
      {
        id: 2,
        eventType: "cus"
      },
      {
        id: 3,
        eventType: "cus"
      },
      {
        id: 2,
        eventType: "com"
      }
  ]

  const buttonPush = (id, type) => {
    console.log(`ID:  ${id} :: ${type}`)
  }

  const includes = (id, type) => {
    // Map kissa 
    kissa && kissa.map((data, index) => {
      //console.log(`ID:  ${id} :: ${data.id} //  ${type} :: ${data.eventType}`)
      if(id == data.id && type == data.eventType) {
        console.log(`ID:  ${id} :: ${type}`)
        console.log(false)
        return false
      } 
    })
    return true
    // return true or false
  }
  

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style = {styles.title} >Welcome to Frevent</Text>
        </View>
      
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
            {console.log(includes(data?.id, data?.eventType)) ?
                <TouchableOpacity style={styles.button} onPress={() => buttonPush(data?.id, data?.eventType)} color="#fff" key={index}>
                  <Text>Attend</Text>
              </TouchableOpacity> :
              <TouchableOpacity style={styles.button} onPress={() => buttonPush(data?.id, data?.eventType)} color="#fff" key={index}>
              <Text>testi</Text>
          </TouchableOpacity>
            }
            </View>
          </View>
      </View>)
      
      })}
      
    </ScrollView>
    </View>
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
    color: "#D61C4E",
    

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
  },
  scrollView:{
    flex: 1,
    alignSelf: 'stretch',
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems:"center"
  }
});

export default CompanyHomeScreen