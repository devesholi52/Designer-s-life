import React, { useState, useEffect } from "react";
// import Headers from "../../Components/Headers/Headers";
import { Image, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import metrics from "../../Theme/Metrics";
// import Colors from "../../Theme/Colors";
import { useNavigation } from "@react-navigation/native";
import AddressScreen from "./Screens/Address/AddressScreen";
// import Fonts from "../../Theme/Fonts";
import { ScrollView } from "react-native-gesture-handler";
import { Picker } from '@react-native-picker/picker';
// import { getShoppingbag } from "../../API";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { showToastMessage, staticImage } from "../../Utils";
import { staticImage } from "./Utils";
import Appurl from './API/Constant'
// import ROOT from '../../API/Constant'
// import { height } from "../Notification/NotificationScreen";
import Headers from "./Components/Headers/Headers";
import Metrics from "./Theme/Metrics";
import Colors from "./Theme/Colors";
import Fonts from "./Theme/Fonts";
import { height } from "./UploadProduct/Deal";

const DealBuyNow = ({ navigation, route }) => {

  const [size, setSize] = useState('28');
  const [quantity, setQuantity] = useState('1');
  // const [itemList, setItemList] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)

  const [productDesc, setProductDesc] = useState([route?.params?.DISC ? route?.params?.DISC : ''])
  // useEffect(() => {
  //   getProductofDeal()
  // }, [])

  // const getProductofDeal = () => {
  //   setProductDesc()
  // }


  const renderItem = ({ item }) => {
    return (
      <View style={{ marginBottom: 30 }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={{ uri: item?.product?.[0]?.image ? item?.product?.[0]?.image : staticImage }} style={{ width: Metrics.ScreenWidth / 3, height: Metrics.ScreenWidth / 3 }} />
          </View>

          {/* <Text>Deal Name</Text> */}
          <View style={{ flex: 3 }}>
            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
              <Text style={{ fontSize: 15, fontFamily: Fonts.RobotoBold }}>Deal Name -</Text>
              <Text style={{ fontSize: 12, fontFamily: Fonts.RobotoBold, marginLeft: 15, marginTop: 2 }}>{item?.title}</Text>
            </View>

            <Text style={{ fontSize: 12, fontFamily: Fonts.RobotoBold }}>{item?.product?.[0]?.product_name}</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: Colors.app_grey, fontFamily: Fonts.RobotoBold, fontSize: 12 }}>Size</Text>
                <Picker
                  placeholder={size}
                  selectedValue={size}
                  onValueChange={(value) => setSize(value)}
                  mode='dropdown'
                  style={{ color: '#000', width: 40 }}
                  itemStyle={{ color: '#000' }}       >
                  <Picker.Item label={'1'} value="1" />
                  <Picker.Item label="2" value="2" />
                </Picker>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: Colors.app_grey, fontFamily: Fonts.RobotoBold, fontSize: 12 }}>Qty</Text>
                <Picker
                  placeholder={quantity}
                  selectedValue={quantity}
                  onValueChange={(value) => setQuantity(value)}
                  mode='dropdown'
                  style={{ color: '#000', width: 40 }}
                  itemStyle={{ color: '#000' }}       >
                  <Picker.Item label="1" value="1" />
                  <Picker.Item label="2" value="2" />
                </Picker>
              </View>
            </View>
            <View style={{ flexDirection: 'row', marginVertical: 5 }}>
              <Text style={{ color: Colors.black, fontSize: 12, fontFamily: Fonts.RobotoMedium }}>{item?.price}</Text>
              <Text style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid', marginHorizontal: 10, fontSize: 12, color: Colors.app_grey, fontFamily: Fonts.RobotoMedium }}>
                {`$350`}
              </Text>
              <Text style={{ color: '#F89225', fontSize: 12, fontFamily: Fonts.RobotoMedium }}>(25%)</Text>
            </View>

            <View style={{ marginVertical: 5 }}>
              <Text style={{ color: Colors.black, fontSize: 12, fontFamily: Fonts.RobotoRegular }}>{item?.created_on}</Text>
            </View>

          </View>
        </View>

      </View>
    )
  }


  return (
    <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
      {/* <Headers title={"Deal Products"} backButton={false} /* Shoppingbag={true} */ /> */}
      {/* {loading && <Loader size={'small'} color={'#000'} />} */}

      <View style={{ maxHeight: height / 2, marginTop: 20, backgroundColor: Colors.greyFA }}>
        <FlatList
          data={productDesc}
          renderItem={renderItem}
        />
      </View>

      {/* <View style={{ padding: 10, backgroundColor: Colors.greyFA, marginVertical: 20 }}>
        <Text style={{ fontFamily: Fonts.RobotoBold, color: Colors.black, marginVertical: 20 }}>Price Detail</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoRegular }}>Total MRP</Text>
          <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoBold }}>{`${totalPrice ? totalPrice : 0}`}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoRegular }}>Discount Price</Text>
          <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoBold }}>-$70</Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoRegular }}>Convenience Fee</Text>
          <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoBold }}>Free</Text>
        </View>

      </View>

      <View style={{ padding: 10, backgroundColor: Colors.greyFA, marginVertical: 20 }}>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold }}>Total Amount</Text>
          <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoBold }}>$280</Text>
        </View>
      </View> */}

      <View style={{ /* flex: 2 */marginTop: 40, justifyContent: 'center' }}>
        <TouchableOpacity onPress={() => navigation.navigate("AddressScreen")} style={{ backgroundColor: Colors.primaryYellow, justifyContent: 'center', alignItems: 'center', marginHorizontal: 30, paddingVertical: 15, borderRadius: 10 }}>
          <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold }}>Place Order</Text>
        </TouchableOpacity>
      </View>


    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    marginVertical: 2,
    flex: 1,
    padding: 10,
    backgroundColor: Colors.white
  }
})
export default DealBuyNow
