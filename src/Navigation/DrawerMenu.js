import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Pressable, ActivityIndicator } from "react-native";
import Colors from "../Theme/Colors";
import { Icon, Image } from "react-native-elements";
import { DrawerContentScrollView, DrawerItem, useDrawerStatus } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import ChatScreen from "../Screens/Chat/ChatScreen";
import Inbox from '../Inbox'
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Chat, Search } from "./StackNavigation";
import Transaction from "../Screens/Transaction"
import ChangePasswordScreen from "../Screens/Auth/ChangePasswordScreen";
import HomeScreen from "../Screens/Home/HomeScreen";
import MyProductScreen from "../MyProductScreen";
// import OrderDetailScreen from "../Screens/OrderScreen/OrderDetailScreen";
import MyProductDetailScreen from "../Screens/Product/MyProductDetailScreen";
import WishList from "../WishList";
import UploadProduct from "../UploadProduct";
import Privacy from "../Privacy";
import AddAnnouncement from "../AddAnnouncement";
import MyOrderScreen from "../Screens/OrderScreen/MyOrderScreen";
import { useDispatch, useSelector } from 'react-redux'
import Appurl from "../API/Constant"

import Fonts from "../Theme/Fonts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { staticImage } from "../Utils";
import useAuthentication from "../customHooks/useAuthentication";
import { removeDataFromRedux } from "../redux/reducers/userReducer";

