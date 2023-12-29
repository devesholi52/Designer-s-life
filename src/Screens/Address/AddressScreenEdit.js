import React, { useState, useEffect } from "react";
import Headers from "../../Components/Headers/Headers";
import { View, StyleSheet, Image, Text, TouchableOpacity, ScrollView } from "react-native";
import { TextInput } from "react-native-paper";
import Colors from "../../Theme/Colors";
import metrics from "../../Theme/Metrics";
import { useNavigation } from "@react-navigation/native";
import PaymentScreen from "../Home/PaymentScreen";
import Fonts from "../../Theme/Fonts";
import Appurl from '../../API/Constant'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { mobileValidation } from "../../helper"
import { showToastMessage } from "../../Utils";
import { width } from "../Notification/NotificationScreen";


const AddressScreenEdit = ({ route }) => {
  const navigation = useNavigation()
  const [addressType, setAddressType] = useState('')
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const [address, setAddress] = useState('')
  const [location, setLocation] = useState('')
  const [pincode, setPincode] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [AddressID, setAddressId] = useState(route?.params?.IDofAddress ? route?.params?.IDofAddress : '')
  const [selectedProductData, setSelectedProductData] = useState(route?.params?.selectedProductData ? route?.params?.selectedProductData : '')

  useEffect(() => {
    getAddress()
  }, [])

  const getAddress = async () => {
    // setLoading(true)
    const token = await AsyncStorage.getItem('token')
    // console.log('res::::', token)
    fetch(`${Appurl.GET_DELIVERY_ADDRESS}${AddressID}/`, {
      method: 'GET',
      headers: { Authorization: `Token ${token}` },
    }).then(res => res.json())
      .then(response => {
        console.log(response);
        setName(response?.name);
        setNumber(response?.mobile);
        setAddress(response?.full_address);
        setLocation(response?.locality);
        setPincode(JSON.stringify(response?.pin_code))
        setCity(response?.city);
        setState(response?.state);
        setAddressType(response?.save_as)
      })
    // .finally(e => setLoading(false))
  }

  const Submit = async () => {
    if (!name) { showToastMessage('please fill in'); return }
    if (!number) { showToastMessage('please fill in'); return }
    if (!mobileValidation(number)) {
      showToastMessage("Mobile number should not be less than 10 digits"); return
    }
    if (!address) { showToastMessage('please fill in'); return }
    if (!location) { showToastMessage('please fill in'); return }
    if (!pincode) { showToastMessage('please fill in'); return }
    if (!city) { showToastMessage('please fill in'); return }
    if (!state) { showToastMessage('please fill in'); return }

    const token = await AsyncStorage.getItem('token')
    let form = new FormData()
    form.append('name', name)
    form.append('mobile', number)
    form.append('full_address', address)
    form.append('locality', location)
    form.append('pin_code', pincode)
    form.append('city', city)
    form.append('state', state)
    form.append('save_as', addressType)

    fetch(`${Appurl.GET_DELIVERY_ADDRESS}${AddressID}/`, {
      method: 'PUT',
      headers: { Authorization: `Token ${token}` },
      body: form
    }).then(res => res.json())
      .then(response => {
        if (response && response?.status == "active") {
          showToastMessage('Address Updated')
          setName('');
          setNumber('');
          setAddress('');
          setLocation('');
          setPincode('');
          setCity('');
          setState('');

          navigation.navigate('AddressAlreadyExist')
        }
        else { showToastMessage('something went wrong') };
      })

  }

  return (

    <ScrollView style={styles.mainContainer}>
      <View >
        {/* <ScrollView showsVerticalScrollIndicator={false} > */}
        {/* <View> */}
        <Text style={styles.title}>Contact Details</Text>
        <TextInput
          style={styles.input}
          label='Name'
          theme={{ colors: { primary: 'lightgrey' } }}
          placeholderTextColor={Colors.dark_grey}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholderTextColor={Colors.dark_grey}
          keyboardType={'numeric'}
          value={number}
          theme={{ colors: { primary: 'lightgrey' } }}
          maxLength={10}
          label='Mobile No*'
          onChangeText={value => {
            setNumber(value)
          }}
        />
        {/* </View> */}


        <View style={{ marginVertical: 20 }}>
          <Text style={styles.title}>Address</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor={Colors.dark_grey}
            value={address}
            theme={{ colors: { primary: 'lightgrey' } }}
            label="Full Address"
            onChangeText={setAddress}
          />

          <TextInput
            style={styles.input}
            placeholderTextColor={Colors.dark_grey}
            value={location}
            theme={{ colors: { primary: 'lightgrey' } }}
            label="Locality/Town"
            onChangeText={setLocation}
          />

          <TextInput
            style={styles.input}
            placeholderTextColor={Colors.dark_grey}
            value={pincode}
            theme={{ colors: { primary: 'lightgrey' } }}
            maxLength={10}
            label='Pin Code*'
            keyboardType={"numeric"}
            onChangeText={setPincode}
          />

          <View style={{ flexDirection: 'row' }}>
            <TextInput
              style={[styles.inputInRow, { marginRight: 5 }]}
              theme={{ colors: { primary: 'lightgrey' } }}
              placeholderTextColor={Colors.dark_grey}
              value={city}
              label='City/district*'
              onChangeText={setCity}
            />

            <TextInput
              style={[styles.inputInRow, { marginLeft: 5 }]}
              theme={{ colors: { primary: 'lightgrey' } }}
              placeholderTextColor={Colors.dark_grey}
              value={state}
              label='State*'
              onChangeText={setState}
            />
          </View>
        </View>
        <View>
          <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold, fontSize: 16 }}>Save Address As</Text>
          <View style={{ flexDirection: 'row', marginVertical: 20, }}>
            <TouchableOpacity onPress={() => setAddressType('Home')}
              style={{
                backgroundColor: addressType === "Home" ? 'black' : Colors.white,
                width: 120,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 7,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: '#eee',
                // borderColor:addressType==="Home"?Colors.black:Colors.grayLight,
              }}>
              <Text style={{
                color: addressType === 'Home' ? Colors.white : Colors.black,
                fontFamily: Fonts.RobotoBold,
                fontSize: 12
              }}>
                Home
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setAddressType('Work')}
              style={{
                backgroundColor: addressType === "Work" ? Colors.black : Colors.white,
                borderColor: addressType === "Work" ? Colors.black : Colors.grayLight,
                borderWidth: 1,
                borderColor: '#eee',
                width: 120,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 7,
                borderRadius: 20,
                marginHorizontal: 10
              }}>
              <Text
                style={{ color: addressType === 'Work' ? Colors.white : Colors.black, fontFamily: Fonts.RobotoBold, fontSize: 12 }}>
                Work
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* </ScrollView> */}
      </View>
      <TouchableOpacity style={{ backgroundColor: '#ffd700', borderRadius: 10, justifyContent: 'center', alignItems: 'center', paddingVertical: 15, marginHorizontal: 30, marginTop: 40, marginBottom: width / 3.2 }}
        onPress={() => Submit()}>
        <Text style={{ fontFamily: Fonts.RobotoBold, color: Colors.black }}>Save Address</Text>
      </TouchableOpacity>
    </ScrollView>

  )
}
const styles = StyleSheet.create({
  mainContainer: {
    marginVertical: 2,
    paddingHorizontal: 20,
    paddingVertical: 10,
    // flex: 1,
    backgroundColor: Colors.white
  },
  input: {
    height: 50,
    borderColor: 'lightgrey',
    // borderWidth: 1,
    marginVertical: 10,
    fontFamily: Fonts.RobotoRegular,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    // paddingLeft: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1
  },
  title: {
    color: Colors.black,
    fontSize: 16,
    fontFamily: Fonts.RobotoBold
  },
  inputInRow: {
    height: 50,
    flex: 1,
    borderColor: 'lightgrey',
    // borderWidth: 1,
    // borderRadius: 5,
    marginVertical: 10,
    fontFamily: Fonts.RobotoRegular,
    paddingLeft: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    // paddingLeft: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1
  }
})
export default AddressScreenEdit
