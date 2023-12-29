import React, { useEffect, useState } from 'react'
import { View, TextInput, Text, StyleSheet, FlatList, KeyboardAvoidingView, TouchableOpacity, ScrollView } from 'react-native'
import CommentsIconCard from './CommentsIconCard'
import Fonts from '../Theme/Fonts'
import { width } from '../UploadProduct/Deal'
import Headers from '../Components/Headers/Headers'
import Appurl from '../API/Constant'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { showToastMessage } from '../Utils'

const data = [1, 2, 2, 4]

export default function index({ route }) {

  const [comment, setComment] = useState([])
  const [name, setName] = useState('')
  const [userdata, setUserdata] = useState(route?.params?.UserId ? route?.params?.UserId : '')

  useEffect(() => {
    getComment()
  }, [])

  const getComment = async () => {
    const token = await AsyncStorage.getItem('token')
    // const Data = await AsyncStorage.getItem('data')
    fetch(Appurl.GET_COMMENT + userdata, {
      method: 'GET',
      headers: { Authorization: `Token ${token}` },
    }).then(res => res.json())
      .then(response => {
        console.log("response of Comment", response.results);
        setComment([...response.results])
      })
  }



  const Submit = async () => {
    const token = await AsyncStorage.getItem('token')
    if (!name) { showToastMessage('please fill in'); return }
    let form = new FormData()
    form.append('comment', name)
    form.append('product_id', userdata)
    fetch(Appurl.POST_COMMENT, {
      method: 'POST',
      headers: { Authorization: `Token ${token}` },
      body: form
    }).then(res => res.json())
      .then(response => {
        getComment()
        setName('')
      })

  }

  return (
    <ScrollView style={{ backgroundColor: 'white', flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        keyboardVerticalOffset={-10}
        style={{ margin: 10 }}
      >
        <FlatList
          data={comment}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <CommentsIconCard item={item} />}
        />
        <View style={{ marginBottom: 70 }}>
          <TextInput style={styles.inputbox}
            placeholder='Write your comments..'
            placeholderTextColor={'grey'}
            multiline={true}
            value={name}
            onChangeText={setName}

          />
          <TouchableOpacity style={styles.button}
            onPress={() => Submit()}>
            <Text style={styles.buttontext}>Submit</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  inputbox: {
    minHeight: 80,
    maxHeight: 300,
    backgroundColor: 'white',
    // margin: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    // color: Color.black,
    borderWidth: 1,
    borderColor: '#eee',
    width: width / 1.15,
    alignSelf: 'center',
    marginBottom: 25,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    fontFamily: Fonts.RobotoRegular,
    fontSize: 14

  },
  button: {
    padding: 10,
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 40,
    backgroundColor: 'black',
    marginLeft: 20,
    // elevation: 1
    // marginBottom:40

  },
  buttontext: {
    color: 'white',
    fontFamily: Fonts.RobotoRegular,
    fontSize: 13
  }
})
