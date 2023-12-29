import React, { } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import HomeScreenEdit from '../Screens/Home/HomeScreenEdit'
import Colors from '../Theme/Colors'
const { width } = Dimensions.get('window')
// import Headers from './Headers/Headers'

const Toptab = ({ data = [], activeTab = '1', onlyline = false, setActiveTab = () => { } }) => {
    return (
        <View style={{ marginLeft: 20 }}>
            <View style={{ width: width, }}>
                {/* <Headers title={"Upload products"} backButton={false}/> */}
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, i) => i.toString()}
                    data={data}
                    horizontal={true}
                    renderItem={({ item, index }) => (
                        <View style={[style.topBarContainer, {
                            backgroundColor: !onlyline && activeTab == index + 1 ? '#ffd700' : Colors.wishlistBackgroundColor,
                            borderBottomWidth: onlyline && activeTab !== 0 ? 1 : 0,
                            borderBottomColor: activeTab == index + 1 ? '#ffd700' : 'lightgrey'
                        }]}>
                            <TouchableOpacity style={style.topBarItemContainer}
                                onPress={() => setActiveTab(index + 1)}>
                                <Text style={[style.topBarItemText, {
                                    fontSize: 16, padding: 5, paddingVertical: 10,
                                    color: /* activeTab == index + 1 ? '#fff' : */ '#000'
                                    , fontWeight: activeTab == index + 1 ? 'bold' : 'normal'
                                }]}>{item}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>
        </View>
    )
}

export default Toptab

const style = StyleSheet.create({
    topBarContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        width: width / 2.2,
        alignSelf: 'center',
        // alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        // marginLeft:10,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        fontWeight: 'normal'
        // elevation:5
    },
    topBarItemContainer: {
        flexDirection: 'column',
        paddingHorizontal: 5,
        padding: -5,
        // backgroundColor:'red'
    },
    topBarItemText: {
        color: 'black',
        textAlign: 'center',
    },


})