const DrawerMenu = (props) => {
  const dispatch = useDispatch()
  const { isAuthenticated, getUserToken } = useAuthentication();
  const tokenfunc = useSelector(state => state?.user?.tokenfunc)
  const userData = useSelector(state => state?.user?.userData)
  const [isExpanded, setIsExpanded] = useState(false)
  const isDrawerStatus = useDrawerStatus();
  const [profileData, setProfileData] = useState([])
  const [emailData, setEmailData] = useState([])
  const [userRole, setUserRole] = useState('')
  const navigation = useNavigation()

  useEffect(() => {
    ProfileDeails()
  }, [])
  const googleSignOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) { }
  };
  const ProfileDeails = async () => {
    // const USERS_TYPE = await AsyncStorage.getItem('USERROLE')
    // setEmailData(USERS_TYPE)
    // console.log('nmcbldjvjdkb', USERS_TYPE)
  }

  const logOut = async () => {
    await AsyncStorage.clear()
    await googleSignOut()
    await getUserToken()
    dispatch(removeDataFromRedux())
  }
  return (
    <View style={[styles.Container]}>
      <TouchableOpacity onPress={() => props.navigation.closeDrawer()} style={{ alignItems: 'flex-end' }}>
        <Icon name={"left"} type={"antdesign"} />
      </TouchableOpacity>
      <View style={{ alignItems: 'center', marginVertical: 10 }}>
        <Pressable
          onPress={() => props.navigation.navigate('ProfileScreen')}>
          <Image
            source={{ uri: userData?.profile?.picture ? Appurl.ROOT + userData?.profile?.picture : staticImage }}
            style={{ width: 70, height: 70, borderRadius: 200 }}
            PlaceholderContent={<ActivityIndicator />}
          />
        </Pressable>
        <View style={{ marginVertical: 5, alignItems: 'center' }}>
          <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold, fontSize: 17 }}> {userData?.first_name} </Text>
          <Text style={{ color: Colors.black, fontSize: 10, fontFamily: Fonts.RobotoRegular }}>{userData?.email}</Text>
        </View>
      </View>
      <DrawerContentScrollView {...props}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.view1}>
          <DrawerItem
            label={"Home"}
            labelStyle={styles.text}
            style={styles.view}
            icon={({ focused }) => (
              <Image source={require('../Assets/Icon/home.png')} style={{ width: 20, height: 20 }} resizeMode={"contain"} />
            )}
            onPress={() => props.navigation.navigate("Home")}
          />

        </View>

        <View style={styles.view1}>
          <DrawerItem
            label={"Deal"}
            labelStyle={styles.text}
            style={styles.view}
            icon={({ focused }) => (
              <Image source={require('../Assets/Icon/deal.png')} style={{ width: 20, height: 20 }} resizeMode={"contain"} />
            )}
            onPress={() => props.navigation.navigate("SearchNew")}
          />
        </View>

        <View style={styles.view1}>
          <DrawerItem
            label={"Wishlist"}
            labelStyle={styles.text}
            style={styles.view}
            icon={({ focused }) => (
              <Image source={require('../Assets/Icon/heart.png')} style={{ width: 20, height: 20 }} resizeMode={"contain"} />
            )}
            onPress={() => props.navigation.navigate('WishList')}
          />
        </View>

        {(!!userData?.profile?.user_role && userData?.profile?.user_role !== "customer") &&

          <View style={styles.view1}>
            <DrawerItem
              label={"Upload Product"}
              labelStyle={styles.text}
              style={styles.view}
              icon={({ focused }) => (
                <Image source={require('../Assets/Icon/plus.png')} style={{ width: 20, height: 20 }} resizeMode={"contain"} />
              )}
              onPress={() => props.navigation.navigate("UploadProduct")}
            />
          </View>
        }

        {(!!userData?.profile?.user_role && userData?.profile?.user_role !== "customer") &&
          <View>
            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={{ height: 40, borderBottomColor: Colors.grayFed, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ justifyContent: 'center', flex: 2, }}>
                <DrawerItem
                  label={"Sales"}
                  labelStyle={styles.text}
                  style={styles.view}
                  icon={({ focused }) => (
                    <Image source={require('../Assets/Icon/sales.png')} style={{ width: 20, height: 20 }} resizeMode={"contain"} />
                  )}
                />
              </View>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                {
                  isExpanded
                    ?
                    <Icon name={'chevron-small-down'} type={'entypo'} />
                    :
                    <Icon name={'chevron-small-right'} type={'entypo'} />
                }

              </View>

            </TouchableOpacity>
            {
              isExpanded
                ?
                <View>
                  <View style={{ backgroundColor: Colors.secondaryGray, borderBottomColor: Colors.review_grey, borderBottomWidth: 1 }}>
                    <DrawerItem
                      label={"Product "}
                      labelStyle={styles.text}
                      icon={({ focused }) => (
                        <Image source={require('../Assets/Icon/my_product.png')} style={{ width: 20, height: 20 }} resizeMode={"contain"} />
                      )}
                      onPress={() => props.navigation.navigate("MyProductScreen")}
                    />
                  </View>
                  <View style={{ backgroundColor: Colors.secondaryGray, borderBottomColor: Colors.review_grey, borderBottomWidth: 1 }}>
                    <DrawerItem
                      label={"Order Details"}
                      labelStyle={styles.text}
                      icon={({ focused }) => (
                        <Image source={require('../Assets/Icon/order_detail.png')} style={{ width: 20, height: 20 }} resizeMode={"contain"} />
                      )}
                      onPress={() => props.navigation.navigate("MyProductDetailScreen")}
                    />
                  </View>
                </View>
                :
                null
            }
          </View>
        }


        {/* <View style={styles.view1}>
          <DrawerItem
            label={"Chat"}
            labelStyle={styles.text}
            style={styles.view}
            icon={({ focused }) => (
              <Image source={require('../Assets/Icon/chat.png')} style={{ width: 20, height: 20 }} resizeMode={"contain"} />
            )}
            onPress={() => props.navigation.navigate("ChatScreen")}
          />
        </View> */}

        <View style={styles.view1}>
          <DrawerItem
            label={"Inbox"}
            labelStyle={styles.text}
            style={styles.view}
            icon={({ focused }) => (
              <Image source={require('../Assets/Icon/email.png')} style={{ width: 20, height: 20 }} resizeMode={"contain"} />
            )}
            onPress={() => props.navigation.navigate("Inbox")}
          />
        </View>

        <View style={styles.view1}>
          <DrawerItem
            label={"My orders"}
            labelStyle={styles.text}
            style={styles.view}
            icon={({ focused }) => (
              <Image source={require('../Assets/Icon/shopping_bag.png')} style={{ width: 20, height: 20 }} resizeMode={"contain"} />
            )}
            onPress={() => props.navigation.navigate("MyOrderScreen")}
          />
        </View>

        <View style={styles.view1}>
          <DrawerItem
            label={"Transaction"}
            labelStyle={styles.text}
            style={styles.view}
            icon={({ focused }) => (
              <Image source={require('../Assets/Icon/transcaction.png')} style={{ width: 20, height: 20 }} resizeMode={"contain"} />
            )}
            onPress={() => props.navigation.navigate("Transaction")}
          />
        </View>

        <View style={styles.view1}>
          <DrawerItem
            label={"Notification"}
            labelStyle={styles.text}
            style={styles.view}
            icon={({ color, size }) => <Icon type='ant-design' name="bells" size={18} color={'black'} />}
            onPress={() => props.navigation.navigate('Notification')}
          />
        </View>

        {/* <View style={styles.view1}>
          <DrawerItem
            label={"Change Password"}
            labelStyle={styles.text}
            style={styles.view}
            icon={({ focused }) => (
              <Image source={require('../Assets/Icon/change_password.png')} style={{ width: 20, height: 20 }} resizeMode={"contain"} />
            )}
            onPress={() => props.navigation.navigate('ChangePasswordScreen')}
          />
        </View> */}

        {/* <View style={styles.view1}>
          <DrawerItem
            label={"Add Announcement"}
            labelStyle={styles.text}
            style={styles.view}
            icon={({ color, size }) => <Icon type='material-icons' name="privacy-tip" size={18} color={'black'} />}
            onPress={() => props.navigation.navigate('AddAnnouncement')}
          />
        </View> */}
        <View style={styles.view1}>
          <DrawerItem
            label={"Privacy"}
            labelStyle={styles.text}
            style={styles.view}
            icon={({ color, size }) => <Icon type='material-icons' name="privacy-tip" size={18} color={'black'} />}
            onPress={() => props.navigation.navigate('Privacy')}
          />
        </View>
        <View style={styles.view1}>
          <DrawerItem
            label={"Logout"}
            labelStyle={styles.text}
            style={styles.view}
            icon={({ focused }) => (
              <Image source={require('../Assets/Icon/log-out.png')} style={{ width: 20, height: 20 }} resizeMode={"contain"} />
            )}
            onPress={logOut}
          />
        </View>
      </DrawerContentScrollView>
    </View>
  )
}
const styles = StyleSheet.create({
  text: {
    color: 'rgba(50, 60, 90, 1)',
    right: 20,
    fontFamily: Fonts.RobotoMedium,
    fontSize: 14,
  },
  Container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 10
  },
  view: { height: 45 },
  view1: { height: 40, justifyContent: 'center', borderBottomColor: Colors.grayFed, borderBottomWidth: 1, marginVertical: 5 },
});
export default DrawerMenu
