import React from "react"
import { Pressable } from "react-native"
import { Icon } from "react-native-elements";
const RadioButton = (props) => {
    return (
        <>
            {
                props.status === 'checked'
                    ?
                    <>
                        <Pressable onPress={props.onPress} style={{ width: 18, height: 18, borderColor: "black", borderWidth: 0.5, borderRadius: 200, marginRight: 10, marginLeft: 8 }}>
                            <Icon name={'check'} size={16} />
                        </Pressable>
                    </>
                    :
                    <Pressable onPress={props.onPress} style={{ width: 18, height: 18, borderColor: "black", borderWidth: 0.5, borderRadius: 200, marginRight: 10, marginLeft: 8 }} />
            }

        </>
    )
}
export default RadioButton