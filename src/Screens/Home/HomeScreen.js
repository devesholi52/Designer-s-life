import React, { useState, useEffect, useRef } from "react";
import { FlatList, Image, RefreshControl, Pressable, Text, Button, TouchableOpacity, View, TextInput, Modal, StyleSheet, Platform, Linking } from "react-native";
import { Loader } from "../../Theme/Metrics";
import Colors from "../../Theme/Colors";
import { Rating } from "react-native-ratings";
import { Icon } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Appurl from '../../API/Constant'
import { height, width } from "../Notification/NotificationScreen";
import { getBanner, searchProduct } from "../../API";
import Fonts from "../../Theme/Fonts";
import HomeProduct from "./HomeProduct";
import IconClose from 'react-native-vector-icons/Fontisto';
import { useSelector } from "react-redux";
import { useDrawerStatus } from "@react-navigation/drawer";

const HomeScreen = ({ navigation, route }) => {
  const userData = useSelector(state => state?.user?.userData ? state.user.userData : '')
  const token = useSelector(state => state?.user?.token)
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dummyItemList, setDummyItemList] = useState([])
  const [products, setProducts] = useState([])
  const [banners, setBanners] = useState([])
  const [searchText, setSearchText] = useState('')
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const isDrawerStatus = useDrawerStatus();
  const [SelectedOne, setSelectedOne] = useState(route?.params?.SelectedOne ? route?.params?.SelectedOne : '')

  console.log("SelectedOne", SelectedOne);

  useEffect(() => {
    getProducts()
    const unsubscribe = navigation.addListener('focus', () => {
      setSearchText('')
      getProducts()
      return unsubscribe;
    })
  }, [])

  // }, [token && token !== ''])

  const get_Banner = async () => {
    const token = await AsyncStorage.getItem('token')
    getBanner(token).then(response => {
      const res = response.data
      if (res && res.results && res.results.length !== 0) {
        setBanners([...res.results])
      } else setBanners([])
    }).finally(e => setLoading(false))
  }
  // const getProducts = () => {
  //   if (!searchText) {
  //     setLoading(true)
  //     ProductListing(token).then(response => {
  //       let res = response.data
  //       console.log("res", res);
  //       if (res && res.results && res.results.length !== 0) {
  //         setProducts(prev => (res?.results))
  //       } else setProducts([])
  //     }).finally(e => {
  //       setLoading(false);
  //       setRefreshing(false)
  //     })
  //   }
  // }
  const getProducts = async () => {
    if (!searchText) {
      setLoading(true)
      const token = await AsyncStorage.getItem('token')
      console.log(token);
      fetch(Appurl.ProductListing, {
        method: 'GET',
        headers: { Authorization: `Token ${token}` },
      }).then(res => res.json())
        .then(response => {
          if (response && response.results && response.results.length !== 0) {
            setProducts(prev => (response?.results))
          }
        }).finally(e => {
          setLoading(false);
          setRefreshing(false)
        })
    }
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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getProducts();
  }, []);

  return (
    <ScrollView
      style={[{ flex: 1, backgroundColor: Colors.backgroundColor },
      ]}
    // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >

      {/* <Button title={"check deep link"}
        style
        onPress={() => {
          // Linking.openURL('https://lifeofdesigner.keycorp.in://ProductDetailScreen/130')
          Linking.openURL('lifeofdesigner://ProductDetailScreen/130')
        }}
      /> */}
      {loading && <Loader size={'small'} color={'#000'} />}
      {/* {refreshing ? <ActivityIndicator /> : null} */}
      <View style={styles.Container} >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 15, marginVertical: 10, borderRadius: 30, borderColor: Colors.searchBorderColor, borderWidth: 2, justifyContent: 'space-between' }}>
          <TextInput
            style={{ borderRadius: 30, fontSize: 12, fontFamily: Fonts.RobotoLight, paddingLeft: 18, paddingVertical: Platform.OS == 'ios' ? 10 : 5, color: Colors.grayLight }}
            placeholder={'Search By name, Type'}
            placeholderTextColor={Colors.dark_grey}
            value={searchText}
            onChangeText={value => handleSearch(value)} />
          <Icon name={'search'} style={{ marginRight: 15, }} size={18} color="grey" />
        </View>
        <FlatList
          data={products}
          renderItem={({ item, index }) => <HomeProduct
            refreshPage={() => {
              if (searchText) handleSearch(searchText)
              else getProducts()
            }}
            // refreshSearch={() => handleSearch(searchText)}
            navigation={navigation} item={item} index={index} />}
          numColumns={2}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible1}
        onRequestClose={() => {
          setModalVisible1(!modalVisible);
        }}
      >
        <View style={styles.containerModal}>
          <Text style={styles.textReview}>Review</Text>

          <Rating
            ratingCount={5}
            imageSize={16}
            style={{ alignItems: 'flex-start', margin: 10 }}
            readonly={true}
          // startingValue={item.rating}
          // onFinishRating={setRateit}
          />

          <TextInput style={styles.textinputmodal}
            placeholder='Enter review' />


          <TouchableOpacity style={styles.iconModal}
            onPress={() => setModalVisible1(false)}>
            <IconClose name="close" size={18} color={'black'} />
          </TouchableOpacity>

          <Text style={styles.DescReview}>This is a dummy box. In which we will ask the user to feed the feedback. 10 days after purchasing the product.</Text>

          <TouchableOpacity style={styles.buttonmodal} >

            <Text style={{ color: 'white', fontFamily: Fonts.RobotoMedium }}>Submit</Text>

          </TouchableOpacity>


        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.containerModal}>
          <Text style={styles.textReview}>Announcement</Text>

          <TouchableOpacity style={styles.iconModal}
            onPress={() => setModalVisible(false)}>
            <IconClose name="close" size={18} color={'black'} />
          </TouchableOpacity>

          {/* <Text style={styles.DescReview}>This is a dummy box. In which we will ask the user to feed the feedback. 10 days after purchasing the product.</Text> */}


          <Text style={{ color: 'grey', fontFamily: Fonts.RobotoRegular, fontSize: 16, marginTop: 20, marginHorizontal: 10 }}>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
            The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,
            as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web
            page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.
            Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</Text>

          {/* <TouchableOpacity style={styles.buttonmodal} >

            <Text style={{ color: 'white', fontFamily: Fonts.RobotoMedium }}>Submit</Text>

          </TouchableOpacity> */}


        </View>
      </Modal>

    </ScrollView >
  )
}

