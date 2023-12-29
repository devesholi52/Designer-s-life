// import React, { useState } from "react";
// import { Modalize } from "react-native-modalize";
// import metrics from "../../../Theme/Metrics";
// import { FlatList, Image, PermissionsAndroid, Text, TouchableOpacity, View } from "react-native";
// import Colors from "../../../Theme/Colors";
// import { Icon } from "react-native-elements";
// import CameraRoll from "@react-native-community/cameraroll";
// const ImageGalleryModal=(props)=>{
//   const [imageArr,setImageArr]=useState([])
//   const [selectedImage,setSelectedImage]=useState([])
//   const [isChanged,setIsChanged]=useState(false)
//   const onOpenModelize=()=>{
//     console.log("open modelize")
//     checkPermissions()
//   }
//
//   const checkPermissions=()=>{
//     hasAndroidPermission().then(res=>{
//
//         if(res){
//           _getPhotos()
//         }else{
//           props.onClose()
//         }
//       })
//   }
//
//   async function hasAndroidPermission() {
//     const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
//
//     const hasPermission = await PermissionsAndroid.check(permission);
//     if (hasPermission) {
//       return true;
//     }
//
//     const status = await PermissionsAndroid.request(permission);
//     return status === 'granted';
//   }
//
//   const _getPhotos = () => {
//     CameraRoll.getPhotos({
//       first: 500,
//       assetType: 'Photos',
//     })
//       .then(r => {
//         r.edges.map(function (el) {
//           var o = Object.assign({}, el);
//           o.node.image.isSelected = false;
//           return o;
//         });
//         setImageArr(r.edges)
//
//       })
//       .catch((err) => {
//         //Error Loading Images
//       });
//
//   };
//
//   const selectItem=(item,idx)=>{
//     let selectedArr=[]
//
//     let modifiedArr=imageArr
//
//     if(item.node.image.uri===imageArr[idx].node.image.uri){
//       if(imageArr[idx].node.image.isSelected){
//         imageArr[idx].node.image.isSelected=false
//         selectedImage.forEach((elm,ind)=>{
//           if(imageArr[idx].node.image.uri===elm.uri){
//             selectedImage.splice(ind,1)
//           }
//         })
//
//       }else{
//         imageArr[idx].node.image.isSelected=true
//         if(selectedImage.length!==0){
//           selectedImage.forEach((elm,ind)=>{
//             selectedArr.push(elm)
//           })
//
//         }
//         let imageObj={
//           name:imageArr[idx].node.image.uri.replace(/^.*[\\\/]/, ''),
//           type:imageArr[idx].node.type,
//           uri:imageArr[idx].node.image.uri
//         }
//         selectedArr.push(imageObj)
//         //selectedArr.push(obj.node.image.uri)
//         setSelectedImage(selectedArr)
//
//       }
//     }
//
//     setImageArr(imageArr)
//     setIsChanged(!isChanged)
//
//   }
//
//   const PHOTOS_ITEM=({item,index})=>{
//     return(
//
//       <TouchableOpacity onPress={()=>selectItem(item,index)} style={{margin:2,borderColor:Colors.dark_grey,borderWidth:1,padding:2}}>
//         {
//           item?.node?.image?.isSelected
//             ?
//             <View style={{width:20,height:20,backgroundColor:Colors.black,position:'absolute',right:1,top:1,zIndex:1,justifyContent:'center',alignItems:'center',borderRadius:200}}>
//               <Icon name={'check'} size={10} type={'font-awesome'} color={Colors.white}/>
//             </View>
//             :
//             null
//         }
//
//         <Image source={{uri:item?.node?.image?.uri}} style={{width:(metrics.ScreenWidth-80)/3,height:100}} resizeMode={'cover'} />
//       </TouchableOpacity>
//     )
//   }
//
//   const _renderPhotos=({item,index})=>{
//     return (
//       <PHOTOS_ITEM item={item} index={index}/>
//     )
//   }
//
//   const renderHeaderComponent=()=>{
//     return(
//       <>
//         <View style={{flexDirection:'row',margin:15,justifyContent:'center',alignItems:'center'}}>
//           <Text style={{color:Colors.black,fontWeight:'bold',fontSize:16}}>Select Images</Text>
//           <TouchableOpacity onPress={props.onClose} style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
//             <Icon name={'close'} size={30}/>
//           </TouchableOpacity>
//         </View>
//         <View style={{height:1,backgroundColor:Colors.settings_seprator,marginVertical:5,}}/>
//       </>
//     )
//   }
//
//   const renderFooterComponent=()=>{
//     return(
//       <View style={{margin:15,justifyContent: 'flex-end',backgroundColor:'red'}}>
//         <TouchableOpacity  style={{backgroundColor:Colors.black,justifyContent:'center',alignItems:'center',paddingVertical:10,borderRadius:5}}>
//           <Text style={{color:Colors.white,fontWeight:'bold'}}>Save</Text>
//         </TouchableOpacity>
//       </View>
//     )
//   }
//
//   return(
//     <>
//       <Modalize
//         onOpen={onOpenModelize}
//         ref={props.reference}
//         modalHeight={metrics.ScreenHeight*0.6}
//         withHandle={false}
//         HeaderComponent={renderHeaderComponent}
//         FooterComponent={renderFooterComponent}
//
//       >
//         <View style={{justifyContent:'center',alignItems:'center'}}>
//           <FlatList
//             data={imageArr}
//             renderItem={_renderPhotos}
//             numColumns={3}
//             showsVerticalScrollIndicator={false}
//             keyExtractor={(item,index) => index}
//             extraData={selectedImage}
//           />
//         </View>
//
//
//       </Modalize>
//     </>
//   )
// }
// export default ImageGalleryModal




