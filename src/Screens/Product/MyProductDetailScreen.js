import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Headers from "../../Components/Headers/Headers";
import Colors from "../../Theme/Colors";
import NewOrders from "./Component/NewOrders";
import ConfirmOrders from "./Component/ConfirmOrders";
import ShippedOrders from "./Component/ShippedOrders";
import DeliveredOrderScreen from "./Component/DeliveredOrderScreen";
import Fonts from "../../Theme/Fonts";
const MyProductDetailScreen = ({ navigation }) => {
  const [des, setDes] = useState(1)
  return (
    <>
      {/* <Headers title={"Order Detail"} backButton={false}/> */}
      <View style={{ flex: 1, backgroundColor: Colors.white, padding: 10, }}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => setDes(1)} style={{ flex: 1, alignItems: 'center', backgroundColor: des === 1 ? Colors.black : Colors.backgroundColor, padding: 10, borderColor: Colors.borderColor, borderWidth: 1 }}>
            <Text style={{ color: des === 1 ? Colors.white : Colors.black, fontFamily: Fonts.RobotoBold, fontSize: 12 }}>New order</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setDes(2)} style={{ flex: 1, alignItems: 'center', backgroundColor: des === 2 ? Colors.black : Colors.backgroundColor, padding: 10, borderColor: Colors.borderColor, borderWidth: 1 }}>
            <Text style={{ color: des === 2 ? Colors.white : Colors.black, fontFamily: Fonts.RobotoBold, fontSize: 12 }}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setDes(3)} style={{ flex: 1, alignItems: 'center', backgroundColor: des === 3 ? Colors.black : Colors.backgroundColor, padding: 10, borderColor: Colors.borderColor, borderWidth: 1 }}>
            <Text style={{ color: des === 3 ? Colors.white : Colors.black, fontFamily: Fonts.RobotoBold, fontSize: 12 }}>Shipped</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setDes(4)} style={{ flex: 1, alignItems: 'center', backgroundColor: des === 4 ? Colors.black : Colors.backgroundColor, padding: 10, borderColor: Colors.borderColor, borderWidth: 1 }}>
            <Text style={{ color: des === 4 ? Colors.white : Colors.black, fontFamily: Fonts.RobotoBold, fontSize: 12 }}>Delivered </Text>
          </TouchableOpacity>
        </View>
        <View>
          {
            des === 1
              ? <NewOrders navigation={navigation} />
              :
              des === 2
                ?
                <ConfirmOrders navigation={navigation} />

                :
                des === 3
                  ?
                  <ShippedOrders navigation={navigation} />
                  : <DeliveredOrderScreen navigation={navigation} />
          }

        </View>
      </View>
    </>
  )
}
export default MyProductDetailScreen
