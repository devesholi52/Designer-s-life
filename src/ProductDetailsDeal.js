import React, { useState, useEffect } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View, TextInput, RefreshControl } from "react-native";
import { SwiperFlatList } from "react-native-swiper-flatlist/src/components/SwiperFlatList/SwiperFlatList";
import { Icon } from "react-native-elements";
import Icons from 'react-native-vector-icons/AntDesign';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AirbnbRating, Rating } from "react-native-ratings";
// import RatingAndReviewScreen from "./RatingAndReviewScreen";
import AddressScreen from "./Screens/Address/AddressScreen";
import ShoppingbagScreen from "./Screens/Home/ShoppingbagScreen/ShoppingbagScreen";
import Share from "react-native-share";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addToFavouriteDeal, getParticularDealData, getParticularDealDataUpdated, removefromFavourite } from "./API";
// import Metrics from "./Theme/Metrics";
import Colors from "./Theme/Colors";
import Fonts from "./Theme/Fonts";
import { get_url_extension, showToastMessage, staticImage } from "./Utils";
import Metrics, { Loader } from "./Theme/Metrics";
import Appurl from './API/Constant';
import { useSelector } from "react-redux";
import ProductSizeForDeal from "./Screens/Home/ProductSizeForDeal";
import RNFetchBlob from "rn-fetch-blob";
import moment from "moment";



