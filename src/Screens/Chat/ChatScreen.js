import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  BackHandler, Keyboard,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from 'react-native-elements';
import { GiftedChat, InputToolbar, Bubble, Avatar, Composer, Send, Actions } from "react-native-gifted-chat";
import { useNavigation } from "@react-navigation/native";
import Headers from "../../Components/Headers/Headers";
import Colors from "../../Theme/Colors";



const ChatScreen = (props) => {
  var count = 0
  const [backHandlerCount, setBackHandlerCount] = useState(0)
  const navigation = useNavigation()
  const [change, setChange] = useState(false)
  const [show, setShow] = useState(false);
  const [messages, setMessages] = useState([]);
  const [customText, setCustomText] = useState('')
  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);


  const backAction = () => {
    count++
    if (count >= 2) {
      count = 0
      navigation.goBack()
      // console.log("go back")
      return true
    }

    onRemove()
    return true

  };

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Ok 😀',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: require('../../Assets/profilepic2.jpg'),
        },
      },
      {
        _id: 2,
        text: 'Ok i\'ll check and confirm',
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'React Native',
          avatar: require('../../Assets/profilepic1.jpg'),
        },
      },
      {
        _id: 3,
        text: 'I am from Hudson,NY, and i need for 4 days',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: require('../../Assets/profilepic2.jpg'),
        },
      },
      {
        _id: 4,
        text: 'ok, Where you from and for how long you need',
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'React Native',
          avatar: require('../../Assets/profilepic1.jpg'),
        },
      },
      {
        _id: 5,
        text: 'Hi, hello, i want the dress',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: require('../../Assets/profilepic2.jpg'),
        },
      },
    ]);

    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };


  }, [])
  const onClick = emoji => {
    // console.log(emoji);
    setCustomText(prevState => prevState + emoji.code)
    // console.log(customText)
  };
  const onRemove = () => {
    // console.log("calling onremove")
    setShow(false)


  }

  const renderCustomSend = (props) => {
    return (
      <Send
        {...props}
        containerStyle={
          {
            borderRadius: 400,
            overflow: "hidden",
            marginVertical: 1,
            justifyContent: 'center',
            marginHorizontal: 10,
            backgroundColor: Colors.chatInputBackgroundColor
          }
        }
      >
        <Image source={require('../../Assets/Icon/send.png')} style={{ width: 30, height: 30, backgroundColor: Colors.chatInputBackgroundColor }} />
      </Send>
    );
  }

  const customComposer = (props) => {
    return (
      <Composer
        {...props}

        placeholder={'Hi how are you'} />
    );
  }

  const customtInputToolbar = props => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: Colors.white,
          borderTopColor: Colors.borderColor,
          // paddingVertical: 5,
          borderColor: '#D3D2D2',

        }}
        primaryStyle={{
          backgroundColor: Colors.chatInputBackgroundColor,
          borderColor: Colors.chatInputToolbarBorderColor,
          borderWidth: 1,
          borderRadius: 6,
          marginHorizontal: 20,
        }}
      />
    );
  }
  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: Colors.white,
      alignContent: "center"
    }}>
      {/* <Headers title={"Chat"} backButton={false} VerticalDot={true}/> */}
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
          avatar: require('../../Assets/profilepic1.jpg'),
        }}
        timeTextStyle={{
          right: { fontSize: 10 },
          left: { fontSize: 10 }
        }}
        showUserAvatar={true}
        alwaysShowSend={true}
        showAvatarForEveryMessage={true}
        renderSend={props => renderCustomSend(props)}
        renderInputToolbar={props => customtInputToolbar(props)}
        //renderChatFooter={props=>customChatFooter(props)}
        renderComposer={props => customComposer(props)}
        text={customText}
        onInputTextChanged={text => {
          // console.log("input text",text)
          setCustomText(text)
        }}
        renderActions={props => (
          <View style={{ flexDirection: "row" }}>
            <Actions
              {...props}
              onPressActionButton={() => {
                Keyboard.dismiss()
                setShow(!show)
              }
              }
              icon={() => (
                <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.black, borderRadius: 200 }}>
                  <Icon name={'android-messages'} type={'material-community'} size={16} color={Colors.white} />
                </TouchableOpacity>

              )}
              onSend={args => console.log(args)}
            />

            <Actions
              {...props}
              onPressActionButton={() => {
                Keyboard.dismiss()
                setShow(!show)
              }
              }
              icon={() => (
                <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 20 }}>😊</Text>
                </TouchableOpacity>

              )}
              onSend={args => console.log(args)}
            />



          </View>

        )}
        renderAvatar={props => (
          <Avatar
            {...props}

            imageStyle={{

              right: { height: 20, width: 20 },
              left: { height: 20, width: 20 }
            }}
          />
        )}
        renderBubble={props => (
          <View>
            <Bubble
              {...props}
              wrapperStyle={{
                left: {
                  backgroundColor: Colors.leftBubbleColor,
                  borderBottomEndRadius: 10,
                  borderBottomStartRadius: 0,
                  borderTopStartRadius: 10,
                  borderTopEndRadius: 10,
                },
                right: {
                  backgroundColor: Colors.black,
                  borderBottomEndRadius: 0,
                  borderBottomStartRadius: 10,
                  borderTopStartRadius: 10,
                  borderTopEndRadius: 10,
                },
              }}
              textStyle={{
                right: {
                  color: Colors.white,
                  fontFamily: 'Popppins-Medium',
                  fontSize: 14,
                },
                left: {
                  color: Colors.black,
                  fontFamily: 'Popppins-Medium',
                  fontSize: 14,
                },
              }}
            />
            {/*<Text>{props.currentMessage.createdAt.getTime()}</Text>*/}
          </View>

        )}
      />
      {/*<EmojiBoard showBoard={show} onClick={onClick} onRemove={onRemove}/>*/}
    </SafeAreaView>
  );
}

export default ChatScreen
