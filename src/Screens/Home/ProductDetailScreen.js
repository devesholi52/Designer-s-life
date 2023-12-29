import React, { useState, useEffect, useRef } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View, TextInput, StyleSheet, FlateList, ActivityIndicator } from "react-native";
import { SwiperFlatList } from "react-native-swiper-flatlist/src/components/SwiperFlatList/SwiperFlatList";
import { Card, Icon } from "react-native-elements";
import Video from 'react-native-video';
import metrics, { Loader } from "../../Theme/Metrics";
import Colors from "../../Theme/Colors";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AirbnbRating, Rating } from "react-native-ratings";
import RatingAndReviewScreen from "./RatingAndReviewScreen";
import AddressScreen from "../Address/AddressScreen";
import ShoppingbagScreen from "./ShoppingbagScreen/ShoppingbagScreen";
import Fonts from "../../Theme/Fonts";
import Share from "react-native-share";
import ProductSize from "./ProductSize";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addToFavourite, getLikeParticularProductData, getParticularProductData, removefromFavouriteProduct } from "../../API";
import Appurl from '../../API/Constant'
import { get_url_extension, showToastMessage, staticImage } from "../../Utils";
import moment from "moment";
import { useSelector } from "react-redux";
import { Pressable } from "react-native";
import RNFetchBlob from "rn-fetch-blob";

const sizes = [
  {
    id: 1,
    SIZE: 'XS',
    selected: false
  },
  {
    id: 2,
    SIZE: 'S',
    selected: false
  },
  {
    id: 3,
    SIZE: 'M',
    selected: false
  },
  {
    id: 4,
    SIZE: 'L',
    selected: false
  },
  {
    id: 5,
    SIZE: 'XL',
    selected: false
  },
]
const ratings = [{
  id: 1,
  name: 'Norah Jones',
  rating: 4,
  comment: 'The point of using lorem ipsum is that it has a more-or-less normal distributions of letters',
}, {
  id: 2,
  name: 'Krishnita Nathans',
  rating: 3,
  comment: 'The point of using lorem ipsum is that it has a more-or-less normal distributions of letters'
}]

