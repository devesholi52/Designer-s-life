import React, { useState, useEffect } from "react";
import { FlatList, Image, Pressable, RefreshControl, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
// import Headers from "../Components/Headers/Headers";
import { useNavigation } from "@react-navigation/native";
import metrics, { Loader } from "../Theme/Metrics";
import Colors from "../Theme/Colors";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Icon } from "react-native-elements";
import Fonts from "../Theme/Fonts";
import Share from "react-native-share";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Appurl from '../API/Constant'
import { showToastMessage, staticImage } from "../Utils";
import { DeletefromFavourite } from "../API";
import { ScrollView } from "react-native-gesture-handler";
import ProductCardDeal from "../Components/ProductCardDeal";
import ProductCard from "../Components/ProductCard";


const Product = () => {

  const [isList, setisList] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // const token = useSelector(state => state?.user?.token ? state.user.token : '')
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



  const getWishlist = async () => {
    setLoading(true)
    const token = await AsyncStorage.getItem('token')
    fetch(Appurl.DEAL_SET_WISHLIST, {
      method: 'GET',
      headers: { Authorization: `Token ${token}` },
    }).then(res => res.json())
      .then(response => {

        setisList([...response.data])
      }).finally(e => setLoading(false),
        setRefreshing(false))
  }

  const removeProduct = async (item) => {
    const token = await AsyncStorage.getItem('token')
    let form = { "deal": `${item.id}` }
    DeletefromFavourite(form, token).then(response => {
      if (response && response.data) {
        showToastMessage('Deal removed from Favourite list successfully')
        getWishlist()
      }
    }).finally(e => { })
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getWishlist();
  }, []);

  const WISHLISTITEM = ({ item, index }) => {
    return (
      <Pressable style={{ marginHorizontalHorizontal: 5, marginVertical: 5, width: metrics.ScreenWidth / 2, justifyContent: 'center', alignItems: 'center' }} >
        <View style={{ width: metrics.ScreenWidth / 2.1, borderColor: Colors.wishlistBorderColor, borderWidth: 1, backgroundColor: Colors.white }}>

          <TouchableOpacity onPress={() => navigation.navigate("ProductDetailsDeal", {
            itemIDDDDDD: item?.id
          })}>
            {/* {item.product?.[0]?.image && */}
            <Image source={{ uri: item.product?.[0]?.images?.[0]?.product_images ? item.product?.[0]?.images?.[0]?.product_images : staticImage }} style={{ width: metrics.ScreenWidth / 2.1 - 2, height: metrics.ScreenWidth / 1.8 }} />
            {/* } */}
          </TouchableOpacity>
          <View style={{ padding: 10 }}>
            <TouchableOpacity
              onPress={() => navigation.navigate("ProductDetailsDeal", {
                itemIDDDDDD: item?.id
              })}>
              <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold, fontSize: 16 }} ellipsizeMode={"tail"} numberOfLines={1}>{item?.title}</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 12, fontFamily: Fonts.RobotoMedium }} ellipsizeMode={"tail"} numberOfLines={1}>{item?.description}</Text>
            <View style={{ flexDirection: 'row', marginTop: 5 }}>
              <Text style={{ color: Colors.black, fontSize: 12, fontFamily: Fonts.RobotoMedium }}>${item?.price}</Text>
              <Text style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid', marginHorizontal: 10, fontSize: 12, fontFamily: Fonts.RobotoMedium }}>
                ${item?.total_price}
              </Text>
              {(100 - item?.price * 100 / item?.total_price >= "0") ?
                <Text style={{ color: '#F89225', fontSize: 12, fontFamily: Fonts.RobotoMedium }}>{Math.trunc(100 - item?.price * 100 / item?.total_price)}%</Text>
                :
                <></>
              }
            </View>
          </View>
          <View style={{ alignSelf: 'baseline' }}>
            <View style={{ flexDirection: 'row', marginVertical: 5 }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Messanger',
                    {
                      userId: item?.created_by
                    })
                }>
                <Icon name={'message-text-outline'} type={'material-community'} size={18} color={Colors.grayLight} style={{ marginHorizontal: 10 }} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => await myCustomShare(`${item?.title}\n${item?.description}\n${item?.price}`)}>
                <Icon name={'share-variant-outline'} type={'material-community'} size={18} color={Colors.grayLight} style={{ marginHorizontal: 10 }} />
              </TouchableOpacity>
            </View>
          </View>

        </View>

      </Pressable>
    )
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.grayFed }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {loading && <Loader size={'small'} color={'#000'} />}
      {(isList && isList.length !== 0) ?
        <FlatList
          data={isList}
          renderItem={({ item, index }) => {
            return (
              <ProductCard item={item} index={index}
                navigation={navigation}
                product={item?.product}
                myCustomShare={myCustomShare}
                removeProduct={removeProduct}
              />
              // <PRODUCTITEM item={item} index={index} />
            )
          }}
          showsVerticalScrollIndicator={false}
        /> : <Text style={{ color: '#000', textAlign: 'center', padding: 10, fontSize: 20 }}>No Deal Added</Text>}
    </ScrollView>

  )
}
export default Product
