import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react'
import { StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { Share } from 'react-native';
import { Alert, ToastAndroid } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import RNThumbnail from 'react-native-thumbnail';
import Fonts from './Theme/Fonts';
import Toast from 'react-native-simple-toast';

export const staticImage = 'https://via.placeholder.com/150'

export const { height, width } = Dimensions.get('window')

const options = {
    title: 'Select Avatar',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};
export const myCustomShare = async (message = '') => {
    const shareOptions = { message: message }
    try {
        const ShareResponse = await Share.open(shareOptions);
        return ShareResponse
    }
    catch (error) { console.log('Error => ', error); }
};

export const showToastMessage = (text = '') => {
    if (Platform.OS == 'ios') {
        return Toast.showWithGravity(text, Toast.LONG, Toast.BOTTOM);
    } else {
        ToastAndroid.show(text, ToastAndroid.SHORT)
    }

}

export const getToken = async () => {
    const token = await AsyncStorage.getItem('token')
    return token
}

export const picimage = (type) => {
    if (type == 'openCamera') {
        launchCamera(options, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };
                var d = { name: response.fileName, type: response.type, uri: response.uri, };
                // setCover({ value: d });
                return d;
            }
        });
    }
    if (type == 'launchImageLibrary') {
        launchImageLibrary(options, async (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };
                var d = { name: response.fileName, type: response.type, uri: response.uri, };
                return d;
            }
        });
    }
}

export const colorsArr = [
    {
        id: 1,
        label: 'Black',
        value: '#000'
    },
    {
        id: 2,
        label: 'White',
        value: '#fff'
    },
    {
        id: 3,
        label: 'Yellow',
        value: '#F2FA08'
    },
    {
        id: 4,
        label: 'Red',
        value: '#FF0101'
    },
    {
        id: 5,
        label: 'Pink',
        value: '#FF00D6'
    },
    {
        id: 6,
        label: 'Parrot green',
        value: '#00D521'
    },
    {
        id: 7,
        label: 'Blue',
        value: '#2901FF'
    },
    {
        id: 8,
        label: 'Orange',
        value: '#FF8001'
    },
    {
        id: 9,
        label: 'Purple',
        value: '#8B00B6'
    },

    {
        id: 10,
        label: 'Grey',
        value: '#717171'
    },
    {
        id: 11,
        label: 'Dark blue',
        value: '#2808FA'
    }
]

export const size =
    [
        { label: 'XS', value: 1 },
        { label: 'SS', value: 2 },
        { label: 'MM', value: 3 },
        { label: 'LL', value: 4 },
        { label: 'XL', value: 5 },
        // { label: '', value: 5.5 },
        // { label: '6', value: 5 },
        // { label: '6.5', value: 6.5 },
        // { label: '7', value: 7 },
        // { label: '7.5', value: 7.5 },
        // { label: '8', value: 8 },
        // { label: '8.5', value: 8.5 },
        // { label: '9', value: 9 },
        // { label: '9.5', value: 9.5 },
        // { label: '10', value: 10 },
        // { label: '10.5', value: 10.5 },
        // { label: '11', value: 11 },
        // { label: '11.5', value: 11.5 },
        // { label: '12', value: 12 },
        // { label: '13', value: 13 },
        // { label: '14', value: 14 },
        // { label: '15', value: 15 },
        // { label: '16', value: 16 },
        // { label: '17', value: 17 }
    ]

export const discount =
    [
        { label: '1%', value: 1 },
        { label: '2%', value: 2 },
        { label: '3%', value: 3 },
        { label: '4%', value: 4 },
        { label: '5%', value: 5 },
        { label: '6%', value: 6 },
        { label: '7%', value: 7 },
        { label: '8%', value: 8 },
        { label: '9%', value: 9 },
        { label: '10%', value: 10 },
        { label: '11%', value: 11 },
        { label: '12%', value: 12 },
        { label: '13%', value: 13 },
        { label: '14%', value: 14 },
        { label: '15%', value: 15 },
        { label: '16%', value: 16 },
        { label: '17%', value: 17 },
        { label: '18%', value: 18 },
        { label: '19%', value: 19 },
        { label: '20%', value: 20 },
        { label: '21%', value: 21 },
        { label: '22%', value: 22 }
    ]

export function get_url_extension(url) {
    return url.split(/[#?]/)[0].split('.').pop().trim();
}

export const convertLocalUpperCase = (string = '') => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const Button = ({ text = '', onPress, style, disabled }) => {
    return <TouchableOpacity onPress={onPress} disabled={disabled}
        style={[styles.button, {
            ...style, opacity: disabled ? 0.4 : 1.0,
            backgroundColor: disabled ? 'rgba(158, 158, 158,0.5)' : '#ffd700',
        }]}>
        <Text style={[styles.btnText,
        { color: disabled ? '#000' : '#000', }]}>{text}</Text>
    </TouchableOpacity>
}

export const getThumbnail = (filepath) => {
    RNThumbnail.get(filepath).then(result => {
        console.log('result', result.path);
    })
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'black',
        paddingVertical: 15,
        // width: width / 2.1,
        width: '50%',
        borderRadius: 5,
        margin: 1
    },
    btnText: {
        fontFamily: Fonts.RobotoMedium,
        color: 'white',
        alignSelf: 'center',
    },
})