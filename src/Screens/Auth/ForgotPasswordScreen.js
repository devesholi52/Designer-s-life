import React, { useState } from "react";
import Colors from "../../Theme/Colors";
import { Image, ImageBackground, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import OTPScreen from "./OTPScreen";
import User from 'react-native-vector-icons/AntDesign';
import Fonts from "../../Theme/Fonts";
import Appurl from '../../API/Constant'
import { width } from "../Notification/NotificationScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";
import { showToastMessage } from "../../Utils";
const ForgotPasswordScreen = () => {

  const [email, setEmail] = useState('')
  const navigation = useNavigation()
  const goToOTPScreen = () => {
    navigation.navigate("OTPScreen")
  }

  const Submit = () => {
    if (!email) { showToastMessage('please fill in'); return }
    let form = new FormData()
    form.append('email', email)
    // form.append('otp', value)
    // form.append('data', userdata)
    fetch(Appurl.OTP_PASS_CHANGE, {
      method: 'POST',
      body: form
    }).then(res => res.json())
      .then(response => {

        if (response && response.message == "There is no user registered with this email.") {
          showToastMessage("There is no user registered with this email.")

        }
        if (response && response.message == "An OTP has been sent to your email") {
          showToastMessage("An OTP has been sent to your email")
          navigation.navigate("PasswordForgetSetPass", {
            Email: email
          }
          )
        }
        setEmail('')
      }

      )
  }
  return (

    <ScrollView
      style={Styles.ImagebackgroundStyle}>

      <TouchableOpacity style={Styles.backButton}
        onPress={() => navigation.goBack()}>
        <Icon name='arrow-back-ios' type={"MaterialIcons"} color={Colors.white} size={15} />
      </TouchableOpacity>
      <Image
        source={require('../../Assets/lifeofdesginer-logo.png')}
        style={{ height: 100, width: 250, marginBottom: 20, marginTop: 50, alignSelf: 'center', marginTop: width / 4.5 }} />

      <View style={{ alignSelf: 'center', marginVertical: 20 }}>
        <Text style={Styles.Forgetpasstext}>Forgot Password?</Text>
      </View>
      <View style={{ marginTop: 30, marginHorizontal: 20 }}>
        <View style={Styles.TextInputView}>
          <TextInput
            style={Styles.InputBox}
            placeholderTextColor={Colors.black}
            // theme={{ colors: { primary: '#242e40' } }}
            theme={{ colors: { text: "white", primary: '#ffd700', placeholder: 'white' } }}
            label={'Enter Email/Mobile'}
            onChangeText={setEmail}
            value={email}
            left={<TextInput.Icon name="account" color='#ffd700' size={17} />}
          />
        </View>

        <View style={{ marginHorizontal: 20, marginVertical: 30 }}>
          <TouchableOpacity onPress={() => Submit()} style={{ backgroundColor: '#ffd700', justifyContent: 'center', alignItems: 'center', borderRadius: 7, paddingVertical: 15, marginTop: 40 }}>
            <Text style={{ fontFamily: Fonts.RobotoBold, color: Colors.black, fontSize: 17 }}>
              Send
            </Text>
          </TouchableOpacity>
        </View>

      </View>

    </ScrollView>


  )
}

const Styles = StyleSheet.create({

  ImagebackgroundStyle: {
    flex: 1,
    backgroundColor: 'black',
  },
  Forgetpasstext: {
    color: '#ffd700',
    fontFamily: Fonts.RobotoBold,
    fontSize: 22,
    marginHorizontal: 5
  },
  TextInputView: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    // borderColor: '#242e40',
  },
  InputBox: {
    fontFamily: Fonts.RobotoBold,
    flex: 1,
    color: "black",
    height: 60,
    borderRadious: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
    backgroundColor: 'black'
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    flexDirection: 'row',
    borderBottomColor: 'white'
  }
})
export default ForgotPasswordScreen

