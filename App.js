import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import { InitialScreens } from "./src/Navigation/StackNavigation";
import { Platform, StyleSheet, SafeAreaView } from 'react-native';
import { MenuProvider } from "react-native-popup-menu";
import { LogBox } from 'react-native';
import PushNotification from "react-native-push-notification";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider as StoreProvider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import store from './src/redux/Store'

import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import Main from './src/Main';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import messaging from '@react-native-firebase/messaging';
import { msgNotification } from './src/PushNotification/LocalNotification';


const App = () => {
  const [FCM_TOKEN, setFCM_TOKEN] = useState('')
  LogBox.ignoreLogs([
    "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
  ]);

  useEffect(() => {
    Platform.OS === 'ios' ? localNotificationIOS() : localNotification()
  }, [])

  const localNotification = () => {
    PushNotification.configure({
      onRegister: function (token) {
        AsyncStorage.setItem('firebase_token', token.token)
        setFCM_TOKEN(token.token)
      },
      onNotification: function (notification) {
        // console.log("NOTIFICATION:", notification);
      },
    });
  }


  const localNotificationIOS = async () => {
    // Register the device with FCM
    // console.log('11111111 from ios ');

    await messaging().registerDeviceForRemoteMessages();
    // console.log('11111111 from ios ');

    await messaging().setAutoInitEnabled(true);

    // Get the token
    const token = await messaging().getToken();

    // console.log('fcm token ios...', token);

    // dispatch(setFirebaseToken(token));

    // AsyncStorage.setItem('FireBase_Token', token);

    AsyncStorage.setItem('firebase_token', token)
    setFCM_TOKEN(token)

    var alreadyTapped = false;
    PushNotification.configure({
      onRegister: function (token) {
        // alert(token)
        // console.log('TOKEN:', token);
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


  if (Platform.OS === 'ios') {
    return (
      <PaperProvider >
        <SafeAreaView style={{ flex: 1 }}>
          <StoreProvider store={store}>
            <Main />
          </StoreProvider>
        </SafeAreaView>
      </PaperProvider>
    );
  } else {
    return (
      <PaperProvider >
        <StoreProvider store={store}>
          <Main />
        </StoreProvider>
      </PaperProvider>
    );
  }
};


export default App;