const ProductDetailsDeal = ({ route }) => {
  const [loading, setLoading] = useState(false)
  const userData = useSelector(state => state?.user?.userData)
  const [products, setProducts] = useState([])
  const [dealID, setDealId] = useState(route?.params?.itemIDDDDDD ? route?.params?.itemIDDDDDD : '')
  const [rateit, setRateit] = useState('')
  const [reviewUs, setReviewus] = useState('')
  const [select, setSelect] = useState([])
  const [selectedProductData, setSelectedProductData] = useState([])
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false)


  const navigation = useNavigation()


  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getDealData();
  }, []);

  useEffect(() => {
    getDealData()
  }, [])

  const getDealData = async () => {
    setLoading(true)
    const token = await AsyncStorage.getItem('token')
    getParticularDealDataUpdated(dealID, token).then(response => {
      let res = response.data
      if (res && res.data && res.data.length !== 0) {
        setProducts(res.data)
      } else setProducts([])
    }).finally(e => setLoading(false),
      setRefreshing(false))
  }

  const add_To_Favourite_Deal = async () => {
    const token = await AsyncStorage.getItem('token')
    // let form = new FormData()
    // form.append('product_id', item.id)
    let form = { "deal": `${dealID}` }
    addToFavouriteDeal(form, token).then(response => {
      if (response && response.data) {
        showToastMessage('Deal added to Favorite successfully')
        // handleSearch(searchText)
        getDealData()
      }
    })
  }

  const removeProductLike = async () => {
    const token = await AsyncStorage.getItem('token')
    let form = { "deal": `${dealID}` }
    removefromFavourite(form, token).then(response => {
      if (response && response.data) {
        showToastMessage('Deal removed from Favorite successfully')
        // handleSearch(searchText)
        getDealData()
      }
    }).finally(e => { })
  }

  const BuyNow = () => {
    if (selectedProductData?.length !== products?.product?.length) {
      showToastMessage('Please select Size'); return
    }
    navigation.navigate("AddressAlreadyExist",
      {
        selectedProductData,
        DISC: dealID,
        products: products
      }
    )
  }
  const onShare = async () => {
    let id = dealID
    // let url = 'https://play.google.com/store/apps/details?id=com.facebook'
    // let url = `lifeofdesigner://ProductDetailScreen/${id}`
    let url = `https://play.google.com/store/apps/details?id=com.lifeofdesigner`
    let imageUrl = products?.deal_pictures?.[0]?.product_images ? `${Appurl.ROOT + products?.deal_pictures?.[0]?.product_images}` : staticImage
    const fs = RNFetchBlob.fs;
    let imagePath = null;
    RNFetchBlob.config({ fileCache: true })
      .fetch("GET", imageUrl)
      .then(resp => { imagePath = resp.path(); return resp.readFile("base64"); })
      .then(async (base64Data) => {
        let shareOption = {
          title: 'Life of designer',
          message: `${products?.title ? products?.title : ''},\n Download Life of designer app.\n Click on the link below\n${url}`,
          urls: [`data:image/jpeg;base64,${base64Data}`]
        };
        try {
          const shareResponse = await Share.open(shareOption);
          console.log(JSON.stringify(shareResponse));
        } catch (error) { console.log('Share Error', error.message); }
        return fs.unlink(imagePath);
      });
  };

  const myCustomShare = async (message = '') => {
    const shareOptions = { message: message }
    try {
      const ShareResponse = await Share.open(shareOptions);
    }
    catch (error) { console.log('Error => ', error); }
  };
  // console.log("products?.deal_pictures", products);
  const renderItem = ({ item }) => {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.white }}>
        {(item?.created_by !== userData?.id) ?
          <TouchableOpacity style={{ position: 'absolute', right: 10, top: 10, zIndex: 1, backgroundColor: "#3C3C3C", padding: 9, borderRadius: 200 }}
            onPress={() => {
              if (products?.frvourite_deals) removeProductLike()
              else add_To_Favourite_Deal()
            }}>
            <Icon
              name={products?.frvourite_deals ? 'heart' : 'hearto'} type={"ant-design"} color={products?.frvourite_deals ? 'red' : 'lightgrey'} size={15} />
          </TouchableOpacity>
          :
          <></>
        }

        <TouchableOpacity style={{ position: 'absolute', right: 50, top: 10, zIndex: 1, backgroundColor: "#3C3C3C", padding: 9, borderRadius: 200 }}
          onPress={() => navigation.navigate("ShoppingbagScreen")}>
          <Icon name={'bag-suitcase-outline'} type={"material-community"} color={Colors.white} size={15} />
        </TouchableOpacity>
        <TouchableOpacity style={{ position: 'absolute', right: 90, top: 10, zIndex: 1, backgroundColor: "#3C3C3C", padding: 9, borderRadius: 200 }}
          onPress={onShare}>
          <Icon name={'share-variant'} type={"material-community"} color={Colors.white} size={15} />
        </TouchableOpacity>
        <TouchableOpacity style={{ position: 'absolute', left: 20, top: 10, zIndex: 1, backgroundColor: "#3C3C3C", padding: 9, borderRadius: 200 }}
          onPress={() => navigation.goBack()}>
          <Icon name={'arrow-back-ios'} type={"MaterialIcons"} color={Colors.white} size={15} />
        </TouchableOpacity>
        {item?.images?.[0]?.product_images && get_url_extension(item?.images?.[0]?.product_images) !== 'mp4' &&
          < Image source={{ uri: item?.images?.[0]?.product_images ? item?.images?.[0]?.product_images : staticImage }} style={{ width: Metrics.ScreenWidth, height: Metrics.ScreenHeight / 2 }} resizeMode={'cover'} />
        }
      </View>
    )
  }
  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      style={{ backgroundColor: 'white' }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ backgroundColor: Colors.white }}>
      {loading && <Loader size={'small'} color={'#000'} />}
      <View style={{ width: Metrics.ScreenWidth, height: Metrics.ScreenHeight / 2.5 }}>
        {/* {loading && <Loader size={'small'} color={'#000'} />} */}
        {(products?.product && products?.product !== 0) &&
          <SwiperFlatList
            index={0}
            showPagination
            data={products?.product}
            paginationActiveColor={"#3E3E3E"}
            paginationDefaultColor={"#CCCCC"}
            paginationStyle={{ justifyContent: 'center', alignItems: 'center' }}
            paginationStyleItem={{ width: 7, height: 7, marginHorizontal: 3 }}
            renderItem={renderItem} />
        }
      </View>

      <View style={{ marginVertical: 10, marginHorizontal: 30, backgroundColor: Colors.greyFA, padding: 10 }}>
        <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold, fontSize: 16 }}> {products?.title ? products?.title : ''}  </Text>
        <Rating
          ratingCount={5}
          imageSize={16}
          style={{ alignItems: 'flex-start', marginVertical: 5 }}
          readonly={true}
        />
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ color: Colors.black, fontSize: 12, fontFamily: Fonts.RobotoMedium }}>${products?.price ? products?.price : ''}</Text>
          <Text style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid', marginHorizontal: 10, fontSize: 12, color: Colors.grayLight, fontFamily: Fonts.RobotoMedium }}>
            ${products?.total_price ? products?.total_price : ''}
          </Text>
          {(100 - products?.price * 100 / products?.total_price >= "0") ?
            <Text style={{ color: Colors.primaryOrange, fontSize: 12, fontFamily: Fonts.RobotoMedium }}>{Math.trunc(100 - products?.price * 100 / products?.total_price)}%</Text>
            :
            <></>
          }
        </View>
      </View>

      <View style={{ marginVertical: 10, marginHorizontal: 30, backgroundColor: Colors.greyFA, padding: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: "center" }}>
          <View
          // onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold, fontSize: 16, marginRight: 3 }}>Select Size</Text>
          </View>
        </View>
        {/* <View
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Icons name='down' color='grey' size={14} style={{ marginTop: 2 }} />
          </View> */}
        {/* {products?.product?.length !== 0 && */}
        {products?.product?.length !== 0 &&
          products?.product?.map(item => {
            return (
              <View style={{ flexDirection: 'row', marginVertical: 7, alignItems: 'center' }}>
                <Image source={{ uri: item?.images?.[0]?.product_images ? item?.images?.[0]?.product_images : 'https://i.pinimg.com/236x/42/ee/da/42eedaf70a43ad0ff896c1256d2a71cd.jpg' }}
                  style={{ height: 35, width: 35, marginLeft: 15, paddingRight: 10, marginTop: 4 }} />
                < ProductSizeForDeal itemData={item}
                  submitSize={selectedSize => {
                    setSelect(selectedSize.id);
                    let data = { id: item.id, size: selectedSize.id }
                    let final = [...selectedProductData, data]
                    final.forEach((e, i) => {
                      if (e.id == item.id && e.size !== selectedSize.id) final.splice(i, 1)
                    })
                    setSelectedProductData(final)
                  }} />
              </View>
            )
          })
        }
      </View>


      <View style={{ marginVertical: 10, marginHorizontal: 30, backgroundColor: Colors.greyFA, padding: 10 }}>
        <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold, fontSize: 16 }}>Deal Detail</Text>
        <View>
          <Text style={{ color: Colors.black, fontSize: 13, lineHeight: 25, fontFamily: Fonts.RobotoRegular }}> {'\u2022'} {products?.description} </Text>
        </View>

      </View>

      {(products?.created_by !== userData?.id) ?
        <TouchableOpacity onPress={BuyNow} style={{ backgroundColor: '#ffd700', width: 150, alignItems: 'center', paddingVertical: 10, borderRadius: 5, alignSelf: 'center', marginVertical: 20, marginTop: 25, }}>
          <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold, fontSize: 12 }}>
            Buy Now
          </Text>
        </TouchableOpacity>
        :
        <></>
      }

      <View style={{ marginVertical: 10, marginHorizontal: 30 }}>
        <Text style={{ color: Colors.primaryOrange, fontFamily: Fonts.RobotoBold, fontSize: 16, letterSpacing: 1 }}>Rating and Review</Text>
        <View style={{ paddingVertical: 10 }}>
          {(products?.rating_review && products?.rating_review !== 0) ?
            products?.rating_review?.map((item, index) => {
              return (
                <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                  <View style={{ flex: 2 }}>
                    {/* <View style={{ backgroundColor: Colors.review_grey, width: Metrics.ScreenWidth / 7, height: Metrics.ScreenWidth / 7, borderRadius: 200, justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ color: Colors.black, textAlign: 'center', fontFamily: Fonts.RobotoBold, fontSize: 22 }}>N</Text>
                    </View> */}
                    <Image source={{ uri: item?.created_by?.profile?.picture ? Appurl.ROOT + item?.created_by?.profile?.picture : staticImage }} style={{
                      height: 40, width: 40, borderRadius: 100, marginTop: 10
                    }} />
                  </View>
                  <View style={{ flex: 9 }}>
                    <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold }}>{item?.created_by?.first_name}</Text>
                    <Rating
                      ratingCount={5}
                      imageSize={16}
                      style={{ alignItems: 'flex-start', marginVertical: 5 }}
                      readonly={true}
                      startingValue={item.rating}
                    // onFinishRating={setRateit}
                    />


                    <Text style={{ fontFamily: Fonts.RobotoRegular }}>{item?.created_on ? moment(item?.created_on).format("MMM Do YY") : ''}</Text>
                    <Text style={{ fontSize: 13, color: Colors.black, marginVertical: 10, fontFamily: Fonts.RobotoRegular }}>{item?.review}</Text>
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
export default ProductDetailsDeal
