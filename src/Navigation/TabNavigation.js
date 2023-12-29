import React from "react";
import { Image, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Icon } from "react-native-elements";
import { Favourite, Home, Profile, Deal, Notification } from "./StackNavigation";
import Colors from "../Theme/Colors";
import Fonts from "../Theme/Fonts";
import IMAGES from '../Constant/Images'
import Icon from 'react-native-vector-icons/FontAwesome'


import { width } from "../UploadProduct/Deal";
const Tab = createBottomTabNavigator();

function MyTabBar({ state, descriptors, navigation, index }) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  if (focusedOptions.tabBarVisible === false) return null;
  return (
    <View style={{ ...Styles.footerContainer, ...Styles.shodow }} >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;
        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true, });
          if (!isFocused && !event.defaultPrevented) { navigation.navigate(route.name); }
        };
        const getIcon = (labelname = '') => {
          let image = null;
          switch (labelname) {
            case 'Home':
              image = IMAGES.HOME_ACTIVE
              break;
            case 'Deal':
              image = IMAGES.DEAL_ACTIVE
              break;
            case 'Favourite':
              image = IMAGES.FAVOURITE_ACTIVE
              break;
            case 'Notification':
              image = IMAGES.NOTIFICATION_ACTIVE
              break;
            case "Profile":
              image = IMAGES.PROFILE_ACTIVE
              break;
            default:
              break;
          }
          return (
            <View style={{ alignItems: 'center', justifyContent: 'center', alignContent: 'center' }}>
              {/*<Image tintColor={'#fff'} source= {require('../Assets/Icon/2.png')} style={Styles.iconImage} />
              */}
              <Icon name={image} size={20} color={'#e3ae2a'} />
              <Text style={{ textAlign: 'center', fontSize: 7, paddingTop: 6, color: "white" }}>{label} </Text>
            </View>
          )
        }
        return (<TouchableOpacity
          accessibilityRole="button"
          accessibilityState={isFocused ? { selected: true } : {}}
          accessibilityLabel={options.tabBarAccessibilityLabel}
          testID={options.tabBarTestID}
          onPress={onPress}
          style={[Styles.bottomIcon, /* label == CONSTANTS.Add && { ...Styles.createEvent, ...Styles.shodow } */]}>
          {getIcon(label)}
          {isFocused ? <View style={Styles.focusDot} /> : null}


        </TouchableOpacity>)
      })}
    </View>
  );
}

const TabNavigation = ({ navigation }) => {
  return (
    <Tab.Navigator screenOptions={{ tabBarShowLabel: false }}
      tabBar={props => <MyTabBar {...props} index={props.state.index} />}
      initialRouteName={'Home'}
    >
      <Tab.Screen options={{ headerShown: false }} name="Home" component={Home} />
      <Tab.Screen options={{ headerShown: false }} name="Deal" component={Deal} />
      <Tab.Screen options={{ headerShown: false }} name="Favourite" component={Favourite} />
      <Tab.Screen options={{ headerShown: false }} name="Notification" component={Notification} />
      <Tab.Screen options={{ headerShown: false }} name="Profile" component={Profile} />
    </Tab.Navigator>
  )
}

const Styles = StyleSheet.create({

  Container: {
    backgroundColor: "#fff",
    // flex: 1,
    // padding: 3,
    alignItems: 'center'
  },
  TextCondition1: {
    fontSize: 12,
    color: Colors.black,
    textAlign: 'center',
    fontFamily: Fonts.RobotoRegular
  },

  TextCondition2: {
    fontSize: 12,
    color: Colors.app_grey,
    textAlign: 'center',
    fontFamily: Fonts.RobotoLight
  },



  footerContainer: {
    flexDirection: 'row',
    height: 60,
    // justifyContent: 'center',
    // alignSelf: 'center',
    alignItems: 'center',
    elevation: 0,
    // borderRadius: 10,
    backgroundColor: '#000'
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    position: 'relative',
    elevation: 0,
    // borderBottomLeftRadius: 25,
  },
  iconImage: {
    height: 20,
    width: 20,
    // padding: 10,
    tintColor: '#e3ae2a'
  }, bottomIcon: {
    flex: 1,
    // padding: 15,
    alignItems: 'center',
  },

})
export default TabNavigation


// #b8860b
// #ffd700
// #daa520