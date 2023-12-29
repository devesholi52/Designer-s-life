import React, { useState, useEffect } from "react";
import Headers from "../Components/Headers/Headers";
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View, StyleSheet, Pressable } from "react-native";
import { Avatar, Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import Colors from "../Theme/Colors";
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from "react-native-popup-menu";
import Metrics, { Loader } from "../Theme/Metrics";
import { useFocusEffect } from "@react-navigation/native";
import Fonts from "../Theme/Fonts";
import Appurl from "../API/Constant";
import { useSelector } from 'react-redux';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showToastMessage, staticImage } from "../Utils";
import { RemoveProduct } from "../API";
import Icons from 'react-native-vector-icons/AntDesign'
import moment from 'moment'
import { ScrollView } from "react-native-gesture-handler";


const MyProductScreen = () => {
  const [visible, setVisible] = useState(false)
  const [productList, setProductList] = useState([])
  const [isChanged, setIsChanged] = useState(false)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const userData = useSelector(state => state?.user?.userData ? state.user.userData : '')
  const token = useSelector(state => state?.user?.token ? state.user.token : '')
  const [clicked, setClicked] = useState('1')

  const navigation = useNavigation()

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
    getProduct()
  }, [])

  const getProduct = async (item, index) => {
    setLoading(true)
    console.log(setLoading);
    const token = await AsyncStorage.getItem('token')
    const Data = await AsyncStorage.getItem('data')
    fetch(Appurl.GET_SALE_PRODUCT + Data, {
      method: 'GET',
      headers: { Authorization: `Token ${token}` },
    }).then(res => res.json())
      .then(response => {
        console.log("response", response);
        if (response && response.results && response.results.length !== 0) {
          setProductList([...response.results])
        }
        else {
          setProductList([])
        }
      })
      .finally(e => setLoading(false),
        setRefreshing(false))
    setClicked("1")
  }

  const DeleteProduct = (item) => {
    setLoading(true)
    fetch(`${Appurl.Product}${item?.id}/`, {
      method: 'DELETE',
      headers: { Authorization: `Token ${token}` },
    })
      .then(res => res.json())
      .then(response => {
        console.log("response.message", response.message);
        if (response && response.message == "Product delete successfully.") { showToastMessage("Product deleted successfully") }
        getProduct()
      }).finally(e => setLoading(false),
        setRefreshing(false))
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getProduct();
  }, []);

  const handleToggle = (index) => {
    console.log("index", index);
    console.log("i am here")
    if (clicked === index) {
      return setClicked('1');
    }
    setClicked(index);
  };



  const Product = ({ item, index, onToggle, closeMenuOption }) => {
    console.log("clicked", clicked);
    console.log("index", index);
    return (
      <ScrollView>
        <Pressable
          onPress={closeMenuOption}>
          <View style={{ paddingHorizontal: 15 }}>
            <View style={{ flexDirection: 'row', paddingVertical: 25 }}>
              <View style={{ flex: 1, marginTop: 8, alignItems: 'center' }}>
                <Avatar source={{ uri: item?.images?.[0]?.product_images ? item?.images?.[0]?.product_images : staticImage }} size={40} />
              </View>
              <View style={{ flex: 4, justifyContent: 'center', paddingHorizontal: 5 }}>
                {/* <Text style={{color:Colors.black,fontSize:14,fontFamily:Fonts.RobotoBold}}> Nautica</Text> */}
                <Text style={{ color: Colors.black, fontSize: 14, marginVertical: 2, fontFamily: Fonts.RobotoMedium }} ellipsizeMode={"tail"} numberOfLines={1}>{item?.product_name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {(item?.color !== "#fff") ?
                    <View style={{ backgroundColor: item?.color, height: 10, width: 10 }}></View>
                    :
                    <View style={{ backgroundColor: item?.color, height: 10, width: 10, borderWidth: 1, borderBottomColor: 'black' }}></View>
                  }
                </View>
                <View style={{ flexDirection: 'row' }}>
                  {item?.size?.map(e => {
                    return (
                      <Text style={{ color: Colors.black, fontSize: 12, marginRight: 4, marginVertical: 2, fontFamily: Fonts.RobotoRegular, }}>{e?.size}</Text>
                    )
                  })
                  }
                </View>
                <Text style={{ color: Colors.black, fontSize: 12, marginVertical: 2, fontFamily: Fonts.RobotoRegular }}>{item?.price}</Text>
                <Text style={{ color: Colors.black, fontSize: 12, marginVertical: 2, fontFamily: Fonts.RobotoMedium }}>{item?.updated_on ? moment(item?.updated_on).format("DD/MM/YYYY") : ''}</Text>
                <Text style={{ color: Colors.black, fontSize: 13, fontFamily: Fonts.RobotoRegular, marginLeft: -3 }} ellipsizeMode={"tail"} numberOfLines={1}> {item?.description}</Text>
              </View>
              <View style={styles.VerticalDot}>
                <TouchableOpacity onPress={onToggle} style={{ flex: 1, justifyContent: 'center' }}>
                  <Icon name={'dots-horizontal'} type={'material-community'} size={18} />
                </TouchableOpacity>

                {clicked === index && <View style={styles.menu}>
                  <TouchableOpacity style={styles.closeMenu} onPress={closeMenuOption}>
                    <Icons name="closecircleo" size={18} color='black' />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ alignItems: 'center', flexDirection: 'row' }}
                    // onPress={() => { removeUserInboxSeller }}>
                    onPress={() => DeleteProduct(item)} >
                    <Icons name="delete" size={18} color='black' style={{ padding: 10 }} />
                    <Text style={{ fontFamily: Fonts.RobotoRegular, fontSize: 14, color: 'black' }}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ alignItems: 'center', flexDirection: 'row', marginBottom: 10 }}
                    onPress={() => navigation.navigate('UploadProductScreenEdit', { IDofUser: item.id })}>
                    <Icons
                      name="edit"
                      size={14}
                      color="black"
                      style={{ padding: 10 }}
                    />
                    <Text>Edit</Text>
                  </TouchableOpacity>
                  {/* <Text style={styles.menubtn}>Delete</Text> */}
                </View>}
              </View>

            </View>
            {/* {
              item?.isExpanded
                ?
                <View style={{ marginVertical: 10, backgroundColor: Colors.greyFA, padding: 10 }}>
                  <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold, fontSize: 16 }}>Description</Text>
                  <View>
                    <Text style={{ color: Colors.black, fontSize: 13, lineHeight: 25, fontFamily: Fonts.RobotoRegular }}>{'\u2022'} {item?.description}</Text>

                  </View>

                </View>
                : null
            } */}
            {/* {
              item?.isExpanded
                ?
                <View style={{ marginVertical: 10, backgroundColor: Colors.greyFA, padding: 10 }}>
                  <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold, fontSize: 16 }}>Description</Text>
                  <View>
                    <Text style={{ color: Colors.black, fontSize: 13, lineHeight: 25, fontFamily: Fonts.RobotoRegular }}>{'\u2022'} The (Model Height 5'7) is wearing size M</Text>

                  </View>

                </View>
                : null
            } */}
            {
              item?.isExpanded
                ?
                <View style={{ marginVertical: 10, backgroundColor: Colors.greyFA, padding: 10 }}>
                  <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold, fontSize: 16 }}> Updated on </Text>
                  <View>
                    <Text style={{ color: Colors.black, fontSize: 13, lineHeight: 25, fontFamily: Fonts.RobotoRegular, marginLeft: 4 }}> {'\u2022'} {item?.updated_on ? moment(item?.updated_on).format('ddd, hA') : ''}</Text>

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
      {loading && <Loader size={'small'} color={'#000'} />}
      <View style={{ flex: 1, backgroundColor: Colors.white }}>
        <FlatList
          data={productList}
          renderItem={({ item, index }) => <Product
            item={item} index={index}
            onToggle={() => handleToggle(index)}
            active={clicked === index}
            closeMenuOption={() => setClicked('1')}
          />}
          showsVerticalScrollIndicator={false}
        />
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
    elevation: 1,
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
    height: 80,
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
