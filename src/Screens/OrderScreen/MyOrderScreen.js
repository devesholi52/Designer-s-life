import React, { useState, useEffect } from "react";
import Headers from "../../Components/Headers/Headers";
import { FlatList, Text, TouchableOpacity, View, Image, StyleSheet, Pressable } from "react-native";
import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";
import { Avatar, Icon } from "react-native-elements";
import Colors from "../../Theme/Colors";
import OrderDetailScreen from "../../OrderDetailScreen";
import Fonts from "../../Theme/Fonts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Appurl from "../../API/Constant"
import moment from "moment";
import { Loader } from "../../Theme/Metrics";
import { useSelector } from "react-redux";

const MyOrderScreen = ({ route }) => {
  const userData = useSelector(state => state?.user?.userData ? state.user.userData : '')
  const navigation = useNavigation()
  const [ordersList, setOrdersList] = useState([])
  const [ordersSellerList, setOrdersSellerList] = useState([])
  const [loading, setLoading] = useState(false)


  useEffect(() => {

    const unsubscribesELLER = navigation.addListener('focus', () => {
      getOrder()
      getOrderForSeller()
      return unsubscribesELLER;
    })
  }, []
  )

  const getOrder = async () => {
    console.log("hryhryrhry",);
    setLoading(true)
    const token = await AsyncStorage.getItem('token')
    const USERS_TYPE = await AsyncStorage.getItem('USERROLE')
    fetch(Appurl.ORDERS, {
      method: 'GET',
      headers: { Authorization: `Token ${token}` },
    }).then(res => res.json())
      .then(response => {
        // console.log("response", response);
        if (response && response.length !== 0) setOrdersList(response)
      }).finally(e => setLoading(false))
  }


  const getOrderForSeller = async () => {
    setLoading(true)
    const token = await AsyncStorage.getItem('token')
    const USERS_TYPE = await AsyncStorage.getItem('USERROLE')
    fetch(Appurl.ORDERS_SELLER, {
      method: 'GET',
      headers: { Authorization: `Token ${token}` },
    }).then(res => res.json())
      .then(response => {
        if (response && response.length !== 0) setOrdersSellerList(response)
      }).finally(e => setLoading(false))
  }

  const ORDERSITEM = ({ item, index }) => {
    // alert("hiiiiii")
    if (userData?.profile?.user_role == "customer") {
      if (item?.cart_product !== null) {
        return (

          <Pressable style={Styles.MainContainer}>
            {(item?.cart_product && item?.cart_product !== 0) ?
              <Text style={{ marginTop: 14, marginLeft: 16, color: Colors.black, fontSize: 14, fontFamily: Fonts.RobotoBold }}>Order Id - {item?.invoice_number}</Text>
              :
              <View></View>
            }
            {(item?.cart_product && item?.cart_product !== 0) ?
              <View style={{ flexDirection: 'row', backgroundColor: '#eee' }}>
                <View style={Styles.Container}>
                  {(item?.cart_product) &&
                    item?.cart_product.map(e => {
                      return (
                        <>
                          {/* {(e && e !== 0) ? */}
                          {(item?.order_status && item?.order_status == 'new_order')}
                          <TouchableOpacity style={{ flexDirection: 'row', marginVertical: 10, backgroundColor: "white", borderRadius: 10, paddingVertical: 15, elevation: 2 }}
                            onPress={() => {
                              if (item?.order_status && item?.order_status == 'new_order') {
                                navigation.navigate('MyOrdersDelivered',
                                  {
                                    productDeatil: e?.product,
                                    productDiscount: e?.product?.discount,
                                    productPrice: e?.product?.price,
                                    orderID: item?.order,
                                    productID: item?.cart_product?.[0]?.cart_id,
                                    DeliveryAddress: item?.delivery_address,
                                    Size: item?.cart_product?.[0]?.product_size?.size,
                                    quantity: item?.cart_product?.[0]?.quantity,
                                    item: item?.created_on,
                                    itemOrder_status: item?.order_status
                                  })
                              }
                              if (item?.order_status && item?.order_status == 'delivered') {
                                navigation.navigate('OrderDetailScreen',
                                  {
                                    productDeatil: e?.product,
                                    productID: e?.product?.id,
                                    DeliveryAddress: item?.delivery_address,
                                    productDiscount: e?.product?.discount,
                                    productPrice: e?.product?.price,
                                    orderID: item?.order,
                                    cartID: item?.cart_product?.[0]?.cart_id,
                                    Size: item?.cart_product?.[0]?.product_size?.size,
                                    quantity: item?.cart_product?.[0]?.quantity,
                                    item: item?.created_on,
                                    itemOrder_status: item?.order_status,
                                    return_product: item?.return_product_status
                                  })
                              }
                              if (item?.order_status && item?.order_status == 'shipped') {
                                navigation.navigate('OrderShippedScreen',
                                  {
                                    productDeatil: e?.product,
                                    productID: e?.product?.id,
                                    DeliveryAddress: item?.delivery_address,
                                    orderID: item?.order,
                                    productDiscount: e?.product?.discount,
                                    productPrice: e?.product?.price,
                                    Size: item?.cart_product?.[0]?.product_size?.size,
                                    quantity: item?.cart_product?.[0]?.quantity,
                                    item: item?.created_on,
                                    itemOrder_status: item?.order_status
                                  })
                              }
                            }
                            }
                          >
                            <Image source={{ uri: e?.product?.images?.[0]?.product_images ? Appurl.ROOT + e?.product?.images?.[0]?.product_images : 'https://i.pinimg.com/236x/42/ee/da/42eedaf70a43ad0ff896c1256d2a71cd.jpg' }}
                              style={{ height: 80, width: 70, borderRadius: 8, marginLeft: 15, paddingRight: 10 }} />
                            {/* {(e && e !== 0) ? */}
                            <View style={{ flexDirection: 'column', marginLeft: 10, marginTop: 5 }}>
                              <Text style={{ color: Colors.black, fontSize: 14, fontFamily: Fonts.RobotoBold, marginLeft: 2 }} ellipsizeMode={"tail"} numberOfLines={1} >{e?.product?.product_name && e?.product?.product_name.length >= 20 ? e?.product?.product_name.substring(0, 20) : e?.product?.product_name}.. </Text>
                              <Text style={{ color: Colors.grayLight, fontSize: 12, marginVertical: 2, fontFamily: Fonts.RobotoRegular, marginLeft: 2 }}>Size <Text style={{
                                color: Colors.black
                              }}>{item?.cart_product?.[0]?.product_size?.size}</Text> Qty <Text style={{
                                color: Colors.black
                              }}></Text>{item?.cart_product?.[0]?.quantity}</Text>
                              <Text style={{ color: Colors.black, fontSize: 12, marginVertical: 2, fontFamily: Fonts.RobotoBold, }}> {item?.created_on ? moment(item?.created_on).format("MMM Do YY") : ''}</Text>
                            </View>
                            {/* // : <Text>No Data available</Text>} */}
                            <TouchableOpacity onPress={() => navigation.navigate('OrderDetailScreen', {
                              // isDelivered: item?.delivered,
                              productDeatil: e,
                              productID: e?.product?.id,
                              DeliveryAddress: item?.delivery_address
                            })} style={{ flex: 1, position: 'absolute', right: 20, top: 40 }}>
                              {/* <Icon name={'chevron-right'} /> */}
                            </TouchableOpacity>
                          </TouchableOpacity>
                        </>
                      )
                    })
                  }

                </View>
                {/* <TouchableOpacity onPress={() => navigation.navigate('OrderDetailScreen', {
            isDelivered: item?.delivered,
            productID: item?.product?.id
          })} style={{ flex: 1, justifyContent: 'center' }}>
            <Icon name={'chevron-right'} />
          </TouchableOpacity> */}
              </View>
              :
              <View></View>
            }
            <ListSeperator />
          </Pressable>
        )
      }
      else {
        return (

          <Pressable style={Styles.MainContainer}>

            {(item?.deal_product && item?.deal_product !== 0) ?
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ marginTop: 14, marginLeft: 16, color: Colors.dark_grey, fontSize: 14, fontFamily: Fonts.RobotoBold }}>Order Id - {item?.invoice_number}</Text>
                <Text style={{ marginTop: 14, marginLeft: 5, color: Colors.black, fontSize: 12, fontFamily: Fonts.RobotoLight }}>(This is a deal)</Text>
                {/* <Text style={{  marginLeft: 16, color: Colors.black, fontSize: 14, fontFamily: Fonts.RobotoRegular }}>Deal Products - </Text> */}
              </View>
              :
              <View></View>
            }
            {(item?.deal_product && item?.deal_product !== 0) ?
              <View style={{ flexDirection: 'row', backgroundColor: '#eee' }}>
                <View style={Styles.Container}>
                  {/* {(item?.deal_product) && */}
                  {/* item?.deal_product.map(e => { */}
                  <>
                    {/* {(e && e !== 0) ? */}
                    {(item?.order_status && item?.order_status == 'new_order')}
                    <TouchableOpacity style={{ flexDirection: 'row', marginVertical: 10, backgroundColor: "white", borderRadius: 10, paddingVertical: 15, elevation: 2 }}
                      onPress={() => {
                        if (item?.order_status && item?.order_status == 'new_order') {
                          navigation.navigate('MyOrdersDelivered',
                            {
                              dealDetail: item,
                              // productDiscount: e?.discount,
                              // productPrice: e?.price,
                              // orderID: item?.order,
                              // productID: item?.cart_product?.[0]?.cart_id,
                              DeliveryAddress: item?.delivery_address,
                              item: item?.created_on,
                              itemOrder_status: item?.order_status
                            })
                        }
                        if (item?.order_status && item?.order_status == 'delivered') {
                          navigation.navigate('OrderDetailScreen',
                            {
                              dealDetail: item,
                              // productDeatil: e,
                              // productID: e?.id,
                              // DeliveryAddress: item?.delivery_address,
                              // productDiscount: e?.discount,
                              // productPrice: e?.price,
                              DeliveryAddress: item?.delivery_address,
                              item: item?.created_on,
                              itemOrder_status: item?.order_status,
                              return_product: item?.return_product_status
                            })
                        }
                        if (item?.order_status && item?.order_status == 'shipped') {
                          navigation.navigate('OrderShippedScreen',
                            {
                              dealDetail: item,
                              // productID: e?.id,
                              // DeliveryAddress: item?.delivery_address,
                              // orderID: item?.order,
                              // productDiscount: e?.discount,
                              // productPrice: e?.price,
                              DeliveryAddress: item?.delivery_address,
                              item: item?.created_on,
                              itemOrder_status: item?.order_status
                            })
                        }
                      }
                      }
                    >
                      <Image source={{ uri: item?.deal_product?.[0]?.images?.[0]?.product_images ? Appurl.ROOT + item?.deal_product?.[0]?.images?.[0]?.product_images : 'https://i.pinimg.com/236x/42/ee/da/42eedaf70a43ad0ff896c1256d2a71cd.jpg' }}
                        style={{ height: 80, width: 70, borderRadius: 8, marginLeft: 15, paddingRight: 10 }} />
                      {/* {(e && e !== 0) ? */}
                      <View style={{ flexDirection: 'column', marginLeft: 10, marginTop: 5 }}>
                        <Text style={{ color: Colors.black, fontSize: 14, fontFamily: Fonts.RobotoBold }} ellipsizeMode={"tail"} numberOfLines={1}> {item?.deal_name && item?.deal_name.length >= 20 ? item?.deal_name.substring(0, 20) : item?.deal_name}.. </Text>
                        <Text style={{ color: Colors.grayLight, fontSize: 12, marginVertical: 4, fontFamily: Fonts.RobotoMedium }}> {item?.deal_description} </Text>
                        {/* <Text style={{ color: Colors.grayLight, fontSize: 12, marginVertical: 2, fontFamily: Fonts.RobotoRegular, marginLeft: 3 }}>Size <Text style={{
                              color: Colors.black
                            }}>46</Text> Qty <Text style={{
                              color: Colors.black
                            }}>56</Text></Text> */}
                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: Fonts.RobotoBold, }}> {item?.created_on ? moment(item?.created_on).format("MMM Do YY") : ''}</Text>
                        {item?.deal_product && item?.deal_product?.length !== 0 &&
                          <Text style={{ color: Colors.grayLight, fontSize: 12, marginVertical: 4, fontFamily: Fonts.RobotoMedium }}> There are {item?.deal_product?.length} Products under this deal</Text>}
                      </View>
                      {/* // : <Text>No Data available</Text>} */}
                      <TouchableOpacity onPress={() => navigation.navigate('OrderDetailScreen', {
                        // isDelivered: item?.delivered,
                        productDeatil: e,
                        productID: e?.product?.id,
                        DeliveryAddress: item?.delivery_address,
                        item: item?.created_on
                      })} style={{ flex: 1, position: 'absolute', right: 20, top: 40 }}>
                        {/* <Icon name={'chevron-right'} /> */}
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </>

                </View>
                {/* <TouchableOpacity onPress={() => navigation.navigate('OrderDetailScreen', {
                  isDelivered: item?.delivered,
                  productID: item?.product?.id
                })} style={{ flex: 1, justifyContent: 'center' }}>
                  <Icon name={'chevron-right'} />
                </TouchableOpacity> */}
              </View>
              :
              <View></View>
            }
            <ListSeperator />
          </Pressable>
        )
      }
    }
    else {
      if (item?.cart_product !== null) {
        return (

          <Pressable style={Styles.MainContainer}>
            {(item?.cart_product && item?.cart_product !== 0) ?
              <Text style={{ marginTop: 14, marginLeft: 16, color: Colors.black, fontSize: 14, fontFamily: Fonts.RobotoBold }}>Order Id - {item?.invoice_number}</Text>
              :
              <View></View>
            }
            {(item?.cart_product && item?.cart_product !== 0) ?
              <View style={{ flexDirection: 'row', backgroundColor: '#eee' }}>
                <View style={Styles.Container}>
                  {(item?.cart_product) &&
                    item?.cart_product.map(e => {
                      return (
                        <>
                          {/* {(e && e !== 0) ? */}
                          {(item?.order_status && item?.order_status == 'new_order')}
                          <TouchableOpacity style={{ flexDirection: 'row', marginVertical: 10, backgroundColor: "white", borderRadius: 10, paddingVertical: 15, elevation: 2 }}
                            onPress={() => {
                              if (item?.order_status && item?.order_status == 'new_order') {
                                navigation.navigate('MyOrdersDelivered',
                                  {
                                    productDeatil: e?.product,
                                    productDiscount: e?.product?.discount,
                                    productPrice: e?.product?.price,
                                    orderID: item?.order,
                                    productID: item?.cart_product?.[0]?.cart_id,
                                    DeliveryAddress: item?.delivery_address,
                                    Size: item?.cart_product?.[0]?.product_size?.size,
                                    quantity: item?.cart_product?.[0]?.quantity,
                                    item: item?.created_on,
                                    itemOrder_status: item?.order_status
                                  })
                              }
                              if (item?.order_status && item?.order_status == 'delivered') {
                                navigation.navigate('OrderDetailScreen',
                                  {
                                    productDeatil: e?.product,
                                    productID: e?.product?.id,
                                    DeliveryAddress: item?.delivery_address,
                                    productDiscount: e?.product?.discount,
                                    productPrice: e?.product?.price,
                                    orderID: item?.order,
                                    cartID: item?.cart_product?.[0]?.cart_id,
                                    Size: item?.cart_product?.[0]?.product_size?.size,
                                    quantity: item?.cart_product?.[0]?.quantity,
                                    item: item?.created_on,
                                    itemOrder_status: item?.order_status,
                                    return_product: item?.return_product_status
                                  })
                              }
                              if (item?.order_status && item?.order_status == 'shipped') {
                                navigation.navigate('OrderShippedScreen',
                                  {
                                    productDeatil: e?.product,
                                    productID: e?.product?.id,
                                    DeliveryAddress: item?.delivery_address,
                                    orderID: item?.order,
                                    productDiscount: e?.product?.discount,
                                    productPrice: e?.product?.price,
                                    Size: item?.cart_product?.[0]?.product_size?.size,
                                    quantity: item?.cart_product?.[0]?.quantity,
                                    item: item?.created_on,
                                    itemOrder_status: item?.order_status
                                  })
                              }
                            }
                            }
                          >
                            <Image source={{ uri: e?.product?.images?.[0]?.product_images ? Appurl.ROOT + e?.product?.images?.[0]?.product_images : 'https://i.pinimg.com/236x/42/ee/da/42eedaf70a43ad0ff896c1256d2a71cd.jpg' }}
                              style={{ height: 80, width: 70, borderRadius: 8, marginLeft: 15, paddingRight: 10 }} />
                            {/* {(e && e !== 0) ? */}
                            <View style={{ flexDirection: 'column', marginLeft: 10, marginTop: 5 }}>
                              {(e?.product?.product_name && e?.product?.product_name !== 0) ?
                                <Text style={{ color: Colors.black, fontSize: 14, fontFamily: Fonts.RobotoBold }} ellipsizeMode={"tail"} numberOfLines={1}> {e?.product?.product_name} </Text>
                                : <Text>No Data available</Text>}
                              <Text style={{ color: Colors.grayLight, fontSize: 12, marginVertical: 2, fontFamily: Fonts.RobotoRegular, marginLeft: 3 }}>Size <Text style={{
                                color: Colors.black
                              }}>{item?.cart_product?.[0]?.product_size?.size}</Text> Qty <Text style={{
                                color: Colors.black
                              }}></Text>{item?.cart_product?.[0]?.quantity}</Text>
                              <Text style={{ color: Colors.black, fontSize: 12, marginVertical: 2, fontFamily: Fonts.RobotoBold, }}> {item?.created_on ? moment(item?.created_on).format("MMM Do YY") : ''}</Text>
                            </View>
                            {/* // : <Text>No Data available</Text>} */}
                            <TouchableOpacity onPress={() => navigation.navigate('OrderDetailScreen', {
                              // isDelivered: item?.delivered,
                              productDeatil: e,
                              productID: e?.product?.id,
                              DeliveryAddress: item?.delivery_address
                            })} style={{ flex: 1, position: 'absolute', right: 20, top: 40 }}>
                              {/* <Icon name={'chevron-right'} /> */}
                            </TouchableOpacity>
                          </TouchableOpacity>
                        </>
                      )
                    })
                  }

                </View>
                {/* <TouchableOpacity onPress={() => navigation.navigate('OrderDetailScreen', {
            isDelivered: item?.delivered,
            productID: item?.product?.id
          })} style={{ flex: 1, justifyContent: 'center' }}>
            <Icon name={'chevron-right'} />
          </TouchableOpacity> */}
              </View>
              :
              <View></View>
            }
            <ListSeperator />
          </Pressable>
        )
      }
      else {
        return (

          <Pressable style={Styles.MainContainer}>

            {(item?.deal_product && item?.deal_product !== 0) ?
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ marginTop: 14, marginLeft: 16, color: Colors.dark_grey, fontSize: 14, fontFamily: Fonts.RobotoBold }}>Order Id - {item?.invoice_number}</Text>
                <Text style={{ marginTop: 14, marginLeft: 5, color: Colors.black, fontSize: 12, fontFamily: Fonts.RobotoLight }}>(This is a deal)</Text>
                {/* <Text style={{  marginLeft: 16, color: Colors.black, fontSize: 14, fontFamily: Fonts.RobotoRegular }}>Deal Products - </Text> */}
              </View>
              :
              <View></View>
            }
            {(item?.deal_product && item?.deal_product !== 0) ?
              <View style={{ flexDirection: 'row', backgroundColor: '#eee' }}>
                <View style={Styles.Container}>
                  {/* {(item?.deal_product) && */}
                  {/* item?.deal_product.map(e => { */}
                  <>
                    {/* {(e && e !== 0) ? */}
                    {(item?.order_status && item?.order_status == 'new_order')}
                    <TouchableOpacity style={{ flexDirection: 'row', marginVertical: 10, backgroundColor: "white", borderRadius: 10, paddingVertical: 15, elevation: 2 }}
                      onPress={() => {
                        if (item?.order_status && item?.order_status == 'new_order') {
                          navigation.navigate('MyOrdersDelivered',
                            {
                              dealDetail: item,
                              // productDiscount: e?.discount,
                              // productPrice: e?.price,
                              // orderID: item?.order,
                              // productID: item?.cart_product?.[0]?.cart_id,
                              DeliveryAddress: item?.delivery_address,
                              item: item?.created_on,
                              itemOrder_status: item?.order_status
                            })
                        }
                        if (item?.order_status && item?.order_status == 'delivered') {
                          navigation.navigate('OrderDetailScreen',
                            {
                              dealDetail: item,
                              // productDeatil: e,
                              // productID: e?.id,
                              // DeliveryAddress: item?.delivery_address,
                              // productDiscount: e?.discount,
                              // productPrice: e?.price,
                              DeliveryAddress: item?.delivery_address,
                              item: item?.created_on,
                              itemOrder_status: item?.order_status,
                              return_product: item?.return_product_status
                            })
                        }
                        if (item?.order_status && item?.order_status == 'shipped') {
                          navigation.navigate('OrderShippedScreen',
                            {
                              dealDetail: item,
                              // productID: e?.id,
                              // DeliveryAddress: item?.delivery_address,
                              // orderID: item?.order,
                              // productDiscount: e?.discount,
                              // productPrice: e?.price,
                              DeliveryAddress: item?.delivery_address,
                              item: item?.created_on,
                              itemOrder_status: item?.order_status
                            })
                        }
                      }
                      }
                    >
                      <Image source={{ uri: item?.deal_product?.[0]?.images?.[0]?.product_images ? Appurl.ROOT + item?.deal_product?.[0]?.images?.[0]?.product_images : 'https://i.pinimg.com/236x/42/ee/da/42eedaf70a43ad0ff896c1256d2a71cd.jpg' }}
                        style={{ height: 80, width: 70, borderRadius: 8, marginLeft: 15, paddingRight: 10 }} />
                      {/* {(e && e !== 0) ? */}
                      <View style={{ flexDirection: 'column', marginLeft: 10, marginTop: 5 }}>
                        <Text style={{ color: Colors.black, fontSize: 14, fontFamily: Fonts.RobotoBold }} ellipsizeMode={"tail"} numberOfLines={1}> {item?.deal_name} </Text>
                        <Text style={{ color: Colors.grayLight, fontSize: 12, marginVertical: 4, fontFamily: Fonts.RobotoMedium }} ellipsizeMode={"tail"} numberOfLines={1}> {item?.deal_description} </Text>
                        {/* <Text style={{ color: Colors.grayLight, fontSize: 12, marginVertical: 2, fontFamily: Fonts.RobotoRegular, marginLeft: 3 }}>Size <Text style={{
                              color: Colors.black
                            }}>46</Text> Qty <Text style={{
                              color: Colors.black
                            }}>56</Text></Text> */}
                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: Fonts.RobotoBold, }}> {item?.created_on ? moment(item?.created_on).format("MMM Do YY") : ''}</Text>
                        {item?.deal_product && item?.deal_product?.length !== 0 &&
                          <Text style={{ color: Colors.grayLight, fontSize: 12, marginVertical: 4, fontFamily: Fonts.RobotoMedium }}> There are {item?.deal_product?.length} Products under this deal</Text>}
                      </View>
                      {/* // : <Text>No Data available</Text>} */}
                      <TouchableOpacity onPress={() => navigation.navigate('OrderDetailScreen', {
                        // isDelivered: item?.delivered,
                        productDeatil: e,
                        productID: e?.product?.id,
                        DeliveryAddress: item?.delivery_address,
                        item: item?.created_on
                      })} style={{ flex: 1, position: 'absolute', right: 20, top: 40 }}>
                        {/* <Icon name={'chevron-right'} /> */}
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </>

                </View>
                {/* <TouchableOpacity onPress={() => navigation.navigate('OrderDetailScreen', {
                  isDelivered: item?.delivered,
                  productID: item?.product?.id
                })} style={{ flex: 1, justifyContent: 'center' }}>
                  <Icon name={'chevron-right'} />
                </TouchableOpacity> */}
              </View>
              :
              <View></View>
            }
            <ListSeperator />
          </Pressable>
        )
      }
    }
  }

  const ListSeperator = () => {
    return (
      <View style={{ borderWidth: 0.8, borderColor: Colors.borderColor }} />
    )
  }

  const renderOrderList = ({ item, index }) => {
    return (
      <ORDERSITEM item={item} index={index} />
    )
  }
  return (
    <>
      {/* <Headers title={"Orders"} backButton={true} /> */}
      {(userData?.profile?.user_role == "customer") ?
        <View style={{ backgroundColor: Colors.greyFA }}>
          {loading && <Loader size={'small'} color={'#000'} />}
          {(ordersList && ordersList.length !== 0)
            ?
            <FlatList
              data={ordersList}
              renderItem={({ item, index }) => <ORDERSITEM item={item} index={index} />}
              keyExtractor={(item, index) => index.toString()}
            /> : <Text style={{ color: '#000', textAlign: 'center', padding: 10, fontSize: 20 }}>No data available</Text>}
        </View>
        :
        <View style={{ backgroundColor: Colors.greyFA }}>
          {loading && <Loader size={'small'} color={'#000'} />}
          {(ordersSellerList && ordersSellerList.length !== 0) ?
            <FlatList
              data={ordersSellerList}
              renderItem={renderOrderList}
            /> : <Text style={{ color: '#000', textAlign: 'center', padding: 10, fontSize: 20 }}>No data available</Text>}
        </View>
      }

    </>
  )
}