const myCustomShare = async (message = '') => {
  const shareOptions = { message: message }
  try {
    const ShareResponse = await Share.open(shareOptions);
  }
  catch (error) { console.log('Error => ', error); }
};
const ProductDetailScreen = ({ route }) => {
  const {
    params: { deeplinkId, itemID }
  } = route
  const videoRef = useRef()
  const userData = useSelector(state => state?.user?.userData)
  const [loading, setLoading] = useState(false)
  const [videoLoading, setVideoLoading] = useState(false)
  const [product, setProduct] = useState([])
  const [productID, setProductId] = useState(itemID ? itemID : '')
  // const [productID, setProductId] = useState(deeplinkId ? deeplinkId : (itemID ? itemID : ''))
  const [rateit, setRateit] = useState('')
  const [reviewUs, setReviewus] = useState('')
  const [select, setSelect] = useState('')
  const [itemCreatedBy, setItemCreatedBy] = useState(route?.params?.itemCreatedBy ? route?.params?.itemCreatedBy : '')

  const navigation = useNavigation()

  useEffect(() => {
    getProductData()
  }, [])

  const getProductData = async () => {
    setLoading(true)
    const token = await AsyncStorage.getItem('token')
    getParticularProductData(productID, token).then(response => {
      let res = response.data
      console.log(res);
      if (res && res.length !== 0) {
        setProduct(res)
      }
      else setProduct([])
    })
      .finally(e => setLoading(false))
  }

  const onShare = async () => {
    let id = itemID
    // let url = 'https://play.google.com/store/apps/details?id=com.facebook'
    // let url = `lifeofdesigner://ProductDetailScreen/${id}`
    // let url = `https://lifeofdesigner.keycorp.in://ProductDetailScreen/${id}`
    let url = `https://play.google.com/store/apps/details?id=com.lifeofdesigner`
    const fs = RNFetchBlob.fs;
    let imagePath = null;
    RNFetchBlob.config({ fileCache: true })
      .fetch("GET", product?.data?.images?.[0]?.product_images)
      .then(resp => { imagePath = resp.path(); return resp.readFile("base64"); })
      .then(async (base64Data) => {
        let shareOption = {
          title: 'Life of designer',
          message: `${product?.data?.product_name ? product?.data?.product_name : ''},\n Download Life of designer app.\n Click on the link below\n${url}`,
          urls: [`data:image/jpeg;base64,${base64Data}`]
        };
        try {
          const shareResponse = await Share.open(shareOption);
          console.log(JSON.stringify(shareResponse));
        } catch (error) { console.log('Share Error', error.message); }
        return fs.unlink(imagePath);
      });
  };

  const renderItem = ({ item }) => {
    let videoUrl = get_url_extension(item?.product_images) == 'mp4' && item?.product_images
    let imageUrl = get_url_extension(item?.product_images) !== 'mp4' && item?.product_images
    return (
      <View style={{
        width: metrics.ScreenWidth,
        height: metrics.ScreenHeight / 1.8,
        alignItems: 'center',
      }}>
        {(itemCreatedBy !== userData?.id) ?
          <TouchableOpacity style={{ position: 'absolute', right: 10, top: 10, zIndex: 1, backgroundColor: "#3C3C3C", padding: 9, borderRadius: 200 }}
            onPress={() => {
              if (product?.data?.frvourite_products) removeProductLike()
              else add_To_Favourite()
            }}>
            <Icon
              name={product?.data?.frvourite_products ? 'heart' : 'hearto'} type={"ant-design"} color={product?.data?.frvourite_products ? 'red' : 'lightgrey'} size={15} />
          </TouchableOpacity>
          :
          <></>
        }
        <TouchableOpacity style={{ position: 'absolute', right: 50, top: 10, zIndex: 1, backgroundColor: "#3C3C3C", padding: 9, borderRadius: 200 }}
          onPress={() => navigation.navigate("ShoppingbagScreen")}>
          <Icon name={item?.like_this_product ? 'bag-suitcase-outline' : 'bag-suitcase-outline'} type={"material-community"} color={Colors.white} size={15} />
        </TouchableOpacity>
        <TouchableOpacity style={{ position: 'absolute', right: 90, top: 10, zIndex: 1, backgroundColor: "#3C3C3C", padding: 9, borderRadius: 200 }}
          onPress={onShare}>
          <Icon name={'share-variant'} type={"material-community"} color={Colors.white} size={15} />
        </TouchableOpacity>
        <TouchableOpacity style={{ position: 'absolute', left: 20, top: 10, zIndex: 1, backgroundColor: "#3C3C3C", padding: 9, borderRadius: 200 }}
          onPress={() => navigation.goBack({
            hello: "ji jan"
          })}>
          <Icon name={item?.like_this_product ? 'arrow-back-ios' : 'arrow-back-ios'} type={"MaterialIcons"} color={Colors.white} size={15} />
        </TouchableOpacity>
        {(imageUrl) ?
          <Image source={{ uri: imageUrl ? imageUrl : staticImage }} style={Styles.ImageSSStyle} />
          :
          <>
            {videoLoading &&
              <ActivityIndicator
                animating
                size="large"
                color={'blue'}
                style={{ justifyContent: 'center', alignSelf: 'center', top: '30%' }}
              />}
            <Video source={{ uri: videoUrl }} repeat={false}
              resizeMode="cover"
              onLoadStart={(l) => { setVideoLoading(true); console.log('onlog start', l); }}
              onBuffer={buffer => { console.log('buffring', buffer); }}
              onLoad={(l) => { setVideoLoading(false); console.log('onLoad', l); }}
              style={StyleSheet.absoluteFill}
            />
          </>
        }
      </View>
    )
  }

  const add_To_Favourite = async () => {
    const token = await AsyncStorage.getItem('token')
    let form = { "product_id": productID }
    addToFavourite(form, token).then(response => {
      if (response && response.data && response.data.status == "True") {
        showToastMessage('Product added to Favorite successfully')
        getProductData()
      }
    })
  }
  const removeProductLike = async () => {
    const token = await AsyncStorage.getItem('token')
    let form = new FormData()
    form.append("product_id", productID)
    fetch(Appurl.REMOVE_FAVOURITE, {
      method: 'PUT',
      headers: { Authorization: `Token ${token}` },
      body: form
    })
      .then(res => res.json())
      .then(response => {
        if (response) {
          showToastMessage('Product removed from Favorite Successfully')
        }
        getProductData()
      }
      )

  }
  const ADDTOCARD = async () => {
    const token = await AsyncStorage.getItem('token')
    let form = new FormData()
    form.append('product', productID)

    fetch(Appurl.POST_ADD_TO_CARD, {
      method: 'POST',
      headers: { Authorization: `Token ${token}` },
      body: form
    })
      .then(res => res.json())
      .then(response => {
        // if (response && response.data.cart_status == Cart) {
        //   ToastAndroid.show('Product already added to cart', ToastAndroid.SHORT)
        // }
        if (response && response.data && response.data.cart_status == 'Cart') {
          showToastMessage('Product added to cart');
        }
        getProductData()
      }
      )

  }
  const BUYNOW = async () => {
    if (product?.data?.cart_products) { showToastMessage('Already in cart'); return }
    if (!select) { showToastMessage('Please select Size'); return }
    const token = await AsyncStorage.getItem('token')
    let form = new FormData()
    form.append('product', productID)
    form.append('product_size', select)

    fetch(Appurl.POST_BUY_NOW, {
      method: 'PUT',
      headers: { Authorization: `Token ${token}` },
      body: form
    })
      .then(res => res.json())
      .then(response => {
        if (response && response.data) {
          navigation.navigate('ShoppingbagScreen')

        }
      }
      )

  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ backgroundColor: Colors.white }}>
      {loading && <Loader size={'small'} color={'#000'} />}
      <View style={{ width: metrics.ScreenWidth, height: metrics.ScreenHeight / 2.5 }}>
        {/* {loading && <Loader size={'small'} color={'#000'} />} */}
        {(product?.data?.images && product?.data?.images?.length !== 0) &&
          <SwiperFlatList
            index={0}
            showPagination
            data={product?.data?.images ? product?.data?.images : staticImage}
            paginationActiveColor={"#3E3E3E"}
            paginationDefaultColor={"#CCCCCC"}
            paginationStyle={{ justifyContent: 'center', alignItems: 'center' }}
            paginationStyleItem={{ width: 7, height: 7, marginHorizontal: 3 }}
            renderItem={renderItem} />}
      </View>

      <View style={Styles.InnerView}>
        <Text style={Styles.ProductTextStyle}>{product?.data?.product_name ? product.data?.product_name : ''}</Text>
        <Rating
          ratingCount={5}
          imageSize={16}
          style={{ alignItems: 'flex-start', marginVertical: 5 }}
          readonly={true}
        />
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ color: Colors.black, fontSize: 12, fontFamily: Fonts.RobotoMedium }}>{Math.trunc(product?.data?.price - product?.data?.price * product?.data?.discount / 100)}</Text>
          <Text style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid', marginHorizontal: 10, fontSize: 12, color: Colors.grayLight, fontFamily: Fonts.RobotoMedium }}>
            {product?.data?.price}
          </Text>
          {(100 - product?.data?.discount >= "0") ?
            <Text style={{ color: Colors.primaryOrange, fontSize: 12, fontFamily: Fonts.RobotoMedium }}>{product?.data?.discount}%</Text>
            :
            <></>
          }
        </View>
      </View>

      <View style={Styles.SelectSizeView}>
        <Text style={Styles.SizeText}>Select Size</Text>
        <View style={{ flexDirection: 'row', marginVertical: 5 }}>

          {(!!product?.data?.size && product?.data?.size.length !== 0) &&
            <ProductSize itemData={product?.data}
              submitSize={selectedSize => {
                setSelect(selectedSize.id);
              }} />}
        </View>
      </View>

      <View style={{ marginVertical: 7, marginHorizontal: 20, backgroundColor: Colors.greyFA, padding: 10, marginTop: 20 }}>
        <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold, fontSize: 16 }}>Product Detail</Text>
        <View>
          <Text style={{ color: Colors.black, fontSize: 13, lineHeight: 25, fontFamily: Fonts.RobotoRegular }}>{'\u2022'} {product?.data?.description}</Text>
        </View>

      </View>

      {/* <View style={{ marginVertical: 7, marginHorizontal: 20, backgroundColor: Colors.greyFA, padding: 10,marginTop:20 }}>
        <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold, fontSize: 16 }}>Size & Fit</Text>
        <View>
          <Text style={{ color: Colors.black, fontSize: 13, lineHeight: 25, fontFamily: Fonts.RobotoRegular }}>{'\u2022'} The model is wearing size {product?.size ? product?.size : ''}</Text>
        </View>

      </View> */}

      {(product?.data?.created_by?.id !== userData?.id) ?
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 20, }}>
          <TouchableOpacity style={{ backgroundColor: '#ffd700', width: 120, justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderRadius: 5, marginHorizontal: 10 }}
            // disabled={product?.data?.created_by?.id == userData?.id}
            onPress={() => BUYNOW()}>
            <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold, fontSize: 12 }}>
              Buy Now
            </Text>
          </TouchableOpacity>
          {(product?.data?.cart_products == true) ?
            <TouchableOpacity style={{ backgroundColor: "black", width: 120, justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderRadius: 5, marginHorizontal: 10 }}
              onPress={() => ADDTOCARD()}
              disabled={product?.data?.cart_products || product?.data?.created_by?.id === userData?.id}
            >
              <Text style={{ color: Colors.white, fontFamily: Fonts.RobotoBold, fontSize: 12 }}>
                Added to cart
              </Text>
            </TouchableOpacity>
            :
            <TouchableOpacity style={{ backgroundColor: Colors.white, borderWidth: 1, width: 120, justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderRadius: 5, marginHorizontal: 10 }}
              onPress={() => ADDTOCARD()}
              disabled={product?.data?.cart_products}
            >
              <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold, fontSize: 12 }}>
                Add to cart
              </Text>
            </TouchableOpacity>
          }
        </View>
        :
        <></>
      }

      <View style={{ marginVertical: 10, marginLeft: 20 }}>
        <Text style={{ color: Colors.primaryOrange, fontFamily: Fonts.RobotoBold, fontSize: 16, letterSpacing: 1 }}>Rating and Review</Text>
        <View style={{ paddingVertical: 2 }}>
          {(product?.data?.rating_review && product?.data?.comments.rating_review !== 0) ?
            product?.data?.rating_review?.map((item, index) => {
              return (
                <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                  <View style={{ marginRight: 10 }}>
                    <Image source={{ uri: item?.created_by?.profile?.picture ? Appurl.ROOT + item?.created_by?.profile?.picture : staticImage }} style={Styles.ImageUnderAdress} />
                  </View>
                  <View style={{ flex: 9 }}>
                    <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold, marginLeft: 3 }}>{item?.created_by?.first_name}</Text>
                    <Rating
                      ratingCount={5}
                      imageSize={16}
                      style={{ alignItems: 'flex-start', marginVertical: 5 }}
                      readonly={true}
                      startingValue={item.rating}
                    // onFinishRating={setRateit}
                    />


                    <Text style={{ fontFamily: Fonts.RobotoRegular }}>
                      {item?.created_on ? moment(item?.created_on).format("MMM Do YY") : ''}</Text>
                    <Text style={{ fontSize: 13, color: Colors.black, marginVertical: 10, fontFamily: Fonts.RobotoRegular, }}>{item?.review}</Text>
                  </View>
                </View>)
            }) : <Text> No data available</Text>}
        </View>

        {/* <Text
          // onPress={() => navigation.navigate('RatingAndReviewScreen')}
          style={{ color: Colors.black, fontFamily: Fonts.RobotoBold, fontSize: 12 }}>
          View all 10 reviews</Text> */}
      </View>

    </ScrollView>)
}