const styles = StyleSheet.create({
  Container: {

  },

  icon: {
    backgroundColor: Colors.white,
    position: 'absolute',
    right: -1,
    bottom: -1,
    borderRadius: 200,
    borderColor: Colors.grayLight,
    padding: 5,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowColor: Colors.white,
    borderWidth: 0.5,
    zIndex: 999
  },
  menu: {
    backgroundColor: 'white',
    // elevation: 3,
    position: 'absolute',
    top: 230,
    right: 50,
    width: 250,
    height: 150,
    alignSelf: 'center',


  },
  closeMenu: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  textinputmodal: {
    padding: 25,
    backgroundColor: '#eee',
    marginHorizontal: 10,
    borderRadius: 5,
    fontFamily: Fonts.RobotoMedium,
    color: 'black',
    marginVertical: 10

  },

  menubtn: {
    fontSize: 18,
    paddingVertical: 10,
    color: 'grey'
  },
  DeactivateStyle: {
    flexDirection: 'row',
    marginTop: 30
  },
  containerModal: {
    height: height / 2.2,
    width: width / 1.2,
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 10,
    top: width / 1.8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    elevation: 2
  },
  textReview: {
    fontFamily: Fonts.RobotoBold,
    fontSize: 17,
    alignSelf: 'center',
    color: 'black',
    paddingTop: 25

  },
  DescReview: {
    padding: 20,
    fontSize: 15,
    fontFamily: Fonts.RobotoMedium
  },
  iconModal: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: 8

  },
  buttonmodal: {
    backgroundColor: 'orange',
    alignSelf: 'center',
    padding: 8,
    paddingHorizontal: 35,
    borderRadius: 10,
    margin: 30,
    fontFamily: Fonts.RobotoMedium
  },
  editor: {
    backgroundColor: "black",
    borderColor: "black",
    // borderWidth: 1,
    minHeight: 200,
    // margin: 10
    // maxHeight: 600,
  },
  rich: {
    // backgroundColor: "green",

    // minHeight: 300,
    // maxHeight: 600,
    // flex: 1,
  },
  richBar: {
    height: 50,
    backgroundColor: "#F5FCFF",
    marginVertical: 10,
    marginTop: 120
  },
});
export default HomeScreen
