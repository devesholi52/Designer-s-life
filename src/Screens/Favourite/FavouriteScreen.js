import React from "react";
import { FlatList, Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import Headers from "../../Components/Headers/Headers";
import { useNavigation } from "@react-navigation/native";
import metrics from "../../Theme/Metrics";
import Colors from "../../Theme/Colors";
import { Icon } from "react-native-elements";
import Fonts from "../../Theme/Fonts";

const FavouriteScreen=()=>{
  const navigation=useNavigation()
  const WISHLIST_DATA=[
    {
      id:1,
      image:require('../../Assets/product1.jpg')
    },
    {
      id:2,
      image:require('../../Assets/product2.jpg')
    },
    {
      id:3,
      image:require('../../Assets/product3.jpg')
    }
  ]

  const WISHLISTITEM=({item,index})=>{
    return(
      <Pressable  style={{marginHorizontalHorizontal:5,marginVertical:5,width:metrics.ScreenWidth/2,justifyContent:'center',alignItems:'center'}}
      onPress={()=>navigation.navigate("SearchDevesh")}>
        <View style={{width:metrics.ScreenWidth/2.1,borderColor:Colors.wishlistBorderColor,borderWidth:1,backgroundColor:Colors.white}}>
          <View>
            <Image  source={item.image} style={{width:metrics.ScreenWidth/2.1-2,height:metrics.ScreenWidth/1.8}} />
          </View>
          <View style={{padding:10}}>
            <Text style={{color:Colors.black,fontFamily:Fonts.RobotoBold,fontSize:16}}>Nautica</Text>
            <Text style={{fontSize:12,fontFamily:Fonts.RobotoMedium}}>Women cotton Set Top</Text>
            <View style={{flexDirection:'row'}}>
              <Text style={{color:Colors.black,fontSize:12,fontFamily:Fonts.RobotoMedium}}>$250</Text>
              <Text style={{textDecorationLine:'line-through', textDecorationStyle: 'solid',marginHorizontal:10,fontSize:12,fontFamily:Fonts.RobotoMedium}}>
                {` $350 `}
              </Text>
              <Text style={{color:'#F89225',fontSize:12,fontFamily:Fonts.RobotoMedium}}>(25%)</Text>
            </View>
          </View>
          <View style={{alignSelf:'baseline'}}>
            <View style={{flexDirection:'row',marginVertical:5}}>
              <Icon name={'message-text-outline'} type={'material-community'} size={18} color={Colors.black} style={{marginHorizontal:10}}/>
              <Icon name={'share-variant-outline'} type={'material-community'} size={18} color={Colors.black} style={{marginHorizontal:10}}/>
            </View>
            <TouchableOpacity style={{alignSelf:'baseline',backgroundColor:Colors.wishlistMoveToBagColor,width:metrics.ScreenWidth/2.1-2}}>
              <Text style={{textAlign:'center',color:Colors.white,marginVertical:5,lineHeight:20,letterSpacing:1,fontSize:12,fontFamily:Fonts.RobotoBold}}>Move to Bag</Text>
            </TouchableOpacity>
          </View>

        </View>

      </Pressable>
    )
  }

  const _renderWishlistItem=({item,index})=>{
    return(
    <WISHLISTITEM item={item} index={index}/>
    )
  }
  return(
    <>
      <Headers title={"Wishlist"} backButton={false}/>
      <View style={{flex:1,backgroundColor:Colors.wishlistBackgroundColor}}>
        <FlatList
          data={WISHLIST_DATA}
          renderItem={_renderWishlistItem}
          numColumns={2}
          showsVerticalScrollIndicator={false}
        />
      </View>

    </>
  )
}
export default FavouriteScreen
