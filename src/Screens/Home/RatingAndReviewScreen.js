import React, { useState } from "react";
import { FlatList, Text, View } from "react-native";
import Headers from "../../Components/Headers/Headers";
import { useFocusEffect } from "@react-navigation/native";
import Colors from "../../Theme/Colors";
import metrics from "../../Theme/Metrics";
import { Rating } from "react-native-ratings";
import { Icon } from "react-native-elements";
import Fonts from "../../Theme/Fonts";
const DATA=[
  {
    id:1,
    name:'Norah Jones',
    rating:4,
    comment:'The point of using lorem ipsum is that it has a more-or-less normal distributions of letters'
  },
  {
    id:2,
    name:'Krishnita Nathans',
    rating:3,
    comment:'The point of using lorem ipsum is that it has a more-or-less normal distributions of letters'
  },
  {
    id:3,
    name:'Norah Jones',
    rating:4,
    comment:'The point of using lorem ipsum is that it has a more-or-less normal distributions of letters'
  },
  {
    id:4,
    name:'Krishnita Nathans',
    rating:3,
    comment:'The point of using lorem ipsum is that it has a more-or-less normal distributions of letters'
  },
  {
    id:5,
    name:'Norah Jones',
    rating:4,
    comment:'The point of using lorem ipsum is that it has a more-or-less normal distributions of letters'
  },
  {
    id:6,
    name:'Krishnita Nathans',
    rating:3,
    comment:'The point of using lorem ipsum is that it has a more-or-less normal distributions of letters'
  },
  {
    id:7,
    name:'Norah Jones',
    rating:4,
    comment:'The point of using lorem ipsum is that it has a more-or-less normal distributions of letters'
  },
  {
    id:8,
    name:'Krishnita Nathans',
    rating:3,
    comment:'The point of using lorem ipsum is that it has a more-or-less normal distributions of letters'
  },
  {
    id:9,
    name:'Norah Jones',
    rating:4,
    comment:'The point of using lorem ipsum is that it has a more-or-less normal distributions of letters'
  },
  {
    id:10,
    name:'Krishnita Nathans',
    rating:3,
    comment:'The point of using lorem ipsum is that it has a more-or-less normal distributions of letters'
  }

]
const RatingAndReviewScreen=()=>{
  const [dataList,setDataList]=useState([])
  useFocusEffect(
    React.useCallback(()=>{
      setDataList(DATA)
    },[])
  )

  const RatingsAndReview=({item,index})=>{
    return(
      <View style={{flexDirection:'row',marginVertical:10}}>
        <View style={{flex:2}}>
          <View style={{backgroundColor:Colors.review_grey,width:metrics.ScreenWidth/7,height:metrics.ScreenWidth/7,borderRadius:200,justifyContent:'center',alignItems:'center'}}>
            <Text style={{color:Colors.black,textAlign:'center',fontFamily:Fonts.RobotoBold,fontSize:22}}>N</Text>
          </View>
        </View>
        <View style={{flex:9}}>
          <Text style={{color:Colors.black,fontFamily:Fonts.RobotoBold}}>{item?.name}</Text>
          <Rating
            ratingCount={5}
            imageSize={16}
            style={{alignItems:'flex-start',marginVertical:5}}
            readonly={true}
            startingValue={item?.rating}
          />
          <Text style={{fontFamily:Fonts.RobotoRegular}}>24 Sept, 2021</Text>
          <Text style={{fontSize:13,color:Colors.black,marginVertical:10,fontFamily:Fonts.RobotoRegular}}>{item?.comment}</Text>
          <View style={{flexDirection:'row',justifyContent:'flex-end',marginHorizontal:10}}>
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginHorizontal:10}}>
              <Icon name={'like2'} type={'antdesign'} size={14} color={Colors.grayLight}/>
              <Text style={{fontSize:10,color:Colors.black,fontFamily:Fonts.RobotoLight}}>28</Text>
            </View>
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',}}>
              <Icon name={'like2'} type={'antdesign'} size={14} style={{marginHorizontal:2,rotation:180}} color={Colors.grayLight} />
              <Text style={{fontSize:10,color:Colors.black,fontFamily:Fonts.RobotoLight}}>6</Text>
            </View>
          </View>
        </View>
      </View>

    )
  }

  const renderRatingAndReview=({item,index})=>{
    return <RatingsAndReview item={item} index={index}/>
  }

  return(
    <>
      <Headers title={"Rating and Review"} backButton={false}/>
      <View style={{flex:1,padding:10,backgroundColor:Colors.white}}>
        <FlatList
          data={dataList}
          renderItem={renderRatingAndReview}
          showsVerticalScrollIndicator={false}
        />
      </View>

    </>
  )
}
export default RatingAndReviewScreen
