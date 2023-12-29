import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, View, FlatList, Text } from 'react-native'
import Colors from '../../Theme/Colors';

export default function ProductSize({ navigation, itemData = null, submitSize = null, cloth = true, }) {
    const [selectedIndex, setSelectedIndex] = useState(null)
    const submit = (item, selectedIndexValue) => {
        setSelectedIndex(selectedIndexValue);
        submitSize(item)
    }
    return (
        <View style={style.continer}>
            <View style={style.SizeChart}>
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={itemData?.size}
                    horizontal={true}
                    keyExtractor={(item, i) => i.toString()}
                    renderItem={({ item, index }) => {
                        return (<TouchableOpacity style={[style.shodow, style.sizeBox, {
                            backgroundColor: selectedIndex == index ? '#EEE' : '#fff'
                        }]} onPress={() => { submit(item, index) }}>
                            <Text style={style.sizeText}>{item?.size ? item?.size : '1'}</Text>
                        </TouchableOpacity>)
                    }} />
            </View>
        </View>
    )
}
const style = StyleSheet.create({
    continer: {
        backgroundColor: Colors.greyFA,
    },
    SizeChart: {
        paddingVertical: 5,

    },
    shodow: {
        shadowColor: 'red',
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1.5,
        elevation: 1,
    },
    sizeBox: {
        // backgroundColor: Colors.greyFA,
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        borderRadius: 70,
        borderColor: 'black',
    },
    sizeText: {
        fontSize: 16,
        // paddingHorizontal: 10,
        color: 'black',
    },
    noSize: {
        color: 'red',
        fontSize: 14,
        paddingHorizontal: 10
    },
    sizeAvailable: {
        color: 'green',
        fontSize: 14,
        paddingHorizontal: 10
    }
})