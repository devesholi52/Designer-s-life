import React, { useState, useEffect, useRef } from "react";
import { FlatList, Image, RefreshControl, Pressable, Text, Button, TouchableOpacity, View, TextInput, Modal, StyleSheet, Platform, Linking } from "react-native";
import { Loader } from "../../Theme/Metrics";
import Colors from "../../Theme/Colors";
import { Rating } from "react-native-ratings";
import { Icon } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Appurl from '../../API/Constant'
import { height, width } from "../Notification/NotificationScreen";
import { getBanner, searchProduct } from "../../API";
import Fonts from "../../Theme/Fonts";
import HomeProduct from "./HomeProduct";
import IconClose from 'react-native-vector-icons/Fontisto';
import { useSelector } from "react-redux";
import { useDrawerStatus } from "@react-navigation/drawer";
import HomeProductEdit from "./HomeProductEdit";
import { staticImage } from "../../Utils";
import EditedHomeProductEdit from "./EditedHomeProductEdit";
import Headers from "../../Components/Headers/Headers";

const EditedHomeScreenedit = ({ navigation, route, onSubmit = () => { } }) => {
    const userData = useSelector(state => state?.user?.userData ? state.user.userData : '')
    const token = useSelector(state => state?.user?.token)
    const [hello, setHello] = useState(route?.params?.hello ? route?.params?.hello : '')
    const [refreshing, setRefreshing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [dummyItemList, setDummyItemList] = useState([])
    const [products, setProducts] = useState([])
    const [banners, setBanners] = useState([])
    const [searchText, setSearchText] = useState('')
    const isDrawerStatus = useDrawerStatus();
    const [selectedArr, setAelectedArr] = useState([]);
    const [isChanged, setIsChanged] = useState(false);

    console.log("herehere-------", selectedArr);
    useEffect(() => {
        getProducts()
        const unsubscribe = navigation.addListener('focus', () => {
            setSearchText('')
            getProducts()
            return unsubscribe;
        })
    }, [])
    // }, [token && token !== ''])

    const getProducts = async () => {
        if (!searchText) {
            setLoading(true)
            const token = await AsyncStorage.getItem('token')
            console.log(token);
            fetch(Appurl.ProductListing, {
                method: 'GET',
                headers: { Authorization: `Token ${token}` },
            }).then(res => res.json())
                .then(response => {
                    if (response && response.results && response.results.length !== 0) {
                        setProducts(prev => (response?.results))
                    }
                }).finally(e => {
                    setLoading(false);
                    setRefreshing(false)
                })
        }
    }

    const handleSearch = async (text) => {
        setSearchText(text);
        const token = await AsyncStorage.getItem('token')
        searchProduct(text, token)
            .then(response => {
                if (response) {
                    let res = response.data.data
                    if (res && res.length !== 0) {
                        setProducts(res)
                    } else setProducts(dummyItemList)
                }
            })
    }

    const removeFromSelectedImage = (item, index) => {
        selectedArr.splice(index, 1)
        setIsChanged(!isChanged)
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getProducts();
    }, []);

    const renderSelectedImage = ({ item, index }) => {
        console.log("item", item);

        return (
            <View style={{ padding: 7, marginLeft: 10, alignItems: 'center', marginBottom: 20 }}>
                <TouchableOpacity onPress={() => removeFromSelectedImage(item, index)}
                    style={{ position: 'absolute', top: 6, right: 0, backgroundColor: '#000', zIndex: 100, borderRadius: 200 }}>
                    <Icon name={'close'} color={'#fff'} size={15} />
                </TouchableOpacity>
                <Image source={{ uri: item?.images?.[0]?.product_images ? item?.images?.[0]?.product_images : staticImage }} style={{ width: 50, height: 50, borderRadius: 10 }} />
                <Text style={{ fontSize: 14, color: 'black' }}>{item?.product_name}</Text>
            </View>
        )

    }


    return (
        <Modal
            style={[{ flex: 1, backgroundColor: Colors.backgroundColor },
            ]}
        // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <Headers title={"Select Products"} backButton={true} navigation={navigation} backgroundColor={"black"} />
            {loading && <Loader size={'small'} color={'#000'} />}
            {/* {refreshing ? <ActivityIndicator /> : null} */}
            <View style={styles.Container} >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 15, marginVertical: 10, borderRadius: 30, borderColor: Colors.searchBorderColor, borderWidth: 2, justifyContent: 'space-between' }}>
                    <TextInput
                        style={{ borderRadius: 30, fontSize: 12, fontFamily: Fonts.RobotoLight, paddingLeft: 18, paddingVertical: Platform.OS == 'ios' ? 10 : 5, color: Colors.grayLight }}
                        placeholder={'Search By name, Type'}
                        placeholderTextColor={Colors.dark_grey}
                        value={searchText}
                        onChangeText={value => handleSearch(value)} />
                    <Icon name={'search'} style={{ marginRight: 15, }} size={18} color="grey" />
                </View>
                <FlatList
                    data={selectedArr}
                    renderItem={renderSelectedImage}
                    numColumns={1}
                    horizontal={true}
                />
                <TouchableOpacity style={{ alignSelf: 'center', paddingHorizontal: 40, paddingVertical: 10, backgroundColor: selectedArr.length == "0" ? `#dcdcdc` : "black", borderRadius: 10 }}
                    onPress={() => onSubmit(selectedArr)}
                    disabled={selectedArr && selectedArr.length == 0}>
                    <Text style={{ fontSize: 15, color: selectedArr.length == "0" ? Colors.dark_grey : "white" }}>Proceed</Text>
                </TouchableOpacity>
                <FlatList
                    data={products}
                    renderItem={({ item, index }) => <EditedHomeProductEdit
                        refreshPage={() => {
                            if (searchText) handleSearch(searchText)
                            else getProducts()
                        }}
                        // refreshSearch={() => handleSearch(searchText)}
                        navigation={navigation} item={item}
                        selectedArr={selectedArr} index={index} setAelectedArr={setAelectedArr}

                    />}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </Modal >
    )
}

