import React, { useState, useEffect } from "react";
import { FlatList, Text, TouchableOpacity, View, Image, StyleSheet } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Avatar, Icon } from "react-native-elements";
// import Colors from "../../Theme/Colors";
// import OrderDetailScreen from "./OrderDetailScreen";
// import Fonts from "../../Theme/Fonts";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import Appurl from "../../API/Constant"
import Colors from "./Theme/Colors";
import Fonts from "./Theme/Fonts";
import { getParticularDealData } from "./API";
import { Loader } from "./Theme/Metrics";

const data = [1, 3, 4, 5]
const dealList = ({ route }) => {
    const navigation = useNavigation()
    const [products, setProducts] = useState()
    const [productID, setProductId] = useState(route?.params?.itemIDDDDDD ? route?.params?.itemIDDDDDD : '')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getDealData()
    }, [])

    const getDealData = async () => {
        setLoading(true)
        const token = await AsyncStorage.getItem('token')
        getParticularDealData(productID, token).then(response => {
            let res = response.data.data
            setProducts(res.product)
        }).finally(e => setLoading(false))
    }

    const DEALITEM = ({ item, index }) => {
        return (
            <TouchableOpacity style={Styles.MainContainer}
                onPress={() => navigation.navigate('ProductDetailScreen',
                    {
                        itemID: item.id
                    })}>
                <View style={{ flexDirection: 'row', paddingVertical: 15 }}>
                    <View style={Styles.Container}>
                        <View style={{ flexDirection: 'row', margin: 10 }}>
                            <Image source={{
                                uri: item?.images?.[0]?.product_images ?
                                    item?.images?.[0]?.product_images : 'https://i.pinimg.com/236x/42/ee/da/42eedaf70a43ad0ff896c1256d2a71cd.jpg'
                            }}
                                style={{ height: 50, width: 50, borderRadius: 8, marginTop: 5 }} />
                            <View style={{ flexDirection: 'column', marginLeft: 10, marginTop: 5 }}>
                                <Text style={Styles.ProductNameText}> {item?.product_name ? item?.product_name : ''} </Text>
                                <Text style={Styles.ProductDescText}>{item?.description ? item?.description : ''}</Text>
                                <View style={{ flexDirection: 'row', marginLeft: 2 }}>
                                    <Text style={Styles.productprice}>$250</Text>
                                    <Text style={Styles.productPriceOff}>$350</Text>
                                    <Text style={Styles.productPriceOffPercent}>(25%)</Text>
                                </View>
                            </View>
                        </View>

                    </View>
                    {/* <TouchableOpacity
                        // onPress={() => navigation.navigate('OrderDetailScreen', {
                        //     isDelivered: item?.delivered
                        // })} 
                        style={{ flex: 1, justifyContent: 'center' }}>
                        <Icon name={'chevron-right'} />
                    </TouchableOpacity> */}
                </View>
                <ListSeperator />
            </TouchableOpacity>
        )
    }

    const ListSeperator = () => {
        return (
            <View style={{ borderWidth: 0.8, borderColor: Colors.borderColor }} />
        )
    }


    return (
        <>
            {loading && <Loader size={'small'} color={'#000'} />}
            <View style={{ backgroundColor: Colors.white, flex: 1 }}>
                {(products && products.length !== 0) ?
                    <FlatList
                        data={products}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => {
                            return (
                                <DEALITEM item={item} index={index} />
                            )
                        }}

                    /> : <Text style={{ color: '#000', textAlign: 'center', padding: 10, fontSize: 20 }}>No Products available</Text>}
            </View>

        </>
    )
}

const Styles = StyleSheet.create({
    MainContainer: {
        paddingHorizontal: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        elevation: 2
    },
    Container: {
        flex: 4,
        justifyContent: 'center',
        paddingHorizontal: 5
    },
    ProductNameText: {
        color: Colors.black,
        fontSize: 14,
        fontFamily: Fonts.RobotoBold
    },
    ProductSizeText: {
        color: Colors.grayLight,
        fontSize: 12,
        marginVertical: 2,
        fontFamily: Fonts.RobotoRegular,
        marginLeft: 3
    },
    ProductDescText: {
        color: Colors.grayLight,
        fontSize: 12,
        marginVertical: 2,
        fontFamily: Fonts.RobotoMedium,
        marginLeft: 2
    },
    productprice: {
        color: Colors.black,
        fontSize: 12,
        fontFamily: Fonts.RobotoMedium
    },
    productPriceOff: {
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
        marginHorizontal: 10,
        fontSize: 12,
        color: Colors.app_grey,
        fontFamily: Fonts.RobotoMedium

    },
    productPriceOffPercent: {
        color: '#F89225',
        fontSize: 12,
        fontFamily: Fonts.RobotoMedium
    },
})
export default dealList
