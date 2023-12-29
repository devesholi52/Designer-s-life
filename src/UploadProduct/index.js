import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Toptab from '../Components/Toptab';
import Headers from "../Components/Headers/Headers";
import UploadProductScreen from './UploadProductScreen'
import Deal from './Deal'
const tabData = ['Product', 'Deal',]


const index = ({ navigation, }) => {
    const [activeTab, setActiveTab] = useState(1);

    return (

        <View style={styles.container}>
            {/* <Headers title={"Upload Products"} backButton={false}/> */}
            <Toptab
                data={tabData}
                onlyline={true}
                activeTab={activeTab}
                setActiveTab={val => setActiveTab(val)} />

            {activeTab == '1' &&
                <>
                    <UploadProductScreen navigation={navigation} />
                </>
            }

            {activeTab == '2' &&

                <Deal navigation={navigation} activeTab={activeTab} />
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