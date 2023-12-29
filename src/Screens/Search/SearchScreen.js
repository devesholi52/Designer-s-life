import React, { useState } from "react";
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import Headers from "../../Components/Headers/Headers";
import metrics from "../../Theme/Metrics";
import { useFocusEffect } from "@react-navigation/native";
import Colors from "../../Theme/Colors";
import { Icon } from "react-native-elements";
import { filter } from "lodash";
import Fonts from "../../Theme/Fonts";
import { useNavigation } from "@react-navigation/native";


const DATA = [
  {
    id: 1,
    name: 'Nautica',
    type: 'Women Red Cotton',
    image: require('../../Assets/product1.jpg'),
    isSelected: false
  },
  {
    id: 2,
    name: 'Nykaa',
    type: 'Woman Flower Cotton',
    image: require('../../Assets/product2.jpg'),
    isSelected: false
  },
  {
    id: 3,
    name: 'Metro',
    type: 'Woman Red Flower Cotton',
    image: require('../../Assets/product3.jpg'),
    isSelected: false
  },
  {
    id: 4,
    name: 'Levis',
    type: 'Woman White Cotton',
    image: require('../../Assets/product5.jpg'),
    isSelected: false
  }
]
export default SearchScreen = () => {
  const [isChanged, setIsChanged] = useState(false)
  const [itemList, setItemList] = useState([])
  const [itemFullList, setItemFullList] = useState([])
  const [query, setQuery] = useState('')

  // const navigation=useNavigation()

  // const onGetStarted=()=>{
  //   navigation.navigate("UploadProduct")

  useFocusEffect(
    React.useCallback(() => {
      setItemList(DATA)
      setItemFullList(DATA)
    }, [isChanged])
  )

  const handleSearch = (text) => {
    const formattedQuery = text;
    let filteredData = filter(itemFullList, item => {
      return contains(item, formattedQuery);
    });
    setItemList(filteredData)
    setQuery(text);
  }

  const contains = (item, query) => {
    if (item.name.toLowerCase().includes(query.toLowerCase()) || item.type.toLowerCase().includes(query.toLowerCase())) {
      return true;
    }

    return false;
  }

  const PRODUCTITEM = ({ item, index }) => {

    return (
      <TouchableOpacity style={{ marginVertical: 5, width: metrics.ScreenWidth / 2, justifyContent: 'center', alignItems: 'center' }}
      /* onPress={onGetStarted} */  >
        <View style={{ width: metrics.ScreenWidth / 2.1, borderColor: Colors.wishlistBorderColor, borderWidth: 1, backgroundColor: Colors.white }}>
          <View>
            <TouchableOpacity onPress={() => onPressHeart(item, index)} style={{ position: 'absolute', right: 10, top: 5, zIndex: 999 }}>
              {
                item.isSelected
                  ?
                  <Icon name={'heart'} type={"material-community"} color={Colors.black} size={20} />
                  :
                  <Icon name={'heart'} type={"material-community"} color={Colors.white} size={20} />
              }
            </TouchableOpacity>
            <Image source={item.image} style={{ width: metrics.ScreenWidth / 2.1 - 4, height: metrics.ScreenWidth / 1.8 }} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5, paddingVertical: 5 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Icon name={'like2'} type={'antdesign'} size={12} color={Colors.grayLight} />
              <Text style={{ fontSize: 10, color: Colors.grayLight, fontFamily: Fonts.RobotoLight }}>100 likes</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Icon name={'comment-o'} type={'font-awesome'} size={12} style={{ marginHorizontal: 2 }} color={Colors.grayLight} />
              <Text style={{ fontSize: 10, color: Colors.grayLight, fontFamily: Fonts.RobotoLight }}>100 comments</Text>
            </View>
          </View>
          <View style={{ paddingHorizontal: 5 }}>
            <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold, fontSize: 16 }}>{item?.name}</Text>
            <Text style={{ fontSize: 12, color: Colors.grayLight, fontFamily: Fonts.RobotoMedium }}>{item?.type}</Text>
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
              <Icon name={'message-text-outline'} type={'material-community'} size={18} color={Colors.black} style={{ marginHorizontal: 5 }} />
              <Icon name={'share-variant-outline'} type={'material-community'} size={18} color={Colors.black} style={{ marginHorizontal: 10 }} />
            </View>
          </View>

        </View>

      </TouchableOpacity>
    )
  }

  const _renderProductItem = ({ item, index }) => {
    return (
      <PRODUCTITEM item={item} index={index} />
    )
  }

  const onPressHeart = (item, index) => {
    itemList[index].isSelected = !itemList[index].isSelected
    setItemList(itemList)
    setIsChanged(!isChanged)
  }

  return (
    <>
      <Headers title={"Search"} backButton={false} />
      <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', marginHorizontal: 15, marginVertical: 10, borderWidth: 2, borderColor: Colors.searchBorderColor, borderRadius: 30 }}>
          <TextInput
            style={{ height: 40, flex: 1, borderRadius: 30, fontSize: 12, fontFamily: Fonts.RobotoLight }}
            placeholder={'Search By name, Type'}
            placeholderTextColor={Colors.grayLight}
            value={query}
            onChangeText={queryText => handleSearch(queryText)}
          />
          <Icon name={'search'} style={{ marginHorizontal: 5, }} size={18} />
        </View>
        <View style={{ flex: 12 }}>
          <FlatList
            data={itemList}
            renderItem={_renderProductItem}
            numColumns={2}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>

    </>
  )
}
