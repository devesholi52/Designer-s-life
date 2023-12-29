import React from "react";
import { Image, Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import Colors from "../../Theme/Colors";
import { Icon } from "react-native-elements";
import Fonts from "../../Theme/Fonts";
const ResetPasswordScreen = () => {
  return (
    <View style={Styles.Container}>

      <Image source={require('../../Assets/reset_password_screen_image.png')}
        style={{ alignItems: 'center', marginVertical: 10 }} />
      <View>
        <Text style={Styles.resetPasswordText}>Reset Password?</Text>
      </View>
      <View style={{ marginTop: 30 }}>

        <View style={Styles.iconView}>
          <Image source={require('../../Assets/Icon/lock.png')} style={{ width: 20, height: 20 }} />
          <TextInput
            style={{ height: 40, fontFamily: Fonts.RobotoBold, marginHorizontal: 5, flex: 1 }}
            placeholderTextColor={Colors.black}
            secureTextEntry={true}
          />
          <Icon name={'ios-eye-outline'} type={'ionicon'} />
        </View>

        <View style={Styles.iconView}>
          <Image source={require('../../Assets/Icon/lock_check.png')} style={{ width: 20, height: 20 }} />
          <TextInput
            style={{ height: 40, fontFamily: Fonts.RobotoBold, marginHorizontal: 5, flex: 1 }}
            placeholderTextColor={Colors.black}
            secureTextEntry={true}
          />
          <Icon name={'ios-eye-outline'} type={'ionicon'} />
        </View>

        <View style={{ marginHorizontal: 20, marginVertical: 30 }}>
          <TouchableOpacity style={{}}>
            <Text style={{ fontFamily: Fonts.RobotoBold, color: Colors.white }}>
              Reset Password
            </Text>
          </TouchableOpacity>
        </View>

      </View>


    </View>
  )
}

const Styles = StyleSheet.create({

  Container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 30,
    backgroundColor: Colors.white
  },
  resetPasswordText: {
    color: Colors.black,
    fontFamily: Fonts.RobotoBold,
    fontSize: 20,
    marginHorizontal: 5
  },
  iconView: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderColor: '#F0F0F0',
    borderWidth: 2,
    borderRadius: 25,
  },
  ResetPassTouchable: {
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
    paddingVertical: 10
  }

})

export default ResetPasswordScreen