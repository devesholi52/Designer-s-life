import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState } from 'react'
import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import useAuthentication from './customHooks/useAuthentication';
import linking from './linking';
import DrawerNavigation from './Navigation/DrawerNavigation';
import { Auth } from './Navigation/StackNavigation'
import { changeTokenValue, setUserInfo } from './redux/reducers/userReducer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

const Main = props => {
    const dispatch = useDispatch()
    const userDetailsData = useSelector(state => state?.user?.userData);
    const { isAuthenticated, getUserToken } = useAuthentication();
    React.useEffect(() => {
        getUserToken();
    }, [isAuthenticated, userDetailsData]);


    useEffect(() => {
        (async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                let data = await AsyncStorage.getItem('userinfo');
                data = JSON.parse(data);
                dispatch(setUserInfo(data));
                dispatch(changeTokenValue(token));
            } catch (error) {
                console.log('err from Authentication hook UserData function::', error);
            }
        })()
    }, [isAuthenticated])


    // console.log('isAuthenticated', isAuthenticated);
    return (<NavigationContainer linking={linking}>
        {isAuthenticated ? <DrawerNavigation /> : <Auth />}
    </NavigationContainer>)
}
export default Main
// export default () => {
//     return (
//         <Stack.Navigator
//             initialRouteName='root_stack'
//             screenOptions={{
//                 headerShown: false
//             }}>
//             <Stack.Screen name="root_stack" component={Main} />
//         </Stack.Navigator>
//     )
// }