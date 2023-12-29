import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Modal, Pressable, ActivityIndicator, } from "react-native";
import Headers from "../../Components/Headers/Headers";
import Colors from "../../Theme/Colors";
import { Avatar, Icon, Image } from "react-native-elements";
import { TextInput } from "react-native-paper";
import Fonts from "../../Theme/Fonts";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import User from 'react-native-vector-icons/AntDesign';
import Icons from 'react-native-vector-icons/AntDesign'
import Appurl from '../../API/Constant';
import { height, width } from "../Notification/NotificationScreen";
import IconClose from 'react-native-vector-icons/Fontisto';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useSelector, useDispatch } from 'react-redux'
import { getProfile } from '../../API/index'
import { convertLocalUpperCase, showToastMessage, staticImage } from "../../Utils";
import { setUserInfo } from "../../redux/reducers/userReducer";
import { mobileValidation } from "../../helper";
import { Loader } from "../../Theme/Metrics";


const ProfileScreen = () => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const userData = useSelector(state => state?.user?.userData ? state.user.userData : '')
  const token = useSelector(state => state?.user?.token ? state.user.token : '')
  const [name, setName] = useState(userData?.first_name ? userData?.first_name : '')
  const [emailId, setEmailId] = useState(userData?.email ? userData?.email : '')
  const [mobileNumber, setMobileNumber] = useState(userData?.profile?.phone ? userData?.profile?.phone : '')   /* {value:'',error:''} */
  const [gender, setGender] = useState(userData?.profile?.gender ? userData?.profile?.gender : '')
  const [location, setLocation] = useState(userData?.profile?.location ? userData?.profile?.location : '')
  const [password, setPassword] = useState('')
  const [isMenu, setIsMenu] = useState(false)
  const [isLiked1, setIsLiked1] = useState(false)
  const [isLiked2, setIsLiked2] = useState(false)
  const [localImage, setLocalImage] = useState(null)
  const [profileImage, setProfileImage] = useState(userData?.profile?.picture ? userData?.profile?.picture : null)

  const [isNameDisabled, setIsNameDisabled] = useState(false)
  const [isEmailDisabled, setIsEmailDisabled] = useState(false)
  const [isMobileNumberDisabled, setIsMobileNumberDisabled] = useState(false)
  const [isGenderDisabled, setIsGenderDisabled] = useState(false)
  const [isLocationDisabled, setIsLocationDisabled] = useState(false)
  const [ispasswordDisabled, setIspasswordDisabled] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false)


  const openCamara = () => {
    launchImageLibrary({ mediaType: 'photo' }, res => {
      if (res.didCancel) {
        console.log(res.didCancel);
      } else if (res.errorMessage) {
        console.log(res.errorMessage);
      } else {
        res.assets.map(result => {
          var d = { name: result.fileName, type: result.type, uri: result.uri, };
          setLocalImage(d);
        });
      }
    });
  };


  const ACCOUNTDEACTIVE = async () => {

    fetch('https://lifeofdesigner.keycorp.in/api/v1/account/delete_otp/', {
      method: 'POST',
      headers: { Authorization: `Token ${token}` },
    }).then(res => res.json())
      .then(response => {
        if (response) {
          showToastMessage('OTP sent to your Email id')
          navigation.navigate("OtpProfileDeactive")
        }
      }
      )
  }

  const Submit = async () => {
    if (!name) { showToastMessage('please fill in'); return }
    if (!emailId) { showToastMessage('please fill in'); return }
    if (!mobileValidation(mobileNumber)) {
      showToastMessage("Number Should not be less then 10."); return
    }
    if (!mobileNumber) { showToastMessage('please fill in'); return }
    if (!gender) { showToastMessage('please fill in'); return }
    if (gender !== 'male' && gender !== 'female' && gender !== 'other' &&
      gender !== 'Male' && gender !== 'Female' && gender !== 'Other') { showToastMessage('Gender should be male/female/other'); return }
    if (!location) { showToastMessage('please fill in'); return }
    // if (!localImage) { showToastMessage('please fill in'); return }
    setLoading(true)
    let form = new FormData()
    form.append('first_name', name)
    form.append('username', emailId)
    form.append('phone', mobileNumber)
    form.append('gender', gender)
    form.append('location', location)
    if (localImage) {
      form.append('picture', localImage)
    }
    fetch(Appurl.profilePost, {
      method: 'POST',
      headers: { Authorization: `Token ${token}` },
      body: form
    })
      .then(res => res.json())
      .then(response => {
        if (response && response.message) { showToastMessage(response.message) }
        if (response && response?.data?.user?.profile) {
          dispatch(setUserInfo(response?.data?.user))
          // AsyncStorage.setItem('userinfo', JSON.stringify(response))
          AsyncStorage.setItem('userinfo', JSON.stringify(response?.data?.user))
          showToastMessage('Profile updated')
        }
      }).finally(e => setLoading(false))
  }
  return (

    <ScrollView style={[styles.Container, modalVisible ? { opacity: 0.3 } : 'white']}>
      {loading && <Loader size={'small'} color={'#000'} />}
      <View style={styles.MainContainer}>
        <View>
          {/* <Avatar rounded size={70} source={{
            uri: localImage ? localImage.uri :
              profileImage ? Appurl.ROOT + profileImage : staticImage
          }} /> */}
          <Image
            source={{
              uri: localImage ? localImage.uri :
                profileImage ? Appurl.ROOT + profileImage : staticImage
            }}
            style={{ height: 100, width: 100, borderRadius: 100 }}
            PlaceholderContent={<ActivityIndicator />}
          />
          <Pressable onPress={() => openCamara()}>
            <Icon name={'camera-enhance-outline'} type={'material-community'} color={Colors.black} containerStyle={styles.icon} size={18} />
          </Pressable>
        </View>
      </View>
      <View style={{ flex: 18 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TextInput
            label="Name"
            style={styles.input}
            theme={{ colors: { text: "black", primary: 'black', placeholder: 'black' } }}
            underlineColor={Colors.transparent}
            onFocus={() => console.log("focused")}
            onBlur={console.log("blurred name")}
            disabled={isNameDisabled}
            value={name}
            right={
              <TextInput.Icon
                name={() => (
                  <Icon
                    size={14}
                    name={'edit-2'}
                    type="feather"
                    color={Colors.text_link}
                    onPress={() => {
                      if (isNameDisabled) {
                        setIsEmailDisabled(true)
                        setIsMobileNumberDisabled(true)
                        setIsGenderDisabled(true)
                        setIsLocationDisabled(true)
                        setIspasswordDisabled(true)
                      }
                      setIsNameDisabled(!isNameDisabled)
                    }
                    }
                  />
                )}
              />
            }
            // onChangeText={text =>
            //   setName({value: text, error: ''})
            // }
            onChangeText={setName}

          />

          <TextInput
            label="Email Id"
            style={styles.input}
            theme={{ colors: { text: "black", primary: 'black', placeholder: 'black' } }}
            underlineColor={Colors.transparent}
            onFocus={() => console.log("focused")}
            disabled={isEmailDisabled}
            value={emailId}
            right={
              <TextInput.Icon
                name={() => (
                  <Icon
                    size={14}
                    name={'edit-2'}
                    type="feather"
                    color={Colors.text_link}
                    onPress={() => {
                      if (isEmailDisabled) {
                        setIsNameDisabled(true)
                        setIsMobileNumberDisabled(true)
                        setIsGenderDisabled(true)
                        setIsLocationDisabled(true)
                        setIspasswordDisabled(true)
                      }
                      setIsEmailDisabled(!isEmailDisabled)
                    }
                    }
                  />
                )}
              />
            }
            // onChangeText={text =>
            //   setEmailId({value: text,error: ''})
            // }
            onChangeText={setEmailId}

          />


          <TextInput
            label="Mobile"
            style={styles.input}
            theme={{ colors: { text: "black", primary: 'black', placeholder: 'black' } }}
            underlineColor={Colors.transparent}
            onFocus={() => console.log("focused")}
            disabled={isMobileNumberDisabled}
            value={mobileNumber}
            maxLength={10}
            keyboardType={'numeric'}
            right={
              <TextInput.Icon
                name={() => (
                  <Icon
                    size={14}
                    name={'edit-2'}
                    type="feather"
                    color={Colors.text_link}
                    onPress={() => {
                      if (isMobileNumberDisabled) {
                        setIsNameDisabled(true)
                        setIsEmailDisabled(true)
                        setIsGenderDisabled(true)
                        setIsLocationDisabled(true)
                        setIspasswordDisabled(true)
                      }
                      setIsMobileNumberDisabled(!isMobileNumberDisabled)
                    }
                    }
                  />
                )}
              />
            }
            onChangeText={value => {
              setMobileNumber(value)
            }}

          />

          <TextInput
            label="Gender"
            style={styles.input}
            theme={{ colors: { text: "black", primary: 'black', placeholder: 'black' } }}
            underlineColor={Colors.transparent}
            onFocus={() => console.log("focused")}
            disabled={isGenderDisabled}
            value={gender}
            maxLength={6}
            right={
              <TextInput.Icon
                name={() => (
                  <Icon
                    size={14}
                    name={'edit-2'}
                    type="feather"
                    color={Colors.text_link}
                    onPress={() => {
                      if (isGenderDisabled) {
                        setIsNameDisabled(true)
                        setIsEmailDisabled(true)
                        setIsMobileNumberDisabled(true)
                        setIsLocationDisabled(true)
                        setIspasswordDisabled(true)
                      }
                      setIsGenderDisabled(!isGenderDisabled)
                    }
                    }
                  />
                )}
              />
            }
            onChangeText={setGender}
          />

          <TextInput
            label="Location"
            style={styles.input}
            theme={{ colors: { text: "black", primary: 'black', placeholder: 'black' } }}
            underlineColor={Colors.transparent}
            onFocus={() => console.log("focused")}
            disabled={isLocationDisabled}
            value={location}
            right={
              <TextInput.Icon
                name={() => (
                  <Icon
                    size={14}
                    name={'edit-2'}
                    type="feather"
                    color={Colors.text_link}
                    onPress={() => {
                      if (isLocationDisabled) {
                        setIsNameDisabled(true)
                        setIsEmailDisabled(true)
                        setIsMobileNumberDisabled(true)
                        setIsGenderDisabled(true)
                        setIspasswordDisabled(true)
                      }
                      setIsLocationDisabled(!isLocationDisabled)
                    }} />
                )} />}
            onChangeText={setLocation} />

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.containerModal}>
              <View style={{ flexDirection: 'row', alignSelf: 'center', marginVertical: 30 }}>
                <TouchableOpacity style={{ backgroundColor: 'black', padding: 10, paddingHorizontal: 28, borderRadius: 20 }}>
                  <Text style={{ fontFamily: Fonts.RobotoMedium, color: 'white' }}>Deactivate</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ marginLeft: 30, paddingHorizontal: 38, backgroundColor: '#eee', padding: 10, borderRadius: 20 }}
                  onPress={() => setModalVisible(false)} >
                  <Text style={{ fontFamily: Fonts.RobotoMedium, color: 'black' }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {(userData?.profile?.register_type !== "social") ?
            <TouchableOpacity style={styles.changepass} onPress={() => navigation.navigate("ChangePasswordScreen")}>
              <Image source={require('../../Assets/Icon/change_password.png')} style={{ width: 20, height: 20 }} resizeMode={"contain"} />
              <Text style={{ fontFamily: Fonts.RobotoRegular, fontSize: 17, color: 'black', marginLeft: 5 }}>Change Password</Text>
            </TouchableOpacity>
            :
            <View></View>
          }

          <TouchableOpacity style={styles.DeactivateStyle} onPress={() => ACCOUNTDEACTIVE()}>
            <User name='deleteuser' size={16} color='black' />
            <Text style={{ fontFamily: Fonts.RobotoRegular, fontSize: 17, color: 'black', marginLeft: 5 }}>Deactivate Account  </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.primaryYellow, marginHorizontal: 20, paddingVertical: 15, marginBottom: width / 3, marginTop: 20, borderRadius: 10 }}
        onPress={() => Submit()}>
        <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold }}>Update</Text>
      </TouchableOpacity>
    </ScrollView>
  )

}
const styles = StyleSheet.create({
  Container: {
    backgroundColor: Colors.white,
    flex: 1,
    padding: 20,
  },
  MainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    fontSize: 12,
    color: Colors.black,
    fontFamily: Fonts.RobotoBold,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.app_grey,
    marginVertical: 7,
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

  menubtn: {
    fontSize: 18,
    paddingVertical: 10,
    color: 'grey'
  },
  DeactivateStyle: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 50
  },
  changepass: {
    flexDirection: 'row',
    marginTop: 30,
  },
  containerModal: {
    // height: height / 2.7,
    width: width / 1.2,
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 10,
    justifyContent: "center",
    top: height / 1.7,
    borderRadius: 10,
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
  iconModal: {
    position: 'absolute',
    top: 0,
    right: 0

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


});
export default ProfileScreen
