
import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity, Text, Image, FlatList, Dimensions, StyleSheet } from 'react-native'

import AntIcon from 'react-native-vector-icons/AntDesign'
import { TextInput } from 'react-native'
const { height, width } = Dimensions.get('window')

export default function index({ data, placeholder = "Select an item",
    onChangeValue, isSearch = false, styles = {}, bottomstyles = {} }) {

    const [newData, setNewData] = useState(data)
    const [isOpen, setisOpen] = useState(false)
    const [value, setValue] = useState("")
    const [searchValue, setSearchValue] = useState("")
    const renderItem = ({ item }) => {
        const { image, label, value, id } = item
        return (
            <TouchableOpacity style={style.itemStyle}
                onPress={() => {
                    setisOpen(false)
                    onChangeValue(item)
                    setValue(value)
                }}>
                {!!image && <Image source={{ uri: image }} style={style.image} />}
                <Text style={{ color: '#000' }}>{label ? label : ''}</Text>
            </TouchableOpacity>
        )
    }
    const handleSearch = text => {
        setSearchValue(text)
        if (!text) return setNewData(data)
        const list = data.filter(val => val.label.toLowerCase().includes(text.toLowerCase()))
        setNewData([...list] || [])
    }


    return (
        <View style={{ position: 'absolute', top: 17, left: width / 1.5, elevation: 5, zIndex: 999 }}>
            {!isOpen ? (
                <TouchableOpacity style={[style.button, { ...styles }]} onPress={() => setisOpen(!isOpen)}>
                    <Text style={style.valueText}>{value ? value : placeholder}</Text>
                    <AntIcon name="down" size={15} color="grey" style={{ paddingRight: 5 }} />
                </TouchableOpacity>
            ) :
                <>
                    <TouchableOpacity style={[style.button, { ...styles }]} onPress={() => setisOpen(!isOpen)}>
                        <Text style={style.valueText}>{value ? value : placeholder}</Text>
                        <AntIcon name="caretup" size={15} />
                    </TouchableOpacity>
                    <View style={[style.bottom, { ...bottomstyles }]}>
                        {isSearch &&
                            <TextInput
                                value={searchValue}
                                onChangeText={handleSearch}
                                placeholder='Search your query here'
                                placeholderTextColor="gray"
                                style={style.searchbox} />}
                        {(newData && newData.length !== 0) ?
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                nestedScrollEnabled={true}
                                data={[...newData]}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => index.toString()}
                            /> : <View style={style.noData}>
                                <Text style={style.noDataText} >No Data Found</Text>
                            </View>
                        }
                    </View>
                </>
            }
        </View>
    )
}

const style = StyleSheet.create({
    bottom: {
        backgroundColor: '#fff',
        marginTop: -10,
        marginBottom: 10,
        marginHorizontal: 15,
        borderRadius: 10,
        borderColor: 'lightgray',
        borderWidth: 1,
        minHeight: 100,
        maxHeight: height / 8,
        width: width / 4,

    },
    button: {
        padding: 5,
        margin: 10,
        marginHorizontal: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderColor: 'lightgray',
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: width / 4,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        elevation: 3
    },
    image: {
        height: 35,
        width: 35
    },
    noData: {
        alignSelf: 'center',
        justifyContent: 'center',
        borderTopColor: 'lightgray',
        borderTopWidth: 1,
        margin: 10,
        width: width / 1.15
    },
    noDataText: {
        textAlign: 'center',
        fontSize: 15,
        color: '#000'
    },
    itemStyle: {
        borderBottomColor: '#EEEEEE',
        borderBottomWidth: 1,
        padding: 15
    },
    searchbox: {
        fontSize: 15,
        color: '#000',
        paddingHorizontal: 20,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        height: 40
    },
    valueText: {
        width: width / 6,
        color: 'gray'
    }

})
// import CustomDropDown from '../Components/Advanced/CustomDropDown'
// {(!!category && category.length !== 0) && <CustomDropDown data={category} placeholder="Business Category" onChangeValue={onSelectBusinessCategory} />}

