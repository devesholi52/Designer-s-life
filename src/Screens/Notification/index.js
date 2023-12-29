import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react'
import { View, TextInput, Text, StyleSheet, FlatList } from 'react-native'
// import { Color } from '../../Utils'
import Headers from "../../Components/Headers/Headers";
import NotificationScreen from './NotificationScreen'
import Appurl from '../../API/Constant'
import { Loader } from '../../Theme/Metrics';

// const DATA = [1, 3, 2, 2, 5, 4, 6]


export default function index({ navigation }) {

  const [notification, setNotification] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getNotification()
  }, [])

  const getNotification = async () => {
    setLoading(true)
    const token = await AsyncStorage.getItem('token')

    fetch(Appurl.GET_NOTIFICATION, {
      method: 'GET',
      headers: { Authorization: `Token ${token}` },
    }).then(res => res.json())
      .then(response => {

        setNotification(response.data)
      }).finally(e => setLoading(false))
  }

  return (
    <>
      <Headers title={"Notification"} backButton={false} navigation={navigation} backgroundColor={"black"} />
      <View style={styles.container}>
        {loading && <Loader size={'small'} color={'#000'} />}
        {(notification && notification.length !== 0) ?
          <FlatList
            data={notification}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <NotificationScreen item={item} navigation={navigation} />}
          /> : <Text style={{ color: '#000', textAlign: 'center', padding: 10, fontSize: 20 }}>No data available</Text>}
      </View>
    </>)
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1
  }
})