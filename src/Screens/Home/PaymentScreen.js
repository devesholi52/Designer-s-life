import React, { useState } from "react";
import Headers from "../../Components/Headers/Headers";
import RNUpiPayment from "react-native-upi-payment";
import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import Colors from "../../Theme/Colors";
import Fonts from "../../Theme/Fonts";
import Appurl from '../../API/Constant';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { width } from "../Notification/NotificationScreen";
import { showToastMessage } from "../../Utils";
import { updateScreenName, updateStep } from "../../redux/reducers/stepper";
import { RadioButton } from "react-native-paper";

const PaymentScreen = ({ route }) => {
  const dispatch = useDispatch()
  const [productID, setProductId] = useState(route?.params?.AddressID ? route?.params?.AddressID : '')
  const [dealIDD, setDealIdd] = useState(route?.params?.IdOfDeal ? route?.params?.IdOfDeal : '')
  const [selectedProductData, setSelectedProductData] = useState(route?.params?.selectedProductData ? route?.params?.selectedProductData : [])
  const [totalAmount, setTotalAmount] = useState(route?.params?.TotalAmount ? route?.params?.TotalAmount : [])
  const [discountPrice, setDiscountPrice] = useState(route?.params?.DiscountPrice ? route?.params?.DiscountPrice : [])
  const [products, setProducts] = useState(route?.params?.products ? route?.params?.products : [])
  const [checked, setChecked] = useState('Zelle');
  const navigation = useNavigation()


  // const googlePayForDeal = async () => {
  //   RNUpiPayment.initializePayment({
  //     vpa: 'john@upi', // or can be john@ybl or mobileNo@upi
  //     payeeName: 'John Doe',
  //     // amount: products?.price,
  //     amount: "1",
  //     transactionRef: 'aasf-332-aoei-fn'
  //   },
  //     // .then((success) => success)
  //     // .catch(e => { e })
  //     () => { console.log("success") },
  //     () => { console.log("failure") }
  //   )
  // }

  const PAYFORDEAL = async () => {
    // await googlePayForDeal()
    const token = await AsyncStorage.getItem('token')
    let ids = []
    let size = []
    selectedProductData.forEach(e => {
      ids.push(e.id)
      size.push(e.size)
    })
    let form = {
      'delivery_address': productID,
      'deal': dealIDD,
      'deal_product': ids,
      'deal_product_size': size,
      // 'isGooglePay': checked === 'Gpay Pay' ? true : false
    }
    fetch(Appurl.PAY_NOW, {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(response => {
        if (response) {
          showToastMessage('Deal purchased')
          updateDeal()
          navigation.navigate('MyOrderScreen', {
            screen: 'payment'
          })
        }
      }
      )

  }

  const PAYFORPRODUCT = async () => {
    // await googlePayForProduct()
    // .then(async res => {

    const token = await AsyncStorage.getItem('token')
    let form = new FormData()
    form.append('delivery_address', productID)
    fetch(Appurl.PAY_NOW, {
      method: 'POST',
      headers: { Authorization: `Token ${token}` },
      body: form
    })
      .then(res => res.json())
      .then(response => {
        if (response) {
          showToastMessage('Product purchased')
          updateDeal()
          navigation.navigate('MyOrderScreen', {
            screen: 'payment'
          })
        }
      }
      )
    // }).catch(e => {

    // })


  }

  const updateDeal = () => {
    dispatch(updateStep(2))
    dispatch(updateScreenName('MyOrderScreen'))
  }

  return (
    <ScrollView style={styles.mainContainer}>
      <View>
        <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold, fontSize: 18 }}>Payment Option</Text>
        {(Platform.OS !== "ios") ?
          <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.searchBorderColor, marginVertical: 30, padding: 6, borderRadius: 10 }}>
            <RadioButton
              color="black"
              uncheckedColor='grey'
              value={0}
              status={checked == 'Gpay Pay' ? 'checked' : 'unchecked'}
              onPress={() => { setChecked('Gpay Pay'); }}
            />

            <View style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 10 }}>
              {/* <Image source={require('../../Assets/Icon/apple_logo.png')} style={{ width: 30, height: 30 }} /> */}
              <Text style={{ color: Colors.black, marginHorizontal: 10, fontFamily: Fonts.RobotoBold }}>Gpay Pay</Text>
            </View>
          </View>
          :
          <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.searchBorderColor, marginVertical: 30, padding: 6, borderRadius: 10 }}>
            <RadioButton
              color="black"
              uncheckedColor='grey'
              value={0}
              status={checked == 'Apple Pay' ? 'checked' : 'unchecked'}
              onPress={() => { setChecked('Apple Pay'); }}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 10 }}>
              {/* <Image source={require('../../Assets/Icon/apple_logo.png')} style={{ width: 30, height: 30 }} /> */}
              <Text style={{ color: Colors.black, marginHorizontal: 10, fontFamily: Fonts.RobotoBold }}>Apple Pay</Text>
            </View>
          </View>
        }


        <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: Colors.searchBorderColor, padding: 10, alignItems: 'center', borderRadius: 10 }}>
          {/* <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.searchBorderColor, marginVertical: 30, padding: 6 }}> */}
          <RadioButton
            color="black"
            uncheckedColor='grey'
            value={0}
            status={checked == 'Zelle' ? 'checked' : 'unchecked'}
            onPress={() => { setChecked('Zelle'); }}
          />
          {/* <Image source={require('../../Assets/Icon/zelle_logo.jpg')} style={{ width: 30, height: 30 }} /> */}
          <Text style={{ color: Colors.black, marginHorizontal: 10, fontFamily: Fonts.RobotoBold }}>Zelle</Text>
        </View>
        {/* </View> */}

      </View>
      <View style={{ padding: 10, backgroundColor: Colors.greyFA, marginVertical: 40 }}>
        <Text style={{ fontFamily: Fonts.RobotoBold, color: Colors.black, marginVertical: 10 }}>Price Detail</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 3 }}>
          <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoRegular }}>Total MRP</Text>
          {(dealIDD == "") ?
            <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoBold }}>{`${totalAmount}`}</Text>
            :
            <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoBold }}>{products?.total_price ? products?.total_price : ''}</Text>
          }
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 3 }}>
          <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoRegular }}>Discount Price</Text>
          {(dealIDD == "") ?
            <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoBold }}>{Math.trunc(discountPrice)}</Text>
            :
            <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoBold }}>{products?.discount ? products?.discount : ''}</Text>
          }
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 3 }}>
          <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoRegular }}>Convenience Fee</Text>
          <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoBold }}>Free</Text>
        </View>



      </View>
      <View style={{ padding: 10, backgroundColor: Colors.greyFA }}>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold }}>Total Amount</Text>
          {(dealIDD == "") ?
            <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoBold }}>{Math.trunc(totalAmount - discountPrice)}</Text>
            :
            <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoBold }}>{products?.price ? products?.price : ''}</Text>
          }
        </View>
      </View>

      <TouchableOpacity style={{ backgroundColor: '#ffd700', justifyContent: 'center', alignItems: 'center', paddingVertical: 15, borderRadius: 10, marginTop: 60, marginBottom: width / 2.5 }}
        // disabled={currentPayMethod ? false : true}
        // onPress={() => {
        //   if (checked == 'Zelle') {
        //     navigation.navigate("ScannerForZelle")
        //   }
        //   else {
        //     if (dealIDD !== "") {
        //       PAYFORDEAL()
        //     }
        //     else {
        //       PAYFORPRODUCT()
        //     }
        //   }
        onPress={() => {
          if (dealIDD !== "") {
            PAYFORDEAL()
          }
          else {
            PAYFORPRODUCT()
          }
        }}>
        <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold }}>Place Order</Text>
      </TouchableOpacity>

    </ScrollView>

  )
}
const styles = StyleSheet.create({
  mainContainer: {
    marginVertical: 2,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flex: 1,
    backgroundColor: Colors.white
  }
})
export default PaymentScreen
