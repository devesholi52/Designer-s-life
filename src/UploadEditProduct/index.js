import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Toptab from '../Components/Toptab';
import UploadProductScreenEdit from './UploadProductScreenEdit'
import DealEdit from './DealEdit';
const tabData = ['Product', 'Deal',]


const index = ({ navigation }) => {
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
                    <UploadProductScreenEdit navigation={navigation} />
                </>
            }

            {activeTab == '2' &&

                <DealEdit navigation={navigation} />
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