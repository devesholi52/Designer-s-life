import React from 'react'
import { View, Text, StyleSheet,ScrollView } from 'react-native'
// import Styles from '../Copmponents/CustomDropDown/Styles'
import { Color, Font } from '../Utils'
import Fonts from './Theme/Fonts'
import Headers from './Components/Headers/Headers'

export default function Privacy() {
    return (
        
        <ScrollView style={styles.container}>
            <View style={styles.Maincontainer}>
                <Text style={styles.Text}>Disclamier of Warranties and Limitation of Liability</Text>
                <Text style={styles.Disc}>Our Site may contain links to third party websites. When you click on a link to any other website or location, you will leave our Site
                    or Services and go to another site, and another entity may collect personal information or anonymous data from you. We have no
                    control over, do not review, and are not responsible for, these outside websites or their content. Please be aware that the terms of
                    this Privacy Policy do not apply to these outside websites or content </Text>


                <Text style={styles.Text}>Disclamier of Warranties and Limitation of Liability</Text>
                <Text style={styles.Disc}>We offer you choices regarding the collection, use, and sharing of your personal information. We may periodically send
                    you emails that directly promote the use of our Services. When you receive promotional communications from us, you may indicate
                    a preference to stop receiving further communications from us and you will have the opportunity to “opt-out” by following the
                    unsubscribe instructions provided in the email you receive or by contacting us directly. Despite your indicated email preferences, we
                    may send you service related communications, including notices of any updates to our Terms of Use or Privacy Policy.  </Text>


                <Text style={styles.Text}>Disclamier of Warranties and Limitation of Liability</Text>
                <Text style={styles.Disc}>Our Services are not directed to children under the age of 13. If a child under 13 submits personal information to us and we learn
                    that this is the case, we will take steps to remove the personal information from our databases. If you believe that we might have
                    any personal information from a child under 13, please contact us at help@lipsum.com  </Text>


                <Text style={styles.Text}>Disclamier of Warranties and Limitation of Liability</Text>
                <Text style={styles.Disc}>If you decide at any time that you no longer wish to accept cookies from our Services for any of the purposes described
                    above, then you can instruct your browser, by changing its settings, to stop accepting cookies or to prompt you before accepting a
                    cookie from the websites you visit. Consult your browser’s technical information. If you do not accept cookies, however, you may
                    not be able to use all portions of the Services or all function </Text>
            </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    Maincontainer: {
        margin: 15
    },
    Text: {
        fontSize: 15,
        color: 'black',
        fontFamily:Fonts.RobotoMedium,
        paddingBottom: 6

    },
    Disc: {
        fontSize: 13,
        color: 'grey',
        fontFamily:Fonts.RobotoRegular,
        alignContent: 'center',
        paddingBottom: 10,
        // letterSpacing: 1
        lineHeight:23
    },

})