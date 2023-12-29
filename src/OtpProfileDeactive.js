import React, { useState } from "react";
// import Colors from "../../Theme/Colors";
import { Image, Text, TextInput, TouchableOpacity, View, StyleSheet, ImageBackground, Modal } from "react-native";
import { CodeField, useBlurOnFulfill, useClearByFocusCell, Cursor } from "react-native-confirmation-code-field";
// import metrics from "../../Theme/Metrics";
import { useNavigation } from "@react-navigation/native";
import Headers from "./Components/Headers/Headers"
// import ResetPasswordScreen from "./ResetPasswordScreen";
// import Fonts from "../../Theme/Fonts";
// import Appurl from "../../API/Constant"
// import { width } from "../Notification/NotificationScreen";
import Metrics from "./Theme/Metrics";
import Fonts from "./Theme/Fonts";
import { width } from "./Screens/Notification/NotificationScreen";
import Colors from "./Theme/Colors";
import { height } from "./UploadProduct/Deal";
import Appurl from './API/Constant'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showToastMessage } from "./Utils";
import { useDispatch, useSelector } from "react-redux";
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import { removeDataFromRedux } from "./redux/reducers/userReducer";
import useAuthentication from "./customHooks/useAuthentication";

export default OtpProfileDeactive = ({ route }) => {
    const dispatch = useDispatch()
    const { isAuthenticated, getUserToken } = useAuthentication();
    const tokenfunc = useSelector(state => state?.user.tokenfunc)
    const [token, setToken] = useState(route?.params?.token ? route?.params?.token : '')
    const [userdata, setUserdata] = useState(route?.params?.data ? route?.params?.data : '')
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation()
    const CELL_COUNT = 4;
    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT, });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });
    const logOut = async () => {
        try {
            await GoogleSignin.signOut()
            await AsyncStorage.clear();
            await getUserToken()
            dispatch(removeDataFromRedux())
            // tokenfunc(false)
        } catch (error) {
            console.log('Error found in Deactivate profile Screen');
        }
    }
    const Submit = async () => {
        const token = await AsyncStorage.getItem('token')
        let form = new FormData()
        // form.append('username', userdata?.user?.email)
        form.append('otp', value)
        // form.append('data', userdata)
        fetch(Appurl.PROFILE_DEACTIVATE, {
            method: 'PUT',
            body: form,
            headers: { Authorization: `Token ${token}` },
        }).then(res => res.json())
            .then(response => {
                if (response && response.message == 'OTP that you enter is not valid.') {
                    showToastMessage("OTP that you entered is not valid.")

                }
                if (response && response.message == 'you have successfully verify OTP.') {
                    setModalVisible(true);

                }
            }
            )
    }
    //   const RESENDOTP = async () => {
    //     const token = await AsyncStorage.getItem('token')
    //     let form = new FormData()
    //     // form.append('username', userdata?.user?.email)
    //     // form.append('otp', value)
    //     // form.append('data', userdata)
    //     fetch(Appurl.PROFILE_DEACTIVATE, {
    //       method: 'POST',
    //       body: form,
    //       headers: { Authorization: `Token ${token}` },
    //     }).then(res => res.json())
    //       .then(response => {
    //         if (response ) {
    //           ToastAndroid.show("Otp sent again", ToastAndroid.SHORT)
    //           // navigation.replace("SigninScreen")
    //         }
    //       }
    //       )
    //   }

    const RESENDOTP = async () => {
        const token = await AsyncStorage.getItem('token')
        fetch('https://lifeofdesigner.keycorp.in/api/v1/account/delete_otp/', {
            method: 'POST',
            headers: { Authorization: `Token ${token}` },
        }).then(res => res.json())
            .then(response => {
                if (response) {
                    showToastMessage('OTP resent successfully')
                }
            }
            )
    }
    const FINALPROFILEDEACTIVATE = async () => {
        const token = await AsyncStorage.getItem('token')
        let form = new FormData()
        fetch(Appurl.FINAL_PROFILE_DEACTIVATE, {
            method: 'DELETE',
            // body: form,
            headers: { Authorization: `Token ${token}` },
        }).then(res => res.json())
            .then(response => {
                if (response && response.data || response.status === 200) {
                    showToastMessage("Your account is Deactived")
                    logOut()
                }
            }
            )
    }

    // const goToResetPassword = () => {
    //   navigation.navigate("ResetPasswordScreen")
    // }

    return (

        //   <ImageBackground
        //     source={require('./Assets/Untitled-4.jpg')}
        //     style={{ height: 840, width: width, paddingHorizontal: 20,paddingTop:width/2.1  }}>
        <>
            {/* <Headers title={"Deactive Profile"} backButton={false} /> */}
            <View style={[styles.container, modalVisible ? { opacity: 0.3 } : 'white']}>
                <View style={{ marginTop: 100 }}>
                    <View style={{ marginHorizontal: 5, marginVertical: 20, alignSelf: 'center' }}>
                        <Text style={{ fontFamily: Fonts.RobotoBold, fontSize: 20, color: '#ffd700', alignSelf: 'center', marginBottom: 5 }}>One Time Passcode</Text>
                        <Text style={{ fontFamily: Fonts.RobotoBold, color: Colors.black, fontSize: 11 }}>An 4 digits passcode sent to your Email</Text>
                    </View>
                    <View style={{ marginTop: 30 }}>
                        <View style={{ paddingHorizontal: 7, marginBottom: 5, }}>
                            <CodeField
                                ref={ref}
                                {...props}
                                value={value}
                                onChangeText={setValue}
                                cellCount={CELL_COUNT}
                                rootStyle={styles.codeFieldRoot}
                                keyboardType="numeric"
                                textContentType="oneTimeCode"
                                renderCell={({ index, symbol, isFocused }) => (
                                    <View
                                        // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
                                        onLayout={getCellOnLayoutHandler(index)}
                                        key={index}
                                        style={[styles.cellRoot, isFocused && styles.focusCell]}>
                                        <Text style={styles.cellText}>
                                            {symbol || (isFocused ? <Cursor /> : null)}
                                        </Text>
                                    </View>
                                )}
                            />

                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 30 }}>
                            <Text style={{ fontSize: 13, fontFamily: Fonts.RobotoRegular, color: 'black' }}>Didn’t receive the OTP?</Text>
                            <TouchableOpacity
                                onPress={() => RESENDOTP()}
                            >
                                <Text style={{ fontSize: 13, color: '#ffd700', fontFamily: Fonts.RobotoBold }}>Resend OTP</Text>
                            </TouchableOpacity>
                        </View>


                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => {
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <View style={styles.containerModal}>
                                {/* <TouchableOpacity style={styles.iconModal}
                  onPress={() => setModalVisible(false)}>
                  <IconClose name="close" size={18} color={'black'} />
                </TouchableOpacity> */}


                                <View style={{ flexDirection: 'row', alignSelf: 'center', marginVertical: 30 }}>
                                    <TouchableOpacity style={{ backgroundColor: 'black', padding: 10, paddingHorizontal: 28, borderRadius: 20 }}
                                        onPress={() => FINALPROFILEDEACTIVATE()}>
                                        <Text style={{ fontFamily: Fonts.RobotoMedium, color: 'white' }}>Deactivate</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{ marginLeft: 30, paddingHorizontal: 38, backgroundColor: '#eee', padding: 10, borderRadius: 20 }}
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <Text style={{ fontFamily: Fonts.RobotoMedium, color: 'black' }}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>


                            </View>
                        </Modal>

                        <View style={{ alignSelf: 'center', marginVertical: 50 }}>
                            <TouchableOpacity /* onPress={goToResetPassword} */ style={{ backgroundColor: '#ffd700', justifyContent: 'center', alignItems: 'center', borderRadius: 7, paddingVertical: 10, paddingHorizontal: 50 }}
                                onPress={() => Submit()}>
                                <Text style={{ fontFamily: Fonts.RobotoBold, color: Colors.black, fontSize: 17 }}>
                                    Submit
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </View>
        </>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    root: { padding: 20, minHeight: 300 },
    title: { textAlign: 'center', fontSize: 30 },
    codeFieldRoot: {
        marginVertical: 10,
        width: Metrics.ScreenWidth - 120,
        marginLeft: 'auto',
        marginRight: 'auto',

    },
    cellRoot: {
        width: Metrics.ScreenWidth / 7,
        height: Metrics.ScreenWidth / 7,
        justifyContent: 'center',
        alignItems: 'center',
        // borderColor: '#ffd700',
        borderWidth: 1,
        backgroundColor: 'white'
    },
    cellText: {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
        fontFamily: Fonts.RobotoBold
    },
    focusCell: {
        borderBottomColor: '#ffd700',
        borderBottomWidth: 3,
    },
    ResendContainer: {
        flexDirection: 'row-reverse',
        justifyContent: 'flex-start',
        marginHorizontal: 7,
        marginVertical: 10
    },
    tickText: {
        marginLeft: 0,
    },

    containerModal: {
        // height: height / 2.7,
        width: width / 1.2,
        backgroundColor: 'white',
        alignSelf: 'center',
        borderRadius: 10,
        justifyContent: "center",
        top: height / 1.6,
        borderRadius: 10,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        paddingVertical: 40
    },
    textReview: {
        fontFamily: Fonts.RobotoBold,
        fontSize: 17,
        alignSelf: 'center',
        color: 'black',
        paddingTop: 25

    },
    iconModal: {
        position: 'absolute',
        top: 0,
        right: 0

    },
    buttonmodal: {
        backgroundColor: 'orange',
        alignSelf: 'center',
        padding: 8,
        paddingHorizontal: 35,
        borderRadius: 10,
        margin: 30,
        fontFamily: Fonts.RobotoMedium
    },
});

