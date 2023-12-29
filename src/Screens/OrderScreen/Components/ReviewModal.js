import { FlatList, Image, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import metrics from "../../../Theme/Metrics";
import Colors from "../../../Theme/Colors";
import { Icon } from "react-native-elements";
import React, { useState } from "react";
import { AirbnbRating, Rating } from "react-native-ratings";
import Fonts from "../../../Theme/Fonts";
import { Platform } from "react-native";

const ReviewModal = (props) => {
  const [rating, setRating] = useState(0)
  const [review, setreview] = useState('')
  const onSubmit = () => {
    setreview()
  }
  return (
    <Modal
      animationType={"fade"}
      transparent={true}
      visible={props.visible}
      onRequestClose={() => { console.log("Modal has been closed.") }}
    >
      <View style={{
        justifyContent: 'center',
        backgroundColor: "rgba(0,0,0,0.3)",
        height: metrics.ScreenHeight,
        width: metrics.ScreenWidth,
      }}>
        <View style={{ width: metrics.ScreenWidth / 1.1, borderRadius: 10, alignSelf: "center", backgroundColor: Colors.white, paddingVertical: 5, paddingHorizontal: 10 }}>
          <View style={{ position: 'absolute', right: 10, top: 5 }}>
            <Icon onPress={props.onCloseReviewModal} size={20} name="closecircle" type="antdesign" color={Colors.black} />
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold }}>Review</Text>
          </View>
          <View style={{ marginTop: 40 }}>
            <AirbnbRating
              count={5}
              size={14}
              defaultRating={0}
              onFinishRating={(val) => setRating(val)}
              ratingContainerStyle={{ alignItems: 'flex-start' }}
              showRating={false}
            />
          </View>
          <View style={{ marginVertical: 10 }}>
            {(Platform.OS == 'ios') ?
              <TextInput
                style={{
                  backgroundColor: Colors.greyFA,
                  fontFamily: Fonts.RobotoBold,
                  padding: 10
                }}
                placeholderTextColor={Colors.black}
                placeholder={'Enter Review'}
                numberOfLines={5}
                minHeight={60}
                multiline={true}
                textAlignVertical={'top'}
                value={review}
                onChangeText={(val) => setreview(val)}
              />
              :
              <TextInput
                style={{
                  backgroundColor: Colors.greyFA,
                  fontFamily: Fonts.RobotoBold,
                }}
                placeholderTextColor={Colors.black}
                placeholder={'Enter Review'}
                numberOfLines={5}
                multiline={true}
                textAlignVertical={'top'}
                value={review}
                onChangeText={(val) => setreview(val)}
              />
            }
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
            <TouchableOpacity onPress={() => props.onSubmit(rating, review)} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFE745', marginHorizontal: 20, paddingHorizontal: 55, paddingVertical: 10, borderRadius: 20 }}>
              <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold }}>Submit</Text>
            </TouchableOpacity>
          </View>

        </View>

      </View>

    </Modal>
  )
}
export default ReviewModal
