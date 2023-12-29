import React, { useEffect, useRef, useState } from "react";
import Headers from "../Components/Headers/Headers";
import {
  Alert, FlatList, Image, Pressable, ScrollView, StyleSheet, Text,
  TouchableOpacity, View, ActivityIndicator
} from "react-native";
import { TextInput } from "react-native-paper";
import Colors from "../Theme/Colors";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { Icon } from "react-native-elements";
import Fonts from "../Theme/Fonts";
import Appurl from '../API/Constant';
import { width } from "./Deal";
import { fromPairs } from "lodash";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colorsArr, discount, showToastMessage, staticImage, } from '../Utils'
import { Loader } from "../Theme/Metrics";
import { VideoPreview } from "../Components/VideoPreview";
import { discountValidation } from "../helper";
const options = {
  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const UploadProductScreen = ({ navigation }) => {
  const imageGallery_modalizeRef = useRef()
  const videoRef = useRef()

  const [loading, setLoading] = useState(false)
  const [productName, setProductName] = useState('')
  const [discription, setDiscription] = useState('')
  const [price, setPrice] = useState('')
  const [discount, setDiscount] = useState('')
  const [isSizeFocus, setIsSizeFocus] = useState(false)
  const [size, setSize] = useState([])
  const [valueSize, setSizeValue] = useState([])
  const [isColorFocus, setIsColorFocus] = useState(false)
  const [valueColor, setColorValue] = useState(null)
  const [isDiscountFocus, setIsDiscountFocus] = useState(false)
  const [valueDiscount, setDiscountValue] = useState(null)
  const [visibleImageGallery, setVisibleImageGallery] = useState(false)
  const [selectedImageArr, setSelectedImageArr] = useState([])
  const [selectedVideoArr, setSelectedVideoArr] = useState([])
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


  useEffect(() => {
    getSize()
  }, [])

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

  const removeFromSelectedImage = (item, index) => {
    selectedImageArr.splice(index, 1)
    setIsChanged(!isChanged)
  }
  const removeFromSelectedVideo = (item, index) => {
    // videoFile.splice(index, 1)
    // setIsChanged(!isChanged)
    setVideoFile([])
  }

  const renderSelectedImage = ({ item, index }) => {
    return (
      <>
        <View style={{ marginHorizontal: index > 0 ? 2 : 0, padding: 5 }}>
          <Image source={item} style={{ width: 50, height: 50, borderRadius: 10 }} />
          <TouchableOpacity onPress={() => removeFromSelectedImage(item, index)} style={{ padding: 2, position: 'absolute', bottom: 2, right: 2, zIndex: 999, backgroundColor: Colors.black, borderRadius: 200 }}>
            <Icon name={'close'} color={Colors.white} size={10} />
          </TouchableOpacity>
        </View>
      </>
    )
  }

  const renderSelectedVideo = ({ item, index }) => {
    return (
      <>
        <View style={{ marginHorizontal: index > 0 ? 2 : 0, padding: 5 }}>
          {/* <Image source={item?.value ? item?.value : staticImage} style={{ width: 50, height: 50, borderRadius: 10 }} /> */}
          <TouchableOpacity
            style={styles.playVideoView}
            onPress={() =>
              setIsVideoPreview({
                value: true,
                videoUrl: `${videoFile[0]?.value?.uri}`,
              })
            }>
            <Image
              source={require('../Assets/playIcon.jpg')}
              style={{ width: 38, height: 38, opacity: 0.5 }}
            />
          </TouchableOpacity>
          <Icon name={'close'} color={Colors.white} size={10} />
          <TouchableOpacity onPress={() => removeFromSelectedVideo(item, index)} style={{ padding: 2, position: 'absolute', bottom: 2, right: 2, zIndex: 999, backgroundColor: Colors.black, borderRadius: 200 }}>
            <Icon name={'close'} color={Colors.white} size={10} />
          </TouchableOpacity>
        </View>
      </>
    )
  }
  const Submit = async () => {
    if (!productName) { showToastMessage('please fill in'); return }
    if (!discription) { showToastMessage('please fill in'); return }
    if (!price) { showToastMessage('please fill in'); return }
    if (!valueColor) { showToastMessage('please fill in'); return }
    if (!valueSize) { showToastMessage('please fill in'); return }
    if (!discountValidation(discount)) {
      showToastMessage("Discount ℅ should be less than total price of product"); return
    }
    // if (!cover.value) { showToastMessage('please fill in'); return }
    // if (! videoFile.value) { showToastMessage('please fill in'); return }
    setLoading(true)
    const token = await AsyncStorage.getItem('token')
    let form = new FormData()
    form.append('product_name', productName || '')
    form.append('description', discription || '')
    form.append('color', valueColor || '')
    if (valueSize && valueSize.length !== 0) {
      for (var i = 0; i < valueSize.length; i++) {
        form.append('size', valueSize[i]);
      }
    }
    form.append('price', price || '')
    form.append('discount', discount || '')
    form.append('user_type', 'seller')
    if (selectedImageArr && selectedImageArr.length !== 0) {
      for (var i = 0; i < selectedImageArr.length; i++) {
        form.append('product_images', selectedImageArr[i]);
      }
    }
    if (cover.value) form.append('image', cover.value)
    if (videoFile && videoFile.length !== 0) form.append('product_images', videoFile[0].value)
    fetch(Appurl.Product, {
      method: 'POST',
      headers: { Authorization: `Token ${token}` },
      body: form
    }).then(res => { console.log('response jjjjj', res); return res.json() })
      .then(response => {
        if (response && response.data && response.data.id) {
          showToastMessage('Successfully uploaded')
          setProductName('');
          setDiscription('');
          setPrice('');
          setDiscount('');
          setSizeValue('');
          setColorValue('');
          setSelectedImageArr([]);
          setVideoFile('');
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
          // console.log('d', d);
          if (single) setCover({ value: d });
          else setSelectedImageArr([...selectedImageArr, d])
        }
      });
    }
    if (type == 'launchImageLibrary') {
      launchImageLibrary(options, async (response) => {
        console.log('Response = ', response);

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
          else setSelectedImageArr([...selectedImageArr, d])
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
        {loading && <Loader />}
        <View>
          <TextInput
            style={styles.textInputStyle}
            placeholderTextColor={Colors.dark_grey}
            label='Enter product name'
            underlineColor={Colors.transparent}
            theme={{ colors: { text: "black", primary: "black", placeholder: Colors.dark_grey } }}
            value={productName}
            onChangeText={setProductName} />

          <TextInput
            style={styles.textInputStyle}
            theme={{ colors: { text: "black", primary: 'black', placeholder: Colors.dark_grey } }}
            placeholderTextColor={Colors.dark_grey}
            value={discription}
            underlineColor={Colors.transparent}
            label='Short Description'
            multiline={true}
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
            searchPlaceholder=""
            value={valueColor}
            renderItem={(item) =>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ height: 20, width: 20, padding: 10, margin: 15, backgroundColor: item.value, borderWidth: 0.5, borderColor: Colors.dark_grey }} />
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
            searchPlaceholder=""
            value={valueSize}
            onFocus={() => setIsSizeFocus(true)}
            onBlur={() => setIsSizeFocus(false)}
            onChange={item => {
              setSizeValue(item); setIsSizeFocus(false);
            }}
          />

          <TextInput
            style={{ height: 50, borderColor: 'lightgrey', borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderRadius: 5, marginVertical: 10, fontFamily: Fonts.RobotoRegular, backgroundColor: 'white', borderBottomWidth: 1, }}
            theme={{ colors: { text: "black", primary: 'black', placeholder: Colors.dark_grey } }}
            placeholderTextColor={Colors.dark_grey}
            value={price}
            keyboardType="numeric"
            label='Enter Price'
            multiline={true}
            underlineColor={Colors.transparent}
            onChangeText={setPrice} />


          <TextInput
            style={{ height: 50, borderColor: 'lightgrey', borderTopWidth: 1, borderRightWidth: 1, borderLeftWidth: 1, borderRadius: 5, marginVertical: 10, fontFamily: Fonts.RobotoRegular, backgroundColor: 'white', borderBottomWidth: 1, }}
            theme={{ colors: { text: "black", primary: 'black', placeholder: Colors.dark_grey } }}
            placeholderTextColor={Colors.dark_grey}
            value={discount}
            label='Discount%'
            multiline={true}
            underlineColor={Colors.transparent}
            keyboardType={"numeric"}
            onChangeText={setDiscount} />


          {/* <View>
              <Pressable onPress={() => handleImagePicker('single')}
                style={{
                  justifyContent: 'center', marginVertical: 10, flexDirection: 'row', alignItems: 'center',
                  borderColor: 'lightgrey', borderWidth: 1, borderRadius: 5, elevation: 2, backgroundColor: 'white'
                }}>
                <Text style={{ height: 55, flex: 1, fontFamily: Fonts.RobotoRegular, paddingLeft: 10, paddingTop: 17 }}>Upload Image</Text>
                <Icon name={'attachment'} type={'material-community'} color={Colors.grayLight} />
              </Pressable>
            </View> */}
          <View>
            <Pressable onPress={handleImagePicker}
              style={styles.uploadImgBtn}>
              <Text style={{ flex: 1, fontFamily: Fonts.RobotoRegular, padding: 10, color: Colors.dark_grey }}>Upload Images</Text>
              <TouchableOpacity style={{ marginRight: 10 }}>
                <Icon name={'attachment'} type={'material-community'} color={Colors.grayLight} />
              </TouchableOpacity>
            </Pressable>
            <FlatList
              data={selectedImageArr}
              renderItem={renderSelectedImage}
              horizontal={true} />
          </View>

          <Pressable onPress={() => picimage('video')}
            // style={styles.uploadImgBtn}>
            style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 10, flexDirection: 'row', borderColor: 'lightgrey', borderWidth: 1, backgroundColor: 'white', height: 45, borderRadius: 5, }}>
            <Text style={{ flex: 1, fontFamily: Fonts.RobotoRegular, paddingLeft: 10, color: Colors.dark_grey }}>Upload Video</Text>
            <TouchableOpacity style={{ marginRight: 10 }}>
              <Icon name={'attachment'} type={'material-community'} color={Colors.grayLight} />
            </TouchableOpacity>
          </Pressable>
          <FlatList
            data={videoFile}
            renderItem={renderSelectedVideo}
            horizontal={true}
          />
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
            <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold }}>Upload</Text>
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
  textInputStyle: {
    height: 50,
    borderColor: 'lightgrey',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    fontFamily: Fonts.RobotoRegular,
    backgroundColor: 'white',
    borderBottomWidth: 1,

  },
  uploadImgBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    flexDirection: 'row',
    height: 45,
    borderColor: 'lightgrey',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white'
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
    color: '#000'
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
  },
  playVideoView: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(189, 189, 189,1)',
    backgroundColor: 'rgba(250, 250, 250,0.5)',
    borderStyle: 'dashed',
  },
})
export default UploadProductScreen
