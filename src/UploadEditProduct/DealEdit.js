import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, Modal, FlatList, Pressable, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';
import Awesome from 'react-native-vector-icons/FontAwesome';
export const { height, width } = Dimensions.get('window');
import Appurl from '../API/Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToastMessage, staticImage } from "../Utils";
import { useSelector } from 'react-redux';
import { editDeal } from '../API';
import { KeyboardAvoidingView } from 'react-native';
import Colors from '../Theme/Colors';
import EditedHomeScreenedit from '../Screens/Home/EditedHomeScreenedit';
import { Loader } from '../Theme/Metrics';
import Fonts from '../Theme/Fonts';

const data = [1, 2, 3, 4, 5, 6, 7]

export default dealEdit = ({ route, navigation }) => {
  const [productTotalPrice, SetProductTotalPrice] = useState();
  const [productData, setProductData] = useState([])
  const [selectedArr, setAelectedArr] = useState([]);
  const [loading, setLoading] = useState(false)
  const [isChanged, setIsChanged] = useState(false);
  const [dealName, setDealName] = useState('');
  const [discription, setDiscription] = useState('');
  const [dealprice, setDealprice] = useState('');
  const [selectedOne, setSelectedOne] = useState([])
  const [productSelect, setProductSelect] = useState([]);
  const [showAddProductScreen, setShowAddProductScreen] = useState(false)
  const userData = useSelector(state => state?.user?.userData ? state.user.userData : '')
  const token = useSelector(state => state?.user?.token ? state.user.token : '')
  const [userIDD, setUserId] = useState(route?.params?.IDofUser ? route?.params?.IDofUser : '');

  const removeFromSelectedImage = (item, index) => {
    selectedArr.splice(index, 1)
    setIsChanged(!isChanged)
  }
  console.log("totalprice", productTotalPrice);
  console.log("selectedOne", selectedOne);

  const Submit = async () => {
    const token = await AsyncStorage.getItem('token')
    if (!dealName) { showToastMessage('please fill in'); return }
    if (!discription) { showToastMessage('please fill in'); return }
    if (!dealprice) { showToastMessage('please fill in'); return }
    let Totalamount = 0
    selectedOne.forEach(e => {
      console.log("selectedArr----------", selectedArr);
      Totalamount = Totalamount + e.price
    })
    if (dealprice > Totalamount) { showToastMessage('Deal Price should be less than total price of selected products'); return }
    let form = new FormData()
    form.append('title', dealName)
    form.append('description', discription)
    form.append('price', dealprice)
    if (selectedOne && selectedOne.length !== 0) {
      for (var i = 0; i < selectedOne.length; i++) {
        form.append('product', selectedOne[i].id);
      }
    }
    console.log(form);
    fetch(`${Appurl.deal}${userIDD}/`, {
      method: 'PUT',
      headers: { Authorization: `Token ${token}` },
      body: form
    }).then(res => res.json())
      .then(response => {
        if (response) { showToastMessage('Deal updated') }
        setDealName('');
        setDiscription('');
        setDealprice('');
        setSelectedOne('');
        navigation.navigate('SearchNew')
      })
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getProduct()
      getDealDetail()
      return unsubscribe;
    })
  }, [])

  const getProduct = async () => {
    const token = await AsyncStorage.getItem('token')
    fetch(Appurl.ProductListing, {
      method: 'GET',
      headers: { Authorization: `Token ${token}` },
    }).then(res => res.json())
      .then(response => {
        // console.log('product Get::', response.results)
        setProductData([...response.results])
      })
  }
  const getDealDetail = async () => {
    setLoading(true)
    const token = await AsyncStorage.getItem('token')
    fetch(`${Appurl.dealGetEdit}${userIDD}`, {
      method: 'GET',
      headers: { Authorization: `Token ${token}` },
    }).then(res => res.json())
      .then(response => {
        if (response && response.length !== 0) {
          let Totalamount = 0
          selectedOne.forEach(e => {
            alert('ggggggggggggggg')
            console.log('eeeeeeeeeeee', e);
            Totalamount = Totalamount + e?.price
            console.log("selectedArr----------", Totalamount);
          })
          SetProductTotalPrice(Totalamount)
          // setProductData([...response.results])
          setDealName(response?.results?.[0]?.title)
          setDiscription(response.results?.[0]?.description)
          setDealprice(JSON.stringify(response.results?.[0]?.price))
          setSelectedOne(response.results?.[0]?.product)
        }
      })
      .finally(e => setLoading(false))
  }

  const renderSelectedImage = ({ item, index }) => {
    return (
      <View style={{ marginHorizontal: index > 0 ? 2 : 0, padding: 5, marginLeft: 10 }}>
        <Image source={{ uri: item?.images?.[0]?.product_images ? item?.images?.[0]?.product_images : staticImage }} style={{ width: 35, height: 30, borderRadius: 10 }} />
        {/* <TouchableOpacity onPress={() => removeFromSelectedImage(item, index)}
          style={{ padding: 2, position: 'absolute', bottom: 2, right: 2, zIndex: 999, backgroundColor: '#000', borderRadius: 200 }}>
          <Icon name={'close'} color={'#fff'} size={10} /> */}
        {/* </TouchableOpacity> */}
      </View>
    )
  }


  if (showAddProductScreen) {
    return <EditedHomeScreenedit
      navigation={navigation}
      onSubmit={data => {
        // console.log('selected data', data);
        setSelectedOne(data)
        setShowAddProductScreen(prev => !prev)
      }} />
  }

  // console.log("selected one", selectedOne);

  return (
    <ScrollView style={styles.MainContainer}>
      {loading && <Loader size={'small'} color={'#000'} />}
      <KeyboardAvoidingView>
        <TextInput
          style={styles.inputbox}
          theme={{ colors: { text: "black", primary: 'black', placeholder: Colors.dark_grey } }}
          value={dealName}
          label='Deal name'
          underlineColor={Colors.transparent}
          onChangeText={setDealName} />

        <TextInput
          style={styles.inputbox}
          theme={{ colors: { text: "black", primary: 'black', placeholder: Colors.dark_grey } }}
          value={discription}
          label='Deal Description'
          underlineColor={Colors.transparent}
          onChangeText={setDiscription} />

        <Pressable style={[styles.IconContainer]}
          onPress={() => setShowAddProductScreen(prev => !prev)}>
          <View style={{ paddingVertical: 16 }}>
            <Text style={{ color: Colors.dark_grey }}>Add Products</Text>
          </View>
        </Pressable>

        <FlatList
          data={selectedOne}
          renderItem={renderSelectedImage}
          horizontal={true}
        />

        {/* <View style={styles.totalAmountView}>
          <Text style={styles.totalAmountText}>Product Total Amount   -</Text>
          <Text style={styles.rightTotalPriceText}>{productTotalPrice}</Text>
        </View> */}

        {/* {
          selectedOne.forEach(e => {
            <View style={{ backgroundColor: 'red', padding: 5 }}>
              <Text style={{ color: 'black', fontSize: 17 }}>
                {e?.price}
              </Text>
            </View>
          })} */}
        <TextInput
          theme={{ colors: { text: "black", primary: 'black', placeholder: Colors.dark_grey } }}
          style={styles.inputboxDealPrice}
          value={dealprice}
          keyboardType={"numeric"}
          label='Enter Deal Price'
          underlineColor={Colors.transparent}
          onChangeText={setDealprice} />

        <TouchableOpacity style={styles.button}
          onPress={() => Submit()}
        >
          <Text style={styles.btnText}>Update</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ScrollView >
  )
}

