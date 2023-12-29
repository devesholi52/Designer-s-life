import { StyleSheet, Text, View, TouchableOpacity, Button, Alert, FlatList, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import FontistoIcons from 'react-native-vector-icons/Fontisto';
import Animated, { color } from 'react-native-reanimated';
import { TextInput } from "react-native-paper"
import IonIcons from 'react-native-vector-icons/Ionicons';
// import { HeaderWithBackIcons } from "../../../reusable_components/Header"
import AntDesign from "react-native-vector-icons/AntDesign"
import MaterialIconss from "react-native-vector-icons/MaterialIcons"
// import { GetPlanPayment, clearState, GetArticlePlanPayment } from "../../../../redux/services/Writer/GetPremiumPayment"
const PaymentRequest = require('react-native-payments').PaymentRequest;
import { useSelector, useDispatch } from 'react-redux';
import Colors from './Theme/Colors';
import Fonts from './Theme/Fonts';
import { showToastMessage } from './Utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Appurl from "./API/Constant"
import { Icon } from "react-native-elements";

const ApplePayment = ({ navigation, route }) => {
    const [id, setid] = useState(route?.params?.id ? route.params.id : '');
    const [dealIDD, setDealIdd] = useState(route?.params?.IdOfDeal ? route?.params?.IdOfDeal : '')
    const [selectedProductData, setSelectedProductData] = useState(route?.params?.selectedProductData ? route?.params?.selectedProductData : '')
    const [deliveryAddressId, setDeliveryAddress] = useState(route?.params?.AddressID ? route?.params?.AddressID : '')
    const [products, setProducts] = useState(route?.params?.products ? route.params.products : '');
    const [DiscountPrice, setDiscountPrice] = useState(route?.params?.DiscountPrice ? route.params.DiscountPrice : '');
    const [price, setprice] = useState(route?.params?.price ? route.params.price : '')
    const [name, setname] = useState(route?.params?.name ? route.params.name : '')
    const [description, setdescription] = useState(route?.params?.description ? route.params.description : '')
    // console.log(description, "9807")
    const dispatch = useDispatch();
    // const { isFetching, isSuccess, isError } = useSelector(state => state.PaymentPlan)


    const METHOD_DATA = [{
        supportedMethods: ['apple-pay'],
        data: {
            merchantIdentifier: 'merchant.com.lifeofdesigner',
            supportedNetworks: ['visa', 'mastercard', 'amex'],
            countryCode: 'US',
            currencyCode: 'USD'
        }
    }];
    let prod_ = [];
    let dealProduct_ = [];
    if (dealIDD === '') {
        products.forEach(e => {
            prod_.push({
                label: e?.product?.product_name,
                amount: { currency: 'USD', value: Math.trunc((e?.product?.price - e?.product?.price * e?.product?.discount / 100) * e?.quantity) }
            })
        })
    }
    else {
        dealProduct_.push({
            label: products?.title,
            amount: { currency: 'USD', value: Math.trunc(products?.total_price) }
        })
    }
    // console.log(prod_,"   ::::: prod_")
    const DETAILS = {

        id: dealIDD == "" ? products.id : dealIDD,
        displayItems: dealIDD == "" ? prod_ : dealProduct_,
        //shippingOptions: [],
        total: {
            label: "Lifeofdesigner",
            amount: {
                currency: 'USD', value:
                    dealIDD == "" ?
                        `${Math.trunc(DiscountPrice)}` : products?.price
            }
        }
    }


    const OPTIONS = {
        requestPayerName: true,
        requestPayerPhone: true,
        requestPayerEmail: true,
        requestShipping: false
    };
    // useEffect(() => {
    //     return () => {
    //         dispatch(clearState());
    //     };
    // }, []);

    // useEffect(() => {
    //     if (isError) {

    //         showToastMessage("Your card was declined. Your request was in live mode, but used a known test card")

    //     }
    // }, [isError]);

    // useEffect(() => {
    //     if (isSuccess) {
    //         showToastMessage("Your payment is done successfully")
    //         navigation.navigate("SubscribeSucess", {
    //             // amount: price,
    //             amount: 200,
    //             type: "course"
    //         })

    //     }
    // }, [isSuccess]);
    // // console.log(" METHOD_DATA, DETAILS, OPTIONS :::: ", METHOD_DATA, " :::: ", DETAILS, " :::::  ", OPTIONS);
    const paymentRequest = new PaymentRequest(METHOD_DATA, DETAILS, OPTIONS);
    // // console.log("paymentRequest :::: ", paymentRequest);

    paymentRequest.addEventListener('shippingaddresschange', e => {
        const updatedDetails = getUpdatedDetailsForShippingAddress(paymentRequest.shippingAddress);
        e.updateWith(updatedDetails);
    });

    paymentRequest.addEventListener('shippingoptionchange', e => {
        const updatedDetails = getUpdatedDetailsForShippingOption(paymentRequest.shippingOption);

        e.updateWith(updatedDetails);
    });

    const pay = async () => {
        await paymentRequest.canMakePayments().then((canMakePayment) => {
            if (canMakePayment) {
                // console.log('Can Make Payment')
                paymentRequest.show()
                    .then(paymentResponse => {
                        // console.log("paymentResponse 86 :::: ", paymentResponse.transactionIdentifier, products?.[0]?.product?.id,);
                        if (dealIDD !== "") {
                            PAYFORDEAL(paymentResponse.transactionIdentifier)
                        }
                        else {
                            PAYFORPRODUCT(paymentResponse.transactionIdentifier)
                        }
                        // dispatch(GetArticlePlanPayment({
                        //     articles: id,
                        //     payment_method: "apple-pay",
                        //     transaction_id: paymentResponse.transactionIdentifier
                        // }))

                        paymentResponse.complete('success');
                    });
            }
            else {
                console.log('Cant Make Payment')
            }
        })
    }

    const PAYFORDEAL = async (transaction_id) => {
        const token = await AsyncStorage.getItem('token')
        let ids = []
        let size = []
        selectedProductData.forEach(e => {
            ids.push(e.id)
            size.push(e.size)
        })
        let form = {
            'delivery_address': deliveryAddressId,
            'deal': dealIDD,
            'deal_product': ids,
            'deal_product_size': size,
            'payment_method': "apple-pay",
            'transaction_id': transaction_id
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
                        screen: 'ApplePayment'
                    })
                }
            })
    }

    const PAYFORPRODUCT = async (transaction_id) => {
        const token = await AsyncStorage.getItem('token')
        let form = new FormData()
        form.append('delivery_address', deliveryAddressId)
        form.append('payment_method', "apple-pay")
        form.append('transaction_id', transaction_id)
        fetch(Appurl.PAYMENT_LIFE_OF_DESIGNER, {
            method: 'POST',
            headers: { Authorization: `Token ${token}` },
            body: form
        })
            .then(res => res.json())
            .then(response => {
                // console.log("response", response);
                if (response) {
                    showToastMessage('Product purchased')
                    navigation.navigate('PaymentSuccessScreen', {
                        screen: 'ApplePayment'
                    })
                }
            })
    }

    const PRODUCTLIST = ({ item, index }) => {
        return (
            <View style={styles.itemContainer}>
                <View style={styles.itemDetail}>
                    <Text style={styles.itemTitle}>{item?.product?.product_name}</Text>
                    <Text style={styles.itemDescription}>
                        {item?.product?.description}
                    </Text>
                </View>
                <View style={styles.itemPrice}>
                    <Text>${Math.trunc((item?.product?.price - item?.product?.price * item?.product?.discount / 100) * item?.quantity)}</Text>
                    {/* <Text>USD {price}</Text> */}
                </View>
            </View>
        )
    }
    const _renderProductItem = ({ item, index }) => {
        return (
            <PRODUCTLIST item={item} index={index} />
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            {/* <HeaderWithBackIcons
                IconOne1={
                    <AntDesign
                        name="arrowleft"
                        size={20}
                        color={Colors.black}

                    />

                }
                onBackIconPress={() => { navigation.goBack() }}

                heading="Apple Pay"
                IconOne={
                    <FontistoIcons
                        name="bell"
                        size={20}
                        color={Colors.black}
                        onPress={() => navigation.navigate("Notification")}
                    />
                }
                IconTwo={
                    <IonIcons
                        name="ios-menu-outline"
                        size={30}
                        color={Colors.black}
                    />
                }
                onIconTwoPress={() => navigation.openDrawer()}
            /> */}
            {/* <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Check</Text>
              <Text style={styles.sectionDescription}>
                Ideally, you should check if Apple Pay is enable in background, and then accordingly call the payment method.
                Showing here on button action for demo purpose.
              </Text>
              <Button
                onPress={() => this.check()}
                title="Check Apple Pay" />
            </View>`
          </View> */}
            <View style={styles.body}>
                <View style={styles.sectionContainer}>
                    <View>
                        <Text style={styles.sectionTitle}>Pay with Apple</Text>

                    </View>
                </View>
                <FlatList
                    data={products}
                    renderItem={_renderProductItem}
                    showsVerticalScrollIndicator={false}
                />

                <View style={{ backgroundColor: 'black', borderColor: Colors.greyFA, marginTop: 20, borderWidth: 1 }}></View>
                <View style={styles.totalContainer}>
                    <View style={styles.itemDetailTotalPrice}>
                        {(dealIDD == "") ?
                            <Text style={styles.itemTitle}>Total</Text>
                            :
                            <Text style={styles.itemTitle}>{products?.title}</Text>
                        }
                    </View>
                    <View style={styles.itemPrice}>
                        {(dealIDD == "") ?
                            <Text>${Math.trunc(DiscountPrice)}</Text>
                            :
                            <Text>${products?.price ? products?.price : ''}</Text>
                        }
                    </View>
                </View>
                <TouchableOpacity style={styles.appleBotton}
                    onPress={() => pay()}>
                    <Text style={styles.appleText}>Pay with </Text>
                    <Icon name="apple1" type="ant-design" size={14} color={Colors.white} />
                    <Text style={styles.appleText}>Pay</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

export default ApplePayment

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.app_grey
    },
    engine: {
        position: 'absolute',
        right: 0
    },
    body: {
        backgroundColor: Colors.white,
        borderBottomColor: "#cccccc",
        borderBottomWidth: 1,
        paddingBottom: 10
    },
    sectionContainer: {
        marginTop: 32,
        marginBottom: 20,
        alignSelf: 'center'
    },
    itemContainer: {
        marginTop: 12,
        // paddingHorizontal: 24,
        display: "flex",
        flexDirection: 'row',
        marginHorizontal: 10,
        marginBottom: 2,
        backgroundColor: Colors.greyFA,
        padding: 7,
        borderRadius: 5
    },
    totalContainer: {
        marginTop: 30,
        // paddingHorizontal: 24,
        display: "flex",
        flexDirection: 'row',
        borderTopColor: "#cccccc",
        // borderTopWidth: 1,
        paddingTop: 10,
        marginBottom: 20,
        marginHorizontal: 10,
        backgroundColor: Colors.greyFA,
        padding: 7,
        borderRadius: 5
    },
    itemDetail: {
        flex: 5,

    },
    itemDetailTotalPrice: {
        flex: 5,
        // marginLeft: 10
    },
    itemTitle: {
        fontWeight: '500',
        fontSize: 18,
        fontFamily: Fonts.RobotoMedium,
        color: Colors.black,
    },
    itemDescription: {
        fontSize: 12,
        fontFamily: Fonts.RobotoMedium,
    },
    itemPrice:
    {
        flex: 2,
        alignItems: "flex-end"
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.black,
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 12,
        fontWeight: '400',
        color: Colors.red,
    },
    highlight: {
        fontWeight: '700',
    },
    footer: {
        color: Colors.black,
        fontSize: 12, fontWeight: '600',
        padding: 4, paddingRight: 12,
        textAlign: 'right',
    },
    appleText: {
        fontFamily: Fonts.RobotoRegular,
        color: Colors.white,
        marginHorizontal: 1,
        fontSize: 19
        // paddingRight: 6
    },
    appleBotton:
    {
        backgroundColor: Colors.green,
        marginHorizontal: 20,
        marginVertical: 30,
        borderRadius: 7,
        flexDirection: "row",
        alignItems: 'center',
        alignSelf: 'center',
        paddingVertical: 7,
        elevation: 6,
        paddingHorizontal: 60,
        shadowColor: Platform.OS == 'ios' && "#fff",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
    }

})