const Styles = StyleSheet.create({
  MainContainer: {
    paddingHorizontal: 15,
    // marginBottom: 10,
    // elevation: 1,
    backgroundColor: '#eee'

  },
  Container: {
    flex: 4,
    justifyContent: 'center',
    paddingHorizontal: 5,

  },
  ProductNameText: {
    color: Colors.black,
    fontSize: 14,
    fontFamily: Fonts.RobotoBold
  },
  ProductSizeText: {
    color: Colors.grayLight,
    fontSize: 12,
    marginVertical: 2,
    fontFamily: Fonts.RobotoRegular,
    marginLeft: 3
  },
  ProductCreatedOnText: {
    color: Colors.black,
    fontSize: 12,
    marginVertical: 2,
    fontFamily: Fonts.RobotoBold,
    marginLeft: 4
  },
})
export default MyOrderScreen

















// const NavigateOnorder = ({ item }) => {
//   // if(item?.order_status && item?.order_status == "new_order"  )
//   // {
//   navigation.navigate('MyOrdersDelivered',
//     {
//       productDeatil: e,
//       productID: item?.id,
//       DeliveryAddress: item?.delivery_address
//     })
//   // }
//   // if(item?.order_status && item?.order_status == "new_order"  )
//   // {
//   // navigation.navigate('MyOrdersDelivered',
//   //   {
//   //     productDeatil: e,
//   //     productID: item?.id,
//   //     DeliveryAddress: item?.delivery_address
//   //   })
//   // }

// onPress={() => NavigateOnorder(item)}>