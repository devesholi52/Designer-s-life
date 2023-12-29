import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { Icon } from 'react-native-elements'
import Fonts from './Theme/Fonts'
import { height } from './Utils'
import Colors from './Theme/Colors'

const PaymentSuccessScreen = ({ route, navigation }) => {
    if (route?.params?.screen == 'ApplePayment') {
        setTimeout(() => {
            navigation.navigate('HomeScreen')
        }, 1500);
    }

    if (route?.params?.screen == 'payment') {
        setTimeout(() => {
            navigation.navigate('HomeScreen')
        }, 1500);
    }
    return (
        <View style={styles.Container}>
            <View style={styles.MainContainer}>
                <TouchableOpacity>
                    <Icon name='checkcircle' type='ant-design' color={'green'} size={50} />
                </TouchableOpacity>
                <Text style={styles.Text}>Payment Successful</Text>
                <Text style={styles.Text2}>Your order has been confirmed</Text>
            </View>
        </View>
    )
}

export default PaymentSuccessScreen

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: 'white',
    },
    MainContainer: {
        alignSelf: "center",
        marginTop: height / 3.5,
        backgroundColor: '#eee',
        padding: 50,
        borderRadius: 5
    },
    Text: {
        fontSize: 30,
        fontFamily: Fonts.RobotoBold,
        marginTop: 25,
        alignSelf: 'center',
        color: 'green'
    },
    Text2: {
        fontFamily: Fonts.RobotoRegular,
        marginTop: 10,
        color: "grey",
        alignSelf: 'center'
    }
})