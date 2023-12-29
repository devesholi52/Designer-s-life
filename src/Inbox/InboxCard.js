import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native'
import { height, Color, width, Font } from '../../Utils'
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationContainer } from '@react-navigation/native';
import moment from 'moment'
import Dot from 'react-native-vector-icons/Entypo'
import Icons from 'react-native-vector-icons/AntDesign'
import Fonts from '../Theme/Fonts';
import { showToastMessage, staticImage } from '../Utils';
import { DeleteInboxUser } from '../API';
import { useSelector } from 'react-redux';
import Appurl from "../API/Constant"
import { Image } from 'react-native-elements';

export default function InboxCard({ data, navigation, handleDelete, onToggle, closeMenuOption, active,
  refreshPage = () => { } }) {

  const userData = useSelector(state => state?.user?.userData ? state.user.userData : '')
  const token = useSelector(state => state?.user?.token ? state.user.token : '')

  const removeUserInboxCustomer = () => {
    let form = new FormData()
    form.append('reciver', `${data?.user?.id}`)
    fetch(Appurl.REMOVE_USER_FROM_INBOX, {
      method: 'DELETE',
      headers: { Authorization: `Token ${token}` },
      body: form
    }).then(res => res.json())
      .then(response => {
        if (response && response.message == "Inbox delete successfully") {
          showToastMessage('Message Deleted');
          // setIsMenu(false)
          // navigation.navigate("HomeScreen")
          refreshPage()
        }
      })
  }
  const removeUserInboxSeller = () => {
    let form = new FormData()
    form.append('reciver', `${data?.created_by?.id}`)
    fetch(Appurl.REMOVE_USER_FROM_INBOX, {
      method: 'DELETE',
      headers: { Authorization: `Token ${token}` },
      body: form
    }).then(res => res.json())
      .then(response => {
        if (response && response.message == "Inbox delete successfully") {
          showToastMessage('Message Deleted');
          // setIsMenu(false)
          // navigation.navigate("HomeScreen")
          refreshPage()
        }
      })
  }

  if (data?.created_by?.id != userData?.id) {
    return (
      <Pressable style={styles.Maincontainer}
        onPress={() => navigation.navigate('Messanger', { userId: data?.created_by?.id })}
      >
        <View style={styles.container}>
          <Image style={styles.image} source={{ uri: data?.created_by?.profile?.picture ? Appurl.ROOT + data?.created_by?.profile?.picture : staticImage }}
            PlaceholderContent={<ActivityIndicator />} />
          <View>
            <Text style={styles.title}>{data?.created_by?.first_name}</Text>
            <Text style={styles.desc}>{data.message}</Text>
          </View>
        </View>
        <Text style={styles.toptimetext}>
          {data?.created_on ? moment(data.created_on).format('ddd, hA') : ''}
        </Text>

        <TouchableOpacity onPress={onToggle}
          style={styles.VerticalDot}>
          <Dot name="dots-three-vertical" size={18} color='grey' />
        </TouchableOpacity>

        {active && <View style={styles.menu}>
          <TouchableOpacity style={styles.closeMenu} onPress={closeMenuOption}>
            <Icons name="closecircleo" size={18} color='black' />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignItems: 'center', flexDirection: 'row' }}
            // onPress={() => { removeUserInboxSeller }}>
            onPress={() => { handleDelete(data?.created_by?.id, "seller") }} >
            <Icons name="delete" size={18} color='black' style={{ padding: 10 }} />
            <Text style={{ fontFamily: Fonts.RobotoRegular, fontSize: 14, color: 'black' }}>Delete</Text>
          </TouchableOpacity>
          {/* <Text style={styles.menubtn}>Delete</Text> */}
        </View>}

      </Pressable>
    )
  }
  else {
    return (
      <Pressable style={styles.Maincontainer}
        onPress={() => navigation.navigate('Messanger', { userId: data?.user?.id })}
      >
        <View style={styles.container}>
          <Image style={styles.image} source={{ uri: data?.user?.profile?.picture ? Appurl.ROOT + data?.user?.profile?.picture : staticImage }}
            PlaceholderContent={<ActivityIndicator />} />
          <View>
            <Text style={styles.title}>{data?.user?.first_name}</Text>
            <Text style={styles.desc}>{data.message}</Text>
          </View>
        </View>
        <Text style={styles.toptimetext}>
          {data?.created_on ? moment(data.created_on).format('ddd, hA') : ''}
        </Text>

        <TouchableOpacity onPress={onToggle}
          style={styles.VerticalDot}>
          <Dot name="dots-three-vertical" size={18} color='grey' />
        </TouchableOpacity>

        {active && <View style={styles.menu}>
          <TouchableOpacity style={styles.closeMenu} onPress={closeMenuOption}>
            <Icons name="closecircleo" size={18} color='black' />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignItems: 'center', flexDirection: 'row' }}
            // onPress={() => {
            //   removeUserInboxCustomer()
            // }}
            onPress={() => { handleDelete(data?.user?.id, "customer") }} >
            <Icons name="delete" size={18} color='black' style={{ padding: 10 }} />
            <Text style={{ fontFamily: Fonts.RobotoRegular, fontSize: 14, color: 'black' }}>Delete</Text>
          </TouchableOpacity>
          {/* <Text style={styles.menubtn}>Delete</Text> */}
        </View>}

      </Pressable>
    )
  }
}
// }
const styles = StyleSheet.create({

  Maincontainer: {
    // height: height / 10,
    // width: width / 1.1,
    // margin: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    // elevation:1
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 40
  },

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15
  },
  title: {
    fontSize: 15,
    paddingLeft: 10,
    color: 'black',
    fontFamily: Fonts.RobotoLight,
  },
  desc: {
    color: 'grey',
    paddingLeft: 10,
    fontFamily: Fonts.RobotoLight,
    fontSize: 13
  },
  toptimetext: {
    position: 'absolute',
    top: 6,
    bottom: 0,
    alignSelf: 'flex-end',
    paddingRight: 25,
    paddingTop: 5,
    fontFamily: Fonts.RobotoLight,
    fontSize: 13
  },
  menu: {
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    position: 'absolute',
    top: 10,
    right: 25,
    width: 100,
    height: 40
  },
  closeMenu: {
    position: 'absolute',
    top: -8,
    right: -8,
  },

  menubtn: {
    fontSize: 13,
    paddingVertical: 10,
    color: 'black'
  },
  VerticalDot: {
    position: 'absolute',
    top: 30,
    right: 20,
  }
}

)
