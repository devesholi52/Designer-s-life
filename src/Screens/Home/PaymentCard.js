import React, { useState } from 'react'
import { Text, TouchableOpacity, View, StyleSheet, } from 'react-native';
import Fonts from '../../Theme/Fonts';
import { height, width } from '../../Utils';
import Icons from 'react-native-vector-icons/AntDesign';
import Dot from 'react-native-vector-icons/Entypo';
// import { RadioButton } from 'react-native-paper';
import RadioButton from '../../RadioButton';
import Colors from '../../Theme/Colors';

const PaymentCard = ({ item, index, cardDelete, navigation, onPressCard }) => {
    const [isMenu, setIsMenu] = useState(false);
    return (
        <View style={styles.Maincontainer}>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                    onPress={() => setIsMenu(!isMenu)}
                    style={styles.VerticalDot}>
                    <Dot name="dots-three-vertical" size={13} color="grey" />
                </TouchableOpacity>
            </View>
            <View style={{ marginLeft: 5 }}>
                <View
                    style={styles.cardInner}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                        <RadioButton
                            status={item?.isSelected ? 'checked' : 'unchecked'}
                            onPress={() => onPressCard(index)}
                        />
                        <Text style={styles.DeliverTO}> ************{item?.last4}</Text>
                    </View>
                </View>
                {/* <View style={{ marginLeft: 9 }}>
                    <Text style={styles.title}>{item?.name}</Text>
                    <Text style={styles.desc}>{item?.full_address}, {item?.locality},{item?.city},</Text>
                    <Text style={styles.desc}>{item?.state}, {item?.pin_code},</Text>
                    <Text style={styles.desc}>{item?.mobile}</Text>
                </View> */}
            </View>
            {isMenu && (
                <View style={styles.menu}>
                    <TouchableOpacity
                        style={styles.closeMenu}
                        onPress={() => setIsMenu(!isMenu)}>
                        <Icons name="closecircleo" size={20} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ alignItems: 'center', flexDirection: 'row' }}
                        onPress={() => cardDelete(item)}>
                        <Icons
                            name="delete"
                            size={14}
                            color="black"
                            style={{ padding: 10 }}
                        />
                        <Text>Delete</Text>
                    </TouchableOpacity>
                    {/* <Text style={styles.menubtn}>Delete</Text> */}
                </View>
            )}
        </View>
    );
}

export default PaymentCard

const styles = StyleSheet.create({
    Maincontainer: {
        marginTop: 10,
        borderColor: '#eee',
        borderRadius: 4,
        paddingVertical: 15,
        margin: 15,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        backgroundColor: Colors.greyFA
    },
    title: {
        color: 'black',
        fontSize: 14,
        marginLeft: 25,
    },
    desc: {
        color: 'black',
        fontSize: 14,
        marginLeft: 25,
    },

    DeliverTO: {
        fontSize: 20,
        fontFamily: Fonts.RobotoRegular,
        color: 'black',
        marginLeft: 10,
    },

    toptimetext: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        alignSelf: 'flex-end',
        paddingHorizontal: 10,
        paddingTop: 5,
        fontSize: 12,
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
        top: 0,
        right: 0,
        width: 100,
        height: 40,
    },
    VerticalDot: {
        position: 'absolute',
        top: 0,
        right: 10,
    },
    closeMenu: {
        position: 'absolute',
        top: -10,
        right: -10,
    },
    button: {
        backgroundColor: 'black',
        paddingVertical: 15,
        // width: width / 2.1,
        width: '50%',
        borderRadius: 5,
        margin: 1
    },
    btnText: {
        fontFamily: Fonts.RobotoMedium,
        color: 'white',
        alignSelf: 'center',
    },
    cardInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // marginTop: 10,
    }
})