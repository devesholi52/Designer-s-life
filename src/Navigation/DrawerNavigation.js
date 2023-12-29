import React from "react";
import { Text } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import TabNavigation from "./TabNavigation";
import HomeScreen from "../Screens/Home/HomeScreen";
import metrics from "../Theme/Metrics";
import DrawerMenu from "./DrawerMenu";

const DrawerNavigation = ({ navigation }) => {
  const Drawer = createDrawerNavigator();
  return (
    <>
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          overlayColor: "rgba(0,0,0,0.7)",
          drawerStyle: {
            flex: 1,
            width: '75%',
            backgroundColor: 'transparent',
            // paddingRight: 5,
          },
          sceneContainerStyle: { backgroundColor: 'transparent' },
        }}
        initialRouteName="Feed"
        drawerContent={(props) => <DrawerMenu navigation={props.navigation} {...props} />}>
        <Drawer.Screen name="Feed" component={TabNavigation} navigation={navigation}
          options={{ headerShown: false, }} />
      </Drawer.Navigator>
    </>
  )
}
export default DrawerNavigation
