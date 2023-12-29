import React, { useState } from "react";
import Headers from "../../Components/Headers/Headers";
import { Image, ImageBackground, Text, TouchableOpacity, View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../Theme/Colors";
import { Icon } from "react-native-elements";
import Fonts from "../../Theme/Fonts";
import { height, width } from "../Notification/NotificationScreen";
import Eye from 'react-native-vector-icons/AntDesign';
import Appurl from '../../API/Constant'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from 'react-redux'
import Back from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from "react-native-gesture-handler";
import { showToastMessage } from "../../Utils";


const ChangePasswordScreen = ({ route }) => {
  const [isOpen, setIsOpen] = useState(true)
  const [isOpenUp, setIsOpenUp] = useState(true)
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const navigation = useNavigation()
  const [userdata, setUserdata] = useState(route?.params?.Email ? route?.params?.Email : '')
  // const token = useSelector(state => state?.user?.token ? state.user.token : '')

  const Submit = async () => {
    if (newPassword !== confirmNewPassword) { showToastMessage("Password should be same"); return }
    if (!newPassword) { showToastMessage('please fill in'); return }
    if (!confirmNewPassword) { showToastMessage('please fill in'); return }


    let form = new FormData()
    // const token = await AsyncStorage.getItem('token')
    form.append('email', userdata)
    form.append('password', newPassword)
    form.append('confirm_password', confirmNewPassword)

    fetch(Appurl.CHANGE_PASSWORD_FROM_SIGNIN, {
      method: 'PUT',
      // headers: { Authorization: `Token ${token}` },
      body: form
    }).then(res => res.json())
      .then(response => {
        if (response && response.message == "You have successfully reset your password. ") {
          showToastMessage('Password changed successfully')
          navigation.replace("SigninScreen")
        }
        setNewPassword('');
        setConfirmNewPassword('');
      })

  }




  return (


    <ScrollView
      style={{ flex: 1, backgroundColor: 'black', }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        keyboardVerticalOffset={-10}
        style={{ margin: 10 }}
      >
        <TouchableOpacity style={Styles.backButton}
          onPress={() => navigation.goBack()}>
          <Back name='arrow-back-ios' color={Colors.white} size={15} />
        </TouchableOpacity>
        <Image
          source={require('../../Assets/lifeofdesginer-logo.png')}
          style={{ height: 100, width: 250, marginBottom: 20, marginTop: width / 4.5, alignSelf: 'center' }} />
        <View style={{ marginTop: 40, alignSelf: 'center' }}>
          <Text style={{ color: '#ffd700', alignSelf: 'center', fontSize: 18, fontFamily: Fonts.RobotoBold, marginBottom: 40, }}>RESET PASSWORD?</Text>
          <View style={Styles.inputbox}>
            {/* <Image source={require('../../Assets/Icon/lock.png')} style={{ width: 20, height: 20,position:'absolute',top:0,left:0 }} /> */}
            <TextInput
              style={{ fontFamily: Fonts.RobotoBold, marginHorizontal: 5, flex: 1, height: 60, backgroundColor: 'black', borderBottomWidth: 1, borderBottomColor: '#2a2a2a' }}
              placeholderTextColor={Colors.black}
              secureTextEntry={isOpen}
              label={'Enter New Password'}
              value={newPassword}
              // theme={{ colors: { primary: '#2a2a2a' } }}
              theme={{ colors: { text: "white", primary: '#ffd700', placeholder: 'white' } }}
              onChangeText={setNewPassword}
              left={<TextInput.Icon name="lock" color='#ffd700' size={17} />}

            />
            <TouchableOpacity style={{ position: 'absolute', top: 20, right: 10 }}>
              <Eye name={isOpen ? "eyeo" : 'eye'} type={'ionicon'} color='#ffd700' size={17}
                onPress={() => setIsOpen(!isOpen)} />
            </TouchableOpacity>
          </View>

          <View style={Styles.inputbox}>
            {/* <Image source={require('../../Assets/Icon/lock_check.png')} style={{ width: 20, height: 20 }} /> */}
            <TextInput
              style={{ fontFamily: Fonts.RobotoBold, marginHorizontal: 5, flex: 1, height: 60, backgroundColor: 'black', borderBottomWidth: 1, borderBottomColor: '#2a2a2a' }}
              placeholderTextColor={Colors.black}
              label={'Confirm New Password'}
              secureTextEntry={isOpenUp}
              // theme={{ colors: { primary: '#2a2a2a' } }}
              theme={{ colors: { text: "white", primary: '#ffd700', placeholder: 'white' } }}
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              left={<TextInput.Icon name="lock-check" color='#ffd700' size={17} />}
            />
            <TouchableOpacity style={{ position: 'absolute', top: 20, right: 10 }}>
              <Eye name={isOpenUp ? "eyeo" : 'eye'} type={'ionicon'} color='#ffd700' size={17}
                onPress={() => setIsOpenUp(!isOpenUp)} />
            </TouchableOpacity>

          </View>

          <View style={{ marginHorizontal: 20, marginVertical: 30 }}>
            <TouchableOpacity style={{ backgroundColor: '#ffd700', justifyContent: 'center', alignItems: 'center', borderRadius: 10, paddingVertical: 15, marginTop: 30 }}
              onPress={() => Submit()}>
              <Text style={{ fontFamily: Fonts.RobotoBold, color: Colors.black }}>
                Reset Password
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView >


  )
}

const Styles = StyleSheet.create({

  inputbox: {

    marginVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    flexDirection: 'row',
    width: width / 1.12,
    justifyContent: 'space-between'
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    flexDirection: 'row',
    borderBottomColor: 'white'
  },
})

export default ChangePasswordScreen