const Styles = StyleSheet.create({

  LikeIconButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
    backgroundColor: "#3C3C3C",
    padding: 9,
    borderRadius: 200
  },
  ShoppingBagButton: {
    position: 'absolute',
    right: 50,
    top: 10,
    zIndex: 1,
    backgroundColor: "#3C3C3C",
    padding: 9,
    borderRadius: 200
  },
  shareButton: {
    position: 'absolute',
    right: 90,
    top: 10,
    zIndex: 1,
    backgroundColor: "#3C3C3C",
    padding: 9,
    borderRadius: 200
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 10,
    zIndex: 1,
    backgroundColor: "#3C3C3C",
    padding: 9,
    borderRadius: 200
  },
  ImageSSStyle: {
    width: metrics.ScreenWidth,
    resizeMode: 'cover',
    height: metrics.ScreenHeight / 1.8,
    marginTop: -5
  },
  VideoStyle: {
    // width: 400,
    // height: 300 ,
    // marginTop: -5
    position: 'absolute',
    top: 0,
    left: 0,
    // bottom: 0,
    // right: 0,
    // flex:1,
    // width: metrics.ScreenWidth,
    // height: metrics.ScreenHeight / 1.3,
    // marginTop: -5
  },
  InnerView: {
    marginVertical: 7,
    marginHorizontal: 20,
    backgroundColor: Colors.greyFA,
    padding: 10,
    marginTop: 30
  },
  ProductTextStyle: {
    color: Colors.black,
    fontFamily: Fonts.RobotoBold,
    fontSize: 16
  },
  SelectSizeView: {
    marginVertical: 7,
    marginHorizontal: 20,
    backgroundColor: Colors.greyFA,
    padding: 10,
    marginTop: 20
  },
  SizeText: {
    color: Colors.black,
    fontFamily: Fonts.RobotoBold,
    fontSize: 16
  },
  SizeMapTouchableStyle: {
    backgroundColor: Colors.white,
    borderRadius: 200,
    borderColor: Colors.productDetailSectionBorderColor,
    borderWidth: 1,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5
  },
  ImageUnderAdress: {
    height: 30,
    width: 30,
    borderRadius: 100,
    marginTop: 10
  }


})
export default React.memo(ProductDetailScreen)


