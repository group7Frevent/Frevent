import { Button, StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import React, { useEffect, useState, useContext } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../../features/userSlice'
import axios from 'axios';
import dayjs from "dayjs";
import { API_URL, API_URL2 } from '@env'
import Ionic from 'react-native-vector-icons/Ionicons'
import HomeScreenHeader from './HomeScreenHeader';
import createOpenLink from 'react-native-open-maps';


const HomeScreen = () => { // <- This is the component that is rendered when the user navigates to the home screen                                      
  const [visibleEvents, setVisibleEvents] = useState([])
  const [attending, setAttending] = useState([])
  const [attendSwitch, setAttendSwitch] = useState(2)


  const userData = useSelector(selectUser) // <- This is the user data that is stored in the redux store
  const getData = async () => {
    try {
      var config = {
        headers: {
          'Authorization': `Basic ${userData?.user.token}`   // user authorization
        }
      }
      const response = await axios.get(API_URL + 'events/getevents/', config) // <- This is the axios request that is sent to the backend
      setVisibleEvents(response.data)
      console.log(response.data)
    }
    catch (error) {                                                        //Fetching events that the current user is not attending to
      console.log(error)
    }
  }

  useEffect(() => {                                                       //Fetching events that the current user is not attending to
    getData()

    attendedEvents()

  }, [attendSwitch])



  const attendedEvents = async () => {                                   //Fetching events that the current user is already attending to
    try {
      var config = {
        headers: {
          'Authorization': `Basic ${userData?.user.token}`   // user authorization
        }
      }
      const response = await axios.get(API_URL + 'events/getAttending/', config)      //Fetching events that the current user is already attending to
      setAttending(response.data)
    }

    catch (error) { 
      console.log(error)
    }
  }

  useEffect(() => {                                                      //Fetching events that the current user is already attending to, and updating the switch
    attendedEvents()

  }, [attendSwitch])


  const buttonAttend = (id, type, index) => {                           //Registering attendance to an event

    const specs = {
      IDEvent: id,
      eventType: type
    };

    const config = {                                                   //Registering attendance to an event, and updating the switch
      headers: {
        'Authorization': `Basic ${userData?.user.token}`  // user authorization
      }
    };

    axios.post(API_URL + 'events/postAttendance/', specs, config)                     //Posting attendance to an event
      .then(response => {
        console.log('Event attendance registered succesfully')
      })
      .catch(error => {
        console.log(error)
      });


    setAttendSwitch((Math.random() * 100) + 1)                                    //Update switch to render page again


  }

  const buttonDontAttend = (id, type, index) => {

    axios.delete(API_URL + 'events/deleteAttendance/', {                    //Cancel attendance to an event
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


    setAttendSwitch((Math.random() * 100) + 1)                          //Update switch to render page again


  }


  const includes = (id, type) => {
    const match = attending && attending.some((data, index) => {                    //Check if user has already registered for this event
      if (id == data.IDEvent && type == data.eventType) {
        return true;
      }
    });
    return !match;
  };

  //Map through events and render mainfeed. Check if event button should be "attend" or "attending"
  return (

    <>
      <HomeScreenHeader />
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          
          {visibleEvents.map((data, index) => {
            return (
              <View key={index} style={styles.event}>
                <View style={styles.upperPart}>
                  <View style={{ flex: 1, }}>
                    <Text style={styles.title}>{data.Tapahtuma}</Text>
                    <Text style={styles.description}>{data.Kuvaus}</Text>
                  </View>
                  <View style={styles.creatorContainer}>
                    {
                      data.ProfilePic &&
                      <Image style={styles.creatorPic} source={{ uri: data.ProfilePic }} />
                    }
                    <Text style={styles.startTime}>{data.Organizer}</Text>
                  </View>
                </View>
                <View style={styles.lowerPart}>
                  <View style={{ flex: 1, }}>
                    <Text style={styles.startTime}>{dayjs(data.Ajankohta).format("D MMM YYYY, H:mm")}, </Text>
                    <TouchableOpacity onPress={() => createOpenLink({ query: data.Paikka, provider: "google" })}>
                      <Text>{data.Paikka} <Ionic name={'locate'} size={15} color={'black'} /></Text>
                    </TouchableOpacity>
                    <Text style={styles.attendees}>{data.Osallistujia} attending</Text>
                  </View>
                  <View style={styles.buttonContainer}>
                    {includes(data?.id, data?.eventType) ?
                      <TouchableOpacity style={styles.btnNormal} onPress={() => { buttonAttend(data?.id, data?.eventType, index) }} color="#fff" key={index}>
                        <Text>Attend</Text>
                      </TouchableOpacity> :
                      <TouchableOpacity style={styles.btnPressed} onPress={() => { buttonDontAttend(data?.id, data?.eventType, index) }} color="#fff" key={index}>
                        <Text><Ionic name={'checkmark'} size={15} color={'green'} /> Attending</Text>
                      </TouchableOpacity>
                    }
                  </View>
                </View>
              </View>)

          })}

        </ScrollView>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',                                                     //CSS styles
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
    flexDirection: "row",

  },
  upperPart: {
    flexDirection: "row",

  },

  creatorContainer: {
    // backgroundColor: 'green',
    justifyContent: 'center',
    maxWidth: '30%',
    paddingLeft: 5,
    textAlign: 'left',
    alignItems: 'flex-end',
  },

  buttonContainer: {
    flexDirection: 'column-reverse',
    paddingBottom: 5,
    paddingLeft: 5,
    width: '33%',
  },

  attendees: {
    fontSize: 13,
    color: "#D61C4E",
    marginTop: 5,
  },

  bottomtitle: {
    padding: 10
  },
  scrollView: {
    flex: 1,
    alignSelf: 'stretch',
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  btnNormal: {
    alignItems: "center",
    backgroundColor: "#F77E21",
    color: "#fff",
    padding: 8,
    paddingRight: 10,
    paddingLeft: 10,
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
    paddingRight: 10,
    paddingLeft: 10,
    marginTop: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "green",
    activeOpacity: 1,
  },

  creatorPic: {
    width: 30,
    height: 30,
    borderRadius: 20,
  },
});

export default HomeScreen