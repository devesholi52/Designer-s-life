

import React, { useState, useEffect } from "react";
import { FlatList, Image, Pressable, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import metrics, { Loader } from "../Theme/Metrics";
import Colors from "../Theme/Colors";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Icon } from "react-native-elements";
import Fonts from "../Theme/Fonts";
import Share from "react-native-share";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Appurl from "../API/Constant"
import { showToastMessage, staticImage } from '../Utils'
import { DeletefromFavouriteProduct } from "../API";
// import WishlistProductDetails from "../WishlistProductDetails";
import ProductDetailScreen from "../Screens/Home/ProductDetailScreen";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import RNFetchBlob from "rn-fetch-blob";

const Product = ({ route }) => {
  // const navigation=useNavigation()
  // const WISHLIST_DATA = [
  //   {
  //     id: 1,
  //     image: require('../Assets/product1.jpg')
  //   },
  //   {
  //     id: 2,
  //     image: require('../Assets/product2.jpg')
  //   },
  //   {
  //     id: 3,
  //     image: require('../Assets/product3.jpg')
  //   },
  //   {
  //     id: 3,
  //     image: require('../Assets/product5.jpg')
  //   }
  // ]

  const [isList, setisList] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [moveToBagData, setMoveToBagData] = useState('')
  const userData = useSelector(state => state?.user?.userData)

  const navigation = useNavigation()

  const myCustomShare = async (message = '') => {
    const shareOptions = { message: message }
    try {
      const ShareResponse = await Share.open(shareOptions);
    }
    catch (error) { console.log('Error => ', error); }
  };

  useEffect(() => {
    // const unsubscribe = navigation.addListener('focus', () => {
    getWishlist()
    // return unsubscribe;
    // })

  }, [])
  const onShare = async () => {
    let id = isList?.id
    // let url = 'https://play.google.com/store/apps/details?id=com.facebook'
    // let url = `lifeofdesigner://ProductDetailScreen/${id}`
    let url = `https://play.google.com/store/apps/details?id=com.lifeofdesigner`
    const fs = RNFetchBlob.fs;
    let imagePath = null;
    RNFetchBlob.config({ fileCache: true })
      .fetch("GET", isList?.[0]?.images?.[0]?.product_images)
      .then(resp => { imagePath = resp.path(); return resp.readFile("base64"); })
      .then(async (base64Data) => {
        let shareOption = {
          title: 'Life of designer',
          message: `${isList?.[0]?.product_name ? isList?.[0]?.product_name : ''},\n Download Life of designer app.\n Click on the link below\n${url}`,
          urls: [`data:image/jpeg;base64,${base64Data}`]
        };
        try {
          const shareResponse = await Share.open(shareOption);
          console.log(JSON.stringify(shareResponse));
        } catch (error) { console.log('Share Error', error.message); }
        return fs.unlink(imagePath);
      });
  };

  const getWishlist = async () => {
    setLoading(true)
    const token = await AsyncStorage.getItem('token')
    fetch(Appurl.SET_WISHLIST, {
      method: 'GET',
      headers: { Authorization: `Token ${token}` },
    }).then(res => res.json())
      .then(response => {

        setisList([...response.data])
      }).finally(e => setLoading(false),
        setRefreshing(false))
  }

  const removeProductLike = async (item) => {
    const token = await AsyncStorage.getItem('token')
    let form = { "product_id": `${item.id}` }
    DeletefromFavouriteProduct(form, token).then(response => {
      if (response && response.data) {
        showToastMessage('Product removed from Favourite list successfully ')
        getWishlist()
      }
    }).finally(e => { })
  }

  const MOVETOBAG = async (item) => {
    const token = await AsyncStorage.getItem('token')
    let form = new FormData()
    form.append('product', `${item.id}`)

    fetch(Appurl.POST_ADD_TO_CARD, {
      method: 'POST',
      headers: { Authorization: `Token ${token}` },
      body: form
    })
      .then(res => res.json())
      .then(response => {
        if (response && response.data) {
          showToastMessage('Product moved to Bag')
        }
        setMoveToBagData(response)
        // { ToastAndroid.show('something went wrong', ToastAndroid.SHORT) };
        getWishlist()
      }
      )

  }
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getWishlist();
  }, []);

  const messageSeller = (item) => {
    if (item?.created_by === userData?.id) {
      showToastMessage('You can not message yourself.');
      return
    }
    navigation.navigate('Messanger', { userId: item?.created_by })
  }

  const WISHLISTITEM = ({ item, index }) => {
    return (
      <Pressable style={{ marginHorizontalHorizontal: 5, marginVertical: 20, width: metrics.ScreenWidth / 2, justifyContent: 'center', alignItems: 'center' }}
      >
        <View style={{ width: metrics.ScreenWidth / 2.1, borderColor: Colors.wishlistBorderColor, borderWidth: 1, backgroundColor: Colors.white }}>

          <TouchableOpacity onPress={() => navigation.navigate("ProductDetailScreen", {
            itemID: item.id
          })}>
            <Image source={{ uri: item?.images?.[0]?.product_images ? /* Appurl + */ item?.images?.[0]?.product_images : staticImage }}
              style={{ width: metrics.ScreenWidth / 2.1 - 2, height: metrics.ScreenWidth / 1.8 }} />
          </TouchableOpacity>

          <TouchableOpacity style={{ position: 'absolute', right: 10, top: 5, zIndex: 999 }}
            onPress={() => removeProductLike(item)}>
            <Image style={{ height: 20, width: 20 }} source={require('../Assets/Icon/close.png')}
            />

          </TouchableOpacity>
          <View style={{ padding: 10 }}>
            <TouchableOpacity
              onPress={() => navigation.navigate("ProductDetailScreen", {
                itemID: item.id
              })}>
              <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold, fontSize: 16 }} ellipsizeMode={"tail"} numberOfLines={1}>{item?.product_name}</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 12, fontFamily: Fonts.RobotoMedium, color: Colors.grayLight, }}
              ellipsizeMode={"tail"}
              numberOfLines={1}
            >{item?.description}</Text>
            <View style={{ flexDirection: 'row', marginTop: 5 }}>
              <Text style={{ color: Colors.black, fontSize: 12, fontFamily: Fonts.RobotoMedium }}>${Math.trunc(item?.price - item?.price * item?.discount / 100)}</Text>
              <Text style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid', marginHorizontal: 10, fontSize: 12, fontFamily: Fonts.RobotoMedium, color: Colors.grayLight, }}>
                ${item?.price}
              </Text>
              <Text style={{ color: '#F89225', fontSize: 12, fontFamily: Fonts.RobotoMedium }}>{item?.discount}%</Text>
            </View>
          </View>
          <View style={{ alignSelf: 'baseline' }}>
            <View style={{ flexDirection: 'row', marginVertical: 5 }}>
              <TouchableOpacity onPress={() => messageSeller(item)}>
                <Icon name={'message-text-outline'} type={'material-community'} size={18} color={Colors.grayLight} style={{ marginHorizontal: 10 }} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onShare}>
                <Icon name={'share-variant-outline'} type={'material-community'} size={18} color={Colors.grayLight} style={{ marginHorizontal: 10 }} />
              </TouchableOpacity>
            </View>
            {(item?.cart_products == true) ?
              <TouchableOpacity style={{ alignSelf: 'baseline', backgroundColor: "black", width: metrics.ScreenWidth / 2.1 - 2, marginTop: 10 }}
                onPress={() => MOVETOBAG(item)}
                disabled={item?.cart_products}
              >
                <Text style={{ textAlign: 'center', color: "white", marginVertical: 5, lineHeight: 20, letterSpacing: 1, fontSize: 12, fontFamily: Fonts.RobotoBold }}>Moved to Bag</Text>
              </TouchableOpacity>
              :
              <TouchableOpacity style={{ alignSelf: 'baseline', backgroundColor: Colors.grayFed, width: metrics.ScreenWidth / 2.1 - 2, marginTop: 10 }}
                onPress={() => MOVETOBAG(item)}
                disabled={item?.cart_products}
              >
                <Text style={{ textAlign: 'center', color: Colors.black, marginVertical: 5, lineHeight: 20, letterSpacing: 1, fontSize: 12, fontFamily: Fonts.RobotoBold }}>Move to Bag</Text>
              </TouchableOpacity>
            }
          </View>

        </View>

      </Pressable>
    )
  }

  const _renderWishlistItem = ({ item, index }) => {
    return (
      <WISHLISTITEM item={item} index={index} />
    )
  }
  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.white }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {loading && <Loader size={'small'} color={'#000'} />}
      {(isList && isList.length !== 0) ?
        <FlatList
          data={isList}
          renderItem={_renderWishlistItem}
          numColumns={2}
          showsVerticalScrollIndicator={false}
        /> : <Text style={{ color: '#000', textAlign: 'center', padding: 10, fontSize: 20 }}>No Product Added</Text>}
    </ScrollView>

  )
}
export default Product
