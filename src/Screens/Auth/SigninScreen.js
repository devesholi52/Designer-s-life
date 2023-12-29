import React, { useEffect, useState } from "react";
import { Image, Text, Alert, TouchableOpacity, View, Platform, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { TextInput } from "react-native-paper";
import Colors from "../../Theme/Colors";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Fonts from "../../Theme/Fonts";
import Appurl from "../../API/Constant"
import { callSignInWithAppleAPI, GoogleLogin } from "../../API/index"
import { height, width } from "../Notification/NotificationScreen";
import { showToastMessage } from "../../Utils";
import { useDispatch, useSelector } from 'react-redux';
import { changeTokenValue, setUserInfo } from '../../redux/reducers/userReducer'
import logo from '../../Assets/lifeofdesginer-logo.png'
import googleImg from '../../Assets/google.png'
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth'
import appleAuth, {
  AppleButton,
  AppleAuthError,
} from '@invertase/react-native-apple-authentication';
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import messaging from '@react-native-firebase/messaging';
import { msgNotification } from '../../PushNotification/LocalNotification';
import useAuthentication from "../../customHooks/useAuthentication";
import { Loader } from "../../Theme/Metrics";

GoogleSignin.configure({
  webClientId:
    Platform.OS == 'ios'
      ? '841406606658-hi87iuj6nnmo0unuvarqmlo7pv5fmoe9.apps.googleusercontent.com'
      : '246790377955-04v60e6v5nuaoiqppdaa103rcsbu5g7a.apps.googleusercontent.com',
  iosClientId:
    '841406606658-hi87iuj6nnmo0unuvarqmlo7pv5fmoe9.apps.googleusercontent.com',
  offlineAccess: false,
});

export default function SigninScreen() {
  const dispatch = useDispatch()
  const { isAuthenticated, getUserToken } = useAuthentication();
  const tokenfunc = useSelector(state => state?.user?.tokenfunc)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isOpen, setIsOpen] = useState(true)
  const [fireBaseToken, setFireBaseToken] = useState('')
  const navigation = useNavigation()
  const goToSignupScreen = () => { navigation.navigate("SignupScreen") }

  useEffect(() => {
    Platform.OS == 'ios' ? localNotificationIOS() : getFIrebaseTok()
  }, [])


  const GoogleSign_in = (token) => {
    let form = new FormData()
    form.append("social_token", token)
    form.append("device_type", Platform.OS)
    form.append("device_os", Platform.OS)
    form.append("device_token", fireBaseToken)
    console.log(form);
    GoogleLogin(form).then(async (response) => {
      console.log("response", response);
      // fireBaseToken(response.data?.[0]?.user?.[0]?.id, response.data.key)
      // once you will successfully login then
      dispatch(changeTokenValue(response?.key))
      dispatch(setUserInfo(response?.user))
      AsyncStorage.setItem('token', response?.key)
      AsyncStorage.setItem('userinfo', JSON.stringify(response?.user))
    }
    )
  }


  const AppleLogin = (token) => {
    // alert('check')
    let form = new FormData();
    form.append("access_token", token);
    form.append("device_os", "ios");
    form.append("device_token", fireBaseToken);
    console.log(form);
    callSignInWithAppleAPI(form).then(async (response) => {
      console.log("response ::: ", response);
      dispatch(changeTokenValue(response?.data?.key))
      dispatch(setUserInfo(response?.data?.user))
      AsyncStorage.setItem('token', response?.data?.key)
      AsyncStorage.setItem('userinfo', JSON.stringify(response?.data?.user))
    }
    )
    // fetch(Appurl.APPLEAPI, {
    //   method: 'POST',
    //   body: form,
    // }).then(res => res.json())
    //   .then(response => {
    //     console.log("response", response);
    //     // dispatch(changeTokenValue(response.data?.[0]?.key))
    //     // dispatch(setUserInfo(response?.data?.[0]?.user))
    //     // AsyncStorage.setItem('token', response?.data?.[0]?.key)
    //     // AsyncStorage.setItem('userinfo', JSON.stringify(response.data?.[0]?.user))
    //   })
  }

  const signIn = async () => {
    try {
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        await GoogleSignin.signOut();
      }
      const { idToken } = await GoogleSignin.signIn()
      const googleCredentials = auth.GoogleAuthProvider.credential(idToken)
      GoogleSign_in(googleCredentials.token)
      console.log("google signin token", googleCredentials)
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        /* do something */
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('in progress');
        console.log("1", error);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('play services not available or outdated');
        console.log("2", error);
      } else {
        Alert.alert('Something went wrong', error.toString());
        console.log("7", error);
      }
    }
  };

  const onAppleButtonPress = async () => {
    try {
      setLoading(true);
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
      // alert("hey")
      if (appleAuthRequestResponse.authorizationCode)
        await AppleLogin(appleAuthRequestResponse.authorizationCode)
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.code === AppleAuthError.CANCELED) {
        showToastMessage(strings('User cancelled Apple Sign-in'));
      }
      if (error.code === AppleAuthError.FAILED) {
        showToastMessage(strings('Touch ID incorrect'));
        // alert('Touch ID wrong');
      }
      if (error.code === AppleAuthError.INVALID_RESPONSE) {
        showToastMessage(strings('Touch ID incorrect'));
        // alert('Touch ID wrong');
      }
      if (error.code === AppleAuthError.NOT_HANDLED) {
        showToastMessage(strings('Something went wrong'));
        // alert('Something went wrong');
      }
      if (error.code === AppleAuthError.UNKNOWN) {
        showToastMessage(strings('Touch ID incorrect'));
        // alert('Touch ID wrong');
      } else {
        // other unknown error
      }
    }
  };

  const getFIrebaseTok = () => {
    PushNotification.configure({
      onRegister: function (token) {
        console.log("firebase token", token.token)
        AsyncStorage.setItem('firebase_token', token.token)
        console.log(token.token);
        setFireBaseToken(token.token)
      }
    })
  }
  const localNotificationIOS = async () => {
    // Register the device with FCM
    // console.log('11111111 from ios ');

    await messaging().registerDeviceForRemoteMessages();
    // console.log('11111111 from ios ');

    await messaging().setAutoInitEnabled(true);

    // Get the token
    const token = await messaging().getToken();

    console.log('fcm token ios... login page :: ', token);

    // dispatch(setFirebaseToken(token));

    // AsyncStorage.setItem('FireBase_Token', token);

    AsyncStorage.setItem('firebase_token', token)
    setFireBaseToken(token)

    var alreadyTapped = false;
    PushNotification.configure({
      onRegister: function (token) {
        // alert(token)
        console.log('TOKEN:', token);
        // if (Platform.OS == 'android')
        //     AsyncStorage.setItem('FireBase_Token', JSON.stringify(token.token))
      },

      onNotification: function (notification) {
        // console.log('NOTIFICATION:', notification);
        PushNotification.getChannels(function (channels) {
          // console.log('getchannels gives us', channels);
        });
        // alert(JSON.stringify(notification)),
        // console.log("NOTIFICATION:asda", notification, value);
        // alert(value)
        // {
        if (
          notification.foreground == true &&
          notification.userInteraction == false &&
          alreadyTapped == false
        ) {
          alreadyTapped = true;
          msgNotification(notification);
          setTimeout(() => {
            alreadyTapped = false;
          }, 50000);
        }
        // }


        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      onAction: function (notification) { },

      onRegistrationError: function (err) {
        console.error(err.message, err, "  <<<==============");
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      // Android only
      senderID: '70377328086',

      popInitialNotification: true,

      requestPermissions: true,
    });
    PushNotification.popInitialNotification((notification) => {
      // console.log("NOTIFICATION :::: ", notification);
    });
  };
  // const firebase_token = (id, key) => {
  //   let form = new FormData()
  //   form.append('user', `${id}`)
  //   // form.append('device_os', Platform.OS)
  //   // form.append('device_token', fireBaseToken)
  //   console.log('device_token ::: ', fireBaseToken);
  //   fetch(Appurl.PUSH_NOTIFICATION, {
  //     method: 'POST',
  //     headers: { Authorization: `Token ${key}` },
  //     body: form
  //   }).then(res => res.json())
  //     .then(response => {
  //       console.log('response::', response)
  //     })
  // }
  const Submit = () => {
    // setLoading(true)
    if (!email || !password) { showToastMessage('Please fill in'); return }
    let form = new FormData()
    form.append('username', email)
    form.append('password', password)
    form.append('device_os', Platform.OS)
    form.append('device_token', fireBaseToken)
    console.log("fireBaseToken", fireBaseToken);
    fetch(Appurl.LOGIN, {
      method: 'POST',
      body: form
    }).then(res => res.json())
      .then(response => {
        console.log("response", response);
        if (response && response.message == "Incorrect authentication credentials.") { showToastMessage('Please enter correct Username or Password'); }
        if (response && response.message == "User matching query does not exist.") { showToastMessage('Please enter correct Username or Password'); }
        if (response && response.message == "Please verify your email first and try logging in again.") {
          showToastMessage('Please verify your email first and try logging in again.'),
            navigation.navigate("OTPScreen")
        }
        if (response && response.data && response.data.key) {
          // firebase_token(response.data.user.id, response.data.key) 
          // once you will successfully login then 
          dispatch(changeTokenValue(response.data.key))
          dispatch(setUserInfo(response?.data?.user))
          AsyncStorage.setItem('token', response?.data?.key)
          AsyncStorage.setItem('userinfo', JSON.stringify(response.data.user))
          getUserToken()
        }
      })
    // .finally(e => setLoading(false))
  }
  return (
    <ScrollView style={Styles.mainContainerImage}>
      {loading && <Loader />}
      <Image source={logo} style={Styles.image}
        PlaceholderContent={<ActivityIndicator />} />
      <Text style={Styles.signinText}>Sign In</Text>
      <TextInput
        style={{ fontFamily: Fonts.RobotoBold, height: 60, borderRadious: 10, backgroundColor: 'black', borderBottomWidth: 1, borderBottomColor: '#2a2a2a', justifyContent: 'center' }}
        placeholderTextColor='red'
        value={email}
        theme={{ colors: { text: "white", primary: '#ffd700', placeholder: 'white' } }}
        keyboardType="default"
        label={'Enter Email'}
        selectionColor='white'
        onChangeText={setEmail}
        left={<TextInput.Icon name="account" color='#ffd700' size={17} />}
      />

      <View style={Styles.inputbox}>
        <TextInput
          style={{ fontFamily: Fonts.RobotoBold, flex: 1, color: "black", height: 60, borderRadious: 10, placeholderTextColor: '#333', backgroundColor: 'black', borderBottomWidth: 1, borderBottomColor: '#2a2a2a' }}
          secureTextEntry={isOpen}
          label={'Enter Password'}
          theme={{ colors: { text: "white", primary: '#ffd700', placeholder: 'white' } }}
          value={password}
          onChangeText={setPassword}
          left={<TextInput.Icon name="lock" color='#ffd700' size={17} />}

        />
        <TouchableOpacity style={{ position: 'absolute', top: 20, right: 10 }}>
          <Icon name={isOpen ? "ios-eye-outline" : 'eye'} type={'ionicon'} color='#ffd700' size={17}
            onPress={() => setIsOpen(!isOpen)} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')} style={{ marginHorizontal: 20 }}>
        <Text style={{ color: '#ffd700', fontFamily: Fonts.RobotoBold, fontSize: 12 }}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{ backgroundColor: '#ffd700', justifyContent: 'center', alignItems: 'center', borderRadius: 9, paddingVertical: 15, marginTop: 40 }}
        onPress={() => Submit()}>
        <Text style={{ fontFamily: Fonts.RobotoBold, color: Colors.black, fontSize: 17 }}>
          Sign In
        </Text>
      </TouchableOpacity>

      <Text style={Styles.socailText}>Or via social media</Text>

      {(Platform.OS !== "ios") ?
        <>
          <TouchableOpacity style={Styles.googleBtn}
            onPress={() => signIn()}>
            <Image source={googleImg} style={{ width: 17, height: 17, marginLeft: 6 }} />
            <Text style={Styles.googleText}>Sign in with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={Styles.Applebtn}
            onPress={() => onAppleButtonPress()}>
            <Icon name="apple1" type="ant-design" size={16} color={Colors.white} />
            <Text style={Styles.appleText}>Sign in with Apple</Text>
          </TouchableOpacity>
        </>
        :
        <TouchableOpacity style={Styles.googleBtn}
          onPress={() => signIn()}>
          <Image source={googleImg} style={{ width: 20, height: 20 }} />
          <Text style={Styles.googleText}>Google</Text>
        </TouchableOpacity>
      }

      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', paddingVertical: 25 }}>
        <Text style={{ color: Colors.white, fontFamily: Fonts.RobotoRegular }}>Don't have an account? </Text>
        <TouchableOpacity onPress={goToSignupScreen}>
          <Text style={{ color: '#ffd700', fontFamily: Fonts.RobotoBold, paddingLeft: 4 }}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>


  )
}


