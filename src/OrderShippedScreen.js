import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Modal, FlatList } from 'react-native'

import Headers from './Components/Headers/Headers';
import Icon from 'react-native-vector-icons/AntDesign';
import { TextInput } from 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import Fonts from './Theme/Fonts';
import { height, width } from './UploadProduct/Deal';
import StarRating from './Components/StarRating';
import Colors from './Theme/Colors';
import { Picker } from '@react-native-picker/picker';
import Appurl from './API/Constant';
import { useSelector } from "react-redux";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { staticImage } from './Utils';
import Metrics from './Theme/Metrics';
import moment from 'moment';

export default function OrderShippedScreen({ navigation, route }) {

    const [productList, setProductList] = useState([])
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('Java');
    const [productDeatils, setProductDeatils] = useState(route?.params?.productDeatil ? route?.params?.productDeatil : '');
    const token = useSelector(state => state?.user?.token ? state.user.token : '')
    const [productId, setProductId] = useState(route?.params?.productID ? route?.params?.productID : '');
    const [deliveryAdd, setDeliveryAdd] = useState(route?.params?.DeliveryAddress ? route?.params?.DeliveryAddress : '');
    const [size, setSize] = useState(route?.params?.Size ? route?.params?.Size : '');
    const [quantity, setQuantity] = useState(route?.params?.quantity ? route?.params?.quantity : '');
    const [dealDetail, setDealDetail] = useState(route?.params?.dealDetail ? route?.params?.dealDetail : '');
    const [productPrice, setProductPrice] = useState(route?.params?.productPrice ? route?.params?.productPrice : '');
    const [discount, setDiscount] = useState(route?.params?.productDiscount ? route?.params?.productDiscount : '');
    const [order_status, setOrder_status] = useState(route?.params?.itemOrder_status ? route?.params?.itemOrder_status : '');

    if (!dealDetail) {
        return (
            <ScrollView>
                <View style={{ marginBottom: 30 }}>
                    <View style={{ flexDirection: 'row', marginLeft: 10, marginTop: 15 }}>
                        <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={{ uri: productDeatils?.images?.[0]?.product_images ? Appurl.ROOT + productDeatils?.images?.[0]?.product_images : staticImage }} style={{ width: Metrics.ScreenWidth / 3, height: Metrics.ScreenWidth / 3 }} />
                        </View>
                        <View style={{ flex: 3 }}>
                            <Text style={{ fontSize: 12, fontFamily: Fonts.RobotoBold, paddingTop: 5 }} ellipsizeMode={"tail"} numberOfLines={1}>{productDeatils?.product_name}</Text>
                            <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 8 }}>
                                <View style={{ flexDirection: 'row',/*  justifyContent: 'center', */ alignItems: 'center' }}>
                                    <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoRegular, fontSize: 14 }}>Size</Text>
                                    <Text style={{ marginLeft: 10, fontSize: 12, fontFamily: Fonts.RobotoMedium }}>{size}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', /* justifyContent: 'center', */ alignItems: 'center', marginLeft: 30 }}>
                                    <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoRegular, fontSize: 14 }}>Qty</Text>
                                    <Text style={{ marginLeft: 10, fontSize: 12, fontFamily: Fonts.RobotoMedium }}>{quantity}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: Fonts.RobotoMedium }}>{Math.trunc(productPrice * quantity - productPrice * quantity * discount / 100)}</Text>
                                <Text style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid', marginHorizontal: 10, fontSize: 12, color: Colors.app_grey, fontFamily: Fonts.RobotoMedium }}>
                                    {productPrice * quantity}
                                </Text>
                                <Text style={{ color: '#F89225', fontSize: 12, fontFamily: Fonts.RobotoMedium }}>{discount}%</Text>
                            </View>
                            <View style={{ marginVertical: 5, }}>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: Fonts.RobotoRegular }}>{productDeatils?.created_on ? moment(productDeatils?.created_on).format('MMM Do YYYY') : ''}</Text>
                            </View>

                        </View>
                    </View>

                </View>
                {/* <View style={styles.imageText}>
                    <Text style={styles.TotalEarning}>Shipped </Text>
                    <Text style={styles.text}>on Sun,15.Feb 2022</Text>
                </View> */}

                <View style={{ marginVertical: 30, marginHorizontal: 18, backgroundColor: Colors.greyFA, padding: 10, borderRadius: 12 }}>
                    <Text style={{ fontFamily: Fonts.RobotoBold, fontSize: 15, color: 'black', marginVertical: 10 }}>Delivery </Text>
                    <Text style={{ fontFamily: Fonts.RobotoMedium, color: 'black', }}>{deliveryAdd?.name}</Text>
                    <Text style={{ color: 'black', fontFamily: Fonts.RobotoRegular }}>{deliveryAdd?.full_address},{deliveryAdd?.locality}, {deliveryAdd?.city} </Text>
                    <Text style={{ color: 'black', fontFamily: Fonts.RobotoRegular }}>{deliveryAdd?.state}, {deliveryAdd?.pin_code}</Text>
                    <Text style={{ color: 'black', fontFamily: Fonts.RobotoRegular }}>{deliveryAdd?.mobile}</Text>
                </View>

                <View style={{ padding: 10, backgroundColor: Colors.greyFA, marginBottom: 30, marginHorizontal: 16, borderRadius: 12 }}>
                    <Text style={{ fontFamily: Fonts.RobotoBold, color: Colors.black, }}>Tracking Detail</Text>
                    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                        <View style={{ flex: 2, justifyContent: 'center', paddingVertical: 10, }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ borderRadius: 200, width: 18, height: 18, justifyContent: 'center', borderWidth: 1, borderColor: Colors.black, backgroundColor: '#228b22' }}>
                                    <Icon name={'check'} size={15} color="white" />
                                </View>
                                <View style={{ flex: 1, height: 2, backgroundColor: Colors.black }} />
                            </View>
                            <View style={{ height: 20 }}>
                                <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoRegular }}>Packed</Text>
                            </View>


                        </View>
                        <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                                <View style={{ flex: 1, height: 2, backgroundColor: Colors.black }} />
                                <View style={{ borderRadius: 200, width: 18, height: 18, justifyContent: 'center', borderWidth: 1, borderColor: Colors.black, backgroundColor: '#228b22' }}>
                                    <Icon name={'check'} size={15} color="white" />
                                </View>
                                <View style={{ height: 2, backgroundColor: Colors.black, flex: 1 }} />
                            </View>
                            <View style={{ height: 20, }}>
                                <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoRegular }}>Shipped</Text>
                            </View>


                        </View>
                        <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ flex: 1, height: 2, backgroundColor: Colors.black }} />
                                <View style={{ borderRadius: 200, width: 18, height: 18, justifyContent: 'center', borderWidth: 1, borderColor: Colors.black, }}>
                                    <Icon name={'check'} size={15} color="black" />
                                </View>
                                <View style={{ backgroundColor: Colors.black, flex: 0.2 }} />
                            </View>
                            <View style={{ height: 20, marginLeft: 40 }}>
                                <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoRegular }}>Delivered</Text>
                            </View>

                        </View>
                        {/* <View style={{ flex: 2, justifyContent: 'center', alignItems: 'flex-end', paddingVertical: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                          <View style={{ flex: 1, height: 2, backgroundColor: Colors.black }} />
                          <View style={{ borderRadius: 200, width: 18, height: 18, justifyContent: 'center', borderWidth: 1, borderColor: Colors.black }}>

                          </View>
                        </View>
                        <View style={{ height: 20 }}>
                          <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoRegular }}></Text>
                        </View>
                      </View> */}
                    </View>
                </View>
                <View style={{ marginBottom: 30, marginHorizontal: 18, backgroundColor: Colors.greyFA, padding: 10, borderRadius: 12 }}>
                    <Text style={{ fontFamily: Fonts.RobotoBold, fontSize: 15, color: 'black', marginVertical: 10 }}>Price Detail</Text>

                    <View style={styles.containerPriceDetail}>
                        <Text style={{ fontSize: 13, color: 'black', fontFamily: Fonts.RobotoRegular }}>Total MRP</Text>
                        <Text style={{ fontFamily: Fonts.RobotoMedium, color: 'black' }}>{productPrice * quantity}</Text>
                    </View>

                    <View style={styles.containerPriceDetail}>
                        <Text style={{ fontSize: 13, color: 'black', fontFamily: Fonts.RobotoRegular }}>Discount Price</Text>
                        <Text style={{ fontFamily: Fonts.RobotoMedium, color: 'black' }}>{Math.trunc(productPrice * quantity - (productPrice * quantity - productPrice * quantity * discount / 100))}</Text>
                    </View>

                    <View style={styles.containerPriceDetail}>
                        <Text style={{ fontSize: 13, color: 'black', fontFamily: Fonts.RobotoRegular }}>Convenience Fee</Text>
                        <Text style={{ fontFamily: Fonts.RobotoMedium, color: 'black' }}>Free</Text>
                    </View>
                </View>

                <View style={styles.containerTotalamount}>
                    <Text style={{ fontFamily: Fonts.RobotoBold, color: 'black' }}>Total Amount</Text>
                    <Text style={{ fontFamily: Fonts.RobotoMedium, color: 'black' }}>{Math.trunc(productPrice * quantity - productPrice * quantity * discount / 100)}</Text>
                </View>
                {/* </View> */}
                {/* <View style={styles.bottomtextcontainer}>
                    <Text style={{ paddingVertical: 5, fontFamily: Fonts.RobotoRegular }}>24 Sept,2021</Text>
                    <Text style={{ fontFamily: Fonts.RobotoMedium, color: 'black' }}>Dummy Text</Text>
                </View> */}

                {/* </ScrollView> */}
            </ScrollView>
        )
    }
    else {
        return (
            <ScrollView>
                <View style={{ marginBottom: 30 }}>
                    <View style={{ flexDirection: 'row', marginLeft: 10, marginTop: 15 }}>
                        <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={{ uri: dealDetail?.deal_product?.[0]?.images?.[0]?.product_images ? Appurl.ROOT + dealDetail?.deal_product?.[0]?.images?.[0]?.product_images : staticImage }} style={{ width: Metrics.ScreenWidth / 3.5, height: Metrics.ScreenWidth / 3.5 }} />
                        </View>
                        <View style={{ flex: 3 }}>
                            <Text style={{ fontSize: 12, fontFamily: Fonts.RobotoBold, paddingTop: 5 }} ellipsizeMode={"tail"} numberOfLines={1}>{dealDetail?.deal_name}</Text>
                            <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: Fonts.RobotoMedium }}>{dealDetail?.deal_price}</Text>
                                <Text style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid', marginHorizontal: 10, fontSize: 12, color: Colors.app_grey, fontFamily: Fonts.RobotoMedium }}>
                                    {dealDetail?.total_price}
                                </Text>
                                <Text style={{ color: '#F89225', fontSize: 12, fontFamily: Fonts.RobotoMedium }}>{Math.trunc(100 - dealDetail?.deal_price * 100 / dealDetail?.total_price)}%</Text>
                            </View>
                            <Text style={{ color: 'black', fontFamily: Fonts.RobotoRegular }}>Delivered by 28feb 2022</Text>
                            <View style={{ marginVertical: 5, }}>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: Fonts.RobotoRegular }}>{dealDetail?.created_on ? moment(dealDetail?.created_on).format('ddd, hA') : ''}</Text>
                            </View>

                        </View>
                    </View>

                </View>
                <View style={styles.imageText}>
                    <Text style={styles.TotalEarning}>Shipped </Text>
                    <Text style={styles.text}>on Sun,15.Feb 2022</Text>
                </View>

                <View style={{ marginVertical: 30, marginHorizontal: 18, backgroundColor: Colors.greyFA, padding: 10, borderRadius: 12 }}>
                    <Text style={{ fontFamily: Fonts.RobotoBold, fontSize: 15, color: 'black', marginVertical: 10 }}>Delivery Address</Text>
                    <Text style={{ fontFamily: Fonts.RobotoMedium, color: 'black', }}>{deliveryAdd?.name}</Text>
                    <Text style={{ color: 'black', fontFamily: Fonts.RobotoRegular }}>{deliveryAdd?.full_address},{deliveryAdd?.locality}, {deliveryAdd?.city} </Text>
                    <Text style={{ color: 'black', fontFamily: Fonts.RobotoRegular }}>{deliveryAdd?.state}, {deliveryAdd?.pin_code}</Text>
                    <Text style={{ color: 'black', fontFamily: Fonts.RobotoRegular }}>{deliveryAdd?.mobile}</Text>
                </View>
                <View style={{ padding: 10, backgroundColor: Colors.greyFA, marginBottom: 30, marginHorizontal: 18, borderRadius: 12 }}>
                    <Text style={{ fontFamily: Fonts.RobotoBold, color: Colors.black, }}>Tracking Detail</Text>
                    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                        <View style={{ flex: 2, justifyContent: 'center', paddingVertical: 10 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                {(order_status == 'new_order') ?
                                    <View style={{ borderRadius: 200, width: 18, height: 18, justifyContent: 'center', borderWidth: 1, borderColor: Colors.black, backgroundColor: '#228b22' }}>
                                        <Icon name={'check'} size={15} color="white" />
                                    </View>
                                    :
                                    <View style={{ borderRadius: 200, width: 18, height: 18, justifyContent: 'center', borderWidth: 1, borderColor: Colors.black, }}>
                                        <Icon name={'check'} size={15} color="black" />
                                    </View>
                                }
                                <View style={{ flex: 1, height: 2, backgroundColor: Colors.black }} />
                            </View>
                            <View style={{ height: 20 }}>
                                <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoRegular }}>Packed</Text>
                            </View>


                        </View>
                        <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ flex: 1, height: 2, backgroundColor: Colors.black }} />
                                <View style={{ borderRadius: 200, width: 18, height: 18, justifyContent: 'center', borderWidth: 1, borderColor: Colors.black, }}>
                                    <Icon name={'check'} size={15} color="black" />
                                </View>

                                <View style={{ flex: 1, height: 2, backgroundColor: Colors.black }} />
                            </View>
                            <View style={{ height: 20 }}>
                                <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoRegular }}>Shipped</Text>
                            </View>


                        </View>
                        <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ flex: 1, height: 2, backgroundColor: Colors.black }} />

                                <View style={{ borderRadius: 200, width: 18, height: 18, justifyContent: 'center', borderWidth: 1, borderColor: Colors.black, }}>
                                    <Icon name={'check'} size={15} color="black" />
                                </View>

                                <View style={{ flex: 0.2, backgroundColor: Colors.black }} />
                            </View>
                            <View style={{ height: 20, marginLeft: 40 }}>
                                <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoRegular }}>Delivered</Text>
                            </View>

                        </View>
                        {/* <View style={{ flex: 2, justifyContent: 'center', alignItems: 'flex-end', paddingVertical: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                          <View style={{ flex: 1, height: 2, backgroundColor: Colors.black }} />
                          <View style={{ borderRadius: 200, width: 18, height: 18, justifyContent: 'center', borderWidth: 1, borderColor: Colors.black }}>

                          </View>
                        </View>
                        <View style={{ height: 20 }}>
                          <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoRegular }}></Text>
                        </View>
                      </View> */}
                    </View>
                </View>
                <View style={{ marginBottom: 30, marginHorizontal: 18, backgroundColor: Colors.greyFA, padding: 10, borderRadius: 12 }}>
                    <Text style={{ fontFamily: Fonts.RobotoBold, fontSize: 15, color: 'black', marginVertical: 10 }}>Price Detail</Text>

                    <View style={styles.containerPriceDetail}>
                        <Text style={{ fontSize: 13, color: 'black', fontFamily: Fonts.RobotoRegular }}>Total MRP</Text>
                        <Text style={{ fontFamily: Fonts.RobotoMedium, color: 'black' }}>{dealDetail?.total_price}</Text>
                    </View>

                    <View style={styles.containerPriceDetail}>
                        <Text style={{ fontSize: 13, color: 'black', fontFamily: Fonts.RobotoRegular }}>Discount Price</Text>
                        <Text style={{ fontFamily: Fonts.RobotoMedium, color: 'black' }}>{dealDetail?.discount}</Text>
                    </View>

                    <View style={styles.containerPriceDetail}>
                        <Text style={{ fontSize: 13, color: 'black', fontFamily: Fonts.RobotoRegular }}>Convenience Fee</Text>
                        <Text style={{ fontFamily: Fonts.RobotoMedium, color: 'black' }}>Free</Text>
                    </View>
                </View>

                <View style={styles.containerTotalamount}>
                    <Text style={{ fontFamily: Fonts.RobotoBold, color: 'black' }}>Total Amount</Text>
                    <Text style={{ fontFamily: Fonts.RobotoMedium, color: 'black' }}>{dealDetail?.deal_price}</Text>
                </View>
                {/* </View> */}
                {/* <View style={styles.bottomtextcontainer}>
                                <Text style={{ paddingVertical: 5, fontFamily: Fonts.RobotoRegular }}>24 Sept,2021</Text>
                                <Text style={{ fontFamily: Fonts.RobotoMedium, color: 'black' }}>Dummy Text</Text>
                            </View> */}

                {/* </ScrollView> */}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    mainContainer: {
        flexDirection: 'row',
        margin: 30,
        alignItems: 'flex-start',
        height: height / 7,
        // backgroundColor: 'red',
    },
    image: {
        height: height / 7.5,
        width: width / 3.5,
    },
    image12: {
        // padding: 30,
        // // margin: 10,
        // marginLeft: 26,
        height: width / 7,
        width: width / 1.15,
        alignSelf: "center"

    },
    imageText: {
        width: width / 1.1,
        backgroundColor: 'black',
        alignSelf: 'center',
        alignItems: 'flex-start',
        padding: 10,
        borderRadius: 5
    },
    TotalEarning: {
        color: 'white',
        fontSize: 15,
        fontFamily: Fonts.RobotoBold
    },
    text: {
        color: 'white',
        fontSize: 13,
        fontFamily: Fonts.RobotoRegular
    },
    innerMain: {
        paddingHorizontal: 20,
        // padding: 5,

    },

    containerSizeQty: {
        flexDirection: 'row',
        fontSize: 15,
        // marginVertical: 10,
        alignItems: 'center'
    },
    containerprice: {
        flexDirection: 'row',
        fontSize: 15,
        marginBottom: 10,
        justifyContent: 'space-between'
    },
    containerPriceDetail: {
        flexDirection: 'row',
        justifyContent: 'space-between',



    },
    containerTotalamount: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Colors.greyFA,
        padding: 10,
        marginHorizontal: 18,
        // width: width / 1.,
        borderRadius: 12,
        marginBottom: 40

    },
    bottomtextcontainer: {
        backgroundColor: Colors.greyFA,
        // marginTop:60,
        // marginBottom:30
        marginHorizontal: 18,
        marginVertical: 30,
        padding: 10,
        borderRadius: 10
    },
    buttoncontainer: {
        flexDirection: 'row',
        alignSelf: 'center'
    },
    buttonEdit: {
        // borderWidth: 1,
        alignSelf: 'center',
        padding: 10,
        borderRadius: 15,
        backgroundColor: 'orange',
        // width: width / 2.7,
        alignItems: 'center',
        borderColor: 'grey',
        margin: 15,
        fontFamily: Fonts.RobotoMedium,
        paddingHorizontal: 25
    },
    buttonDelete: {
        borderWidth: 1,
        alignSelf: 'center',
        padding: 10,
        borderRadius: 12,
        backgroundColor: 'orange',
        // width: width / 2.7,
        alignItems: 'center',
        borderColor: "#eee",
        margin: 15,
        fontFamily: Fonts.RobotoMedium,
        paddingHorizontal: 25
    },
    containerModal: {
        // height: height / 2.7,
        width: width / 1.2,
        backgroundColor: 'white',
        alignSelf: 'center',
        borderRadius: 10,
        justifyContent: "center",
        top: width / 1.4,
        // elevation:2
    },
    textReview: {
        fontFamily: Fonts.RobotoBold,
        fontSize: 17,
        alignSelf: 'center',
        color: 'black',
        paddingTop: 25

    },
    iconModal: {
        position: 'absolute',
        top: 0,
        right: 0

    },

    textinputmodal: {
        padding: 25,
        backgroundColor: '#eee',
        marginHorizontal: 10,
        borderRadius: 5,
        fontFamily: Fonts.RobotoRegular,
        color: 'black'

    },
    buttonmodal: {
        backgroundColor: 'orange',
        alignSelf: 'center',
        padding: 8,
        paddingHorizontal: 35,
        borderRadius: 10,
        margin: 30,
        fontFamily: Fonts.RobotoMedium
    }

})



