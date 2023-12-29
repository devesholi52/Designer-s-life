import React, { useState, useEffect } from "react";
import Colors from "../../Theme/Colors";
import { FlatList, Text, View, Picker, StyleSheet, ActivityIndicator, Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Fonts from "../../Theme/Fonts";
import { ScrollView } from "react-native";
import Appurl from "../../API/Constant"
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { Loader } from "../../Theme/Metrics";
import { Pressable } from "react-native";


const TransactionScreenForProducts = ({ navigation }) => {

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [fetchingFromServer, setFetchingFromServer] = useState(false)

  const [category, setcategory] = useState([
    { image: null, label: 'january', value: 'january', id: 1 },
    { image: null, label: 'febuary', value: 'febuary', id: 1 },
    { image: null, label: 'March', value: 'March', id: 1 },
    { image: null, label: 'April', value: 'April', id: 1 },
  ])
  const [isSizeFocus, setIsSizeFocus] = useState(false);

  const onSelectBusinessCategory = (item) => {
    console.log('====================================');
    console.log(item);
    console.log('====================================');
  }
  // console.log("responseofProduct", data);
  useEffect(() => {
    getDataForProduct()
  }, [])
  // useEffect(() => {
  //   getDataForProduct()
  // }, [page])

  // const getDataForProduct = async () => {
  //   // setLoading(true)

  //   const token = await AsyncStorage.getItem('token')
  //   fetch(Appurl.TRANSACTION_FOR_PRODUCT.replace('{{offset}}', page), {
  //     method: 'GET',
  //     headers: { Authorization: `Token ${token}` },
  //   }).then(res => res.json())
  //     .then(response => {
  //       if (response && response?.results) {
  //         // console.log("responseofProduct", response?.results);
  //         setData([...data, ...response?.results])
  //       }
  //       setFetchingFromServer(false)
  //     })
  //   // .finally(e => setLoading(false))
  //   // .catch(e => showToastMessage('Something went wrong'))
  // }
  const getDataForProduct = async () => {
    setLoading(true)
    const token = await AsyncStorage.getItem('token')
    fetch(Appurl.TRANSACTION_FOR_PRODUCT, {
      method: 'GET',
      headers: { Authorization: `Token ${token}` },
    }).then(res => res.json())
      .then(response => {
        if (response && response?.results) {
          console.log("responseofProduct", response?.results);
          setData(response?.results)
        }
        setFetchingFromServer(false)
      })
      .finally(e => setLoading(false))
    // .catch(e => showToastMessage('Something went wrong'))
  }

  // const renderFooter = () => {
  //   return (
  //     //Footer View with Load More button
  //     <View>
  //       {fetchingFromServer ?
  //         (
  //           <View style={{ backgroundColor: "white", padding: 5 }}>
  //             <ActivityIndicator color={Colors.primaryOrange} size="large" />
  //           </View>
  //         ) : null}
  //     </View>
  //   );
  // }

  const TrasactionItem = ({ item, index }) => {
    // console.log("item", item);
    return (
      <>
        {(item?.cart_product && item?.cart_product?.length !== 0) &&
          <Pressable style={{ paddingHorizontal: 15, marginVertical: 5 }}
            onPress={() => navigation.navigate('ShowTransactionForProduct', {
              item: item,
            })}>
            <View style={{ flexDirection: 'row', paddingVertical: 15 }}>
              <Image source={{ uri: item?.cart_product?.[0]?.product?.images?.[0]?.product_images }}
                style={styles.Image}
                PlaceholderContent={<ActivityIndicator />}
              />
              <View style={{ flex: 4, justifyContent: 'center', paddingHorizontal: 10 }}>
                <Text style={{ color: Colors.black, fontSize: 15, fontFamily: Fonts.RobotoMedium }}>OrderID- {item?.invoice_number}</Text>
                <Text style={{ color: Colors.black, fontSize: 13, fontFamily: Fonts.RobotoRegular }}>{item?.updated_on ? moment(item?.updated_on).format("DD/MM/YYYY") : ''}</Text>
              </View>
              <View style={{ flex: 1, justifyContent: 'center', marginRight: 5, paddingHorizontal: 5 }}>
                {/* <Text style={{ color: Colors.black, alignItems: 'flex-end', fontSize: 16, fontFamily: Fonts.RobotoMedium }}>${Math.trunc(item?.cart_product?.[0]?.product?.price - item?.cart_product?.[0]?.product?.price * item?.cart_product?.[0]?.product?.discount / 100)}</Text> */}
                {item?.cart_product && item?.cart_product?.length !== 0 && item?.cart_product?.length == 1 &&
                  <Text style={{ color: Colors.black, fontSize: 14, fontFamily: Fonts.RobotoRegular, marginRight: 5 }}>{item?.cart_product?.length} item</Text>
                }
                {item?.cart_product && item?.cart_product?.length !== 0 && item?.cart_product?.length > 1 &&
                  <Text style={{ color: Colors.black, fontSize: 14, fontFamily: Fonts.RobotoRegular, marginRight: 5 }}>{item?.cart_product?.length} items</Text>
                }

                <Text style={{ color: "blue", fontSize: 10, fontFamily: Fonts.RobotoRegular, marginleft: 5 }}>open</Text>
              </View>
            </View>
            <ListSeperator />
          </Pressable>
        }
      </>
    )
  }

  const renderTransactionItem = ({ item, index }) => {
    return (
      <TrasactionItem item={item} index={index} />

    )
  }

  const ListSeperator = () => {
    return (
      <View style={{ borderWidth: 0.8, borderColor: Colors.borderColor }} />
    )
  }



  return (
    <ScrollView>
      {loading && <Loader size={'small'} color={'#000'} />}
      {/* <Headers title={"Transaction"} backButton={false} /> */}
      <View style={{ backgroundColor: Colors.white, flex: 1 }} >
        <View style={{ paddingHorizontal: 20, paddingVertical: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold, fontSize: 17, marginTop: 15 }}>Last Transaction</Text>
          {/* {(!!category && category.length !== 0) && <CustomDropDown data={category} placeholder="January" onChangeValue={onSelectBusinessCategory} />} */}
        </View>
        {(data && data.length !== 0) ?
          <FlatList
            data={data}
            // onEndReachedThreshold={0.5}
            renderItem={renderTransactionItem}
          // onEndReached={() => {
          //   setPage(page + 10)
          //   setFetchingFromServer(true)
          // }}
          // ListFooterComponent={renderFooter}
          /> : <Text style={{ color: '#000', textAlign: 'center', padding: 10, fontSize: 20 }}>No data available</Text>}
      </View>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  DropdownStyle: {
    height: 23,
    // marginRight: 40,
    width: '30%',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 30,
    marginVertical: 16,
    marginLeft: 20,
    borderColor: '#eee',
    color: '#000',
    backgroundColor: Colors.grayFed,
    alignSelf: 'center'
  },
  dropDownSizeTextView: {
    height: 20,
    width: 20,
    padding: 10,
    margin: 15,
    // backgroundColor: item.value,
    borderWidth: 0.5,
    borderColor: Colors.dark_grey,
  },
  Image: {
    height: 40,
    width: 40,
    borderRadius: 100,
    margin: 5
  },
})
export default TransactionScreenForProducts
