import React, { useState } from "react";
import Headers from "../../Components/Headers/Headers";
import { Image, ImageBackground, Text, TouchableOpacity, View, StyleSheet, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { TextInput } from "react-native-paper";
import Colors from "../../Theme/Colors";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import Fonts from "../../Theme/Fonts";
import { height, width } from "../Notification/NotificationScreen";
import Eye from 'react-native-vector-icons/AntDesign';
import Appurl from '../../API/Constant'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showToastMessage } from "../../Utils";
const ChangePasswordScreen = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [isOpenUp, setIsOpenUp] = useState(true)
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const navigation = useNavigation()

  const Submit = async () => {
    if (newPassword !== confirmNewPassword) { showToastMessage("Password should be same"); return }
    if (!newPassword) { showToastMessage('please fill in'); return }
    if (!confirmNewPassword) { showToastMessage('please fill in'); return }
    const token = await AsyncStorage.getItem('token')
    let form = new FormData()
    form.append('password', newPassword)
    form.append('confirm_password', confirmNewPassword)

    fetch(Appurl.CHANGE_PASSWORD, {
      method: 'POST',
      headers: { Authorization: `Token ${token}` },
      body: form
    }).then(res => res.json())
      .then(response => {
        if (response && response.message) { showToastMessage(response.message) }
        else { showToastMessage('something went wrong') };
        setNewPassword('');
        setConfirmNewPassword('');
        navigation.navigate('ProfileScreen')
      })
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'black' }}>
      <KeyboardAvoidingView>
        <Image
          source={require('../../Assets/lifeofdesginer-logo.png')}
          style={{ height: 100, width: 250, marginVertical: width / 8, alignSelf: 'center' }} />
        <Text style={Styles.ResetPassText}>RESET PASSWORD?</Text>

        {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
        <View style={Styles.inputboxView}>
          <TextInput
            style={Styles.inputbox}
            placeholderTextColor={Colors.black}
            secureTextEntry={isOpen}
            label={'Enter New Password'}
            // theme={{ colors: { primary: 'black' } }}
            theme={{ colors: { text: "white", primary: '#ffd700', placeholder: 'white' } }}
            value={newPassword}
            onChangeText={setNewPassword}
            left={<TextInput.Icon name="lock" color='#ffd700' size={17} />}

          />
          <TouchableOpacity style={{ position: 'absolute', top: 20, right: 10 }}>
            <Eye name={isOpen ? "eyeo" : 'eye'} type={'ionicon'} color='#ffd700' size={17}
              onPress={() => setIsOpen(!isOpen)} />
          </TouchableOpacity>
        </View>

        <View style={Styles.inputboxView}>
          <TextInput
            style={Styles.inputbox}
            placeholderTextColor={Colors.black}
            label={'Confirm New Password'}
            // theme={{ colors: { primary: 'black' } }}
            theme={{ colors: { text: "white", primary: '#ffd700', placeholder: 'white' } }}
            secureTextEntry={isOpenUp}
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
            left={<TextInput.Icon name="lock-check" color='#ffd700' size={17} />}
          />
          <TouchableOpacity style={{ position: 'absolute', top: 20, right: 10 }}>
            <Eye name={isOpenUp ? "eyeo" : 'eye'} type={'ionicon'} color='#ffd700' size={18}
              onPress={() => setIsOpenUp(!isOpenUp)} />
          </TouchableOpacity>
        </View>
        {/* </TouchableWithoutFeedback> */}

        <View style={{ marginHorizontal: 20, marginVertical: 25 }}>
          <TouchableOpacity style={{ backgroundColor: '#ffd700', justifyContent: 'center', alignItems: 'center', borderRadius: 10, paddingVertical: 15, margin: 30, }}
            onPress={() => Submit()}>
            <Text style={{ fontFamily: Fonts.RobotoBold, color: Colors.black }}>
              Reset Password
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>

  )
}

const Styles = StyleSheet.create({

  inputboxView: {
    marginVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    flexDirection: 'row',
    width: width / 1.12,
    // flexDirection:'row',
    justifyContent: 'space-between',
    alignSelf: "center"
  },
  inputbox: {
    fontFamily: Fonts.RobotoBold,
    marginHorizontal: 5,
    flex: 1,
    height: 60,
    borderRadious: 10,
    backgroundColor: 'black',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a'
  },

  ResetPassText: {
    color: '#ffd700',
    alignSelf: 'center',
    fontSize: 18,
    fontFamily: Fonts.RobotoBold,
    marginBottom: 35,
  }
})

export default ChangePasswordScreen
