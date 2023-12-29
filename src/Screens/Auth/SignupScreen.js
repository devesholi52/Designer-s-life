import React, { useState } from "react";
import Colors from "../../Theme/Colors";
import { Image, Text, TouchableOpacity, View, ScrollView, ImageBackground, StyleSheet, ActivityIndicator } from "react-native";
// import { Icon } from "react-native-elements";
import { TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from '@react-navigation/native';
import SigninScreen from "./SigninScreen";
import Fonts from "../../Theme/Fonts";
import Eye from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/AntDesign';
import Back from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Appurl from '../../API/Constant'
import { height, width } from "../Notification/NotificationScreen";
import { showToastMessage } from "../../Utils";
import { color } from "react-native-reanimated";
import { mobileValidation } from "../../helper";

const SignupScreen = () => {
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [isOpen, setIsOpen] = useState(true)
  const [isOpenUp, setIsOpenUp] = useState(true)
  const navigation = useNavigation()
  const goToSigninScreen = () => {
    //navigation.navigate("SigninScreen")
    navigation.goBack()
  }


  const Submit = () => {

    if (password !== confirmPass) { showToastMessage("Password should be same"); return }
    if (!name) { showToastMessage('please fill in'); return }
    if (!number) { showToastMessage('please fill in'); return }
    if (!mobileValidation(number)) {
      showToastMessage("Number Should not be less then 10."); return
    }
    if (!email) { showToastMessage('please fill in'); return }
    if (!password) { showToastMessage('please fill in'); return }

    let form = new FormData()
    form.append('first_name', name)
    form.append('phone', number)
    form.append('username', email)
    form.append('password', password)
    form.append('email', email)
    form.append('user_type', 'seller')

    fetch(Appurl.REGISTER, {
      method: 'POST',
      body: form
    }).then(res => res.json())
      .then(response => {
        if (response && response.email) showToastMessage('Please enter a valid email')
        if (response && response.username == "A user with that username already exists.") showToastMessage('A user with this email already exists')
        // if (password == !confirmPass) { ToastAndroid.show("Password should be same", ToastAndroid.SHORT) }
        if (response && response.message) { showToastMessage(response.message) }
        if (response && response?.status) {
          navigation.navigate('OTPScreen', {
            token: response.token,
            data: email
          })
          setName('');
          setNumber('');
          setEmail('');
          setPassword('');
          setConfirmPass('');
        } else {
          // ToastAndroid.show('something went wrong', ToastAndroid.SHORT)


        };
      })

  }

  return (
    <ScrollView style={Styles.ImageBackgroundStyle}>
      {/* <ImageBackground source={require('../../Assets/Untitled-4.jpg')}
        style={Styles.ImageBackgroundStyle}> */}
      <TouchableOpacity style={Styles.backButton}
        onPress={() => navigation.goBack()}>
        <Back name='arrow-back-ios' color={Colors.white} size={15} />
      </TouchableOpacity>
      <Image
        source={require('../../Assets/lifeofdesginer-logo.png')}
        style={{ height: 100, width: 250, alignSelf: 'center', marginLeft: 40, marginTop: 60 }}
        PlaceholderContent={<ActivityIndicator />} />

      <View style={{ alignSelf: 'center', marginTop: 50 }}>
        <Text style={{ color: "#ffd700", fontFamily: Fonts.RobotoBold, fontSize: 20, marginHorizontal: 5 }}>Sign Up</Text>
      </View>
      <View style={{ marginTop: 10, alignSelf: 'center' }}>
        <View style={Styles.inputboxView}>
          <TextInput
            style={Styles.inputBox}
            placeholderTextColor='#2a2a2a'
            value={name}
            label='Full Name'
            // theme={{ colors: { primary: '#2a2a2a' } }}
            theme={{ colors: { text: "white", primary: '#ffd700', placeholder: 'white' } }}
            onChangeText={setName}
            left={<TextInput.Icon name="account" color='#ffd700' size={17} />}
          />
        </View>

        <View style={Styles.inputboxView}>
          <TextInput
            style={Styles.inputBox}
            placeholderTextColor='#2a2a2a'
            // secureTextEntry={true}
            value={number}
            label='Mobile No.'
            // theme={{ colors: { primary: '#2a2a2a' } }}
            theme={{ colors: { text: "white", primary: '#ffd700', placeholder: 'white' } }}
            maxLength={10}
            keyboardType="numeric"
            onChangeText={value => {
              setNumber(value)
            }}
            left={<TextInput.Icon name="cellphone" color='#ffd700' size={17} />}
          />
        </View>

        <View style={Styles.inputboxView}>
          <TextInput
            style={Styles.inputBox}
            placeholderTextColor={Colors.white}
            value={email}
            label="Email Address"
            // theme={{ colors: { primary: '#2a2a2a' } }}
            theme={{ colors: { text: "white", primary: '#ffd700', placeholder: 'white' } }}
            onChangeText={setEmail}
            left={<TextInput.Icon name="email" color='#ffd700' size={17} />}
          />
        </View>

        <View style={Styles.inputboxView}>
          <TextInput
            style={Styles.inputBox}
            placeholderTextColor={Colors.black}
            label="Password"
            // theme={{ colors: { primary: '#2a2a2a' } }}
            theme={{ colors: { text: "white", primary: '#ffd700', placeholder: 'white' } }}
            secureTextEntry={isOpen}
            value={password}
            onChangeText={setPassword}
            left={<TextInput.Icon name="lock" color='#ffd700' size={17} />}
          // right={<TextInput.Icon name={'eye'} type={'ant-design'} color='blue'
          // onPress={() => setIsOpen(!isOpen)} 
          // />}
          />
          <TouchableOpacity style={{ position: 'absolute', top: 20, right: 10 }}>
            <Eye name={isOpen ? "eyeo" : 'eye'} type={'ionicon'} color='#ffd700' size={17}
              onPress={() => setIsOpen(!isOpen)} />
          </TouchableOpacity>
        </View>

        <View style={Styles.inputboxView}>

          <TextInput
            style={Styles.inputBox}
            placeholderTextColor={Colors.dark_grey}
            label="Confirm Password"
            value={confirmPass}
            // theme={{ colors: { primary: '#2a2a2a' } }}
            theme={{ colors: { text: "white", primary: '#ffd700', placeholder: 'white' } }}
            secureTextEntry={isOpenUp}
            onChangeText={setConfirmPass}
            left={<TextInput.Icon name="lock-check" color='#ffd700' size={17} />}
          />
          <TouchableOpacity style={{ position: 'absolute', top: 20, right: 10 }}>
            <Eye name={isOpenUp ? "eyeo" : 'eye'} type={'ionicon'} color='#ffd700' size={17}
              onPress={() => setIsOpenUp(!isOpenUp)} />
          </TouchableOpacity>
        </View>

        <View style={{ marginHorizontal: 20, marginVertical: 40 }}>
          <TouchableOpacity style={{ backgroundColor: '#ffd700', justifyContent: 'center', alignItems: 'center', borderRadius: 7, paddingVertical: 15, marginTop: 30 }}
            onPress={() => Submit()} >
            <Text style={{ fontFamily: Fonts.RobotoBold, color: Colors.black, fontSize: 17 }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
        {/* <View style={{ alignItems: 'center', }}>
          <Text style={{ color: 'white', fontFamily: Fonts.RobotoBold }}>Or via social media</Text>
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#242e40', padding: 5, borderRadius: 20, width: 120, marginHorizontal: 5 }}>
              <Image source={require('../../Assets/facebook.png')} style={{ width: 30, height: 30 }} />
              <Text style={{ fontFamily: Fonts.RobotoBold, color: Colors.white, marginHorizontal: 10, fontSize: 12 }}>Facebook</Text>
            </View>
          </View>
        </View> */}

      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', margin: 30, marginBottom: 60 }}>
        <Text style={{ color: Colors.white, fontFamily: Fonts.RobotoRegular }}>Already have an account? </Text>
        <TouchableOpacity onPress={goToSigninScreen}>
          <Text style={{ color: '#ffd700', fontFamily: Fonts.RobotoBold }}>Sign In</Text>
        </TouchableOpacity>
      </View>
      {/* </ImageBackground> */}

    </ScrollView>
  )
}



const Styles = StyleSheet.create({

  ImageBackgroundStyle: {
    // height: 840,
    // width: width,
    // paddingHorizontal: 20,
    // paddingTop: width / 2
    flex: 1,
    backgroundColor: 'black',
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    flexDirection: 'row',
    borderBottomColor: 'white'
  },
  SignUpText: {
    color: Colors.white,
    fontFamily: Fonts.RobotoBold,
    fontSize: 20,
    marginHorizontal: 5
  },

  inputboxView: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    // flexDirection: 'row',
    width: width / 1.12,
    justifyContent: 'space-between',

  },

  inputBox: {
    fontFamily: Fonts.RobotoBold,
    flex: 1,
    height: 60,
    borderRadious: 10,
    backgroundColor: 'black',
    borderBottomColor: '#2a2a2a',
    borderBottomWidth: 1
  },
})


export default SignupScreen

















