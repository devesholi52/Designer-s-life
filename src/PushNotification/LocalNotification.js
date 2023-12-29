import PushNotification from 'react-native-push-notification';

export const msgNotification = (eventData) => {
    // console.log();
    PushNotification.localNotification({
        autoCancel: true,
        // bigText: 'This is local notification demo in React Native app. Only shown, when expanded.',
        // subText: "local notification demo",
        title: eventData.title,
        message: eventData.message,
        vibrate: true,
        vibration: 10000,
        playSound: true,
        soundName: 'default',
        channelId: eventData.channelId
        // actions: '["Yes", "No"]'
    })
}

export default null