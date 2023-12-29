import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Image } from 'react-native'
import Fonts from '../../Theme/Fonts'
import { TouchableOpacity } from 'react-native-gesture-handler'

const ScannerForZelle = () => {
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Image source={require('../../Assets/QrImageZelle.png')} style={{ width: 400, height: 400, alignSelf: "center", marginTop: 70 }} />
            <Text style={{ alignSelf: 'center', fontSize: 18, fontFamily: Fonts.RobotoMedium, color: 'black' }}>Scan QR Code</Text>
            <TouchableOpacity style={{ backgroundColor: 'black', marginHorizontal: 60, marginTop: 50, borderRadius: 10, alignItems: 'center', paddingVertical: 10 }}
            // onPress={()=>navigation.navigate("PaymentScreen")}
            >
                <Text style={{ color: 'white', fontSize: 16, fontFamily: Fonts.RobotoMedium }}>Proceed after pay</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ScannerForZelle

const styles = StyleSheet.create({})