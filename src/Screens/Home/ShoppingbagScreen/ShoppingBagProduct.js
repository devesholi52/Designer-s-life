import React, { useEffect, useState } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import metrics from '../../../Theme/Metrics';
import Colors from '../../../Theme/Colors';
import Fonts from '../../../Theme/Fonts';
import moment from 'moment';
import { showToastMessage, staticImage } from '../../../Utils';
import Appurl from '../../../API/Constant';
import { Dropdown } from 'react-native-element-dropdown';
import { height, width } from '../../Notification/NotificationScreen';

const ShoppingBagProduct = ({
    item, index,
    onIncrementPress,
    onDecrementPress,
    onSelectSize,
    onDeleteProductPress
}) => {
    const [isSizeFocus, setIsSizeFocus] = useState(false);
    const [valueSize, setSizeValue] = useState();
    const [sizes, setSizes] = useState();

    useEffect(() => {
        let sizeChart = []
        item?.product?.size.forEach(item => {
            let data = { value: item?.id, label: item?.size }
            sizeChart.push(data)
        })
        setSizes(sizeChart)
    }, [])

    // console.log("ITEM:::", item?.product_size?.size)
    return (
        <View style={styles.mainContainer}>
            <View style={{ flexDirection: 'row' }}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{
                            uri: item?.product?.images?.[0]?.product_images
                                ? Appurl.ROOT + item?.product?.images?.[0]?.product_images
                                : staticImage,
                        }}
                        style={styles.Image}
                    />
                </View>
                <View style={{ flex: 3 }}>
                    <Text style={styles.productName}>{item?.product?.product_name}</Text>
                    <View style={styles.dropDownView}>
                        <Text style={styles.sizeText}>Size</Text>
                        <Dropdown
                            style={[
                                styles.DropdownStyle,
                                isSizeFocus && { borderColor: 'black' },
                            ]}
                            placeholderStyle={{ color: '#000', fontSize: 13 }}
                            selectedTextStyle={{ fontSize: 14, color: '#000' }}
                            iconStyle={{}}
                            value={valueSize?.label}
                            onChange={size => {
                                setSizeValue(size);
                                onSelectSize(size?.value, item?.id)
                            }}
                            // onChange={(item) => {setSizeValue(item.value)}}
                            data={sizes}
                            labelField="label"
                            valueField="value"
                            maxHeight={100}
                            onFocus={() => setIsSizeFocus(true)}
                            onBlur={() => setIsSizeFocus(false)}
                            placeholder={(item?.product_size?.size)
                                ? (item?.product_size?.size) : "Select size"}
                            renderItem={item => {
                                return (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                        {/* <View style={styles.dropDownSizeTextView} /> */}
                                        <Text style={{
                                            fontFamily: Fonts.RobotoRegular,
                                            padding: 5,
                                            marginLeft: 10,
                                            fontSize: 13,
                                            color: 'black'
                                        }}>
                                            {item?.label}
                                        </Text>
                                    </View>
                                )
                            }}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.qtyHeader}>Qty</Text>
                        <Text style={styles.qtyText}>{item?.quantity ? item?.quantity : 1}</Text>
                        <View style={styles.qntyView}>
                            <TouchableOpacity
                                onPress={() => onIncrementPress(item?.quantity, item?.id)}>
                                <Text style={{ fontSize: 18, paddingRight: 40, color: "black" }}>+</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    if (item?.quantity > 1) { onDecrementPress(item?.quantity, item?.id) }
                                    else showToastMessage('Minimum quantity reached!')
                                }}>
                                <Text style={{ fontSize: 18, color: "black" }}>-</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginVertical: 15 }}>
                        <Text style={styles.discountText}>${Math.trunc((item?.product?.price - item?.product?.price * item?.product?.discount / 100) * item?.quantity)}</Text>
                        <Text style={styles.priceText}>
                            {/* {`${totalPrice * discountPrice / 100 ? totalPrice * discountPrice / 100 : 0}`}*/}
                            ${item?.product?.price * item?.quantity}
                        </Text>
                        <Text style={styles.discountPercentText}>
                            {item?.product?.discount}%
                        </Text>
                    </View>

                    <View style={{ marginVertical: 5 }}>
                        <Text style={styles.dateText}>
                            {item?.created_on
                                ? moment(item?.created_on).format('MM/DD/YYYY')
                                : ''}
                        </Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity
                style={styles.crossIcon}
                onPress={() => onDeleteProductPress(item?.id)}>
                <Image
                    style={{ height: 15, width: 15 }}
                    source={require('../../../Assets/Icon/close.png')}
                />
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    mainContainer: {
        marginBottom: 30,
        backgroundColor: Colors.greyFA,
        marginTop: 5
    },
    imageContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    Image: {
        width: metrics.ScreenWidth / 3,
        height: metrics.ScreenWidth / 2.2,
    },
    productName: {
        fontSize: 12,
        fontFamily: Fonts.RobotoBold,
        paddingTop: 15,
        color: 'black'
    },
    dropDownView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sizeText: {
        color: Colors.black,
        fontFamily: Fonts.RobotoRegular,
        fontSize: 14,
    },
    DropdownStyle: {
        height: 23,
        // marginRight: 40,
        width: '65%',
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
        // height: 10,
        // width: 20,
        // padding: 10,
        margin: 15,
        // backgroundColor: item.value,
        borderWidth: 0.5,
        borderColor: Colors.dark_grey,
    },
    qtyHeader: {
        color: Colors.black,
        fontFamily: Fonts.RobotoRegular,
        fontSize: 14,
    },
    qtyText: {
        marginLeft: 10,
        fontFamily: Fonts.RobotoBold,
    },
    qntyView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.grayFed,
        paddingHorizontal: 10,
        marginLeft: 10,
        borderRadius: 10,
        width: width / 2.55,
        justifyContent: 'space-between',
    },
    discountText: {
        color: Colors.black,
        fontSize: 12,
        fontFamily: Fonts.RobotoMedium,
    },
    priceText: {
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
        marginHorizontal: 10,
        fontSize: 12,
        color: Colors.app_grey,
        fontFamily: Fonts.RobotoMedium,
    },
    discountPercentText: {
        color: '#F89225',
        fontSize: 12,
        fontFamily: Fonts.RobotoMedium,
    },
    dateText: {
        color: Colors.black,
        fontSize: 12,
        fontFamily: Fonts.RobotoRegular,
    },
    crossIcon: {
        position: 'absolute',
        right: 30,
        top: 0,
        zIndex: 999,
    },
});
export default ShoppingBagProduct;
