import React, { useRef, useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image, Pressable, TouchableOpacity } from 'react-native'
import { get_url_extension, showToastMessage, staticImage } from '../Utils'
export function dynamicSize(val) { return val }
import Appurl from "../API/Constant"
import { Icon } from "react-native-elements";
import Colors from '../Theme/Colors'
import Fonts from '../Theme/Fonts'
import Share from "react-native-share";
import metrics, { Loader } from "../Theme/Metrics";
import { useSelector } from "react-redux";
import RNFetchBlob from "rn-fetch-blob";

const ALIGNMENT = {
    SPACE_BETWEEN: 'space-between',
    CENTER: 'center',
    ROW: 'row',
    COLUMN: 'column'
}
const ProductCard = ({ item, navigation, product,
    index,
    onPressLike,
    myCustomShare,
    removeProductLike,
    add_To_Favourite_Deal, removeProduct
}) => {

    const userData = useSelector(state => state?.user?.userData)
    const [picture, setPicture] = useState([])

    // useEffect(() => {
    //     let data = []
    //     item?.product?.[0]?.images?.forEach(e => {
    //         if (get_url_extension(e?.product_images) !== 'mp4') {
    //             data.push(e)
    //         }
    //     });
    //     setPicture(data)
    // }, [])
    const onShare = async () => {
        let id = item?.id
        // let url = 'https://play.google.com/store/apps/details?id=com.facebook'
        let url = `https://play.google.com/store/apps/details?id=com.lifeofdesigner`
        // let url = `lifeofdesigner://ProductDetailScreen/${id}`
        // let url = `https://lifeofdesigner.keycorp.in://ProductDetailScreen/${id}`
        let imageUrl = picture[0]?.images?.[0]?.product_images ? `${Appurl.ROOT + picture[0]?.images?.[0]?.product_images}` : staticImage
        const fs = RNFetchBlob.fs;
        let imagePath = null;
        RNFetchBlob.config({ fileCache: true })
            .fetch("GET", imageUrl)
            .then(resp => { imagePath = resp.path(); return resp.readFile("base64"); })
            .then(async (base64Data) => {
                let shareOption = {
                    title: 'Life of designer',
                    message: `${item?.title ? item?.title : ''},\n Download Life of designer app.\n Click on the link below\n${url}`,
                    urls: [`data:image/jpeg;base64,${base64Data}`]
                };
                try {
                    const shareResponse = await Share.open(shareOption);
                    console.log(JSON.stringify(shareResponse));
                } catch (error) { console.log('Share Error', error.message); }
                return fs.unlink(imagePath);
            });
    };

    const messageSeller = () => {
        if (item?.created_by === userData?.id) {
            showToastMessage('You can not message yourself.');
            return
        }
        navigation.navigate('Messanger', { userId: item?.created_by })
    }
    console.log("item?.frvourite_deals", item?.frvourite_deals);
    return (
        <View style={style.box}>

            {(item?.created_by == userData?.id) ?
                (item?.frvourite_deals == "true") &&
                <TouchableOpacity
                    onPress={() => removeProductLike(item)}
                    style={{ position: 'absolute', right: 10, top: 58, zIndex: 999, backgroundColor: "#a9a9a9", padding: 5, borderRadius: 100 }}>
                    <Icon name={'heart'} type={"ant-design"} color={item?.frvourite_deals == "true" ? "red" : Colors.white} size={12} />
                </TouchableOpacity>
                :
                <TouchableOpacity
                    onPress={() => {
                        if (item?.frvourite_deals) removeProduct(item)
                        else add_To_Favourite_Deal(item)
                    }}
                    style={{ position: 'absolute', right: 10, top: 58, zIndex: 999, backgroundColor: "#a9a9a9", padding: 5, borderRadius: 100 }}>
                    <Icon name={item?.frvourite_deals ? 'heart' : 'heart'} type={"ant-design"} color={item?.frvourite_deals ? 'red' : Colors.white} size={12} />
                </TouchableOpacity>
            }
            <View style={{ position: 'absolute', right: 10, top: 5, zIndex: 999 }}>
                {/* <TouchableOpacity onPress={() => onPressLike(item, index)}>
                    <Icon name={'like1'} type={'antdesign'} size={18} color={item?.like_this_deal ? Colors.black : Colors.app_grey} />
                </TouchableOpacity>
                <Text style={style.likeText}>{item?.like?.length ? item?.like?.length : '0'}</Text> */}
                {/* <Text style={{ fontSize: 14, fontFamily: Fonts.RobotoBold, color: "green", marginRight: 15, }}>{item.comments?.length ? item.comments?.length : ''}</Text> */}
                <TouchableOpacity onPress={() => navigation.navigate('CommentsIconForDeal', { UserIdD: item.id })}
                    style={{ backgroundColor: "#a9a9a9", padding: 5, borderRadius: 100 }}>
                    <Icon name={'comment-o'} type={'font-awesome'} size={12} color={Colors.white} />
                </TouchableOpacity>
            </View>
            <View
                style={{ position: 'absolute', right: 10, top: 32, zIndex: 999, backgroundColor: "#a9a9a9", padding: 5, borderRadius: 100 }}>
                <TouchableOpacity
                    onPress={onShare}>
                    <Icon name={'share-variant-outline'} type={'material-community'} size={12} color={Colors.white} />
                </TouchableOpacity>
            </View>
            <Pressable style={style.boxInner}
                onPress={() => navigation.navigate("ProductDetailsDeal", {
                    itemIDDDDDD: item?.id
                })}
            >
                {product?.length === 1 ?
                    <Image source={{ uri: product?.[0]?.images?.[0]?.product_images ? product?.[0]?.images?.[0]?.product_images : staticImage }} style={style.singleImage} />
                    : <Image source={{ uri: product?.[0]?.images?.[0]?.product_images ? product?.[0]?.images?.[0]?.product_images : staticImage }} style={style.boxMainImage} />}

                {product?.length === 2 ?
                    <Image source={{ uri: product?.[1]?.images?.[0]?.product_images ? product?.[1]?.images?.[0]?.product_images : staticImage }} style={style.boxSecondImage} />
                    : <>
                        {product?.length > 2 && <View style={style.rightImgBox}>
                            <Image source={{ uri: product?.[1]?.images?.[0]?.product_images ? product?.[1]?.images?.[0]?.product_images : staticImage }} style={style.boxSecondHalfImage} />
                            {<View>
                                {product?.length > 3 && <Text style={style.imagesCount}>+{product?.length - 3}</Text>}
                                <Image source={{ uri: product?.[2]?.images?.[0]?.product_images ? product?.[2]?.images?.[0]?.product_images : staticImage }} style={[style.boxThirdImage, {
                                    opacity: product?.length > 3 ? 0.7 : 1.0
                                }]} />
                            </View>}
                        </View>}
                    </>}
            </Pressable>

            <View style={style.boxBottom}>
                {/* <View style={style.likeCommentView}>
                    <View style={style.LikeandTextView}>
                        <TouchableOpacity onPress={() => navigation.navigate('CommentsIconForDeal', { UserIdD: item.id })}>
                            <Icon name={'comment-o'} type={'font-awesome'} size={18} style={{ marginHorizontal: 2 }} color={Colors.grayLight} />
                        </TouchableOpacity>
                        <Text style={style.CommentText}>{item.comments?.length ? item.comments?.length : ''}</Text>
                    </View>
                    <View
                        style={style.CommentandTextView}>
                        <TouchableOpacity
                            onPress={onShare}>
                            <Icon name={'share-variant-outline'} type={'material-community'} size={18} color={Colors.black} style={{ marginHorizontal: 10 }} />
                        </TouchableOpacity>
                    </View>
                </View> */}
                <View style={{ paddingHorizontal: 5, }}>
                    <TouchableOpacity onPress={() => navigation.navigate("ProductDetailsDeal", {
                        itemIDDDDDD: item?.id
                    })}>
                        <Text
                            style={style.TittleText}
                            ellipsizeMode={"tail"} numberOfLines={1}>{item?.title}</Text>
                    </TouchableOpacity>
                    <Text
                        style={style.DescriptionText}
                        ellipsizeMode={"tail"} numberOfLines={1}>{item?.description}
                    </Text>

                    <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                        <Text
                            style={style.PriceText}>${item?.price}</Text>
                        <Text
                            style={style.PriceOffText}>${item?.total_price}
                        </Text>
                        <Text style={style.DiscountText}>{item?.discount}</Text>

                    </View>
                </View>
                <View style={{ alignSelf: 'baseline' }}>
                    <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                        <TouchableOpacity onPress={messageSeller} style={{ flexDirection: 'row' }}>
                            <Icon name={'chat'} type={'entypo'} size={18} color={Colors.grayLight} style={{ marginHorizontal: 5 }} />
                            <Text style={{ color: 'black', fontFamily: Fonts.RobotoRegular, fontSize: 13, paddingLeft: 5, paddingTop: 1 }}>Chat with Seller</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* </View> */}
            </View>
        </View>
    )
}

