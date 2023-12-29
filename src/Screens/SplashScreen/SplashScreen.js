import React, { useEffect } from "react";
import { ActivityIndicator, Dimensions, Image, ImageBackground, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Auth } from "../../Navigation/StackNavigation";
import Colors from "../../Theme/Colors";
import Fonts from "../../Theme/Fonts";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width, height } = Dimensions.get('screen')
const SplashScreen = () => {
  const navigation = useNavigation()


  useEffect(() => {
    // setTimeout(function () {
    //   navigation.navigate("SigninScreen")
    // }, 2000);

  }, []);

  const onGetStarted = () => {
    navigation.navigate("SigninScreen")
    // const token = await AsyncStorage.getItem('token')
    // if (token) { navigation.navigate("DrawerNavigation") }
    // else { navigation.navigate('Auth') }
  }
  return (
    <>
      <ImageBackground source={require('../../Assets/splash_screen_back_ground.png')} style={{ width: width, height: height * 0.9, paddingVertical: 30 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Image source={require('../../Assets/logo.png')}
            PlaceholderContent={<ActivityIndicator />} />
        </View>
        <View style={{ flex: 6, alignItems: 'center', justifyContent: 'center' }}>
          <Image source={require('../../Assets/splash_screen_image.png')} style={{ width: width * 1.1, height: height / 1.6 }} resizeMode={'contain'} />
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity onPress={onGetStarted} style={{
            shadowColor: Colors.black,
            shadowOffset: { width: 10, height: 10 },
            shadowOpacity: 0.5,
            elevation: 10,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            backgroundColor: Colors.black, paddingHorizontal: 35, paddingVertical: 11, borderRadius: 20
          }}>
            <Text style={{ color: Colors.white, fontFamily: Fonts.RobotoBold }}>Getting Started</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

    </>
  )
}
export default SplashScreen