import React, { useState } from "react";
import { FlatList, Image, Modal, PermissionsAndroid, Text, TouchableOpacity, View } from "react-native";
import Colors from "../../../Theme/Colors";
import metrics from "../../../Theme/Metrics";
import { Icon } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import CameraRoll from "@react-native-community/cameraroll";
import Fonts from "../../../Theme/Fonts";
const ImageGalleryModal = (props) => {
  const [imageArr, setImageArr] = useState([])
  const [photos, setPhotos] = useState([])
  const [selectedImage, setSelectedImage] = useState([])
  const [isChanged, setIsChanged] = useState(false)
  useFocusEffect(
    React.useCallback(() => {

      hasAndroidPermission().then(res => {

        if (res) {
          _getPhotos()
        } else {
          props.onClose()
        }
      })
    }, [props.visible])
  )

  async function hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }

  function printUncommon(arr1, arr2, n1, n2) {
    //arr1.sort();                      // Sort both the arrays
    //arr2.sort();
    // arr1.sort((a,b)=>a.node.timestamp-b.node.timestamp)
    // arr2.sort((a,b)=>a.node.timestamp-b.node.timestamp)
    arr1.sort((a, b) => b.node.timestamp - a.node.timestamp)
    arr2.sort((a, b) => b.node.timestamp - a.node.timestamp)
    let i = 0, j = 0, k = 0, tempArr = [];
    while (i < n1 && j < n2) {

      // If not common, print smaller
      if (arr1[i].id < arr2[j].id) {
        tempArr.push(arr1[i])
        i++;
        k++;
      }
      else if (arr2[j].id < arr1[i].id) {
        tempArr.push(arr2[j])
        k++;
        j++;
      }

      // Skip common element
      else {
        i++;
        j++;
      }
    }

    // printing remaining elements
    while (i < n1) {
      tempArr.push(arr1[i])
      i++;
      k++;
    }
    while (j < n2) {
      tempArr.push(arr2[j])
      j++;
      k++;
    }
    return tempArr
  }

  function printCommon(arr1, arr2, n1, n2) {
    //arr1.sort();                      // Sort both the arrays
    //arr2.sort();
    // arr1.sort((a,b)=>a.node.timestamp-b.node.timestamp)
    // arr2.sort((a,b)=>a.node.timestamp-b.node.timestamp)
    arr1.sort((a, b) => b.node.timestamp - a.node.timestamp)
    arr2.sort((a, b) => b.node.timestamp - a.node.timestamp)
    var common = [];                  // Array to contain common elements
    var i = 0, j = 0;                 // i points to arr1 and j to arr2
    // Break if one of them runs out
    while (i < n1 && j < n2) {

      if (arr1[i].id == arr2[j].id) {        // If both are same, add it to result

        arr2[j].isAlreadyAdded = true
        arr2[j].isAddedFromClient = true
        common.push(arr2[j]);
        i++;
        j++;
      }
      else if (arr1[i].id < arr2[j].id) {  // Increment the smaller value so that
        i++;                        // it could be matched with the larger
      }                             // element
      else {
        j++;
      }
    }

    return common;
  }

  const _getPhotos = () => {
    CameraRoll.getPhotos({
      first: 500,
      assetType: 'Photos',
    })
      .then(r => {
        let modifiedResult = r.edges.map(function (el, index) {
          var o = Object.assign({}, el);
          o.id = index
          //o.node.image.isSelected = false;
          return o;
        });
        let unCommon = [];
        let common = [];
        unCommon = printUncommon(selectedImage, modifiedResult, selectedImage.length, modifiedResult.length)
        common = printCommon(selectedImage, modifiedResult, selectedImage.length, modifiedResult.length)
        let modifiedCommon = common.map(function (el, index) {
          var o = Object.assign({}, el);
          o.node.image.isSelected = true;
          return o;
        });
        let modifiedUncommon = unCommon.map(function (el, index) {
          var o = Object.assign({}, el);
          o.node.image.isSelected = false;
          return o;
        });

        setImageArr([...modifiedCommon, ...modifiedUncommon])

      })
      .catch((err) => {
        console.log(err)
        //Error Loading Images
      });

  };

  const selectItem = (item, idx) => {
    let selectedArr = []

    let modifiedArr = imageArr

    if (item.node.image.uri === imageArr[idx].node.image.uri) {
      if (imageArr[idx].node.image.isSelected) {
        imageArr[idx].node.image.isSelected = false
        selectedImage.forEach((elm, ind) => {
          if (imageArr[idx].node.image.uri === elm.node.image.uri) {
            selectedImage.splice(ind, 1)
          }
        })

      } else {
        imageArr[idx].node.image.isSelected = true
        if (selectedImage.length !== 0) {
          selectedImage.forEach((elm, ind) => {
            selectedArr.push(elm)
          })

        }
        let imageObj = {
          name: imageArr[idx].node.image.uri.replace(/^.*[\\\/]/, ''),
          type: imageArr[idx].node.type,
          uri: imageArr[idx].node.image.uri
        }
        //selectedArr.push(imageObj)
        selectedArr.push(imageArr[idx])
        //selectedArr.push(obj.node.image.uri)
        setSelectedImage(selectedArr)

      }
    }

    setImageArr(imageArr)
    setIsChanged(!isChanged)

  }

  const PHOTOS_ITEM = ({ item, index }) => {
    return (

      <TouchableOpacity onPress={() => selectItem(item, index)} style={{ margin: 2, borderColor: Colors.dark_grey, borderWidth: 1, padding: 2 }}>
        {
          item?.node?.image?.isSelected
            ?
            <View style={{ width: 20, height: 20, backgroundColor: Colors.black, position: 'absolute', right: 1, top: 1, zIndex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 200 }}>
              <Icon name={'check'} size={10} type={'font-awesome'} color={Colors.white} />
            </View>
            :
            null
        }

        <Image source={{ uri: item?.node?.image?.uri }} style={{ width: (metrics.ScreenWidth - 80) / 3, height: 100 }} resizeMode={'cover'} />
      </TouchableOpacity>
    )
  }

  const _renderPhotos = ({ item, index }) => {
    return (
      <PHOTOS_ITEM item={item} index={index} />
    )
  }



  const onSave = () => {
    //props.onSelectImageFromImageGallery([])
    props.onSelectImageFromImageGallery(selectedImage)
    props.onClose()
  }

  return (
    <Modal
      visible={props.visible}
      animationType={"fade"}
      transparent={true}
      style={{ justifyContent: 'center', alignItems: 'center' }}
    >
      <View style={{
        justifyContent: 'center',
        backgroundColor: "rgba(0,0,0,0.3)",
        height: metrics.ScreenHeight,
      }}>
        <View style={{ height: metrics.ScreenHeight / 1.1, borderRadius: 10, alignSelf: "center", backgroundColor: Colors.white, paddingVertical: 5, paddingHorizontal: 10, }}>
          <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
            <Icon onPress={props.onClose} size={20} name="closecircle" type="antdesign" color={Colors.black} />
          </View>
          <View style={{ flex: 10, padding: 5, justifyContent: 'center', alignItems: 'center' }}>
            <FlatList
              data={imageArr}
              renderItem={_renderPhotos}
              numColumns={3}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index}
              extraData={selectedImage}
            />
          </View>
          <View style={{ flex: 1, marginVertical: 5, justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => onSave()} style={{ backgroundColor: Colors.black, justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderRadius: 5 }}>
              <Text style={{ color: Colors.white, fontFamily: Fonts.RobotoBold }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

    </Modal>
  )
}
export default ImageGalleryModal
