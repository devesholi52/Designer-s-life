import React, { useState, useEffect } from 'react';
import { ApplePayButton, useApplePay } from '@stripe/stripe-react-native';
import { FlatList, Text, View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Loader } from '../../Theme/Metrics';
import { useNavigation } from '@react-navigation/native';
import { height, width } from '../Notification/NotificationScreen';
import Fonts from '../../Theme/Fonts';
import Appurl from '../../API/Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, showToastMessage } from '../../Utils';
import AddressCardExist from './AddressCardExist';
import { getAddressList } from '../../API';
import { useSelector } from 'react-redux';
import { Platform } from 'react-native';
import Colors from '../../Theme/Colors';
import { Icon } from "react-native-elements";

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

export default function AddressAlreadyExist({ route }) {
    const navigation = useNavigation();
    const token = useSelector(state => state?.user?.token)
    const [loading, setLoading] = useState(false);
    const [addressList, setAddresslist] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [currentAddress, setCurrentAddress] = useState(null);
    const [clicked, setClicked] = useState('0')
    const [totalAmount, setTotalAmount] = useState(route?.params?.TotalAmount ? route?.params?.TotalAmount : '')
    const [discountPrice, setDiscountPrice] = useState(route?.params?.DiscountPrice ? route?.params?.DiscountPrice : '')
    const [dealID, setDealId] = useState(route?.params?.DISC ? route?.params?.DISC : '')
    const [selectedProductData, setSelectedProductData] = useState(route?.params?.selectedProductData ? route?.params?.selectedProductData : '')
    const [products, setProducts] = useState(route?.params?.products ? route?.params?.products : '')


    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getAddress();
    }, []);
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getAddress()
            return unsubscribe;
        })
    }, [])

    const getAddress = async () => {
        setLoading(true);
        getAddressList(token).then(response => {
            if (response && response.data && response.data.results) {
                let temp = []
                response.data.results.forEach(element => {
                    let local = element;
                    element.isSelected = false;
                    temp.push(local)
                });
                setAddresslist([...temp]);
                setCurrentAddress("")
                setClicked("0")
            }
        }).finally(e => setLoading(false), setRefreshing(false));
    };

    const AddressDelete = async item => {
        const token = await AsyncStorage.getItem('token');
        fetch(`${Appurl.GET_DELIVERY_ADDRESS}${item?.id}/`, {
            method: 'DELETE',
            headers: { Authorization: `Token ${token}` },
        })
            .then(res => res.json())
            .then(response => {
                if (response && response.message) {
                    showToastMessage('Address removed');
                }
                getAddress();
            });
    };

    const onPressCard = index => {
        let temp = addressList // assigned initial list to temp
        temp.forEach(e => e.isSelected = false)
        let local = temp[index]  // find current element  
        local.isSelected = true; // assigned selected value to true for current element
        setCurrentAddress(local)
        temp.splice(index, 1, local) //replaced current element into the newly created array
        setAddresslist([...temp])
    }

    const handleToggle = index => {
        if (clicked === index) {
            return setClicked('0');
        }
        setClicked(index);
    };
    return (
        <View style={styles.container}>
            {loading && <Loader size={'small'} color={'#000'} />}
            {refreshing && <ActivityIndicator />}
            {addressList && addressList.length !== 0 ? (
                <>
                    <FlatList
                        data={addressList}
                        renderItem={({ item, index }) => <AddressCardExist
                            item={item} index={index}
                            AddressDelete={AddressDelete}
                            navigation={navigation}
                            onPressCard={onPressCard}
                            closeMenuOption={() => setClicked('0')}
                            onToggle={() => handleToggle(index)}
                            active={clicked === index}
                        />}
                        ListFooterComponent={() => {
                            return (
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity onPress={() => navigation.navigate('AddressScreen')}
                                        style={{ alignSelf: 'flex-end' }}>
                                        <Text style={{ color: 'green' }}>+ Add New Address</Text>
                                    </TouchableOpacity>
                                    {Platform.OS == 'ios' ?
                                        // <Button
                                        //     style={{ margin: 20, }}
                                        //     disabled={currentAddress ? false : true}
                                        //     text='Proceed to Apple Pay'
                                        //     onPress={() => navigation.navigate('ApplePayment', {
                                        //         AddressID: currentAddress.id,
                                        //         IdOfDeal: dealID,
                                        //         selectedProductData: selectedProductData,
                                        //         TotalAmount: totalAmount,
                                        //         DiscountPrice: discountPrice,
                                        //         products: products,
                                        //         addressLists: addressList
                                        //     })}
                                        // />
                                        <TouchableOpacity style={[styles.Applebtn,
                                        {
                                            opacity: currentAddress == false ? 0.4 : 1.0,
                                            backgroundColor: currentAddress == false ? 'rgba(158, 158, 158,0.5)' : '#000',
                                            elevation: currentAddress == false ? 0 : 5
                                        }
                                        ]}
                                            disabled={currentAddress ? false : true}
                                            onPress={() => navigation.navigate('ApplePayment', {
                                                AddressID: currentAddress.id,
                                                IdOfDeal: dealID,
                                                selectedProductData: selectedProductData,
                                                TotalAmount: totalAmount,
                                                DiscountPrice: discountPrice,
                                                products: products,
                                                addressLists: addressList
                                            })}
                                        >
                                            <Text style={[styles.appleText,
                                            {
                                                color: currentAddress == false ? Colors.dark_grey : '#fff',
                                            }]}>Proceed to </Text>
                                            <Icon name="apple1" type="ant-design" size={14} color={currentAddress == false ? Colors.dark_grey : '#fff'} />
                                            <Text style={[styles.appleText,
                                            {
                                                color: currentAddress == false ? Colors.dark_grey : '#fff',
                                            }]}>Pay</Text>
                                        </TouchableOpacity>
                                        :
                                        <Button
                                            style={{ margin: 20, }}
                                            disabled={currentAddress ? false : true}
                                            text='Proceed to Pay'
                                            onPress={() => navigation.navigate('PaymentAlreadyExist', {
                                                AddressID: currentAddress.id,
                                                IdOfDeal: dealID,
                                                selectedProductData: selectedProductData,
                                                TotalAmount: totalAmount,
                                                DiscountPrice: discountPrice,
                                                products: products,
                                                addressLists: addressList
                                            })}
                                        />
                                    }
                                    {/* <TouchableOpacity onPress={() => navigation.navigate('AddressScreen')}
                                        style={styles.buttonadressproceed}>
                                        <Text style={{ color: 'white' }}>Add New Address</Text>
                                    </TouchableOpacity> */}
                                </View>
                            )
                        }}
                        showsVerticalScrollIndicator={false}
                    />
                </>
            ) : (
                <View style={styles.refreshView}>
                    <Text style={styles.noData}>No data available</Text>
                    <Button text='Refresh' onPress={onRefresh} style={styles.refreshBtn} />
                    <Button
                        style={{ marginTop: 5 }}
                        text='Add New Address'
                        onPress={() => navigation.navigate('AddressScreen')}
                    />
                </View>
            )
            }
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingBottom: 10,
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
        paddingVertical: 10,
        borderRadius: 7,

    },
    Applebtn: {
        marginVertical: 15,
        marginTop: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // borderWidth: 1,
        borderColor: '#242e40',
        paddingVertical: 8,
        borderRadius: 7,
        paddingHorizontal: 60,
        backgroundColor: "#000",
        // elevation: 4,
        shadowColor: Platform.OS == 'ios' && "#fff",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,

    },
    appleText: {
        fontFamily: Fonts.RobotoRegular,
        color: Colors.white,
        marginHorizontal: 1,
        fontSize: 19,
        // paddingRight: 6
    },
});
