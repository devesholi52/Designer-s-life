import React, { useState, useEffect } from "react";
import Headers from "../Components/Headers/Headers";
import { FlatList, RefreshControl, Text, ScrollView, TouchableOpacity, View, StyleSheet, Pressable } from "react-native";
import { Avatar, Icon } from "react-native-elements";
import Colors from "../Theme/Colors";
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from "react-native-popup-menu";
import Metrics, { Loader } from "../Theme/Metrics";
import { useFocusEffect } from "@react-navigation/native";
import moment from 'moment'
import { useNavigation } from "@react-navigation/native";
import Fonts from "../Theme/Fonts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Appurl from '../API/Constant';
import Icons from 'react-native-vector-icons/AntDesign'
import { useSelector } from 'react-redux';
import { showToastMessage, staticImage } from "../Utils";

const MyProductScreen = () => {
  const [visible, setVisible] = useState(false)
  const [productList, setProductList] = useState([])
  const [isChanged, setIsChanged] = useState(false)
  const [productData, setProductData] = useState([])
  const [popUP, setPopUP] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const token = useSelector(state => state?.user?.token ? state.user.token : '')
  const navigation = useNavigation()
  const [clicked, setClicked] = useState('1')


  const ListSeperator = () => {
    return (
      <View style={{ borderWidth: 0.8, borderColor: Colors.borderColor }} />
    )
  }

  const toggleExpand = (item, index) => {
    productList[index].isExpanded = !productList[index].isExpanded
    setIsChanged(!isChanged)
  }

  const togglePopup = (item, index) => {
    productList[index].isVisible = !productList[index].isVisible
    setIsChanged(!isChanged)
  }

  const onCloseToggle = (item, index) => {
    productList[index].isVisible = false
    setIsChanged(!isChanged)
  }

  useEffect(() => {
    getDeal()
  }, [])

  const getDeal = async (item, index) => {
    setLoading(true)
    const token = await AsyncStorage.getItem('token')
    fetch(Appurl.dealGet, {
      method: 'GET',
      headers: { Authorization: `Token ${token}` },
    }).then(res => res.json())
      .then(response => {
        console.log('response', response?.results);
        if (response && response.results && response.results.length !== 0) {
          setProductList([...response.results])
        }
        else {
          setProductList([])
        }
      }).finally(e => setLoading(false),
        setRefreshing(false)),
      setClicked("1")
  }


  const DeleteDeal = (item) => {
    setLoading(true)
    fetch(`${Appurl.deal}${item?.id}/`, {
      method: 'DELETE',
      headers: { Authorization: `Token ${token}` },
    })
      .then(res => res.json())
      .then(response => {
        if (response && response.message) { showToastMessage("Deal deleted successfully") }
        getDeal()
      }).finally(e => setLoading(false),
        setRefreshing(false))
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getDeal();
  }, []);

  const handleToggle = (index) => {
    console.log("index", index);
    console.log("clicked", clicked);
    console.log("i am here")
    if (clicked === index) {
      return setClicked('1');
    }
    setClicked(index);
  };
  const Product = ({ item, index, onToggle, closeMenuOption }) => {
    return (
      <ScrollView>

        <Pressable
          onPress={closeMenuOption}>
          <View style={{ paddingHorizontal: 15 }}>
            <View style={{ flexDirection: 'row', paddingVertical: 30 }}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Avatar source={{ uri: item.product?.[0]?.images?.[0]?.product_images ? item.product?.[0]?.images?.[0]?.product_images : staticImage }} size={40} />
              </View>
              <View style={{ flex: 4, justifyContent: 'center', padding: 5 }}>
                <Text style={{ color: Colors.black, fontSize: 14, fontFamily: Fonts.RobotoBold }} ellipsizeMode={"tail"} numberOfLines={1}>Deal name - {item?.title}</Text>
                <Text style={{ color: Colors.black, fontSize: 12, marginVertical: 4, fontFamily: Fonts.RobotoMedium }} ellipsizeMode={"tail"} numberOfLines={1}>Deal description - {item?.description}</Text>
                <Text style={{ color: Colors.black, fontSize: 10, marginVertical: 4, fontFamily: Fonts.RobotoRegular }}>Created on -
                  {item?.updated_on ? moment(item?.updated_on).format('DD/MM/YYYY') : ''}</Text>
              </View>
              <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-end' }}>
                <TouchableOpacity onPress={onToggle} style={{ flex: 1, justifyContent: 'center' }}>
                  <Icon name={'dots-horizontal'} type={'material-community'} size={18} />
                </TouchableOpacity>
                {clicked === index &&
                  <View style={styles.menu}>
                    <TouchableOpacity style={styles.closeMenu} onPress={closeMenuOption}>
                      <Icons name="closecircleo" size={18} color='black' />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ alignItems: 'center', flexDirection: 'row' }}
                      // onPress={() => { removeUserInboxSeller }}>
                      onPress={() => DeleteDeal(item)} >
                      <Icons name="delete" size={18} color='black' style={{ padding: 10 }} />
                      <Text style={{ fontFamily: Fonts.RobotoRegular, fontSize: 14, color: 'black' }}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ alignItems: 'center', flexDirection: 'row', marginBottom: 10 }}
                      onPress={() => navigation.navigate('DealEdit', { IDofUser: item.id }
                      )}
                    >
                      <Icons
                        name="edit"
                        size={14}
                        color="black"
                        style={{ padding: 10 }}
                      />
                      <Text>Edit</Text>
                    </TouchableOpacity>
                    {/* <Text style={styles.menubtn}>Delete</Text> */}
                  </View>
                }
              </View>

            </View>
            {
              item?.isExpanded
                ?
                <View style={{ marginVertical: 10, backgroundColor: Colors.greyFA, padding: 10 }}>
                  <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold, fontSize: 16 }}>Product Detail</Text>
                  <View>
                    <Text style={{ color: Colors.black, fontSize: 13, lineHeight: 25, fontFamily: Fonts.RobotoRegular }}>{'\u2022'} Cotton Half Sleeves</Text>
                    <Text style={{ color: Colors.black, fontSize: 13, lineHeight: 25, fontFamily: Fonts.RobotoRegular }}>{'\u2022'} Floral Print</Text>
                    <Text style={{ color: Colors.black, fontSize: 13, lineHeight: 25, fontFamily: Fonts.RobotoRegular }}>{'\u2022'} Square Necm long</Text>
                    <Text style={{ color: Colors.black, fontSize: 13, lineHeight: 25, fontFamily: Fonts.RobotoRegular }}>{'\u2022'} Woven georgette</Text>
                  </View>

                </View>
                : null
            }

            <ListSeperator />

          </View>


        </Pressable>

      </ScrollView>
    )

  }

  const renderProduct = ({ item, index }) => {
    return (
      <Product item={item} index={index} />

    )

  }

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {/* <Headers title={"My Product"} backButton={false}/> */}
      <View style={{ flex: 1, backgroundColor: Colors.white }}>
        {loading && <Loader size={'small'} color={'#000'} />}
        {(productList && productList.length !== 0) ?
          <FlatList
            data={productList}
            renderItem={({ item, index }) => <Product
              item={item} index={index}
              onToggle={() => handleToggle(index)}
              active={clicked === index}
              closeMenuOption={() => setClicked('1')} />}
            showsVerticalScrollIndicator={false}
          /> : <Text style={{ color: '#000', textAlign: 'center', padding: 10, fontSize: 20 }}>No data available</Text>}
      </View>

    </ScrollView>
  )
}
const styles = StyleSheet.create({
  VerticalDot: {
    position: 'absolute',
    top: 30,
    right: 20,
  },
  menu: {
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    position: 'absolute',
    top: Platform.OS == 'ios' ? 30 : 0,
    right: 0,
    width: 100,
    height: 75,

  },
  closeMenu: {
    position: 'absolute',
    top: -10,
    right: -10,
  },

  menubtn: {
    fontSize: 13,
    paddingVertical: 10,
    color: 'black'
  },
})
export default MyProductScreen
