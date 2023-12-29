import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, Modal, FlatList, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';
import Awesome from 'react-native-vector-icons/FontAwesome';
export const { height, width } = Dimensions.get('window');
import Appurl from '../API/Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToastMessage, staticImage } from "../Utils"
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '../Theme/Colors';
import { Loader } from '../Theme/Metrics';
import HomeProductEdit from '../Screens/Home/HomeProductEdit';
import HomeScreenEdit from '../Screens/Home/HomeScreenEdit';

const data = [1, 2, 3, 4, 5, 6, 7]

export default Deal = ({ navigation, route }) => {
  const [productData, setProductData] = useState([])
  const [selectedArr, setAelectedArr] = useState([]);
  const [isChanged, setIsChanged] = useState(false);
  const [dealName, setDealName] = useState('');
  const [discription, setDiscription] = useState('');
  const [dealprice, setDealprice] = useState('');
  const [dummyItemList, setDummyItemList] = useState([])
  const [selectedOne, setSelectedOne] = useState([])
  const [message, setMessage] = useState(route?.params?.message ? route?.params?.message : '')
  const [totalproductprice, setTotalproductprice] = useState('');
  const [productSelect, setProductSelect] = useState([]);
  const [loading, setLoading] = useState(false)
  const [showAddProductScreen, setShowAddProductScreen] = useState(false)

  const removeFromSelectedImage = (item, index) => {
    selectedArr.splice(index, 1)
    setIsChanged(!isChanged)
  }

  const Submit = async () => {
    const token = await AsyncStorage.getItem('token')
    if (!dealName) { showToastMessage('please fill in'); return }
    if (!discription) { showToastMessage('please fill in'); return }
    if (!dealprice) { showToastMessage('please fill in'); return }
    let Totalamount = 0
    selectedOne.forEach(e => {
      Totalamount = Totalamount + e.price
      console.log("Totalamount", Totalamount);
    })
    if (dealprice > Totalamount) { showToastMessage('Deal Price should be less than total price of selected products'); return }
    setLoading(true)
    let form = new FormData()
    form.append('title', dealName)
    form.append('description', discription)
    form.append('price', dealprice)
    console.log("deal price", form);
    if (selectedOne && selectedOne.length !== 0) {
      for (var i = 0; i < selectedOne.length; i++) {
        form.append('product', selectedOne[i].id);
      }
    }
    console.log(form);
    fetch(Appurl.deal, {
      method: 'POST',
      headers: { Authorization: `Token ${token}` },
      body: form
    }).then(res => res.json())
      .then(response => {
        if (response) { showToastMessage('Deal created') }
        setDealName('');
        setDiscription('');
        setDealprice('');
        setAelectedArr([]);
        navigation.navigate('SearchNew')
      }).catch(e => showToastMessage('Something went wrong'))
      .finally(e => setLoading(false))

  }

  const handleSearch = async (text) => {
    setSearchText(text);
    const token = await AsyncStorage.getItem('token')
    searchProduct(text, token)
      .then(response => {
        if (response) {
          let res = response.data.data
          if (res && res.length !== 0) {
            setProducts(res)
          } else setProducts(dummyItemList)
        }
      })
  }
  const renderSelectedImage = ({ item, index }) => {
    return (
      <>
        <View style={{ marginHorizontal: index > 0 ? 2 : 0, padding: 5, marginLeft: 10 }}>
          <Image source={{ uri: item?.images?.[0]?.product_images ? item?.images?.[0]?.product_images : staticImage }} style={{ width: 35, height: 30, borderRadius: 10 }} />
          <TouchableOpacity onPress={() => removeFromSelectedImage(item, index)}
            style={{ padding: 2, position: 'absolute', bottom: 2, right: 2, zIndex: 999, backgroundColor: '#000', borderRadius: 200 }}>
            <Icon name={'close'} color={'#fff'} size={10} />
          </TouchableOpacity>
        </View>
      </>
    )
  }

  if (showAddProductScreen) {
    return <HomeScreenEdit
      navigation={navigation}
      onSubmit={data => {
        console.log('selected data', data);
        setSelectedOne(data)
        setShowAddProductScreen(prev => !prev)
      }} />
  }

  return (

    <ScrollView style={styles.MainContainer}>
      {loading && <Loader />}
      {/* <View style={{ height: height, }}> */}
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

      <TextInput
        theme={{ colors: { text: "black", primary: 'black', placeholder: Colors.dark_grey } }}
        style={styles.inputboxDealPrice}
        value={dealprice}
        keyboardType={"numeric"}
        label='Enter Deal Price'
        underlineColor={Colors.transparent}
        onChangeText={setDealprice} />
      {/* <Awesome name='dollar' color='grey' size={15} /> */}

      <TouchableOpacity style={styles.button}
        onPress={() => Submit()}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>Upload</Text>
      </TouchableOpacity>
      {/* </View> */}
      {/* </View> */}
    </ScrollView>
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
    marginVertical: 8,
    fontSize: 15,
    borderBottomWidth: 1
  },
  IconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    marginHorizontal: 15,
    padding: 10,
    borderColor: 'lightgrey',
    borderRadius: 5,
    fontSize: 15,
    paddingVertical: -5,
    marginTop: 8


  },
  button: {
    alignSelf: 'center',
    backgroundColor: '#ffd700',
    paddingHorizontal: 140,
    padding: 15,
    marginTop: 90,
    borderRadius: 10

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
    justifyContent: 'space-between',
    marginHorizontal: 15,
    backgroundColor: 'white',
    height: 50,
    borderRadius: 5,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'lightgrey',
    marginTop: 17,


  }

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