const Styles = StyleSheet.create({
  mainContainerImage: {
    padding: 20,
    flex: 1,
    backgroundColor: 'black',
    // paddingTop: width / 4.9
  },
  socailText: {
    alignSelf: 'center',
    color: 'white',
    fontFamily: Fonts.RobotoRegular,
    // marginTop: 25,
    marginVertical: 20,
    fontSize: 15
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 5,
    shadowColor: Platform.OS == 'ios' && "#fff",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
  },
  Applebtn: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2, borderColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 5,
    shadowColor: Platform.OS == 'ios' && "#fff",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,

  },
  googleText: {
    fontFamily: Fonts.RobotoBold,
    color: Colors.white,
    marginHorizontal: 7,
    fontSize: 16
  },
  appleText: {
    fontFamily: Fonts.RobotoBold,
    color: Colors.white,
    marginHorizontal: 7,
    fontSize: 16,
    // paddingRight: 6
  },
  image: {
    height: 100, width: 250,
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 30
  },

  signinText: {
    color: "#ffd700",
    fontFamily: Fonts.RobotoBold,
    fontSize: 24,
    marginHorizontal: 10,
    alignSelf: 'center',
    marginVertical: 30

  },

  inputBoxEmail: {
    marginVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    // borderTopWidth: 1,
    // borderLeftWidth: 1,
    // borderRightWidth: 1,
    // borderTopLeftRadius: 8,
    // borderTopRightRadius: 8
  },


  inputbox: {
    marginVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    width: width / 1.12,
    justifyContent: 'space-between',
  }
})