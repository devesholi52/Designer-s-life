import React, { useState, useEffect } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { Title, RadioButton } from 'react-native-paper'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { height, width, Color, Loader, showToastMessage } from '../../utils'
import Icon from 'react-native-vector-icons/AntDesign'
import { getLanguage, updateLanguage } from '../../API'
import { useSelector } from 'react-redux'

export default function Language({ navigation, postId, cancelPress_Language, okPress_Language }) {
    const token = useSelector(state => state?.user?.token)

    const [loading, setloading] = React.useState(false);
    const [checked, setChecked] = React.useState(0);
    const [tagValue, setTagValue] = useState([])
    // const [tagValue, setTagValue] = useState([
    //     "ENGLISH", "CHINESE", "SPANISH", "HINDI", "ARABIC", "PORTUGUESE", "BENGALI",
    //     "RUSSIAN", "JAPANESE", "LAHNDA", "JAVANESE", "GERMAN", "KOREAN", "FRENCH", "TELUGU"
    // ])

    useEffect(() => {
        setloading(true)
        getLanguage(token).then(res => {
            setloading(false)
            if (res) setTagValue(res)
            // console.log(res);
        }).catch(e => setloading(false))
    }, [])

    const FlexRadioBtn = (RadioCheckValue, text) => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, padding: 10 }}>
                <RadioButton
                    color="black"
                    value={RadioCheckValue}
                    status={checked === RadioCheckValue ? 'checked' : 'unchecked'}
                    onPress={() => onSubmit(RadioCheckValue, text)}
                />
                <Title style={{ color: '#455A64', fontSize: 12 }}>{text.language_title ? text.language_title : ''}</Title>
            </View>
        )
    }
    const renderItem = ({ item, index }) => (
        <View style={{ backgroundColor: '#F5F5F5', padding: 10, elevation: 5, shadowColor: '#555', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 2 } }}>
            {FlexRadioBtn(index, item)}
        </View>
    )
    const Header = () => (
        <View style={style.customHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={cancelPress_Language}>
                    <Icon name="arrowleft" size={25} color={Color.white} />
                </TouchableOpacity>
                <Title style={{ color: '#de1e8f', fontSize: 19, paddingHorizontal: 15 }}>{'Select Language'}</Title>
            </View>
        </View>
    )
    const onSubmit = (index, data) => {
        setloading(true)
        setChecked(index)
        let form = new FormData()
        form.append('post_id', postId)
        form.append('language', data.id)
        console.log('payload::::', form)
        updateLanguage(form, token).then(res => {
            setloading(false)
            showToastMessage('success')
            okPress_Language(data)
            // console.log('updated language ', res);
        }).catch(e => { setloading(false); showToastMessage('something went wrong') })
    }

    return (
        <ScrollView style={style.container}>
            {loading && <Loader />}
            <Header />
            <Title style={{ padding: 20 }}>Select language</Title>
            <View style={{ height: height / 1.5, padding: 20 }}>
                {(tagValue && tagValue.length !== 0) &&
                    <FlatList
                        data={tagValue}
                        renderItem={renderItem}
                        keyExtractor={item => item.id} />}
            </View>
        </ScrollView>
    )
}
const style = StyleSheet.create({
    container: {
        height: height,
        width: width,
        backgroundColor: '#fff',
        elevation: 10,
        shadowColor: '#555', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 2 },
        zIndex: 3,
        position: 'absolute',
    },
    customHeader: {
        alignItems: 'center',
        backgroundColor: Color.primaryColor,
        padding: 13,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10
    },
    btn: {
        backgroundColor: Color.btn,
        alignSelf: 'center',
        padding: 10,
        width: width / 1.4,
        borderRadius: 20,
        alignItems: 'center'
    },
    textInput: {
        margin: 10,
        backgroundColor: '#F5F5F5',
        padding: 20,
        color: Color.black,
        borderBottomWidth: 1,
        borderBottomColor: '#78909C'
    }
})