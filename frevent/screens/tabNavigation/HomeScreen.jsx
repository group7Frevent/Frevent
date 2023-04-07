import { Button, StyleSheet, Text, View, TouchableOpacity, ScrollView, TouchableHighlight } from 'react-native';
import React, { useEffect, useState, useContext } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../../features/userSlice'
import axios from 'axios';
import dayjs from "dayjs";
import { API_URL, API_URL2 } from '@env'
import Ionic from 'react-native-vector-icons/Ionicons'


const HomeScreen = () => {


    //const { user, setUser } = useContext(UserContext)                                          
    const [visibleEvents, setVisibleEvents] = useState([])
    const [attending, setAttending] = useState([])


    const userData = useSelector(selectUser)
   const getData = async () => {
        try {
            var config = {
                headers: {
                    'Authorization': `Basic ${userData?.user.token}`   // user authorization
                }
            }
            const response = await axios.get(API_URL + 'events/getevents/', config)
            setVisibleEvents(response.data)
    }
    catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getData()
  }, [])



  const attendedEvents = async () => {
    try {
      var config = {
          headers: {
              'Authorization': `Basic ${userData?.user.token}`   // user authorization
          }
      }
      const response = await axios.get(API_URL + 'events/getAttending/', config)
      setAttending(response.data)
}

catch (error) {
console.log(error)
}
}

useEffect(() => {
  attendedEvents()
}, [])

  


const buttonAttend = (id, type, index) => {

  const specs = {
    IDEvent: id,
    eventType: type
  };
  
  const config = {
    headers: {
      'Authorization': `Basic ${userData?.user.token}`
    }
  };
  
  axios.post(API_URL + 'events/postAttendance/', specs, config)
    .then(response => {
      console.log('Event attendance registered succesfully')
    })
    .catch(error => {
      console.log(error)
    });

  attendedEvents()
  getData()
}

  const buttonDontAttend = (id, type, index) => {

    axios.delete(API_URL + 'events/deleteAttendance/', {
      headers: {
        'Authorization': `Basic ${userData?.user.token}`
      },
      data: {
        IDEvent: id,
        eventType: type
      }
    })
      .then(response => {
        console.log('Event attendance deleted successfully')
      })
      .catch(error => {
        console.log(error)
      });
  
    attendedEvents()
    getData()
    

    //Tähän sql yhteys tietokanta poista osallistuminen
    console.log(`ID:  ${id} :: ${type}`)
  }


  const includes = (id, type) => {
    const match = attending && attending.some((data, index) => {
      if(id == data.IDEvent && type == data.eventType) {
        return true;
      } 
    });
    return !match;
  };
  

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
        <Text style = {styles.title} >Welcome!</Text>
          <Text style = {styles.title} >Here are your upcoming events</Text>
        </View>
      
      {visibleEvents.map((data, index) => {
        return(
      <View key = {index} style = {styles.event}>
        <Text style = {styles.title} >{data.Tapahtuma}</Text>
        <Text style = {styles.description}>{data.Kuvaus}</Text>
          <View style = {styles.lowerPart}>
            <View style = {{flex:1,}}>
              <Text style = {styles.startTime}>{dayjs(data.Ajankohta).format("D MMM YYYY HH.mm")}, {data.Paikka}</Text>
              <Text style = {styles.attendees}>{data.Osallistujia} attending</Text>
            </View>
            <View>
            {includes(data?.id, data?.eventType) ?
                <TouchableOpacity style={styles.btnNormal} onPress={() => {buttonAttend(data?.id, data?.eventType, index)}} color="#fff" key={index}>
                  <Text>Attend</Text>
              </TouchableOpacity> :
              <TouchableOpacity style={styles.btnPressed} onPress={() => {buttonDontAttend(data?.id, data?.eventType, index)}} color="#fff" key={index}>
              <Text><Ionic name={'checkmark'} size={15} color={'green'} /> Attending</Text>
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
  },

  btnNormal: {
    alignItems: "center",
    backgroundColor: "#F77E21",
    color: "#fff",
    padding: 8,
    paddingRight: 20,
    paddingLeft: 20,
    marginTop: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D61C4E",
    activeOpacity: 1,
  },

  btnPressed: {
    alignItems: "center",
    backgroundColor: '#15bf34',
    color: "#fff",
    padding: 8,
    paddingRight: 20,
    paddingLeft: 20,
    marginTop: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "green",
    activeOpacity: 1,
  },
});

export default HomeScreen