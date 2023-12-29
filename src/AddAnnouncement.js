import { StyleSheet, Text, View, TouchableOpacity, Switch ,TextInput} from 'react-native'
import React, { useRef, useState } from 'react'
import Headers from './Components/Headers/Headers'
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import Fonts from './Theme/Fonts';
import { height, width } from './UploadProduct/Deal';



const AddAnnouncement = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const RichText = useRef()
    return (
        <View style={styles.container}>
            {/* <Headers title={"Announcement"} backButton={false} /> */}
            {/* <Text>djcb</Text> */}
            <View style={styles.container2}>
                <View>
                     {/* <RichEditor
                        disabled={false}
                        containerStyle={styles.editor}
                        ref={RichText}
                        // initialContentHTML={description}
                        // style={styles.rich}
                        placeholder={"Write here..."}
                    // onChange={(text) => setDescription(text)}
                    // editorInitializedCallback={editorInitializedCallback}
                    // initialHeight={300}
                    /> */}

                    <TextInput
                    placeholder='Write here..'
                    style={styles.TextInput}/>
                </View> 

                {/* <RichToolbar
                    style={[styles.richBar]}
                    editor={RichText}
                    disabled={false}
                    iconTint={"purple"}
                    selectedIconTint={"pink"}
                    disabledIconTint={"purple"}
                    // editorInitializedCallback={editorInitializedCallback}
                    iconSize={15}
                // actions={["insertVideo", ...defaultActions , actions.setStrikethrough,  actions.heading1 ,
                // ]}
                // iconMap={{ [actions.setStrikethrough]: strikethrough, }}
                /> */}
            </View>
            <View style={{flexDirection:'row',alignItems:'center',alignSelf:'flex-end'}}>
                <Text style={{fontFamily:Fonts.RobotoMedium,color:'black'}}>On/Off</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                    style={{ marginRight: 10, marginVertical: 20,marginLeft:5 }}
                />
            </View>

            <TouchableOpacity style={styles.buttonmodal} >
                <Text style={{ color: 'white', fontFamily: Fonts.RobotoMedium, fontSize: 16 }}>Submit</Text>
            </TouchableOpacity>
        </View>

    )
}

export default AddAnnouncement

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    container2: {
        borderWidth: 2,
        borderColor: '#eee',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        // borderRadius:20,
        margin: 20,
        // height: height / 2.5
    },
    buttonmodal: {
        backgroundColor: 'orange',
        alignSelf: 'center',
        padding: 8,
        paddingHorizontal: height / 6,
        paddingVertical: 10,
        borderRadius: 10,
        margin: 30,
        fontFamily: Fonts.RobotoMedium,
        marginTop: 40
    },
    richBar: {
        height: 50,
        backgroundColor: "#F5FCFF",
        // marginVertical: 10,
        marginTop: height / 3.4,
        borderBottomRadius: 20,
        // elevation:2
    },
    TextInput:{
        height:height/4,
        width:width/1.4,
        paddingBottom:height/4.8,
        paddingLeft:10
    }
})