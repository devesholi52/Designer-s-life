import React, { useState } from "react";
import { Text, TouchableOpacity, View, Modal, StyleSheet } from "react-native";
import Colors from "../../Theme/Colors";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import Fonts from "../../Theme/Fonts";
import HomeScreen from "../../Screens/Home/HomeScreen";
import { width } from "../../UploadProduct/Deal";
import Dot from 'react-native-vector-icons/Entypo';
import IconClose from 'react-native-vector-icons/Ionicons';
const Headers = (props) => {
  const navigation = useNavigation()
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={{ elevation: 10, zIndex: 999, flexDirection: 'row', backgroundColor: Colors.black, justifyContent: 'space-between', padding: 15 }}>
      <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
        {
          props.backButton
            ?
            <Icon name={'arrowleft'} type={"antdesign"} color={"#e3ae2a"} onPress={() => navigation.goBack()} />
            : null
        }
        <Text style={{ color: Colors.white, fontSize: 16, marginHorizontal: 5, fontFamily: Fonts.RobotoBold }}>{props.title}</Text>
      </View>

      {
        props.Shoppingbag
          ?
          <TouchableOpacity
            onPress={() => navigation.navigate('ShoppingbagScreen')}>
            <Icon name={'shopping-bag'} color={"#e3ae2a"} type={"MaterialIcons"} size={20} style={{ marginLeft: width / 1.6, marginTop: 2 }} />
          </TouchableOpacity>
          : null
      }
      {
        props.VerticalDot
          ?
          <TouchableOpacity
            onPress={() => setModalVisible(true)}>
            <Dot name={'dots-three-vertical'} size={16} color={"#e3ae2a"} style={{ marginLeft: width / 1.4, marginTop: 4 }} />
          </TouchableOpacity>
          : null
      }
      <TouchableOpacity onPress={() => props.navigation.openDrawer()}>
        <Icon name={"menu"} color={"#e3ae2a"} />
      </TouchableOpacity>



      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.containerModal}>

          <TouchableOpacity style={styles.iconModal}
            onPress={() => setModalVisible(false)}>
            <IconClose name="close-circle-outline" size={22} color={'grey'} style={{ padding: 6 }} />
          </TouchableOpacity>



          <Text style={styles.menubtn}>Clear Chat</Text>

          <Text style={styles.menubtn}>Block User</Text>
          <Text style={styles.menubtn}>Report</Text>

        </View>
      </Modal> */}
    </View>
  )
}

const styles = StyleSheet.create({


  containerModal: {
    height: 110,
    width: 140,
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 10,
    justifyContent: "center",
    position: 'absolute',
    top: 23,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    left: width / 1.92
  },
  iconModal: {
    position: 'absolute',
    top: 0,
    right: 0

  },
  menubtn: {
    fontSize: 17,
    paddingVertical: 5,
    paddingLeft: 10,
    color: 'black',
    fontFamily: Fonts.RobotoRegular

  },
})
export default Headers
