import React, { useState, useEffect } from "react";
import { FlatList, RefreshControl, Image, Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
// import Headers from "../Components/Headers/Headers";
import metrics, { Loader } from "../Theme/Metrics";
import { useFocusEffect } from "@react-navigation/native";
import Colors from "../Theme/Colors";
import { Icon } from "react-native-elements";
import ProductDetailsDeal from "../ProductDetailsDeal";
import { filter } from "lodash";
import { ActivityIndicator } from "react-native-paper";
import Fonts from "../Theme/Fonts";
import { useNavigation } from "@react-navigation/native";
import Share from "react-native-share";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Appurl from '../API/Constant'
import { showToastMessage, staticImage } from "../Utils";
import { searchProductDeal, addToFavouriteDeal, removefromFavourite } from "../API";
import Headers from "../Components/Headers/Headers";
import { ScrollView } from "react-native-gesture-handler";
import ProductCard from "../Components/ProductCard";

export default SearchScreen = () => {
  const [isChanged, setIsChanged] = useState(false)
  const [itemList, setItemList] = useState([])
  const [itemFullList, setItemFullList] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [dummyItemList, setDummyItemList] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  const navigation = useNavigation()

  // const onGetStarted=()=>{
  //   navigation.navigate("UploadProduct")


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getDeal()
      return unsubscribe;
    })
  }, [])

  const handleSearch = async (text) => {
    setSearchText(text);
    const token = await AsyncStorage.getItem('token')
    searchProductDeal(text, token)
      .then(response => {
        if (response) {
          let res = response.data.data
          if (res && res.length !== 0) {
            setItemList(res)
          } else setItemList(dummyItemList)
        }
      })/* .finally(e => { }) */
  }

  const contains = (item, query) => {
    if (item.name.toLowerCase().includes(query.toLowerCase()) || item.type.toLowerCase().includes(query.toLowerCase())) {
      return true;
    }

    return false;
  }

  const myCustomShare = async (message = '') => {
    const shareOptions = { message: message }
    try {
      const ShareResponse = await Share.open(shareOptions);
    }
    catch (error) { console.log('Error => ', error); }
  };

  const getDeal = async (item, index) => {
    setLoading(true)
    const token = await AsyncStorage.getItem('token')
    fetch(Appurl.dealGet, {
      method: 'GET',
      headers: { Authorization: `Token ${token}` },
    }).then(res => res.json())
      .then(response => {
        if (response && response.results && response.results.length !== 0) {
          setItemList([...response.results])
        }
      }).finally(e => {
        setLoading(false);
        setRefreshing(false)
      })
  }
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getDeal();
  }, []);

  const onPressLike = async (item, index,) => {

    const token = await AsyncStorage.getItem('token')
    let form = new FormData()
    form.append('deal', item.id)
    fetch(Appurl.DEAL_LIKE, {
      method: 'POST',
      headers: { Authorization: `Token ${token}` },
      body: form
    })
      .then(res => res.json())
      .then(response => {
        // handleSearch(searchText)
        getDeal()
      })

  }
  const onPressComment = async (item, index) => {
    const token = await AsyncStorage.getItem('token')
    let form = new FormData()
    form.append('deal', item.id)
    fetch(Appurl.DEAL_COMMENT, {
      method: 'POST',
      headers: { Authorization: `Token ${token}` },
      body: form
    }).then(res => res.json())
      .then(response => {

        navigation.navigate('CommentsIconForDeal',
          { UserIdD: item.id }
        )
      })
  }

  const add_To_Favourite_Deal = async (item) => {
    const token = await AsyncStorage.getItem('token')
    // let form = new FormData()
    // form.append('product_id', item.id)
    let form = { "deal": `${item.id}` }
    addToFavouriteDeal(form, token).then(response => {
      if (response && response.data) {
        showToastMessage('Deal added to Favorite successfully')
        handleSearch(searchText)
        getDeal()

      }
    })
  }

  const removeProductLike = async (item) => {
    const token = await AsyncStorage.getItem('token')
    let form = { "deal": `${item.id}` }
    removefromFavourite(form, token).then(response => {
      if (response && response.data) {
        showToastMessage('Deal removed from Favorite successfully')
        // handleSearch(searchText)
        getDeal()
      }
    }).finally(e => { })
  }


  const PRODUCTITEM = ({ item, index }) => {
    return (
      <TouchableOpacity style={Styles.MainTouchableStyle}
      >
        <View style={Styles.Container}>
          <View style={Styles.likeCommentView}>
            <View style={Styles.LikeandTextView}>
              <TouchableOpacity onPress={() => onPressLike(item, index)}>
                <Icon name={'like1'} type={'antdesign'} size={18} color={item?.like_this_deal ? Colors.black : Colors.app_grey} />
              </TouchableOpacity>
              <Text style={Styles.likeText}>{item?.like?.length ? item?.like?.length : '0'}</Text>
            </View>
            <View
              style={Styles.CommentandTextView}>
              <TouchableOpacity onPress={() => navigation.navigate('CommentsIconForDeal', { UserIdD: item.id })}>
                <Icon name={'comment-o'} type={'font-awesome'} size={18} style={{ marginHorizontal: 2 }} color={Colors.grayLight} />
              </TouchableOpacity>
              <Text style={Styles.CommentText}>{item.comments?.length ? item.comments?.length : ''}</Text>
            </View>
          </View>
          <View style={{ paddingHorizontal: 5, }}>
            <TouchableOpacity onPress={() => navigation.navigate("ProductDetailsDeal", {
              itemIDDDDDD: item?.id
            })}>
              <Text
                style={Styles.TittleText}>{item?.title}</Text>
            </TouchableOpacity>
            <Text
              style={Styles.DescriptionText}>{item?.description}</Text>

            <View style={{ flexDirection: 'row', marginVertical: 5 }}>
              <Text
                style={Styles.PriceText}>{item?.discount}</Text>
              <Text
                style={Styles.PriceOffText}> {item?.price}
              </Text>
              <Text
                style={Styles.DiscountText}>(25%)</Text>
            </View>
          </View>
          <View style={{ alignSelf: 'baseline' }}>
            <View style={{ flexDirection: 'row', marginVertical: 5 }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Messanger', { userId: item?.created_by })
                }>
                <Icon name={'message-text-outline'} type={'material-community'} size={18} color={Colors.black} style={{ marginHorizontal: 5 }} />
              </TouchableOpacity>
              {/* <TouchableOpacity onPress={() => myCustomShare()}>
                <Icon name={'share-variant-outline'} type={'material-community'} size={18} color={Colors.black} style={{ marginHorizontal: 10 }} />
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }


  const onPressHeart = (item, index) => {
    itemList[index].isSelected = !itemList[index].isSelected
    console.log(itemList)
    setItemList(itemList)
    setIsChanged(!isChanged)
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#eee' }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {/* <Headers title={"Deal"} backButton={false} Shoppingbag={true} /> */}
      {loading && <Loader size={'small'} color={'#000'} />}
      <View style={Styles.TextInputView}>
        <TextInput
          style={{ borderRadius: 30, fontSize: 12, fontFamily: Fonts.RobotoLight, paddingLeft: 18, color: Colors.grayLight, paddingVertical: Platform.OS == 'ios' ? 10 : 5 }}
          placeholder={'Search by name, type'}
          placeholderTextColor={Colors.grayLight}
          value={searchText}
          onChangeText={value => handleSearch(value)}
        />
        <Icon name={'search'} style={{ marginRight: 15, }} size={18} color="grey" />
      </View>
      <View style={{ flex: 12 }}>
        {(itemList && itemList.length !== 0) ?
          <FlatList
            data={itemList}
            renderItem={({ item, index }) => {
              return (
                <ProductCard item={item} index={index}
                  navigation={navigation}
                  product={item?.product}
                  onPressLike={onPressLike}
                  myCustomShare={myCustomShare}
                  removeProduct={removeProductLike}
                  add_To_Favourite_Deal={add_To_Favourite_Deal}
                />
                // <PRODUCTITEM item={item} index={index} />
              )
            }}
            // numColumns={2}
            showsVerticalScrollIndicator={false}
          /> : <Text style={{ color: '#000', textAlign: 'center', padding: 10, fontSize: 20 }}>No data available</Text>}
      </View>
    </ScrollView>
  )
}

const Styles = StyleSheet.create({

  MainTouchableStyle: {
    marginVertical: 5,
    width: metrics.ScreenWidth / 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  Container: {
    width: metrics.ScreenWidth / 2.1,
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
    borderRadius: 30,
    backgroundColor: 'white',
    // paddingVertical: Platform.OS == 'ios' ? 10 : 5
  },


})
