import React, { useState, useEffect, useRef } from 'react'
import { View, TextInput, Text, StyleSheet, FlatList } from 'react-native'
import { Color } from '../../Utils'
import InboxCard from './InboxCard'
import Icons from 'react-native-vector-icons/AntDesign'
import Headers from '../Components/Headers/Headers'
import { useSelector } from 'react-redux'
import { searchInbox } from '../API'
import { Loader } from '../Theme/Metrics'
import { RefreshControl } from 'react-native'
import Colors from '../Theme/Colors'
import { Platform } from 'react-native'
import Appurl from "../API/Constant"
import { showToastMessage } from '../Utils'

export default function index({ navigation }) {
    const userData = useSelector(state => state?.user?.userData ? state.user.userData : '')
    const token = useSelector(state => state?.user?.token ? state.user.token : '')
    const [searchText, setSearchText] = useState('')
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [wsState, setWsState] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [clicked, setClicked] = useState('0')
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket(`wss://lifeofdesigner.keycorp.in/ws/inbox/${userData?.id}`)
        // ws.current.onopen = () => { console.log("connection establish open") };
        // ws.current.onclose = () => { console.log("connection establish closed"); }
        return () => { ws.current.close(); };
    }, [wsState])

    // console.log("userData?.id", userData?.id);

    // const onRefresh = React.useCallback(() => {
    //     setRefreshing(true);
    //     getProducts();
    // }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getMessages()
            return unsubscribe;
        })
    }, [messages]);

    const getMessages = () => {
        //get messages
        setLoading(true)
        // console.log("ws.current.onmessage", ws.current.onmessage);
        try {
            ws.current.onmessage = e => {
                // alert("here bhjsadcjsck")
                const response = JSON.parse(e.data);
                if (response && response?.length > 0) {
                    // console.log("response", response);
                    setMessages(prev => response)
                } else {
                    setMessages([])
                    setLoading(false)
                }
            }
        } catch (e) {
            setMessages([])
            setLoading(false)
        }
        setTimeout(() => {
            setLoading(false)
        }, 1000);
    }

    const handleSearch = (value) => {
        setSearchText(value)
        let form = new FormData()
        form.append('user_name', value)
        fetch(Appurl.GET_SEARCH_INBOX, {
            method: 'PUT',
            headers: { Authorization: `Token ${token}` },
            body: form,
            redirect: 'follow'
        }).then(res => res.json())
            .then(response => {
                if (response) {
                    let res = response.data
                    // console.log('res inbox search', value, res);
                    if (res && res.length !== 0) {
                        setMessages(res)
                    } else { setMessages([]) }
                }
            })
    }
    // console.log("messagechechceh", messages);

    const removeUserInboxCustomer = (id) => {
        setLoading(true)
        let form = new FormData()
        form.append('reciver', `${id}`)
        // console.log("idherehere222", id);
        fetch(Appurl.REMOVE_USER_FROM_INBOX, {
            method: 'DELETE',
            headers: { Authorization: `Token ${token}` },
            body: form
        }).then(res => res.json())
            .then(response => {
                if (response && response.message == "Inbox delete successfully") {
                    showToastMessage('Message Deleted');
                    // ws.current.close()
                    // setIsMenu(false)
                    navigation.navigate("HomeScreen")
                    setWsState(prev => !prev)
                }
            }).finally(e => setLoading(false))
    }
    const removeUserInboxSeller = (id) => {
        setLoading(true)
        let form = new FormData()
        form.append('reciver', `${id}`)
        // console.log("idherehere1", id);
        fetch(Appurl.REMOVE_USER_FROM_INBOX, {
            method: 'DELETE',
            headers: { Authorization: `Token ${token}` },
            body: form
        }).then(res => res.json())
            .then(response => {
                if (response && response.message == "Inbox delete successfully") {
                    showToastMessage('Message Deleted');
                    // ws.current.close()
                    // setIsMenu(false)
                    navigation.navigate("HomeScreen")
                    setWsState(prev => !prev)
                }
            }).finally(e => setLoading(false))
    }
    const handleToggle = index => {
        // console.log("index", index);
        if (clicked === index) {
            return setClicked('0');
        }
        setClicked(index);
    };
    return (

        <View style={styles.container}
        // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            {loading && <Loader size={'small'} color={'#000'} />}
            <View style={styles.InputBoxContainer}>
                <TextInput placeholder="Search by Name"
                    placeholderTextColor={Colors.grayLight}
                    style={{ color: 'black', paddingVertical: 10, }}
                    value={searchText}
                    onChangeText={value => handleSearch(value)} />
                <Icons name="search1" size={14} color='grey' />
            </View>
            {(messages && messages.length !== 0) ?
                <FlatList
                    data={[...messages]}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        return (
                            <InboxCard
                                data={item} navigation={navigation}
                                refreshPage={() => {
                                    getMessages(), setRefreshing(true)
                                }}
                                handleDelete={(id, type) => {
                                    if (type == "seller") {
                                        removeUserInboxSeller(id)
                                    }
                                    else {
                                        removeUserInboxCustomer(id)
                                    }
                                }}
                                closeMenuOption={() => setClicked('0')}
                                onToggle={() => handleToggle(index)}
                                active={clicked === index}
                            />
                        )
                    }} />
                : <Text style={{ color: '#000', textAlign: 'center', padding: 10, fontSize: 20 }}>No data available</Text>}
        </View>)
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    InputBoxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        margin: 14,
        borderRadius: 20,
        paddingHorizontal: 10,
        borderColor: '#eee',
        marginBottom: 20,
    },
})