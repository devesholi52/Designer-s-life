import React, { useState } from "react";
import Colors from "../../Theme/Colors";
import { Image, Text, TextInput, TouchableOpacity, View, StyleSheet, ScrollView } from "react-native";
import { CodeField, useBlurOnFulfill, useClearByFocusCell, Cursor } from "react-native-confirmation-code-field";
import metrics from "../../Theme/Metrics";
import { useNavigation } from "@react-navigation/native";
import ResetPasswordScreen from "./ResetPasswordScreen";
import Fonts from "../../Theme/Fonts";
import Appurl from "../../API/Constant"
import { width } from "../Notification/NotificationScreen";
import { showToastMessage } from "../../Utils";
import Back from 'react-native-vector-icons/MaterialIcons';

export default OTPScreen = ({ route }) => {
  const [token, setToken] = useState(route?.params?.token ? route?.params?.token : '')
  const [userdata, setUserdata] = useState(route?.params?.usernm ? route?.params?.usernm : '')
  const navigation = useNavigation()
  const CELL_COUNT = 4;
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT, });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const Submit = () => {
    if (!value) { showToastMessage('Please fill in'); return }
    let form = new FormData()
    form.append('username', userdata)
    form.append('otp', value)
    // form.append('data', userdata)
    fetch(Appurl.OTP, {
      method: 'PUT',
      body: form
    }).then(res => res.json())
      .then(response => {

        if (response && response.message == "you have successfully verify OTP.") {
          showToastMessage('OTP verified, Sign in to continue.')
          navigation.replace("SigninScreen")
        }

        if (response && response.message == "OTP that you enter is not valid.") {
          showToastMessage('Please enter valid OTP')
          // navigation.replace("SigninScreen")
        }
      }
      )
  }


  const RESENDOTP = () => {
    let form = new FormData()
    form.append('username', userdata)
    fetch(Appurl.OTP, {
      method: 'POST',
      body: form
    }).then(res => res.json())
      .then(response => {
        if (response) {
          console.log(response);
          showToastMessage("OTP resent successfully.")
          // navigation.replace("SigninScreen")
        }
      }
      )
  }


  // const goToResetPassword = () => {
  //   navigation.navigate("ResetPasswordScreen")
  // }

  return (

    <ScrollView
      style={{ flex: 1, backgroundColor: 'black', }}>
      <TouchableOpacity style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Back name='arrow-back-ios' color={Colors.white} size={15} />
      </TouchableOpacity>
      <Image
        source={require('../../Assets/lifeofdesginer-logo.png')}
        style={{ height: 100, width: 250, alignSelf: 'center', marginTop: width / 4.5, marginBottom: 20, alignSelf: 'center', }} />
      {/* <View style={{ marginTop: width / 6 }}> */}
      <View style={{ marginHorizontal: 5, marginVertical: 10, alignSelf: 'center' }}>
        <Text style={{ fontFamily: Fonts.RobotoBold, fontSize: 20, color: '#ffd700', alignSelf: 'center', marginBottom: 5 }}>One Time Passcode</Text>
        <Text style={{ fontFamily: Fonts.RobotoBold, color: Colors.white, fontSize: 11, alignSelf: 'center', marginTop: 10 }}>4 digits passcode sent to your Email </Text>
        <Text style={{ fontFamily: Fonts.RobotoBold, color: Colors.white, fontSize: 11, alignSelf: 'center', marginTop: 5 }}>{userdata?.user?.email}</Text>
      </View>
      <View style={{ marginTop: 30 }}>
        <View style={{ paddingHorizontal: 7, marginBottom: 5, }}>
          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="numeric"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => (
              <View
                // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
                onLayout={getCellOnLayoutHandler(index)}
                key={index}
                style={[styles.cellRoot, isFocused && styles.focusCell]}>
                <Text style={styles.cellText}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              </View>
            )}
          />

        </View>

        <View style={styles.ResendOTPview}>
          <Text style={{ fontSize: 13, fontFamily: Fonts.RobotoRegular, color: 'white' }}>Didn't receive the OTP? </Text>
          <TouchableOpacity
            onPress={() => RESENDOTP()}>
            <Text style={{ fontSize: 13, color: '#ffd700', fontFamily: Fonts.RobotoBold, marginLeft: 8 }}>Resend OTP</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginHorizontal: 20, marginVertical: 50 }}>
          <TouchableOpacity /* onPress={goToResetPassword} */ style={{ backgroundColor: '#ffd700', justifyContent: 'center', alignItems: 'center', borderRadius: 7, paddingVertical: 15 }}
            onPress={() => Submit()}>
            <Text style={{ fontFamily: Fonts.RobotoBold, color: Colors.black, fontSize: 17 }}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>

      </View>
      {/* </View> */}
    </ScrollView>

  )
}
const styles = StyleSheet.create({
  root: {
    padding: 20,
    minHeight: 300
  },

  title: {
    textAlign: 'center',
    fontSize: 30
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    flexDirection: 'row',
    borderBottomColor: 'white'
  },

  ResendOTPview: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30
  },

  oneTimePasscodeText: {
    fontFamily: Fonts.RobotoBold,
    fontSize: 20,
    color: '#ffd700',
    alignSelf: 'center',
    marginBottom: 5
  },

  codeFieldRoot: {
    marginVertical: 10,
    width: metrics.ScreenWidth - 120,
    marginLeft: 'auto',
    marginRight: 'auto',

  },
  cellRoot: {
    width: metrics.ScreenWidth / 7,
    height: metrics.ScreenWidth / 7,
    justifyContent: 'center',
    alignItems: 'center',
    // borderColor: '#ffd700',
    borderWidth: 1,
    backgroundColor: 'white'
  },
  cellText: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: Fonts.RobotoBold
  },
  focusCell: {
    borderBottomColor: '#ffd700',
    borderBottomWidth: 3,
  },
  ResendContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    marginHorizontal: 7,
    marginVertical: 10
  },
  tickText: {
    marginLeft: 0,
  },
});

