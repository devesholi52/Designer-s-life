

import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native'
export const { height, width } = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';
import Dot from 'react-native-vector-icons/Entypo'
import Icons from 'react-native-vector-icons/AntDesign'
import moment from "moment";

export default function NotificationScreen({ item, navigation }) {

  const [isLiked, setIsLiked] = useState(false)
  const [isMenu, setIsMenu] = useState(false)
  return (
    <TouchableOpacity style={styles.Maincontainer}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => { setIsLiked(!isLiked) }}>
          <Icon name='bell' size={20} color={isLiked ? 'grey' : '#ffd700'} />
        </TouchableOpacity>
        <View>
          {/* <Text style={styles.title}>New friend request</Text> */}
          {/* <Text style={styles.title}>{item?.created_by?.first_name}</Text> */}
          <Text style={styles.desc}>{item?.messages}</Text>
        </View>
      </View>

      <Text style={styles.toptimetext}>
        {item?.updated_on ? moment(item?.updated_on).format("MMM Do YY") : ''}
      </Text>

    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({

  Maincontainer: {
    // height: height / 10,
    marginTop: 10,
    width: width / 1.1,
    margin: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    flex: 1
    // elevation:1
  },

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15

  },
  title: {
    color: 'black',
    fontSize: 14,
    marginLeft: 8,
    marginBottom: 2
  },
  image: {
    height: height / 24,
    width: width / 8
  },
  desc: {
    color: 'black',
    paddingLeft: 10
  },
  toptimetext: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
    paddingTop: 5,
    fontSize: 12
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
    right: 10,
    width: 100,
    height: 40
  },
  closeMenu: {
    position: 'absolute',
    top: 0,
    right: 0,
  },

  menubtn: {
    fontSize: 13,
    paddingVertical: 10,
    color: 'black'
  },
  VerticalDot: {
    position: 'absolute',
    top: 25,
    right: 5,
  }
}

)