export default ProductCard

const style = StyleSheet.create({
    box: {
        justifyContent: ALIGNMENT.SPACE_BETWEEN,
        backgroundColor: '#fff',
        margin: dynamicSize(20),
        marginVertical: dynamicSize(10),
        borderRadius: dynamicSize(10),
        alignSelf: ALIGNMENT.CENTER,
        // height: dynamicSize(300),
        width: dynamicSize(350)
    },
    boxInner: {
        flexDirection: ALIGNMENT.ROW,
        justifyContent: ALIGNMENT.SPACE_BETWEEN,
    },
    rightImgBox: {
        flexDirection: ALIGNMENT.COLUMN,
        justifyContent: ALIGNMENT.SPACE_BETWEEN,
    },
    // single image
    singleImage: {
        width: dynamicSize(335),
        height: dynamicSize(220),
        borderTopLeftRadius: dynamicSize(10),
        borderTopRightRadius: dynamicSize(10)
    },
    // when 2 or more images are there this will be 1st img
    boxMainImage: {
        height: dynamicSize(220),
        width: dynamicSize(180),
        borderTopLeftRadius: dynamicSize(10),
    },
    // when exact 2 images are there, this will be 2nd image
    boxSecondImage: {
        height: dynamicSize(220),
        width: dynamicSize(154),
        borderTopRightRadius: dynamicSize(10),
    },
    // when there will be 3 or more images then this will be 2nd image 
    boxSecondHalfImage: {
        height: dynamicSize(110),
        width: dynamicSize(153),
        borderTopRightRadius: dynamicSize(10),
    },
    // when there are 3 more more images, this will be the last image
    boxThirdImage: {
        height: dynamicSize(108),
        width: dynamicSize(153),
    },
    imagesCount: {
        position: 'absolute',
        alignSelf: ALIGNMENT.CENTER,
        color: '#fff',
        zIndex: dynamicSize(999),
        fontSize: 16,
        fontWeight: 'bold',
        top: '50%'
    },

    title: {
        fontSize: 18,
        color: '#000',
        paddingHorizontal: dynamicSize(10),
    },
    description: {
        fontSize: 18,
        color: 'gray',
        paddingHorizontal: dynamicSize(10),
    },
    boxBottom: {
        padding: dynamicSize(10),
        // flexDirection: 'row',
        justifyContent: 'space-between',
        // alignItems: 'center',
    },

    // Bottom Sheet
    BgDeleteContainer: {
        flexDirection: ALIGNMENT.ROW,
        justifyContent: ALIGNMENT.SPACE_BETWEEN,
        marginHorizontal: 10
    },
    sheetDeleteText: {
        color: '#ff4545',
        fontSize: dynamicSize(16),
        marginLeft: dynamicSize(20),
        fontWeight: 'bold'
    },
    deleteSheetText: {
        fontSize: dynamicSize(19),
        color: '#343434',
        fontWeight: 'bold',
        textAlign: ALIGNMENT.CENTER,
        padding: dynamicSize(10)
    },
    deleteSheetDescription: {
        fontSize: dynamicSize(15),
        color: 'gray',
        textAlign: ALIGNMENT.CENTER
    },
    sheetDeleteBgBtnText: {
        color: '#ff4545',
        fontSize: dynamicSize(14),
        fontWeight: 'bold'
    },


    MainTouchableStyle: {
        marginVertical: 5,
        width: metrics.ScreenWidth / 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    Container: {
        // width: metrics.ScreenWidth / 2.1,
        borderColor: Colors.wishlistBorderColor,
        borderWidth: 1,
        backgroundColor: Colors.white
    },
    likeCommentView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        paddingVertical: 5
    },
    likeText: {
        fontSize: 14,
        color: Colors.black,
        fontFamily: Fonts.RobotoLight
    },
    CommentText: {
        fontSize: 14,
        color: Colors.black,
        fontFamily: Fonts.RobotoLight,

    },
    LikeandTextView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    CommentandTextView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    TittleText: {
        color: Colors.black,
        fontFamily: Fonts.RobotoBold,
        fontSize: 16
    },
    DescriptionText: {
        fontSize: 12,
        color: Colors.grayLight,
        fontFamily: Fonts.RobotoMedium,
        marginVertical: 5
    },
    PriceText: {
        color: Colors.black,
        fontSize: 12,
        fontFamily: Fonts.RobotoMedium
    },
    PriceOffText: {
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
        marginHorizontal: 10,
        fontSize: 12,
        color: Colors.grayLight,
        fontFamily: Fonts.RobotoMedium
    },
    DiscountText: {
        color: '#F89225',
        fontSize: 12,
        fontFamily: Fonts.RobotoMedium
    },
    TextInputView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 15,
        marginVertical: 10,
        borderWidth: 2,
        borderColor: Colors.searchBorderColor,
        borderRadius: 30
    },

})