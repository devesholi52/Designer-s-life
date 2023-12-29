import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Toptab from '../Components/Toptab';
import Headers from "../Components/Headers/Headers";
import Product from './Product'
import Deal from './Deal'
import Colors from '../Theme/Colors';
const tabData = ['Product', 'Deal',]


const index = () => {
    const [activeTab, setActiveTab] = useState(1);

    return (

        <View style={{ flex: 1, backgroundColor: activeTab == '1' ? Colors.white : Colors.grayFed }}>
            {/* <Headers title={"Wishlist"} backButton={false} /> */}
            <Toptab
                data={tabData}
                // onlyline={true}
                activeTab={activeTab}
                setActiveTab={val => setActiveTab(val)} />

            {activeTab == '1' &&
                <Product />
            }

            {activeTab == '2' &&
                <Deal />
            }
        </View>
    )
}

export default index

// const styles = StyleSheet.create({
// })