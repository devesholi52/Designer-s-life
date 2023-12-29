import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { CreditCardInput } from 'react-native-credit-card-input';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { getCardList, postCardList } from './API';
import { Loader } from './Theme/Metrics';
import { showToastMessage, width } from './Utils';
import Fonts from './Theme/Fonts';
import Appurl from "./API/Constant"
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SubscriptionPymnt({ navigation, route }) {
    const dispatch = useDispatch()
    const token = useSelector(state => state?.user?.token)

    const [amountValue, setAmountValue] = useState('')
    const [cardInfo, setCardInfo] = useState('');
    const [loading, setLoading] = useState(false);
    const [planId, setPlanId] = useState(route?.params?.planId)

    const _onChange = (form) => setCardInfo(form.values)
    const onSubmit = async () => {
        // await googlePayForProduct()
        // .then(async res => {
        // setLoading(true)
        let error = 0
        if (!cardInfo.number) { showToastMessage('please fill in'); return }
        if (!cardInfo.cvc) { showToastMessage('please fill in'); return }
        if (!cardInfo.expiry.substr(0, 2)) { showToastMessage('please fill in'); return }
        if (!cardInfo.expiry.substr(3, 2)) { showToastMessage('please fill in'); return }
        if (!cardInfo) {
            alert('please fill the required info'); setLoading(false); error = 1; return;
        } else {
            const token = await AsyncStorage.getItem('token')
            let month = cardInfo.expiry.substr(0, 2)
            let year = cardInfo.expiry.substr(3, 2)
            let form = new FormData()
            form.append('exp_month', month)
            form.append('exp_year', year)
            form.append('number', cardInfo.number)
            form.append('cvc', cardInfo.cvc)
            fetch(Appurl.CARD_DATA, {
                method: 'POST',
                headers: { Authorization: `Token ${token}` },
                body: form
            })
                .then(res => res.json())
                .then(response => {

                    if (response && response.detail) {
                        showToastMessage('Your card number is incorrect.')
                        // navigation.navigate('PaymentAlreadyExist')
                    }
                    else {
                        showToastMessage('Card details saved successfully”')
                        navigation.navigate('PaymentAlreadyExist')
                    }
                }
                )
            // .finally(e => { setLoading(false) })
            // }).catch(e => {

            // })
        }

    }
    return (
        <ScrollView style={{ flex: 1, paddingTop: 50 }}>
            {loading && <Loader />}
            <Text style={{ alignSelf: 'center', color: "black", fontFamily: Fonts.RobotoBold, marginVertical: 20, fontSize: 18 }}>Please fill card details</Text>
            <CreditCardInput onChange={_onChange} />
            <TouchableOpacity
                onPress={() => onSubmit()}
                style={style.btnStripe}>
                <Text style={style.text}>Proceed to Payment</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const style = StyleSheet.create({
    btnStripe: {
        backgroundColor: 'teal',
        padding: 13,
        alignSelf: 'center',
        marginTop: 50,
        borderRadius: 10,
        width: (width * 60) / 100,
    },
    text: {
        textAlign: 'center',
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold'
    }
})