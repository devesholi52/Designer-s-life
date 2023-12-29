// import { notifications } from 'react-native-firebase';
import { msgNotification } from './LocalNotification'
import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import AsyncStorage from '@react-native-community/async-storage';
import { Platform } from 'react-native';

import { useDispatch } from 'react-redux';
import {
    setFirebaseToken
} from '../redux/Reducers/UserReducer';
var PushNotification = require("react-native-push-notification");

const LocalNotification = async (value) => {
    // Register the device with FCM
    await messaging().registerDeviceForRemoteMessages();

    // Get the token
    const token = await messaging().getToken();
    const dispatch = useDispatch();

    dispatch(setFirebaseToken(token));

    AsyncStorage.setItem('FireBase_Token', token)

    var alreadyTapped = false
    PushNotification.configure({

        onRegister: function (token) {
            // alert(token)
            // console.log("TOKEN:", token);
            // if (Platform.OS == 'android')
            //     AsyncStorage.setItem('FireBase_Token', JSON.stringify(token.token))
        },

        onNotification: function (notification) {
            PushNotification.getChannels(function (channels) {
                // console.log('getchannels gives us', channels);
            });
            // alert(JSON.stringify(notification)),
            // console.log("NOTIFICATION:asda", notification, value);
            // alert(value)
            // {
            if (notification.foreground == true && notification.userInteraction == false && alreadyTapped == false) {
                alreadyTapped = true
                msgNotification(notification)
                setTimeout(() => {
                    alreadyTapped = false
                }, 50000);
            }
            // }

            notification.finish(PushNotificationIOS.FetchResult.NoData);
        },

        onAction: function (notification) {
        },


        onRegistrationError: function (err) {
            console.error(err.message, err);

        },

        permissions: {
            alert: true,
            badge: true,
            sound: true,
        },
        // Android only
        senderID: "45001123031",

        popInitialNotification: true,

        requestPermissions: true,

    });
}


export default LocalNotification;