const styles = StyleSheet.create({
  MainContainer: {
    backgroundColor: "white",
    // flex: 1,
  },

  inputbox: {
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white',
    height: 50,
    borderColor: 'lightgrey',
    marginHorizontal: 15,
    marginVertical: 20,
    // borderRadius: 10,
    // padding: 10,
    fontSize: 15,
    borderBottomWidth: 1,
    marginTop: 15,
  },
  IconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    marginHorizontal: 15,
    padding: 10,
    borderColor: 'lightgrey',
    borderRadius: 10,
    fontSize: 15,
    paddingVertical: -5,
    // marginTop: 20
  },
  button: {
    alignSelf: 'center',
    backgroundColor: '#ffd700',
    paddingHorizontal: 140,
    padding: 15,
    marginTop: 90,
    borderRadius: 10
  },
  btnText: {
    fontSize: 18, fontWeight: 'bold', color: 'black'
  },
  Image: {
    height: 28,
    width: 28,
    borderRadius: 10,
    justifyContent: "space-between"
  },
  ImageView: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 5
  },
  containerModal: {
    height: height / 5,
    width: width / 1.08,
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 10,
    justifyContent: "center",
    borderColor: 'lightgrey',
    borderWidth: 1
    // shadowOffset: {
    //   width: 0,
    //   height: 2
    // },
    // shadowColor: "#000",
    // flex:1
  },
  imagemodal: {
    height: 22,
    width: 25,
    marginBottom: 4
  },
  ModalImageText: {
    flexDirection: 'row',
    margin: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'

  },
  inputboxDealPrice: {
    // width: width / 1.09,
    // flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    backgroundColor: 'white',
    height: 50,
    borderRadius: 5,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'lightgrey',
    // backgroundColor:'red',
    marginTop: 25,
    borderBottomWidth: 1
  },
  totalAmountView: {
    flexDirection: 'row',
    // justifyContent: 'space-between'
  },
  totalAmountText: {
    color: Colors.black,
    fontFamily: Fonts.RobotoMedium,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 6
  },
  rightTotalPriceText: {
    fontSize: 14,
    color: Colors.dark_grey,
    marginTop: 20,
    marginRight: 20,
    fontFamily: Fonts.RobotoRegular
  },
})















// {
//   image:require('../Assets/product5.jpg'),
//   title: 'Black Floral Printed'
// },
//  {
//   image:require('../Assets/product5.jpg'),
//   title: 'Black Floral Printed'
// },
//  {
//   image:require('../Assets/product5.jpg'),
//   title: 'Black Floral Printed'
// },
//  {
//   image:require('../Assets/product5.jpg'),
//   title: 'Black Floral Printed'
// },
//  {
//   image:require('../Assets/product5.jpg'),
//   title: 'Black Floral Printed'
// },
//  {
//   image:require('../Assets/product5.jpg'),
//   title: 'Black Floral Printed'
// },