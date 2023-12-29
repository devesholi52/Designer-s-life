import React, { useState, useEffect } from "react";
import { Image, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import metrics, { Loader } from "../../../Theme/Metrics";
import Colors from "../../../Theme/Colors";
import Fonts from "../../../Theme/Fonts";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Appurl from '../../../API/Constant'
import { height } from "../../Notification/NotificationScreen";
import ShoppingBagProduct from './ShoppingBagProduct'
import { deleteCartProduct, getCartProducts, updateProductSize } from "../../../API";
import { useSelector } from 'react-redux'
import { showToastMessage } from "../../../Utils";

const ShoppingbagScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false)
  const userData = useSelector(state => state?.user?.userData)
  const token = useSelector(state => state?.user?.token)
  const [data, setData] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalDiscount, setTotalDiscount] = useState(0)
  const [DiscountPrice, setdiscountPrice] = useState(0)
  const [Size, setSize] = useState("")

  useEffect(() => {
    getData()
  }, [])
  const getData = async () => {
    setLoading(true)
    getCartProducts(token)
      .then(response => {
        let price = 0
        let discount = 0
        let disPrice = 0
        if (response && response.data && response.data.data) {
          console.log("res[onse", response?.data);
          res = response?.data?.data
          let dis = 0
          let disPrice = 0
          res.forEach(item => {
            price += item?.quantity * item?.product?.price
            dis += item?.product?.price * item?.product?.discount / 100
            disPrice += item?.product?.price * item?.quantity * item?.product?.discount / 100
          });
          discount = dis * 100 / price
          finalDiscount = price - disPrice
          setTotalDiscount(discount)
          setTotalPrice(price)
          setdiscountPrice(finalDiscount)
        }
        setData([...res])
      }).finally(e => setLoading(false))
  }

  const finalPrice = (price = 0, discount = 0) => price * discount / 100
  // const onIncrementPress = (qty, id) => {
  //   let form = new FormData();
  //   form.append('quantity', qty);
  //   updateProductSize(id, form, token)
  //     .then(response => {
  //       if (response) {
  //         showToastMessage('Quantity Updated');
  //         getData()
  //       }
  //     });
  // }
  const onIncrementPress = (qty, id) => {
    let form = new FormData()
    form.append('quantity', qty + 1)
    fetch(`${Appurl.UPDATE_CART}${id}/`, {
      method: 'PUT',
      headers: { Authorization: `Token ${token}` },
      body: form
    }).then(res => res.json())
      .then(response => {
        showToastMessage('Quantity Updated');
        getData()

      })

  }
  const onDecrementPress = (qty, id) => {
    let form = new FormData();
    form.append('quantity', qty - 1);
    updateProductSize(id, form, token)
      .then(response => {
        if (response) {
          showToastMessage('Quantity Updated');
          getData()
        }
      });
  }
  const onSelectSize = (value, id) => {
    setLoading(true)
    let form = new FormData();
    form.append('product_size', value);
    updateProductSize(id, form, token)
      .then(response => {
        let res = response?.data
        // setSize(JSON.stringify(res?.product_size));
        if (res) { showToastMessage('Size Updated'); }
        getData()
      }).finally(e => setLoading(false))
  }
  const onDeleteProductPress = (id) => {
    deleteCartProduct(id, token)
      .then(response => {
        if (response && response?.data && response?.data?.message == 'Cart delete successfully.') {
          showToastMessage('Product removed successfully');
          getData()
        }
      });
  }
  const PlaceOrder = () => {
    let error = false
    if (data && data.length !== 0) {
      data.forEach(item => {
        if (!item?.product_size?.id) {
          showToastMessage('Please select Size');
          error = true
        }
      })
    }
    if (!error) navigation.navigate('AddressAlreadyExist',
      {
        TotalAmount: totalPrice,
        DiscountPrice: DiscountPrice,
        products: data
      })
  }

  return (
    <ScrollView style={styles.Container}>
      {loading && <Loader />}
      {(data && data.length !== 0) ?
        <>
          <FlatList
            data={data}
            renderItem={({ item, index }) =>
              <ShoppingBagProduct
                item={item} index={index}
                onIncrementPress={onIncrementPress}
                onDecrementPress={onDecrementPress}
                onSelectSize={onSelectSize}
                onDeleteProductPress={onDeleteProductPress}
              />
            }
            ListFooterComponent={({ }) => {
              return (
                <View >
                  <View style={styles.priceDetailView}>
                    <Text style={styles.priceDetailText}>Price Detail</Text>
                    <View style={styles.LeftMrpView}>
                      <Text style={styles.leftTotalPriceText}>Price</Text>
                      <Text style={styles.rightTotalPriceText}>${totalPrice}</Text>
                    </View>
                    <View style={styles.LeftMrpView}>
                      <Text style={styles.leftTotalPriceText}>Discount</Text>
                      <View>
                        <Text style={styles.rightTotalPriceText}>${Math.trunc(totalPrice - DiscountPrice)}</Text>
                        {/* <Text style={styles.rightTotalPriceText}>{`${finalPrice(totalPrice, totalDiscount).toFixed(2)}`}</Text> */}
                        {/* <Text style={[styles.rightTotalPriceText]}>{`${totalDiscount ? totalDiscount.toFixed(2) : 0}%`}</Text> */}
                      </View>
                    </View>

                    <View style={styles.LeftMrpView}>
                      <Text style={styles.leftTotalPriceText}>Shipping Fee</Text>
                      <Text style={styles.rightTotalPriceText}>Free</Text>
                    </View>

                  </View>

                  <View style={styles.totalAmountMainView}>
                    <View style={styles.totalAmountView}>
                      <Text style={styles.totalAmountText}>Total Amount</Text>
                      <Text style={styles.rightTotalPriceText}>${Math.trunc(DiscountPrice)}</Text></View>
                  </View>

                  <View style={{ justifyContent: 'center', marginVertical: 60 }}>
                    <TouchableOpacity
                      onPress={PlaceOrder} style={styles.button}>
                      <Text style={styles.buttonText}>Place Order</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            }}
          />
        </>
        : <Text style={styles.noData}>No data available</Text>}
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor
  },
  priceDetailView: {
    padding: 10,
    backgroundColor: Colors.greyFA,
    marginVertical: 10
  },
  priceDetailText: {
    fontFamily: Fonts.RobotoBold,
    color: Colors.black,
    marginVertical: 20
  },
  LeftMrpView: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  leftTotalPriceText: {
    fontSize: 12,
    color: Colors.black,
    fontFamily: Fonts.RobotoRegular,
    marginVertical: 3
  },
  rightTotalPriceText: {
    fontSize: 12,
    color: Colors.black,
    fontFamily: Fonts.RobotoBold
  },
  totalAmountMainView: {
    padding: 10,
    backgroundColor: Colors.greyFA,
    marginVertical: 20
  },
  totalAmountView: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  totalAmountText: {
    color: Colors.black,
    fontFamily: Fonts.RobotoBold
  },
  button: {
    backgroundColor: Colors.primaryYellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10
  },
  buttonText: {
    color: Colors.black,
    fontFamily: Fonts.RobotoBold
  },
  noData: {
    color: '#000',
    textAlign: 'center',
    padding: 10,
    fontSize: 20
  }

})
export default ShoppingbagScreen
