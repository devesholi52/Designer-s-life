import React, { useState, useEffect } from "react";
import { FlatList, Text, TouchableOpacity, View, Image, StyleSheet, Pressable } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Colors from "../../../../Theme/Colors";
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from "react-native-popup-menu";
import { Avatar, Icon } from "react-native-elements";
import metrics, { Loader } from "../../../../Theme/Metrics";
import Fonts from "../../../../Theme/Fonts";
import Appurl from '../../../../API/Constant'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showToastMessage, staticImage } from "../../../../Utils";
import { useSelector } from "react-redux";
import moment from "moment";

const NewOrders = ({ navigation }) => {
  const userData = useSelector(state => state.user.userData)
  const [productList, setProductList] = useState([])
  const [isChanged, setIsChanged] = useState(false)
  const [userRole, setUserRole] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getOrder()
  }, [])

  const getOrder = async () => {
    setLoading(true)
    const token = await AsyncStorage.getItem('token')
    // const USERS_TYPE = await AsyncStorage.getItem('USERROLE')
    fetch(Appurl.GET_NEW_ORDER, {
      method: 'GET',
      headers: { Authorization: `Token ${token}` },
    }).then(res => res.json())
      .then(response => {
        if (response && response.length !== 0) setProductList(response)
        else {
          setProductList([])
        }
      }).finally(e => setLoading(false))
  }

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

  const RejectOrder = async (id) => {
    const token = await AsyncStorage.getItem('token')
    let form = new FormData()
    form.append('order', id)
    fetch(Appurl.ORDER_CANCEL, {
      method: 'PUT',
      headers: { Authorization: `Token ${token}` },
      body: form
    }).then(res => res.json())
      .then(response => {
        if (response && response.data && response.data.order_rejected == true) { showToastMessage('Order cancelled ') }
        getOrder()
      })
  }
  const ConfirmOrder = async (id) => {
    const token = await AsyncStorage.getItem('token')
    let form = new FormData()
    form.append('order', id)
    form.append('order_status', "confirmed")
    fetch(Appurl.CONFIRM_ORDER, {
      method: 'PUT',
      headers: { Authorization: `Token ${token}` },
      body: form
    }).then(res => res.json())
      .then(response => {
        if (response && response?.status == 'True') {
          showToastMessage('Order Confirmed ')
          getOrder()
        }
      })
  }

  const messageSeller = () => {
    // if (productList?.[0]?.cart_product?.[0]?.product?.created_by === userData?.id) {
    //   showToastMessage('You can not message yourself.');
    //   return
    // }
    navigation.navigate('Messanger', { userId: item?.created_by })
  }
  const messageSellerDeal = () => {
    // if (productList?.[0]?.deal_product?.[0]?.created_by === userData?.id) {
    //   showToastMessage('You can not message yourself.');
    //   return
    // }
    navigation.navigate('Messanger', { userId: productList?.[0]?.deal_product?.[0]?.created_by })
  }

  const renderProduct = ({ item, index }) => {
    if (item?.cart_product !== null) {
      return (
        <MenuProvider>
          {(item?.cart_product && item?.cart_product !== 0) ?
            <Text style={{ marginTop: 10, marginLeft: 5, color: Colors.gray, fontSize: 14, fontFamily: Fonts.RobotoBold }}>Order Id - {item?.invoice_number}</Text>
            : <View></View>
          }
          {(item?.cart_product && item?.cart_product !== 0) ?
            <View style={Styles.container}>
              <View style={{ flexDirection: 'row', paddingVertical: 25 }}>
                <View style={{ flex: 4, justifyContent: 'center', paddingHorizontal: 5 }}>
                  <Pressable style={Styles.MainContainer}
                    onPress={() => navigation.navigate('ShowProductsForAnOrder', {
                      item: item,
                      orderId: item?.cart_product?.[0]?.cart_id,
                      productId: item?.id,
                      date: item?.created_on,
                    })}>
                    {(item?.cart_product?.[0]?.product && item?.cart_product?.[0]?.product !== 0) ?
                      <Image style={Styles.img} source={{
                        uri: item?.cart_product?.[0]?.product?.images?.[0]?.product_images ?
                          Appurl.ROOT + item?.cart_product?.[0]?.product?.images?.[0]?.product_images : staticImage
                      }} /> : <Image source={{ uri: staticImage }} />}
                    {(item?.cart_product?.[0]?.product && item?.cart_product?.[0]?.product !== 0) ?
                      <View style={Styles.innerBox}>
                        <Text style={Styles.ProductNameText} ellipsizeMode={"tail"} numberOfLines={1}> {item?.cart_product?.[0]?.product?.product_name} </Text>
                        <Text style={Styles.ProductDescText}
                          ellipsizeMode={"tail"}
                          numberOfLines={1}
                        >{item?.cart_product?.[0]?.product?.description}</Text>
                        <Text style={Styles.ProductCreatedText}>{item?.created_on ? moment(item?.created_on).format('DD/MM/YYYY') : ''}</Text>
                        {item?.cart_product && item?.cart_product?.length !== 0 &&
                          <Text style={Styles.ProductCreatedText}>{item?.cart_product?.length} more</Text>}
                      </View>
                      : <Text>No Data available</Text>}
                  </Pressable>
                </View>
                <View style={{ justifyContent: 'flex-start', alignItems: 'flex-end' }}>
                  <TouchableOpacity onPress={() => { togglePopup(item, index) }} style={{ paddingVertical: 2 }}>
                    <Icon name={'dots-horizontal'} type={'material-community'} size={18} />
                    <Menu opened={item?.isVisible}>
                      <MenuTrigger />
                      <MenuOptions optionsContainerStyle={{
                        marginTop: -55,
                        width: metrics.ScreenWidth / 3,
                        paddingHorizontal: 5,
                        backgroundColor: Colors.white,
                      }}>

                        <MenuOption>
                          {/* {(!!userRole && userRole !== "customer") && */}
                          <View>
                            <TouchableOpacity onPress={() => onCloseToggle(item, index)} style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                              <Icon name={'close'} size={18} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}
                              onPress={() => ConfirmOrder(item?.id)}>
                              <Icon name={'checkcircleo'} type={'antdesign'} size={16} />
                              <Text style={Styles.ProductConfirmText}>Confirm</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}
                              onPress={() => RejectOrder(item?.id)}>
                              <Icon name={'closecircleo'} type={'antdesign'} size={16} />
                              <Text style={Styles.ProductRejectText}>Reject</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}
                              onPress={() => navigation.navigate('MessageOrderDetails', { userId: item?.created_by })}>
                              <Icon name={'envelope'} type={'simple-line-icon'} size={16} />
                              <Text style={Styles.ProductMessageText}>Message</Text>
                            </TouchableOpacity>
                          </View>
                        </MenuOption>
                      </MenuOptions>
                    </Menu>
                  </TouchableOpacity>
                  {/* <Icon name={'chevron-small-right'} type={'entypo'} /> */}
                </View>
              </View>
              <ListSeperator />
            </View>
            :
            <View></View>}
        </MenuProvider >

      )
    }
    else {
      return (
        <MenuProvider>
          {(item?.deal_product && item?.deal_product !== 0) ?
            <Text style={{ marginTop: 10, marginLeft: 5, color: Colors.gray, fontSize: 14, fontFamily: Fonts.RobotoBold }}>Order Id - {item?.invoice_number}</Text>
            :
            <View></View>
          }
          {(item?.deal_product && item?.deal_product !== 0) ?
            <View style={Styles.container}>
              <View style={{ flexDirection: 'row', paddingVertical: 25 }}>
                <View style={{ flex: 4, justifyContent: 'center', paddingHorizontal: 5 }}>
                  <Pressable style={Styles.MainContainer}
                    onPress={() => navigation.navigate('ShowProductsForAnOrder', {
                      item: item,
                      orderId: item?.cart_product?.[0]?.cart_id,
                      productId: item?.id
                    })}>
                    {(item?.deal_product && item?.deal_product !== 0) ?
                      <Image style={Styles.img} source={{
                        uri: item?.deal_product?.[0]?.images?.[0]?.product_images ?
                          Appurl.ROOT + item?.deal_product?.[0]?.images?.[0]?.product_images : staticImage
                      }} /> : <Image source={{ uri: staticImage }} />}
                    {(item?.deal_product && item?.deal_product !== 0) ?
                      <View style={Styles.innerBox}>
                        <Text style={Styles.ProductNameText} ellipsizeMode={"tail"} numberOfLines={1}> {item?.deal_name} </Text>
                        <Text style={Styles.ProductDescText} ellipsizeMode={"tail"} numberOfLines={1}>{item?.deal_description}</Text>
                        <Text style={Styles.ProductCreatedText}>{item?.created_on ? moment(item?.created_on).format('DD/MM/YYYY') : ''}</Text>
                        {item?.deal_product && item?.deal_product?.length !== 0 &&
                          <Text style={Styles.ProductCreatedText}>{item?.deal_product?.length} more</Text>}
                      </View>
                      : <View></View>}
                  </Pressable>
                </View>
                <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-end' }}>
                  <TouchableOpacity onPress={() => { togglePopup(item, index) }} style={{ paddingVertical: 2 }}>
                    <Icon name={'dots-horizontal'} type={'material-community'} size={18} />
                    <Menu opened={item?.isVisible}>
                      <MenuTrigger />
                      <MenuOptions optionsContainerStyle={{
                        marginTop: -55,
                        width: metrics.ScreenWidth / 3,
                        paddingHorizontal: 5,
                        backgroundColor: Colors.white,
                      }}>

                        <MenuOption>
                          {/* {(!!userRole && userRole !== "customer") && */}
                          {(userData?.profile?.user_role && userData?.profile?.user_role == 'seller') ?
                            <View>
                              <TouchableOpacity onPress={() => onCloseToggle(item, index)} style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                <Icon name={'close'} size={18} />
                              </TouchableOpacity>
                              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}
                                onPress={() => ConfirmOrder(item?.id)}>
                                <Icon name={'checkcircleo'} type={'antdesign'} size={16} />
                                <Text style={Styles.ProductConfirmText}>Confirm</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}
                                onPress={() => RejectOrder(item?.id)}>
                                <Icon name={'closecircleo'} type={'antdesign'} size={16} />
                                <Text style={Styles.ProductRejectText}>Reject</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}
                                onPress={() => navigation.navigate('Messanger', { userId: item?.created_by })}>
                                <Icon name={'envelope'} type={'simple-line-icon'} size={16} />
                                <Text style={Styles.ProductMessageText}>Message</Text>
                              </TouchableOpacity>
                            </View> : <View>
                              <TouchableOpacity onPress={() => onCloseToggle(item, index)} style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                <Icon name={'close'} size={18} />
                              </TouchableOpacity>
                              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}
                                onPress={() => navigation.navigate('MessageOrderDetails', { userId: item?.created_by })}>
                                <Icon name={'envelope'} type={'simple-line-icon'} size={16} />
                                <Text style={Styles.ProductMessageText}>Message</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}
                                onPress={() => RejectOrder(item?.id)}>
                                <Icon name={'closecircleo'} type={'antdesign'} size={16} />
                                <Text style={Styles.ProductRejectText}>Reject</Text>
                              </TouchableOpacity>
                            </View>}
                        </MenuOption>
                      </MenuOptions>
                    </Menu>
                  </TouchableOpacity>
                  {/* <Icon name={'chevron-small-right'} type={'entypo'} /> */}
                </View>
              </View>
              <ListSeperator />
            </View>
            :
            <View></View>
          }
        </MenuProvider >

      )
    }
  }

  return (
    <View style={{ backgroundColor: Colors.white }}>
      {loading && <Loader size={'small'} color={'#000'} />}
      {(productList && productList.length !== 0 &&
        (productList?.[0]?.cart_product !== null || productList?.[0]?.deal_product !== null)) ?
        <FlatList
          data={productList}
          renderItem={renderProduct}
          showsVerticalScrollIndicator={false}
        /> : <Text style={{ color: '#000', textAlign: 'center', padding: 10, fontSize: 20 }}>No data available</Text>}
    </View>
  )
}

const Styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    backgroundColor: Colors.greyFA,
    marginBottom: 20,
    borderRadius: 8,
    marginTop: 5,
  },
  img: {
    height: 100,
    width: 100,
    borderRadius: 5
  },
  innerBox: {
    width: '80%',
    padding: 10
  },
  MainContainer: {
    flexDirection: 'row',
    // paddingVertical: 20,
    backgroundColor: Colors.greyFA,
    margin: 1
  },
  ProductNameText: {
    color: Colors.black,
    fontSize: 14,
    fontFamily: Fonts.RobotoBold,
    marginLeft: 1
  },
  ProductDescText: {
    color: Colors.grayLight,
    fontSize: 12,
    marginVertical: 5,
    fontFamily: Fonts.RobotoMedium,
    marginLeft: 3
  },
  ProductCreatedText: {
    color: Colors.black,
    fontSize: 12,
    marginVertical: 2,
    fontFamily: Fonts.RobotoBold,
    marginLeft: 4
  },
  ProductConfirmText: {
    color: Colors.black,
    marginHorizontal: 5,
    fontFamily: Fonts.RobotoRegular
  },
  ProductMessageText: {
    color: Colors.black,
    marginHorizontal: 5,
    fontFamily: Fonts.RobotoRegular
  },
  ProductRejectText: {
    color: Colors.black,
    marginHorizontal: 5,
    fontFamily: Fonts.RobotoRegular
  },

})
export default NewOrders
