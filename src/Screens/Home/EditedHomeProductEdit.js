import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View, StyleSheet, ActivityIndicator, Linking, Pressable } from "react-native";
import { Icon, Image } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Appurl from '../../API/Constant'
import { ProductListing, getBanner, addToFavourite, removefromFavourite, searchProduct, removefromFavouriteProduct } from "../../API";
import { get_url_extension, showToastMessage, staticImage } from "../../Utils";
import metrics, { Loader } from "../../Theme/Metrics";
import Colors from "../../Theme/Colors";
import Font from "../../Theme/Fonts";
import Share from "react-native-share";
import { useSelector } from "react-redux";
import RNFetchBlob from "rn-fetch-blob";
import Fonts from "../../Theme/Fonts";

const EditedHomeProductEdit = ({ navigation, item, renderSelectedItem, index, selectedArr, setAelectedArr, searchText, refreshPage = () => { }, refreshSearch = () => { } }) => {
    const [tokenValue, setTokenValue] = useState(null)
    const userData = useSelector(state => state?.user?.userData)

    return (
        <View style={styles.MainContainer}>
            <View style={styles.Container}>
                <TouchableOpacity disabled={selectedArr.find(e => e.id === item.id)}
                    onPress={() => {
                        if (selectedArr.find(e => e.id === item.id)) {
                            showToastMessage("Already Selected")
                        }
                        if (!selectedArr.find(e => e.id === item.id)) {
                            setAelectedArr([...selectedArr, item])
                        }
                    }}>
                    {/* <Image source={{ uri: item?.image ? item?.image : staticImage }} */}
                    {item?.images?.[0]?.product_images && get_url_extension(item?.images?.[0]?.product_images) !== 'mp4' &&
                        <Image source={{ uri: item?.images?.[0]?.product_images ? item?.images?.[0]?.product_images : staticImage }}
                            style={styles.Image}
                            PlaceholderContent={<ActivityIndicator />}
                        />
                    }
                </TouchableOpacity>
                <View style={{ paddingHorizontal: 5, marginTop: 10 }}>
                    <TouchableOpacity
                        onPress={renderSelectedItem}>
                        <Text style={styles.productName} numberOfLines={1} ellipsizeMode={"tail"}>{item.product_name ? item.product_name : ''}</Text>
                    </TouchableOpacity>
                    <Text style={styles.productDesc}
                        ellipsizeMode={"tail"}
                        numberOfLines={1}
                    >{item.description ? item.description : ''}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.productprice}>${Math.trunc(item?.price - item?.price * item?.discount / 100)}</Text>
                        <Text style={styles.productPriceOff}>
                            ${item?.price ? item?.price : ''}
                        </Text>
                        {(100 - item?.discount >= "0") ?
                            <Text style={styles.productPriceOffPercent}>{item?.discount}%</Text>
                            :
                            <></>
                        }

                    </View>
                </View>
            </View>
        </View >
    )
}


const styles = StyleSheet.create({

    MainContainer: {
        marginVertical: 10,
        width: metrics.ScreenWidth / 2,
        justifyContent: 'center',
        alignItems: 'center',
    },

    Container: {
        width: metrics.ScreenWidth / 2.1,
        borderColor: Colors.wishlistBorderColor,
        borderWidth: 1,
        backgroundColor: Colors.white,
        paddingVertical: 10
    },
    HeartIcon: {
        position: 'absolute',
        right: 10,
        top: 58,
        zIndex: 999,
        // backgroundColor: "#808080",
        backgroundColor: "#a9a9a9",
        padding: 5,
        borderRadius: 100
    },
    ShareIcon: {
        position: 'absolute',
        right: 10,
        top: 32,
        zIndex: 999,
        backgroundColor: "#a9a9a9",
        padding: 5,
        borderRadius: 100
    },
    CommentIcon: {
        position: 'absolute',
        right: 10,
        top: 5,
        zIndex: 999,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    Image: {
        width: metrics.ScreenWidth / 2.1,
        height: metrics.ScreenWidth / 2.1,
    },
    LikeandcommentTextView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    CommentLikeText: {
        fontSize: 14,
        fontFamily: Font.RobotoBold,
        color: "white",
        marginRight: 5,
    },
    LikeCommentView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        paddingVertical: 5
    },
    productName: {
        color: Colors.black,
        fontSize: 16,
        fontFamily: Font.RobotoBold
    },
    productDesc: {
        fontSize: 12,
        color: Colors.grayLight,
        fontFamily: Font.RobotoMedium,
        marginVertical: 5
    },
    productprice: {
        color: Colors.black,
        fontSize: 12,
        fontFamily: Font.RobotoMedium
    },
    productPriceOff: {
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
        marginHorizontal: 10,
        fontSize: 12,
        color: Colors.app_grey,
        fontFamily: Font.RobotoMedium

    },
    productPriceOffPercent: {
        color: '#F89225',
        fontSize: 12,
        fontFamily: Font.RobotoMedium
    },



})


export default EditedHomeProductEdit