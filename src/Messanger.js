import React, { useState, useCallback, useEffect, useRef } from 'react'
import { StyleSheet, View, ActivityIndicator, picimage, Text } from 'react-native'
import { GiftedChat, Bubble, Send, Avatar } from 'react-native-gifted-chat'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Divider, IconButton, } from 'react-native-paper';
import { Color } from '../Utils';
import Appurl from './API/Constant'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from "react-redux";
import { staticImage } from './Utils';
import { Loader } from './Theme/Metrics';

export default function Messanger({ route }) {
    const userData = useSelector(state => state?.user?.userData ? state.user.userData : '')
    const token = useSelector(state => state?.user?.token ? state.user.token : '')
    const [userID, setUserId] = useState(route?.params?.userId ? route?.params?.userId : '');
    const [messages, setMessages] = useState([]);
    const [enterMessages, setEnterMessages] = useState();
    const [loading, setLoading] = useState(true)
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket(`wss://lifeofdesigner.keycorp.in/ws/connection/${userData?.id}/${userID}`)
        // ws.current.onopen = () => { console.log("connection establish open") };
        // ws.current.onclose = () => { console.log("connection establish closed"); }
        return () => { ws.current.close(); };
    }, [])

    const onSend = useCallback((messages = []) => {
        let form = new FormData()
        form.append('user', userID)
        form.append('message', messages?.[0]?.text)
        form.append('created_by', userData?.id)
        // form.append('data', userdata)
        console.log("form", form);
        console.log("token", token);
        fetch(Appurl.CHAT_MESSAGE_SEND, {
            method: 'POST',
            headers: { Authorization: `Token ${token}` },
            body: form
        }).then(res => res.json())
            .then(response => {
            }
            )
        // setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }, [])

    useEffect(() => {
        // setLoading(true)
        try {
            ws.current.onmessage = e => {
                const response = JSON.parse(e.data);
                let final = []
                if (response && response.length > 0) {
                    setLoading(false)
                    response.forEach(value => {
                        let data = {
                            _id: value?.id,
                            text: value?.message ? value.message : '',
                            createdAt: value.created_on ? value.created_on : '',
                            user: {
                                _id: value?.created_by?.id == userData?.id ? 2 : 1,
                                name: value?.created_by?.first_name,
                                avatar: value?.created_by?.profile?.picture ? Appurl.ROOT + value?.created_by?.profile?.picture : staticImage,
                            },
                            sent: true,
                        }
                        final.push(data)
                        setLoading(false)
                    })
                }
                else { setMessages([]); setLoading(false) }
                setMessages(final)
            };
        } catch (e) {
            setLoading(false)
        }

    }, []);

    function renderLoading() {
        return <View style={styles.loadingContainer}>
            <ActivityIndicator size='large' color='#6646ee' />
        </View>
    }

    function renderBubble(props) {
        return (
            <Bubble {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: 'teal',
                        elevation: 10,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2
                        },
                        shadowOpacity: 0.25,
                        borderRadius: 15,
                        borderBottomEndRadius: 2
                    },
                    left: {
                        backgroundColor: '#eee',
                        elevation: 10,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2
                        },
                        shadowOpacity: 0.25,
                        borderRadius: 15,
                        borderBottomLeftRadius: 2
                    }
                }}
                textStyle={{ right: { color: 'white' }, left: { color: '#000' } }} />
        )
    }


    function renderSend(props) {
        return (
            <>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 3, paddingRight: 16 }}>
                    <Ionicons name={'document-text'} size={19} color={`#000080`}
                        onPress={picimage} style={styles.mediaButton} />
                    <Send {...props}>

                        <Ionicons name={'ios-send-sharp'} size={20} style={{ alignSelf: 'center', bottom: 12 }} color={`#000080`} />

                    </Send>
                </View>
            </>)
    }

    function scrollToBottomComponent() {
        return <View style={styles.bottomComponentContainer}>
            <IconButton icon='chevron-double-down' size={20} />
        </View>
    }
    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {loading && <Loader size={'small'} color={'#000'} />}
            {/* {(messages && messages.length !== 0) ? */}
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{ _id: 2, }}
                isCustomViewBottom
                renderBubble={renderBubble}
                placeholder={'Type your message here...'}
                textInputProps={{ color: '#000', }}
                alwaysShowSend
                inverted={false}
                renderSend={renderSend}
                scrollToBottom
                scrollToBottomComponent={scrollToBottomComponent}
                renderLoading={renderLoading}
                onQuickReply={reply => handleQuickReply(reply)}
            />
            {/* : */}
            {/* <Text style={styles.noData}>No data available</Text>} */}
        </View>
    )
}


const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    mediaButton: {
        alignSelf: 'center',
        // marginTop: 10,
        paddingHorizontal: 10
    },
    bottomComponentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'teal',
        borderRadius: 100,
        height: 30,
        width: 30
    },
    noData: {
        color: '#000',
        textAlign: 'center',
        fontSize: 18
    }
}
)

