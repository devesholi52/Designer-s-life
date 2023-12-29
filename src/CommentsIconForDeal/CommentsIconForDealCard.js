import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useState, useEffect } from 'react'
import { View, TextInput, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import Appurl from '../API/Constant'
import { useSelector, useDispatch } from 'react-redux'

import Fonts from '../Theme/Fonts'
import { width } from '../UploadProduct/Deal'
import { staticImage } from '../Utils'
import moment from 'moment'

export default function CommentsIconForDealCard({ item, index }) {

    const userData = useSelector(state => state?.user?.userData ? state.user.userData : '')



    return (

        <View style={styles.container}>

            <View style={styles.imageView}>
                <Image source={{ uri: userData?.profile?.picture ? Appurl.ROOT + userData?.profile?.picture : staticImage }} style={styles.image} />
                <View style={styles.textcontainer}>
                    <Text style={{ fontSize: 15, color: 'black', lineHeight: 30, fontFamily: Fonts.RobotoMedium, paddingLeft: 3 }}>{item.created_by.first_name}</Text>
                    <Text style={styles.date}> {item.created_on ? moment(item.created_on).format('MM/DD/YYYY') : ''}</Text>
                    <Text style={{ color: 'grey', lineHeight: 20, fontFamily: Fonts.RobotoRegular, fontSize: 13, marginBottom: 5, paddingLeft: 3 }}>{item.comment}</Text>
                </View>
            </View>
            {/* <TouchableOpacity style={styles.button}
                >
                <Text style={styles.buttontext}>Reply</Text>
            </TouchableOpacity> */}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        // alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderColor: '#eee',
        width: width / 1.05,
        margin: 10,
        flex: 1

    },
    imageView: {
        flexDirection: 'row',
        padding: 4,
    },
    image: {
        height: 30,
        width: 30,
        borderRadius: 30,
        margin: 5
    },
    textcontainer: {
        width: width / 1.2,
        padding: 3
    },
    date: {
        color: 'grey',
        lineHeight: 30,
        fontFamily: Fonts.RobotoRegular,
        fontSize: 13
    },
    button: {
        alignSelf: 'flex-end',
        marginRight: 10,
        marginBottom: 3
    },
    buttontext: {
        color: 'green',
        fontFamily: Fonts.RobotoMedium

    }

})
