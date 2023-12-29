import React, { useState } from 'react'
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native'
import Colors from '../../../../Theme/Colors'
import Fonts from '../../../../Theme/Fonts'
import { showToastMessage, staticImage, } from '../../../../Utils'
import Icon from 'react-native-vector-icons/FontAwesome';
import Dot from 'react-native-vector-icons/Entypo'
import Icons from 'react-native-vector-icons/AntDesign'
import AppUrl from '../../../../API/Constant'
import moment from 'moment'
import { useSelector } from "react-redux";
import { width } from '../../../Notification/NotificationScreen'
import { Loader } from '../../../../Theme/Metrics'

export default function ConfirmOrderScreen({ route }) {
    const [itemData, setItemData] = useState(route?.params?.item ? route?.params?.item : null)
    const token = useSelector(state => state?.user?.token ? state.user.token : '')
    const [orderId, setOrderId] = useState(route?.params?.orderId ? route?.params?.orderId : null)
    const [date, setDate] = useState(route?.params?.date ? route?.params?.date : null)
    const [productId, setProductId] = useState(route?.params?.productId ? route?.params?.productId : null)
    const [loading, setLoading] = useState(false)


    const RejectOrder = () => {
        setLoading(true)
        let form = new FormData()
        form.append('order', productId)
        form.append('cart', orderId)
        fetch(AppUrl.CANCEL_ORDER, {
            method: 'PUT',
            headers: { Authorization: `Token ${token}` },
            body: form
        }).then(res => res.json())
            .then(response => {
                if (response && response.message == "Cart Product delete successfully.") {
                    showToastMessage('Product cancelled')
                }

            }).finally(e => setLoading(false))
    }

    function RenderItem({ item }) {
        const [isMenu, setIsMenu] = useState(false)
        if (item?.cart_id) {
            return (
                <View style={styles.boxContainer}>
                    <Image style={styles.img}
                        source={{ uri: item?.product?.images?.[0]?.product_images ? AppUrl.ROOT + item?.product?.images?.[0]?.product_images : staticImage }} />
                    <View style={styles.innerBox}>
                        <Text style={styles.productName} ellipsizeMode={"tail"} numberOfLines={1}> {item?.product?.product_name} </Text>
                        <Text style={styles.productDesc} ellipsizeMode={"tail"} numberOfLines={1}>{itemData?.delivery_address?.name}, {itemData?.delivery_address?.full_address}</Text>
                        <Text style={styles.productDesc} ellipsizeMode={"tail"} numberOfLines={1}>{itemData?.delivery_address?.state}, {itemData?.delivery_address?.pin_code}, {itemData?.delivery_address?.locality}</Text>
                        <Text style={styles.productDesc} ellipsizeMode={"tail"} numberOfLines={1}>{itemData?.delivery_address?.mobile}</Text>
                        {/* <TouchableOpacity onPress={() => setIsMenu(!isMenu)}
                            style={styles.ThreeDot}>
                            <Dot name="dots-three-vertical" size={13} color='grey' />
                        </TouchableOpacity> */}

                        {isMenu && <View style={styles.menu}>
                            <TouchableOpacity style={styles.closeMenu} onPress={() => setIsMenu(!isMenu)}>
                                <Icons name="closecircleo" size={13} color='black' />
                            </TouchableOpacity>

                            <TouchableOpacity style={{ flexDirection: 'row' }}
                                onPress={() => RejectOrder()}>
                                <Icons name="delete" size={13} color='black' style={{ paddingHorizontal: 10, paddingVertical: 10 }} />
                                <Text style={styles.menubtn}>Cancel</Text>
                            </TouchableOpacity>
                        </View>}
                    </View>
                </View>
            )
        }
        else {
            return (
                <View style={styles.boxContainer}>
                    <Image style={styles.img}
                        source={{ uri: item?.images?.[0]?.product_images ? AppUrl.ROOT + item?.images?.[0]?.product_images : staticImage }} />
                    <View style={styles.innerBox}>
                        <Text style={styles.productName} ellipsizeMode={"tail"} numberOfLines={1}> {item?.product_name} </Text>
                        <Text style={styles.productDesc} ellipsizeMode={"tail"} numberOfLines={1}>{itemData?.delivery_address?.name}, {itemData?.delivery_address?.full_address}</Text>
                        <Text style={styles.productDesc} ellipsizeMode={"tail"} numberOfLines={1}>{itemData?.delivery_address?.state}, {itemData?.delivery_address?.pin_code}, {itemData?.delivery_address?.locality}</Text>
                        <Text style={styles.productDesc} ellipsizeMode={"tail"} numberOfLines={1}>{itemData?.delivery_address?.mobile}</Text>
                        {/* {orderId == "null" ?
                            <TouchableOpacity onPress={() => setIsMenu(!isMenu)}
                                style={styles.ThreeDot}>
                                <Dot name="dots-three-vertical" size={13} color='grey' />
                            </TouchableOpacity>
                            :
                            <View></View>
                        } */}

                        {isMenu && <View style={styles.menu}>
                            <TouchableOpacity style={styles.closeMenu} onPress={() => setIsMenu(!isMenu)}>
                                <Icons name="closecircleo" size={13} color='black' />
                            </TouchableOpacity>

                            <TouchableOpacity style={{ flexDirection: 'row' }}
                                onPress={() => RejectOrder()}>
                                <Icons name="delete" size={13} color='black' style={{ paddingHorizontal: 10, paddingVertical: 10 }} />
                                <Text style={styles.menubtn}>Cancel</Text>
                            </TouchableOpacity>
                        </View>}

                    </View>
                </View>
            )
        }
    }

    return (
        <View style={styles.container}>
            <Text style={{ marginTop: 10, marginLeft: 5, color: Colors.gray, fontSize: 14, fontFamily: Fonts.RobotoBold }}>Order ID- {itemData?.invoice_number}</Text>
            {/* {itemData?.cart_product && itemData?.cart_product?.length !== 0 ? */}
            {loading && <Loader size={'small'} color={'#000'} />}
            {itemData?.cart_product !== null ?
                <FlatList
                    data={itemData?.cart_product}
                    renderItem={({ item }) => <RenderItem item={item} />}
                    keyExtractor={(item, index) => index.toString()}
                />
                :
                <FlatList
                    data={itemData?.deal_product}
                    renderItem={({ item }) => <RenderItem item={item} />}
                    keyExtractor={(item, index) => index.toString()}
                />
            }
            {/* : <Text>No products available</Text>} */}
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20
    },
    boxContainer: {
        width: width / 1.15,
        backgroundColor: Colors.greyFA,
        flexDirection: 'row',
        margin: 5,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        borderRadius: 10,
    },
    img: {
        height: 80,
        width: 70,
        borderRadius: 5,
        margin: 10
    },
    innerBox: {
        width: '70%',
        padding: 10
    },
    productName: {
        color: Colors.black,
        fontSize: 14,
        fontFamily: Fonts.RobotoBold
    },
    productDesc: {
        color: Colors.grayLight, fontSize: 12,
        marginVertical: 5, fontFamily: Fonts.RobotoMedium, marginLeft: 3
    },
    ThreeDot: {
        color: Colors.black,
        fontFamily: Fonts.RobotoBold,
        position: 'absolute',
        right: 10,
        top: 10
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
        top: 17,
        right: 22,
        width: 100,
        height: 40
    },
    closeMenu: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    menubtn: {
        fontSize: 13,
        paddingVertical: 10,
        color: 'black'
    },
    VerticalDot: {
        position: 'absolute',
        top: 25,
        right: 5,
    },
    updated_on: {
        color: Colors.black, fontSize: 12,
        fontFamily: Fonts.RobotoMedium, marginLeft: 3
    }
})