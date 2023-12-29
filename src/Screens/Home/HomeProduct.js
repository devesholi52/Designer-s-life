import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View, StyleSheet, ActivityIndicator, Linking } from "react-native";
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

const HomeProduct = ({ navigation, item, index, searchText, refreshPage = () => { }, refreshSearch = () => { } }) => {
    const [tokenValue, setTokenValue] = useState(null)
    const userData = useSelector(state => state?.user?.userData)

    const add_To_Favourite = async (item) => {
        const token = await AsyncStorage.getItem('token')
        let form = { "product_id": `${item.id}` }
        addToFavourite(form, token).then(response => {
            if (response && response.data) {
                showToastMessage('Product added to Favorite successfully')
                // refreshSearch()
                refreshPage()
            }
        })
    }

    const removeProductLike = async (item) => {
        const token = await AsyncStorage.getItem('token')
        let form = { "product_id": `${item.id}` }
        removefromFavouriteProduct(form, token).then(response => {
            if (response && response.data) {
                showToastMessage('Product removed from Favorite Successfully')
                // refreshSearch()
                refreshPage()
            }
        }).finally(e => { })
    }

    const postLike = async () => {
        // setLoading(true)
        const token = await AsyncStorage.getItem('token')
    }

    const onPressLike = async (item, index) => {
        const token = await AsyncStorage.getItem('token')
        let form = new FormData()
        form.append('product_id', item.id)
        fetch(Appurl.POST_LIKE, {
            method: 'POST',
            headers: { Authorization: `Token ${token}` },
            body: form
        }).then(res => res.json())
            .then(response => {
                // refreshSearch()
                refreshPage()
            })

    }

    const onPressComment = async (item, index) => {
        const token = await AsyncStorage.getItem('token')
        let form = new FormData()
        form.append('product_id', item.id)
        fetch(Appurl.POST_COMMENT, {
            method: 'POST',
            headers: { Authorization: `Token ${token}` },
            body: form
        }).then(res => res.json())
            .then(response => {
                navigation.navigate('CommentsIcon',
                    { UserId: item.id })
            })
    }

    const messageSeller = () => {
        if (item?.created_by === userData?.id) {
            showToastMessage('You can not message yourself.');
            return
        }
        navigation.navigate('Messanger', { userId: item?.created_by })
    }
    const onShare = async () => {
        let id = item?.id
        // let url = 'https://play.google.com/store/apps/details?id=com.facebook'
        // let url = `lifeofdesigner://ProductDetailScreen/${id}`
        let url = 'https://play.google.com/store/apps/details?id=com.lifeofdesigner'
        // Linking.openURL('lifeofdesigner://ProductDetailScreen/${id}')

        const fs = RNFetchBlob.fs;
        let imagePath = null;
        RNFetchBlob.config({ fileCache: true })
            .fetch("GET", item?.images?.[0]?.product_images)
            .then(resp => { imagePath = resp.path(); return resp.readFile("base64"); })
            .then(async (base64Data) => {
                let shareOption = {
                    title: 'Life of designer',
                    message: `${item?.product_name ? item?.product_name : ''},\n Download Life of designer app.\n Click on the link below\n${url}`,
                    urls: [`data:image/jpeg;base64,${base64Data}`],
                    url: `lifeofdesigner://ProductDetailScreen/${id}`,
                };
                try {
                    const shareResponse = await Share.open(shareOption);
                    console.log(JSON.stringify(shareResponse));
                    console.log("shareResponse", JSON.stringify(shareResponse));
                } catch (error) { console.log('Share Error', error.message); }
                return fs.unlink(imagePath);
            });
    };

    // const onShare = async () => {
    //     let id = 254
    //     let url = `lifeofdesigner://ProductDetailScreen/${id}`
    //     let newData = null;
    //     const getBase64 = (file) => {
    //         const fs = RNFetchBlob.fs;
    //         RNFetchBlob.config({ fileCache: true })
    //             .fetch("GET", file)
    //             .then(resp => { newData = resp.path(); return resp.readFile("base64"); })
    //             .then(async (base64Data) => {
    //                 return base64Data;
    //             }).finally(e => fs.unlink(newData))
    //     }
    //     let shareOption = {
    //         title: 'Life of designer',
    //         message: `${item?.product_name ? item?.product_name : ''},\n Download Life of designer app.\n Click on the link below\n${url}`,
    //         urls: [`data:image/jpeg;base64,${getBase64(item?.images?.[0]?.product_images)}`],
    //         // url: `data:image/jpeg;base64,${getBase64(`lifeofdesigner://ProductDetailScreen/${id}`)}`,
    //         // social: Share.Social.WHATSAPP
    //     };
    //     try {
    //         const shareResponse = await Share.open(shareOption);
    //         console.log(JSON.stringify(shareResponse));
    //         console.log("shareResponse", JSON.stringify(shareResponse));
    //     } catch (error) { console.log('Share Error', error.message); }
    // };

    return (
        <View style={styles.MainContainer}>
            <View style={styles.Container}>
                {(item?.created_by !== userData?.id) ?
                    <TouchableOpacity
                        onPress={() => {
                            if (item?.frvourite_products) removeProductLike(item)
                            else add_To_Favourite(item)
                        }}
                        style={styles.HeartIcon}>
                        <Icon name={item?.frvourite_products ? 'heart' : 'heart'} type={"ant-design"} color={item?.frvourite_products ? 'red' : Colors.white} size={12} />
                        {/* <Image source={item?.frvourite_products ? require('../../Assets/heart-active.png') : require('../../Assets/heart.png')} style={{ width: 20, height: 20, color: "" }} /> */}
                    </TouchableOpacity>
                    :
                    <></>
                }
                <TouchableOpacity
                    onPress={onShare}
                    style={styles.ShareIcon} >
                    {/* <Image source={require('../../Assets/shar.png')} style={{ width: 20, height: 20 }} /> */}
                    <Icon name={'share-variant-outline'} type={'material-community'} size={12} color={Colors.white} />
                </TouchableOpacity>

                <View style={styles.CommentIcon}>
                    {/* <TouchableOpacity onPress={() => onPressLike(item, index)}>
                        <Icon name="like1" type={"ant-design"} size={15} color={item?.like_this_product ? Colors.black : Colors.app_grey} />
                    </TouchableOpacity> */}
                    {/* <Text style={styles.CommentLikeText}>{item.like.length ? item.like.length : ''}</Text> */}
                    <TouchableOpacity onPress={() => navigation.navigate('CommentsIcon', { UserId: item.id })}
                        // onPress={() => navigation.navigate('CommentsIcon', { UserId: item?.id })}
                        style={{ backgroundColor: "#a9a9a9", padding: 5, borderRadius: 100 }}
                    >
                        <Icon name={'comment-o'} type={'font-awesome'} size={12} color={Colors.white} />
                        {/* <Image source={require('../../Assets/comment.png')} style={{ width: 20, height: 20 }} /> */}
                    </TouchableOpacity>
                </View>




                <TouchableOpacity onPress={() => navigation.navigate("ProductDetailScreen", {
                    itemID: item.id,
                    itemCreatedBy: item?.created_by
                })}>
                    {/* <Image source={{ uri: item?.image ? item?.image : staticImage }} */}
                    {item?.images?.[0]?.product_images && get_url_extension(item?.images?.[0]?.product_images) !== 'mp4' &&
                        <Image source={{ uri: item?.images?.[0]?.product_images ? item?.images?.[0]?.product_images : staticImage }}
                            style={styles.Image}
                            PlaceholderContent={<ActivityIndicator />}
                        />
                    }
                </TouchableOpacity>
                {/* 
                <View style={styles.LikeCommentView}>
                    <View style={styles.LikeandcommentTextView}>
                        <TouchableOpacity onPress={() => navigation.navigate('CommentsIcon', { UserId: item.id })}
                        >
                            <Icon name={'comment'} type={'font-awesome'} size={15} style={{ marginHorizontal: 2 }} color={Colors.black} />
                        </TouchableOpacity>
                        <Text style={styles.CommentLikeText}>{item.like.length ? item.like.length : ''}</Text>
                    </View>
                    <View style={styles.LikeandcommentTextView}>
                        <TouchableOpacity
                            onPress={onShare}>
                            <Icon name={'share-variant-outline'} type={'material-community'} size={18} color={Colors.black} style={{ marginHorizontal: 10 }} />
                        </TouchableOpacity>
                    </View>
                </View> */}
                <View style={{ paddingHorizontal: 5, marginTop: 10 }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("ProductDetailScreen", {
                            itemID: item.id
                        })}>
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
                <View style={{ alignSelf: 'baseline' }}>
                    <View style={{ flexDirection: 'row', marginVertical: 5, }}>
                        <TouchableOpacity onPress={messageSeller} style={{ flexDirection: 'row' }}>
                            <Icon name={'chat'} type={'entypo'} size={18} color={Colors.grayLight} style={{ marginHorizontal: 5 }} />
                            <Text style={{ color: 'black', fontFamily: Fonts.RobotoRegular, fontSize: 12 }}>Chat with Seller</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View >
    )
}


const styles = StyleSheet.create({

    MainContainer: {
        marginVertical: 5,
        width: metrics.ScreenWidth / 2,
        justifyContent: 'center',
        alignItems: 'center',

    },

    Container: {
        width: metrics.ScreenWidth / 2.1,
        borderColor: Colors.wishlistBorderColor,
        borderWidth: 1,
        backgroundColor: Colors.white

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
        width: metrics.ScreenWidth / 2.1 - 2,
        height: metrics.ScreenWidth / 1.8,
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
        fontFamily: Font.RobotoMedium
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


export default HomeProduct