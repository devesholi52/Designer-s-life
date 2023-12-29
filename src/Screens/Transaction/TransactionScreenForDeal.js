import React, { useState, useEffect } from "react";
import Headers from "../../Components/Headers/Headers";
import Colors from "../../Theme/Colors";
import { FlatList, Text, View, Picker, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Avatar } from "react-native-elements";
import Fonts from "../../Theme/Fonts";
import CustomDropDown from '../../Components/CustomDropDown'
import { Dropdown } from "react-native-element-dropdown";
import { ScrollView } from "react-native";
import Appurl from "../../API/Constant"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showToastMessage, staticImage } from "../../Utils";
import moment from "moment";
import { Loader } from "../../Theme/Metrics";


const TransactionScreenForDeal = ({ navigation }) => {

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [page, setPage] = useState(1)
    const [fetchingFromServer, setFetchingFromServer] = useState(false)

    const [category, setcategory] = useState([
        { image: null, label: 'january', value: 'january', id: 1 },
        { image: null, label: 'febuary', value: 'febuary', id: 1 },
        { image: null, label: 'March', value: 'March', id: 1 },
        { image: null, label: 'April', value: 'April', id: 1 },
    ])
    const [isSizeFocus, setIsSizeFocus] = useState(false);

    const onSelectBusinessCategory = (item) => {
        console.log('====================================');
        console.log(item);
        console.log('====================================');
    }

    useEffect(() => {
        getDataForDeal();
    }, [])
    // useEffect(() => {
    //     getDataForDeal();
    // }, [page])

    const getDataForDeal = async () => {
        setLoading(true)
        const token = await AsyncStorage.getItem('token')
        fetch(Appurl.TRANSACTION_FOR_DEAL, {
            method: 'GET',
            headers: { Authorization: `Token ${token}` },
        }).then(res => res.json())
            .then(response => {
                if (response && response.results) {
                    setData(response.results)
                }
            })
            .finally(e => setLoading(false))
        // .catch(e => showToastMessage('Something went wrong'))
    }
    // const getDataForDeal = async () => {
    //     // setLoading(true)
    //     const token = await AsyncStorage.getItem('token')
    //     fetch(Appurl.TRANSACTION_FOR_DEAL.replace('{{offset}}', page), {
    //         method: 'GET',
    //         headers: { Authorization: `Token ${token}` },
    //     }).then(res => res.json())
    //         .then(response => {
    //             console.log("responseofdeal", response?.results);
    //             if (response && response.results) {
    //                 setData([...data, ...response.results])
    //             }
    //         })
    //     // .finally(e => setLoading(false))
    //     // .catch(e => showToastMessage('Something went wrong'))
    // }
    // const renderFooter = () => {
    //     return (
    //         //Footer View with Load More button
    //         <View>
    //             {fetchingFromServer ?
    //                 (
    //                     <View style={{ backgroundColor: "white", padding: 5 }}>
    //                         <ActivityIndicator color={Colors.primaryOrange} size="large" />
    //                     </View>
    //                 ) : null}
    //         </View>
    //     );
    // }

    const TrasactionItem = ({ item, index }) => {
        return (
            <>
                {(item?.deal_product && item?.deal_product?.length !== 0) &&
                    <View style={{ paddingHorizontal: 15, marginVertical: 5 }}>
                        <View style={{ flexDirection: 'row', paddingVertical: 15 }}>
                            {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={{ uri: item?.images?.[0]?.product_images ? item?.images?.[0]?.product_images : staticImage }} style={{ width: 30, height: 30 }} />
                    </View> */}
                            {(moment(item?.updated_on).format("ddd") !== "Fri") ?
                                <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0e68c', borderRadius: 100, paddingHorizontal: 10, marginRight: 15, marginLeft: 5 }}>
                                    <Text style={{ color: "grey", fontSize: 10, fontFamily: Fonts.RobotoRegular }}>{item?.updated_on ? moment(item?.updated_on).format("ddd") : ''}</Text>
                                </View>
                                :
                                <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0e68c', borderRadius: 100, paddingHorizontal: 13, marginRight: 15, marginLeft: 5 }}>
                                    <Text style={{ color: "grey", fontSize: 10, fontFamily: Fonts.RobotoRegular }}>Fri</Text>
                                </View>
                            }
                            <View style={{ flex: 4, justifyContent: 'center', paddingHorizontal: 5 }}>
                                <Text style={{ color: Colors.black, fontSize: 13, fontFamily: Fonts.RobotoMedium }}>OrderID- {item?.invoice_number}</Text>
                                {/* <Text style={{ color: Colors.grayLight, fontSize: 12, marginVertical: 2, fontFamily: Fonts.RobotoRegular }}>Size <Text style={{
                            color: Colors.black
                        }}>{item?.size}</Text> Qty <Text style={{
                            color: Colors.black
                        }}>{item?.quantity}</Text></Text> */}
                                <Text style={{ color: Colors.black, fontSize: 10, fontFamily: Fonts.RobotoRegular }}>{item?.updated_on ? moment(item?.updated_on).format("DD/MM/YYYY") : ''}</Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={{ color: Colors.black, alignItems: 'flex-end', fontSize: 16, fontFamily: Fonts.RobotoMedium }}>${JSON.stringify(item?.deal?.price)}</Text>
                            </View>
                        </View>
                        <ListSeperator />
                    </View>
                }
            </>
        )
    }

    const renderTransactionItem = ({ item, index }) => {
        return (
            <TrasactionItem item={item} index={index} />

        )
    }

    const ListSeperator = () => {
        return (
            <View style={{ borderWidth: 0.8, borderColor: Colors.borderColor }} />
        )
    }



    return (
        <ScrollView>
            {loading && <Loader size={'small'} color={'#000'} />}
            {/* <Headers title={"Transaction"} backButton={false} /> */}
            <View style={{ backgroundColor: Colors.white, flex: 1 }}>
                <View style={{ paddingHorizontal: 20, paddingVertical: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold, fontSize: 17, marginTop: 15 }}>Last Transaction</Text>
                    {/* {(!!category && category.length !== 0) && <CustomDropDown data={category} placeholder="January" onChangeValue={onSelectBusinessCategory} />} */}
                </View>
                {(data && data.length !== 0) ?
                    <FlatList
                        data={data}
                        renderItem={renderTransactionItem}
                    // onEndReachedThreshold={0.5}
                    // onEndReached={() => {
                    //     setPage(page + 10)
                    //     setFetchingFromServer(true)
                    // }}
                    // ListFooterComponent={renderFooter}
                    /> : <Text style={{ color: '#000', textAlign: 'center', padding: 10, fontSize: 20 }}>No data available</Text>}
            </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    DropdownStyle: {
        height: 23,
        // marginRight: 40,
        width: '30%',
        paddingHorizontal: 10,
        borderWidth: 1,
        borderRadius: 30,
        marginVertical: 16,
        marginLeft: 20,
        borderColor: '#eee',
        color: '#000',
        backgroundColor: Colors.grayFed,
        alignSelf: 'center'
    },
    dropDownSizeTextView: {
        height: 20,
        width: 20,
        padding: 10,
        margin: 15,
        // backgroundColor: item.value,
        borderWidth: 0.5,
        borderColor: Colors.dark_grey,
    },
})
export default TransactionScreenForDeal
