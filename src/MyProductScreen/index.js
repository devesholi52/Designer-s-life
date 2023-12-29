import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Toptab from '../Components/Toptab';
import Headers from '../Components/Headers/Headers';
import Product from './Product'
import Deal from './Deal';
const tabData = ['Product', 'Deal',]


const index = ({}) => {
    const [activeTab, setActiveTab] = useState(1);

    return (
        
        <View style={styles.container}>
            {/* <Headers title={"My Product"} backButton={false}/> */}
            <Toptab
                data={tabData}
                onlyline={true}
                activeTab={activeTab}
                setActiveTab={val => setActiveTab(val)} />

            {activeTab == '1' &&
                <>
                    <Product />
                    </>
                }

            {activeTab == '2' &&
                
                    <Deal />
                }
        </View>
    )
}

export default index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
})