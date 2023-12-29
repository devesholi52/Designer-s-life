import React, { useState } from 'react'
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native'
import moment from 'moment'
import { useSelector } from "react-redux";
import Colors from './Theme/Colors';
import Fonts from './Theme/Fonts';
import { showToastMessage, staticImage } from './Utils';
import { width } from './Screens/Notification/NotificationScreen';
import { Loader } from './Theme/Metrics';
import { ActivityIndicator } from 'react-native';

export default function ShowTransactionForProduct({ route }) {
    const [itemData, setItemData] = useState(route?.params?.item ? route?.params?.item : null)
    const token = useSelector(state => state?.user?.token ? state.user.token : '')
    const [loading, setLoading] = useState(false)


    function RenderItem({ item }) {
        const [isMenu, setIsMenu] = useState(false)
        // console.log("itemooooooooooooo", item);
        return (
            <View style={{ paddingHorizontal: 15, marginVertical: 5 }}>
                <View style={{ flexDirection: 'row', paddingVertical: 15 }}>
                    <Image source={{ uri: item?.product?.images?.[0]?.product_images }}
                        style={styles.Image}
                        PlaceholderContent={<ActivityIndicator />}
                    />
                    <View style={{ flex: 4, justifyContent: 'center', paddingHorizontal: 10, }}>
                        <Text style={{ color: Colors.black, fontSize: 15, fontFamily: Fonts.RobotoMedium }}>{item?.product?.product_name}</Text>
                        <Text style={{ color: Colors.black, fontSize: 14, fontFamily: Fonts.RobotoRegular }}>{item?.updated_on ? moment(item?.updated_on).format("DD/MM/YYYY") : ''}</Text>
                    </View>

                    <Text style={{ color: Colors.black, alignItems: 'flex-end', fontSize: 16, fontFamily: Fonts.RobotoMedium, padding: 13 }}>${Math.trunc(item?.product?.price - item?.product?.price * item?.product?.discount / 100)}</Text>

                </View>
                <ListSeperator />
            </View>
        )

    }

    const ListSeperator = () => {
        return (
            <View style={{ borderWidth: 0.8, borderColor: Colors.borderColor }} />
        )
    }
    return (
        <View style={styles.container}>
            <Text style={{ marginTop: 10, marginLeft: 5, color: Colors.gray, fontSize: 14, fontFamily: Fonts.RobotoBold }}>Order ID- {itemData?.invoice_number}</Text>
            {/* {itemData?.cart_product && itemData?.cart_product?.length !== 0 ? */}
            {loading && <Loader size={'small'} color={'#000'} />}
            <FlatList
                data={itemData?.cart_product}
                renderItem={({ item }) => <RenderItem item={item} />}
                keyExtractor={(item, index) => index.toString()}
            />
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
    Image: {
        height: 40,
        width: 40,
        borderRadius: 100,
        margin: 5
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
        color: Colors.black,
        fontSize: 12,
        marginVertical: 2,
        fontFamily: Fonts.RobotoMedium, marginLeft: 3
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