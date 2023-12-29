import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { Loader } from '../../Theme/Metrics';
import { useNavigation } from '@react-navigation/native';
import { height, width } from '../Notification/NotificationScreen';
import Fonts from '../../Theme/Fonts';
import Appurl from '../../API/Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, showToastMessage } from '../../Utils';
import PaymentCard from './PaymentCard';
import { getCardList } from '../../API';
import { useSelector } from 'react-redux';
import Colors from '../../Theme/Colors';

const data = [
    {
        like: '100 likes',
        title: 'Vikram kumar',
        Delever: 'Delivery To',
        desc: 'information technology is a topic of choice in the blog world-think breaking...',
    },
    {
        like: '100 likes',
        title: 'Vinay kumar',
        Delever: 'Delivery To',
        desc: 'information technology is a topic of choice in the blog world-think breaking...',
    },
];

export default function PaymentAlreadyExist({ route }) {
    const navigation = useNavigation();
    const token = useSelector(state => state?.user?.token)
    const [loading, setLoading] = useState(false);
    const [addressId, setProductId] = useState(route?.params?.AddressID ? route?.params?.AddressID : '')
    const [paymentList, setPaymentList] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [currentAddress, setCurrentAddress] = useState(null);
    const [dealIDD, setDealIdd] = useState(route?.params?.IdOfDeal ? route?.params?.IdOfDeal : '')
    const [totalAmount, setTotalAmount] = useState(route?.params?.TotalAmount ? route?.params?.TotalAmount : '')
    const [discountPrice, setDiscountPrice] = useState(route?.params?.DiscountPrice ? route?.params?.DiscountPrice : '')
    const [dealID, setDealId] = useState(route?.params?.DISC ? route?.params?.DISC : '')
    const [selectedProductData, setSelectedProductData] = useState(route?.params?.selectedProductData ? route?.params?.selectedProductData : '')
    const [products, setProducts] = useState(route?.params?.products ? route?.params?.products : '')

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getCardData();
    }, []);
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getCardData()
            return unsubscribe;
        })
    }, [])

    const getCardData = async () => {
        setLoading(true);
        getCardList(token).then(response => {
            if (response && response.data) {
                let temp = []
                response.data.forEach(element => {
                    let local = element;
                    element.isSelected = false;
                    temp.push(local)
                });
                setPaymentList([...temp]);
                setCurrentAddress("")
            }
        }).finally(e => setLoading(false), setRefreshing(false));
    };


    const cardDelete = async () => {
        const token = await AsyncStorage.getItem('token')
        let form = new FormData()
        form.append('card_id', paymentList?.[0]?.card_id)
        fetch(Appurl.CARD_DATA, {
            method: 'DELETE',
            headers: { Authorization: `Token ${token}` },
            body: form
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    showToastMessage('Deleted')
                }
                getCardData()
            }
            )
    }
    console.log("paymentList", paymentList);

    const PAYFORPRODUCT = async () => {
        const token = await AsyncStorage.getItem('token')
        let form = new FormData()
        form.append('card_id', paymentList?.[0]?.card_id)
        // form.append('amount', Math.trunc(totalAmount - discountPrice))
        form.append('delivery_address', addressId)
        fetch(Appurl.PAYMENT_LIFE_OF_DESIGNER, {
            method: 'POST',
            headers: { Authorization: `Token ${token}` },
            body: form
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    showToastMessage('Product purchased')
                    navigation.navigate('PaymentSuccessScreen', {
                        screen: 'payment'
                    })
                }
            })
    }

    const PAYFORDEAL = async () => {
        const token = await AsyncStorage.getItem('token')
        let ids = []
        let size = []
        selectedProductData.forEach(e => {
            ids.push(e.id)
            size.push(e.size)
        })
        let form = {
            'card_id': paymentList?.[0]?.card_id,
            'delivery_address': addressId,
            // 'amount': Math.trunc(products?.price),
            'deal': dealIDD,
            'deal_product': ids,
            'deal_product_size': size,
        }
        fetch(Appurl.PAYMENT_LIFE_OF_DESIGNER, {
            method: 'POST',
            headers: {
                Authorization: `Token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    showToastMessage('Deal purchased')
                    navigation.navigate('PaymentSuccessScreen', {
                        screen: 'payment'
                    })
                }
            })
    }


    const onPressCard = index => {
        let temp = paymentList // assigned initial list to temp
        temp.forEach(e => e.isSelected = false)
        let local = temp[index]  // find current element  
        local.isSelected = true; // assigned selected value to true for current element
        setCurrentAddress(local)
        temp.splice(index, 1, local) //replaced current element into the newly created array
        setPaymentList([...temp])
    }
    return (
        <ScrollView style={styles.container}>
            {loading && <Loader size={'small'} color={'#000'} />}
            {refreshing && <ActivityIndicator />}
            {paymentList && paymentList.length !== 0 ? (
                <>
                    <Text style={{ alignSelf: 'center', color: "black", fontFamily: Fonts.RobotoBold, marginVertical: 20, fontSize: 18 }}>Please select your card</Text>
                    <FlatList
                        data={paymentList}
                        renderItem={({ item, index }) => <PaymentCard
                            item={item} index={index}
                            cardDelete={cardDelete}
                            navigation={navigation}
                            onPressCard={onPressCard}
                        />}
                        showsVerticalScrollIndicator={false}
                    />
                    <>
                        <View style={{ padding: 10, backgroundColor: Colors.greyFA, marginVertical: 40 }}>
                            <Text style={{ fontFamily: Fonts.RobotoBold, color: Colors.black, marginVertical: 10 }}>Price Detail</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 3 }}>
                                <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoRegular }}>Total MRP</Text>
                                {(dealIDD == "") ?
                                    <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoBold }}>{`${totalAmount}`}</Text>
                                    :
                                    <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoBold }}>{products?.total_price ? products?.total_price : ''}</Text>
                                }
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 3 }}>
                                <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoRegular }}>Discount Price</Text>
                                {(dealIDD == "") ?
                                    <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoBold }}>{Math.trunc(totalAmount - discountPrice)}</Text>
                                    :
                                    <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoBold }}>{products?.discount ? products?.discount : ''}</Text>
                                }
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 3 }}>
                                <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoRegular }}>Convenience Fee</Text>
                                <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoBold }}>Free</Text>
                            </View>



                        </View>



                        <View style={{ padding: 10, backgroundColor: Colors.greyFA, }}>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold }}>Total Amount</Text>
                                {(dealIDD == "") ?
                                    <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoBold }}>{Math.trunc(discountPrice)}</Text>
                                    :
                                    <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoBold }}>{products?.price ? products?.price : ''}</Text>
                                }
                            </View>
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button
                                style={{ margin: 20, }}
                                disabled={currentAddress ? false : true}
                                text='Place Order'
                                onPress={() => {
                                    if (dealIDD !== "") {
                                        PAYFORDEAL()
                                    }
                                    else {
                                        PAYFORPRODUCT()
                                    }
                                }}
                            />
                            <TouchableOpacity onPress={() => navigation.navigate('SubscriptionPymnt')}
                                style={styles.buttonadressproceed}>
                                <Text style={{ color: 'white' }}>Add New Card</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                </>
            ) : (
                <View style={styles.refreshView}>
                    <Text style={styles.noData}>No data available</Text>
                    <Button text='Refresh' onPress={onRefresh} style={styles.refreshBtn} />
                    <Button
                        style={{ marginTop: 5 }}
                        text='Add New Card'
                        onPress={() => navigation.navigate('SubscriptionPymnt')}
                    />
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 10
    },
    Maincontainer: {
        marginTop: 10,
        // borderColor: '#eee',
        borderRadius: 4,
        paddingVertical: 15,
        margin: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        elevation: 4,
    },
    title: {
        color: 'black',
        fontSize: 14,
        marginVertical: 5,
        marginLeft: 25,
    },
    desc: {
        color: 'black',
        fontSize: 14,
        marginLeft: 25,
    },

    DeliverTO: {
        fontSize: 15,
        fontFamily: Fonts.RobotoBold,
        color: 'black',
        marginLeft: 7,
    },
    image: {
        height: height / 24,
        width: width / 8,
    },

    toptimetext: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        alignSelf: 'flex-end',
        paddingHorizontal: 10,
        paddingTop: 5,
        fontSize: 12,
    },
    menu: {
        backgroundColor: 'white',
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        position: 'absolute',
        top: 0,
        right: 0,
        width: 100,
        height: 70,
    },
    VerticalDot: {
        position: 'absolute',
        top: 0,
        right: 10,
    },
    closeMenu: {
        position: 'absolute',
        top: -10,
        right: -10,
    },
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
    noData: {
        color: '#000',
        fontFamily: Fonts.RobotoMedium,
        textAlign: 'center',
        padding: 10,
        fontSize: 20,
    },
    refreshView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    refreshBtn: {
        alignSelf: 'center'
    },
    buttonContainer: {
        // flexDirection: 'row',
        alignItems: 'center',
        width: width / 1.17,
        alignSelf: 'center',
        marginBottom: 20
    },
    buttonadressproceed: {
        backgroundColor: 'black',
        marginHorizontal: 50,
        paddingHorizontal: 37,
        borderRadius: 5,
        paddingVertical: 14
    }
});