const styles = StyleSheet.create({
    Container: {

    },

    icon: {
        backgroundColor: Colors.white,
        position: 'absolute',
        right: -1,
        bottom: -1,
        borderRadius: 200,
        borderColor: Colors.grayLight,
        padding: 5,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowColor: Colors.white,
        borderWidth: 0.5,
        zIndex: 999
    },
    menu: {
        backgroundColor: 'white',
        // elevation: 3,
        position: 'absolute',
        top: 230,
        right: 50,
        width: 250,
        height: 150,
        alignSelf: 'center',


    },
    closeMenu: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    textinputmodal: {
        padding: 25,
        backgroundColor: '#eee',
        marginHorizontal: 10,
        borderRadius: 5,
        fontFamily: Fonts.RobotoMedium,
        color: 'black',
        marginVertical: 10

    },

    menubtn: {
        fontSize: 18,
        paddingVertical: 10,
        color: 'grey'
    },
    DeactivateStyle: {
        flexDirection: 'row',
        marginTop: 30
    },
    containerModal: {
        height: height / 2.2,
        width: width / 1.2,
        backgroundColor: 'white',
        alignSelf: 'center',
        borderRadius: 10,
        top: width / 1.8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        elevation: 2
    },
    textReview: {
        fontFamily: Fonts.RobotoBold,
        fontSize: 17,
        alignSelf: 'center',
        color: 'black',
        paddingTop: 25

    },
    DescReview: {
        padding: 20,
        fontSize: 15,
        fontFamily: Fonts.RobotoMedium
    },
    iconModal: {
        position: 'absolute',
        top: 0,
        right: 0,
        margin: 8

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
    editor: {
        backgroundColor: "black",
        borderColor: "black",
        // borderWidth: 1,
        minHeight: 200,
        // margin: 10
        // maxHeight: 600,
    },
    rich: {
        // backgroundColor: "green",

        // minHeight: 300,
        // maxHeight: 600,
        // flex: 1,
    },
    richBar: {
        height: 50,
        backgroundColor: "#F5FCFF",
        marginVertical: 10,
        marginTop: 120
    },
    imagemodal: {
        height: 22,
        width: 25,
        marginBottom: 4,
        backgroundColor: 'red'
    },
    ModalImageText: {
        flexDirection: 'row',
        margin: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'

    },
});
export default EditedHomeScreenedit
