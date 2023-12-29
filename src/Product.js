import React, { useState, useEffect } from "react";
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
// import Headers from "../Components/Headers/Headers";
import metrics, { Loader } from "../Theme/Metrics";
import { useFocusEffect } from "@react-navigation/native";
import Colors from "../Theme/Colors";
import { Icon } from "react-native-elements";
import { filter } from "lodash";
import { ActivityIndicator } from "react-native-paper";
import Fonts from "../Theme/Fonts";
import { useNavigation } from "@react-navigation/native";
import Share from "react-native-share";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Appurl from '../API/Constant'
import { addToFavourite, ProductListing, removefromFavourite, searchProduct } from "../API";
import { showToastMessage, staticImage } from "../Utils";


const DATA = [
  {
    id: 1,
    name: 'Nautica',
    type: 'Women Red Cotton',
    image: require('../Assets/product1.jpg'),
    isSelected: false
  },
  {
    id: 2,
    name: 'Nykaa',
    type: 'Woman Flower Cotton',
    image: require('../Assets/product2.jpg'),
    isSelected: false
  },
  {
    id: 3,
    name: 'Metro',
    type: 'Woman Red Flower Cotton',
    image: require('../Assets/product3.jpg'),
    isSelected: false
  },
  {
    id: 4,
    name: 'Levis',
    type: 'Woman White Cotton',
    image: require('../Assets/product5.jpg'),
    isSelected: false
  }
]
export default SearchScreen = () => {
  const [isChanged, setIsChanged] = useState(false)
  const [itemList, setItemList] = useState([])
  const [dummyItemList, setDummyItemList] = useState([])
  const [itemFullList, setItemFullList] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')

  // const [isList, setisList] = useState([])

  const navigation = useNavigation()

  // const onGetStarted=()=>{
  //   navigation.navigate("UploadProduct")

  useEffect(() => {
    getproduct()
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      setItemList(DATA)
      setItemFullList(DATA)
    }, [isChanged])
  )

  const handleSearch = async (text) => {
    setSearchText(text);
    setLoading(true)
    const token = await AsyncStorage.getItem('token')
    searchProduct(text, token)
      .then(response => {
        if (response) {
          let res = response.data.data
          if (res && res.length !== 0) {
            setItemList(res)
          } else setItemList(dummyItemList)
        }
      }).finally(e => setLoading(false))
  }

  const add_To_Favourite = async (item) => {
    const token = await AsyncStorage.getItem('token')

    // let form = new FormData()
    // form.append('product_id', item.id)
    let form = { "product_id": `${item.id}` }
    addToFavourite(form, token).then(response => {
      if (response && response.data) { getproduct() }
    })
  }

  const contains = (item, query) => {
    // console.log(query)
    if (item.name.toLowerCase().includes(query.toLowerCase()) || item.type.toLowerCase().includes(query.toLowerCase())) {
      return true;
    }

    return false;
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
        getproduct()
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
        navigation.navigate('CommentsIcon')
      })

  }

  const getproduct = async () => {
    const token = await AsyncStorage.getItem('token')
    setLoading(true)
    ProductListing(token).then(response => {
      let res = response.data
      if (res && res.results && res.results.length !== 0) {
        setItemList([...res.results])
        setDummyItemList([...res.results])
      } else setItemList([])
    }).finally(e => setLoading(false))
  }

  const removeProductLike = async (item) => {
    const token = await AsyncStorage.getItem('token')
    let form = { "product_id": `${item.id}` }
    removefromFavourite(form, token).then(response => {
      if (response && response.data) {
        showToastMessage(response.data.message)
        getproduct()
      }
    }).finally(e => { })
  }


  const PRODUCTITEM = ({ item, index }) => {
    return (
      <TouchableOpacity style={{ marginVertical: 5, width: metrics.ScreenWidth / 2, justifyContent: 'center', alignItems: 'center' }}
      /* onPress={()=>navigation.navigate('ProductDetailScreen')} */ >
        <View style={{ width: metrics.ScreenWidth / 2.1, borderColor: Colors.wishlistBorderColor, borderWidth: 1, backgroundColor: Colors.white }}>
          <View>
            <TouchableOpacity
              onPress={() => {
                if (item?.frvourite_products) removeProductLike(item)
                else add_To_Favourite(item)
              }}
              style={{ position: 'absolute', right: 10, top: 5, zIndex: 999 }}>
              <Icon name={item?.frvourite_products ? 'heart' : 'hearto'} type={"ant-design"} color={item?.frvourite_products ? 'red' : 'white'} size={20} />
            </TouchableOpacity>
            <Image source={{ uri: staticImage }}
              style={{ width: 200/* metrics.ScreenWidth / 2.1 - 4 */, height: 300/* metrics.ScreenWidth / 1.8 */ }} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5, paddingVertical: 5 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => onPressLike(item, index)}>
                <Icon name={'like2'} type={'antdesign'} size={18} color={Colors.grayLight} />
              </TouchableOpacity>
              <Text style={{ fontSize: 10, color: Colors.grayLight, fontFamily: Fonts.RobotoLight }}>{item?.like?.length ? item?.like.length : '0'}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => onPressComment(item, index)}>
                <Icon name={'comment-o'} type={'font-awesome'} size={18} style={{ marginHorizontal: 2 }} color={Colors.grayLight} />
              </TouchableOpacity>
              <Text style={{ fontSize: 10, color: Colors.grayLight, fontFamily: Fonts.RobotoLight }}>{item.comments?.length ? item.comments?.length : ''}</Text>
            </View>
          </View>
          <View style={{ paddingHorizontal: 5 }}>
            <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold, fontSize: 16 }}>{item?.product_name}</Text>
            <Text style={{ fontSize: 12, color: Colors.grayLight, fontFamily: Fonts.RobotoMedium }}>{item?.description}</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ color: Colors.black, fontSize: 12, fontFamily: Fonts.RobotoMedium }}>$250</Text>
              <Text style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid', marginHorizontal: 10, fontSize: 12, color: Colors.grayLight, fontFamily: Fonts.RobotoMedium }}>
                {` $350 `}
              </Text>
              <Text style={{ color: '#F89225', fontSize: 12, fontFamily: Fonts.RobotoMedium }}>(25%)</Text>
            </View>
          </View>
          <View style={{ alignSelf: 'baseline' }}>
            <View style={{ flexDirection: 'row', marginVertical: 5 }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Messanger')
                }>
                <Icon name={'message-text-outline'} type={'material-community'} size={18} color={Colors.black} style={{ marginHorizontal: 5 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => myCustomShare(`${item?.product_name}\n${item?.price}`)}>
                <Icon name={'share-variant-outline'} type={'material-community'} size={18} color={Colors.black} style={{ marginHorizontal: 10 }} />
              </TouchableOpacity>
            </View>
          </View>

        </View>

      </TouchableOpacity>
    )
  }
  return (
    <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
      {loading && <Loader color={'#000'} />}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 15, marginVertical: 10, borderRadius: 30, borderColor: Colors.searchBorderColor, borderWidth: 2 }}>
        <TextInput
          style={{ height: 40, flex: 1, borderRadius: 30, fontSize: 12, fontFamily: Fonts.RobotoLight }}
          placeholder={'Search By name, Type'}
          placeholderTextColor={Colors.grayLight}
          value={searchText}
          onChangeText={value => handleSearch(value)}
        />
        <Icon name={'search'} style={{ marginHorizontal: 5, }} size={18} />
      </View>
      <FlatList
        data={itemList}
        renderItem={({ item, index }) => {
          return (<PRODUCTITEM item={item} index={index} />)
        }}
        numColumns={2}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}
