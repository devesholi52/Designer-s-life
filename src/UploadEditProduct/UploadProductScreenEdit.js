import React, { useRef, useState, useEffect } from "react";
import Headers from "../Components/Headers/Headers";
import {
  Alert, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator
} from "react-native";
import { TextInput } from "react-native-paper";
import Colors from "../Theme/Colors";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { Icon } from "react-native-elements";
import Fonts from "../Theme/Fonts";
import Appurl from '../API/Constant';
import { width } from "./Deal";
import { fromPairs } from "lodash";
import { useSelector } from 'react-redux';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colorsArr, discount, get_url_extension, showToastMessage, size, staticImage } from '../Utils'
import { editProduct } from "../API";
import { VideoPreview } from "../Components/VideoPreview";
import { discountValidation } from "../helper";
const options = {
  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const UploadProductScreenEdit = ({ route, navigation }) => {
  const imageGallery_modalizeRef = useRef()
  const videoRef = useRef()
  const userData = useSelector(state => state?.user?.userData ? state.user.userData : '')
  const token = useSelector(state => state?.user?.token)
  const [userIDD, setUserId] = useState(route?.params?.IDofUser ? route?.params?.IDofUser : '');
  const [loading, setLoading] = useState(false)
  const [productName, setProductName] = useState('')
  const [discription, setDiscription] = useState('')
  const [price, setPrice] = useState('')
  const [discount, setDiscount] = useState('')
  const [isSizeFocus, setIsSizeFocus] = useState(false)
  const [size, setSize] = useState([])
  const [getData, setGetData] = useState([])
  const [valueSize, setSizeValue] = useState([])
  const [isColorFocus, setIsColorFocus] = useState(false)
  const [valueColor, setColorValue] = useState(null)
  const [selectedImageArr, setSelectedImageArr] = useState([])
  const [isChanged, setIsChanged] = useState(false)
  const [cover, setCover] = useState({
    value: null,
    error: ''
  })
  const [videoFile, setVideoFile] = useState([])
  const [visibleVideoGallery, setVisibleVideoGallery] = useState(false)
  const [isVideoPreview, setIsVideoPreview] = useState({
    value: false,
    videoUrl: '',
  });

  const [dynamicVideos, setDynamicVideos] = useState([])
  const [dynamicImages, setDynamicImages] = useState([])

  const getSize = async () => {
    const token = await AsyncStorage.getItem('token')
    fetch(Appurl.GET_SIZE_WHILE_UPLOAD, {
      method: 'GET',
      headers: { Authorization: `Token ${token}` },
    }).then(res => res.json())
      .then(response => {
        let data = []
        if (response && response.results) {
          response.results.forEach(item => {
            let localData = { label: item.size, value: item.id }
            data.push(localData)
          });
          setSize(data)
        }
      }).catch(e => showToastMessage('Something went wrong'))
      .finally(e => setLoading(false))
  }

  const removeSelectedImage = (item, index, type) => {
    if (type === 'dynamic') {
      // selectedImageArr.splice(index, 1)
      // setIsChanged(!isChanged)
      showToastMessage("You need to select an image ")
    }
    else {
      let arr = selectedImageArr
      arr.splice(index, 1)
      setSelectedImageArr([...arr])
    }
  }
  const removeSelectedVideo = (item, index, type) => {
    if (type === 'dynamic') {
      // videoFile.splice(index, 1)
      // setIsChanged(!isChanged)
      showToastMessage("You need to select a video ")
    }
    else {
      let arr = videoFile
      arr.splice(index, 1)
      setVideoFile([...arr])
    }
  }
  const renderSelectedImage = (item, index, type) => {
    return (
      <>
        <View style={{ marginHorizontal: index > 0 ? 2 : 0, padding: 5 }}>
          <Image source={{ uri: type === 'dynamic' ? item?.product_images : item?.uri }}
            style={{ width: 50, height: 50, borderRadius: 10 }} />
          {type !== 'dynamic' &&
            <TouchableOpacity onPress={() => removeSelectedImage(item, index, type)}
              style={{ padding: 2, position: 'absolute', bottom: 2, right: 2, zIndex: 999, backgroundColor: Colors.black, borderRadius: 200 }}>
              <Icon name={'close'} color={Colors.white} size={10} />
            </TouchableOpacity>}
        </View>
      </>
    )
  }
  const renderSelectedVideo = (item, index, type) => {
    return (
      <View style={{ marginHorizontal: index > 0 ? 2 : 0, padding: 5 }}>
        <TouchableOpacity
          style={styles.playVideoView}
          onPress={() =>
            setIsVideoPreview({
              value: true,
              videoUrl: type === 'dynamic' ? `${item?.product_images}` : `${item?.value?.uri}`,
            })
          }>
          <Image source={require('../Assets/playIcon.jpg')}
            style={{ width: 38, height: 38, opacity: 0.5 }} />
        </TouchableOpacity>
        {type !== 'dynamic' &&
          <TouchableOpacity onPress={() => { removeSelectedVideo(item, index, type) }}
            style={{ padding: 2, position: 'absolute', bottom: 2, right: 2, zIndex: 999, backgroundColor: Colors.black, borderRadius: 200 }}>
            <Icon name={'close'} color={Colors.white} size={10} />
          </TouchableOpacity>}
      </View>
    )
  }
  useEffect(() => {
    getProductDetail()
    getSize()
  }, [])
  const getProductDetail = async () => {
    fetch(`${Appurl.ProductListingEdit}${userIDD}`, {
      method: 'GET',
      headers: { Authorization: `Token ${token}` },
    }).then(res => res.json())
      .then(response => {
        let res = response?.results?.[0]
        if (res) {
          let images = []; let videos = []
          // setGetData(response?.results?.[0])
          setProductName(res?.product_name);
          setDiscription(res?.description);
          setPrice(JSON.stringify(res?.price));
          setDiscount(JSON.stringify(res?.discount));
          if (res) {
            let data = []
            res?.size?.forEach((item, index) => {
              data.push(index + 1)
            });
            setSizeValue(data)
          }
          setColorValue(res?.color);
          if (res?.images) {
            res?.images.forEach(e => {
              if (get_url_extension(e?.product_images) == 'mp4') videos.push(e)
              else images.push(e)
            })
            setDynamicVideos(videos)
            setDynamicImages(images)
          }
        }
      }).catch(e => showToastMessage('Something went wrong'))
      .finally(e => setLoading(false))
  }
  const Submit = async () => {
    if (!productName) { showToastMessage('please fill in'); return }
    if (!discription) { showToastMessage('please fill in'); return }
    if (!price) { showToastMessage('please fill in'); return }
    if (!valueColor) { showToastMessage('please fill in'); return }
    if (!valueSize) { showToastMessage('please fill in'); return }
    // if (!selectedImageArr) { showToastMessage('please fill in'); return }
    // if (!videoFile) { showToastMessage('please fill in'); return }
    setLoading(true)
    let form = new FormData()
    form.append('product_name', productName || '')
    form.append('description', discription || '')
    form.append('color', valueColor || '')
    // form.append('product_size', valueSize || '')
    if (valueSize && valueSize.length !== 0) {
      for (var i = 0; i < valueSize.length; i++) {
        form.append('size', valueSize[i]);
      }
    }
    form.append('price', price || '')
    form.append('discount', discount || '')
    if (!discountValidation(discount)) {
      showToastMessage("Discount ℅ should be less than total price of product"); return
    }
    form.append('user_type', 'seller')
    if (selectedImageArr && selectedImageArr.length !== 0) {
      for (var i = 0; i < selectedImageArr.length; i++) {
        form.append('product_images', selectedImageArr[i]);
      }
    }
    // if (cover.value) form.append('image', cover.value)
    if (videoFile && videoFile.length !== 0) form.append('product_images', videoFile[0].value)
    fetch(`${Appurl.Product}${userIDD}/`, {
      method: 'PUT',
      headers: { Authorization: `Token ${token}` },
      body: form
    }).then(res => { return res.json() })
      .then(response => {
        if (response && response.data && response.data.id) {
          showToastMessage('Product updated successfully ')
          setProductName('');
          setDiscription('');
          setPrice('');
          setSizeValue('');
          setColorValue('');
          setDiscount('');
          setSelectedImageArr([]);
          setVideoFile([])
          navigation.navigate('HomeScreen')
        }
      }).catch(e => showToastMessage('Something went wrong'))
      .finally(e => setLoading(false))
  }

  const picVideo = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.video],
      });
      let data = { uri: res.uri, type: res.type, name: res.name, }
      // setVideoTitle(res.name)
      setVideoFile(res)
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }
  const picimage = (type, single = false) => {
    if (type == 'openCamera') {
      launchCamera(options, async (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          const source = { uri: response.uri };
          let result = response.assets[0]
          var d = { name: result.fileName, type: result.type, uri: result.uri, };
          if (single) setCover({ value: d });
          else {
            setSelectedImageArr([...selectedImageArr, d])
          }


        }
      });
    }
    if (type == 'launchImageLibrary') {
      launchImageLibrary(options, async (response) => {
        // console.log('Response = ', response);
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          const source = { uri: response.uri };
          let result = response.assets[0]
          var d = { name: result.fileName, type: result.type, uri: result.uri, };
          if (single) setCover({ value: d });
          else {
            console.log('ddddddddd:::', d)
            console.log('selectedImageArrrrrrrrrrrrr', selectedImageArr)
            setSelectedImageArr([...selectedImageArr, d])
            console.log('LN 247:::', selectedImageArr)
          }
        }
      });
    }
    if (type == 'video') {
      launchImageLibrary({ mediaType: 'video', /* includeBase64: true */ }, async (response) => {
        // console.log('Response = ', response);
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          const source = { uri: response.uri };
          let result = response.assets[0]
          var d = { name: result.fileName, type: result.type, uri: result.uri, };
          // setVideoFile({ value: d });
          setVideoFile([{ value: d }]);
        }
      });
    }
  }
  const handleImagePicker = (type) => {
    Alert.alert(
      'PLEASE CHOOSE IMAGE SOURCE !',
      '',
      [{ text: 'cancel', onPress: () => console.log('canceled'), style: 'cancel' },
      { text: "Open Camera", onPress: () => { picimage('openCamera', type == 'single' ? true : false) } },
      { text: "Launch Image Library", onPress: () => { picimage('launchImageLibrary', type == 'single' ? true : false) } }],
      { cancelable: false });
  }
  return (
    <>
      <ScrollView style={styles.mainContainer}>
        {loading && <ActivityIndicator size={'large'} color="blue" />}
        <View>
          <TextInput
            style={styles.inputProductName}
            placeholderTextColor={Colors.dark_grey}
            label='Enter product name'
            theme={{ colors: { text: "black", primary: 'black', placeholder: Colors.dark_grey } }}
            value={productName}
            underlineColor={Colors.transparent}
            onChangeText={setProductName} />

          <TextInput
            style={styles.inputDiscription}
            theme={{ colors: { text: "black", primary: 'black', placeholder: Colors.dark_grey } }}
            placeholderTextColor={Colors.dark_grey}
            value={discription}
            label='Short Description'
            multiline={true}
            underlineColor={Colors.transparent}
            onChangeText={setDiscription} />

          <Dropdown
            style={[
              styles.dropdown,
              isColorFocus && { borderColor: 'black' },
            ]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={colorsArr}
            search={false}
            // maxHeight={00}
            labelField="label"
            valueField="value"
            placeholder={'Color'}
            value={valueColor}
            renderItem={(item) =>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ height: 20, width: 20, padding: 10, margin: 15, backgroundColor: item.value, borderWidth: 0.5, borderColor: Colors.dark_grey, }} />
                <Text style={{ fontFamily: Fonts.RobotoRegular }}>{item?.label}</Text>
              </View>
            }
            onFocus={() => setIsColorFocus(true)}
            onBlur={() => setIsColorFocus(false)}
            onChange={item => {
              setColorValue(item.value);
              setIsColorFocus(false);
            }} />

          <MultiSelect
            style={[
              styles.dropdown,
              isSizeFocus && { borderColor: 'black' },
            ]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={size}
            search={false}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={'Select Size'}
            value={valueSize}
            onFocus={() => setIsSizeFocus(true)}
            onBlur={() => setIsSizeFocus(false)}
            onChange={item => {
              setSizeValue(item);
              setIsSizeFocus(false);
            }} />

          <TextInput
            style={styles.inputPrice}
            theme={{ colors: { text: "black", primary: 'black', placeholder: Colors.dark_grey } }}
            placeholderTextColor={Colors.dark_grey}
            value={price}
            keyboardType="numeric"
            label='Enter Price'
            multiline={true}
            underlineColor={Colors.transparent}
            onChangeText={setPrice} />


          <TextInput
            style={styles.inputDiscount}
            theme={{ colors: { text: "black", primary: 'black', placeholder: Colors.dark_grey } }}
            placeholderTextColor={Colors.dark_grey}
            value={discount}
            label='Discount%'
            keyboardType={"numeric"}
            multiline={true}
            underlineColor={Colors.transparent}
            onChangeText={val => setDiscount(val)} />

          <View>
            <Pressable onPress={handleImagePicker}
              style={styles.inputImage}>
              <Text style={{ flex: 1, fontFamily: Fonts.RobotoRegular, padding: 10, color: Colors.dark_grey }}>Upload Images</Text>
              <Icon name={'attachment'} type={'material-community'} color={Colors.grayLight} style={{ paddingRight: 7 }} />
            </Pressable>
            {selectedImageArr && selectedImageArr.length !== 0 ?
              <FlatList
                data={selectedImageArr}
                renderItem={({ item, index }) => renderSelectedImage(item, index, 'local')}
                horizontal={true} /> : <FlatList
                data={dynamicImages}
                renderItem={({ item, index }) => renderSelectedImage(item, index, 'dynamic')}
                horizontal={true} />}
          </View>

          <Pressable onPress={() => {
            picimage('video')
          }}
            style={styles.inputVideo}>
            <Text style={{ flex: 1, fontFamily: Fonts.RobotoRegular, paddingLeft: 10, color: Colors.dark_grey }}>
              Upload Video</Text>
            <Icon name={'attachment'}
              type={'material-community'}
              color={Colors.grayLight}
              style={{ paddingRight: 7 }} />
          </Pressable>

          {videoFile && videoFile.length !== 0 ?
            <FlatList
              data={videoFile}
              renderItem={({ item, index }) => renderSelectedVideo(item, index, 'local')}
              horizontal={true}
            /> : <FlatList
              data={dynamicVideos}
              renderItem={({ item, index }) => renderSelectedVideo(item, index, 'dynamic')}
              horizontal={true}
            />}
        </View>
        <VideoPreview
          ref={videoRef}
          onPressHeader={() => setIsVideoPreview({ value: false, videoUrl: '' })}
          onRequestClose={() => setIsVideoPreview({ value: false, videoUrl: '' })}
          url={isVideoPreview.videoUrl}
          videoThumbnail={`${isVideoPreview.videoUrl}`}
          visible={isVideoPreview.value}
        />

        <View style={{ flex: 2, justifyContent: 'center', backgroundColor: Colors.white, paddingVertical: 5 }}>
          <TouchableOpacity disabled={loading ? true : false}
            style={{ backgroundColor: Colors.primaryYellow, alignItems: 'center', paddingVertical: 15, borderRadius: 10, marginHorizontal: 20, marginVertical: 45 }}
            onPress={() => Submit()}>
            <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold }}>Update</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  )
}
const styles = StyleSheet.create({
  mainContainer: {
    marginVertical: 2,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flex: 1,
    backgroundColor: Colors.white
  },
  dropdown: {
    height: 50,
    borderColor: 'lightgrey',
    borderRadius: 5,
    borderWidth: 1,
    marginVertical: 10,
    paddingLeft: 6,
    backgroundColor: 'white'
  },
  placeholderStyle: {
    fontSize: 14,
    color: Colors.dark_grey,
    paddingHorizontal: 5,
  },
  selectedTextStyle: {
    fontSize: 14,
    color: Colors.black
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
  },
  inputProductName: {
    height: 50,
    borderColor: 'lightgrey',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    fontFamily: Fonts.RobotoRegular,
    backgroundColor: 'white'
  },
  inputDiscription: {
    height: 50,
    borderColor: 'lightgrey',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    fontFamily: Fonts.RobotoRegular,
    backgroundColor: 'white'
  },
  inputPrice: {
    height: 50,
    borderColor: 'lightgrey',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    fontFamily: Fonts.RobotoRegular,
    backgroundColor: 'white'
  },

  inputDiscount: {
    height: 50,
    borderColor: 'lightgrey',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    fontFamily: Fonts.RobotoRegular,
    backgroundColor: 'white'
  },
  inputImage: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
    height: 45,
    borderColor: 'lightgrey',
    borderWidth: 1,
    borderRadius: 5,
    height: 50,
    backgroundColor: 'white'
  },
  inputVideo: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
    borderColor: 'lightgrey',
    borderWidth: 1,
    backgroundColor: 'white',
    height: 50,
    borderRadius: 5,
  },
  playVideoView: {
    backgroundColor: 'rgba(238, 238, 238,0.5)',
    borderRadius: 3
  }
})
export default UploadProductScreenEdit













