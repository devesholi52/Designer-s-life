import React, { useState } from 'react'
import { StyleSheet, Modal, View, ActivityIndicator, TouchableOpacity, Image, } from 'react-native'
import Video from 'react-native-video';

const Header = ({ onPress }) => {
    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.headerRight} onPress={onPress}>
                <Image
                    source={require('../Assets/cross.jpg')}
                    style={styles.closeIcon}
                />
            </TouchableOpacity>
        </View>
    );
};

export const VideoPreview = ({
    visible,
    onDismiss,
    onRequestClose,
    ref,
    url,
    onPressHeader,
    videoThumbnail,
    onPlaybackStatusUpdate,
}) => {
    const [loading, setLoading] = useState(false);

    let poster =
        videoThumbnail
            ? videoThumbnail
            :
            'https://www.flaticon.com/free-icon/play-button_109197';
    return (
        <Modal
            visible={visible}
            onDismiss={onDismiss}
            onRequestClose={onRequestClose}>
            <View style={{ flex: 1, backgroundColor: '#000' }}>
                <Header onPress={onPressHeader} />
                {loading && (
                    <ActivityIndicator
                        color={'#fff'}
                        style={{
                            justifyContent: 'center',
                            alignSelf: 'center',
                        }}
                    />
                )}
                {url && (
                    <Video
                        ref={ref}
                        style={styles.video}
                        // style={{width: 300, height: 300}}
                        controls={true}
                        poster={poster}
                        source={{ uri: url }}
                        useNativeControls
                        resizeMode="contain"
                        isLooping
                        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                        onLoadStart={() => setLoading(true)}
                        onLoad={() => setLoading(false)}
                    />
                )}
            </View>
        </Modal>
    );
};


const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        zIndex: 999,
        alignSelf: 'flex-end'
    },
    headerRight: {
        backgroundColor: 'rgba(238, 238, 238,0.3)',
        borderRadius: 20,
        padding: 8,
        top: 10,
        right: 10,
    },
    closeIcon: {
        height: 20,
        width: 20,
    },
    video: {
        flex: 1
    }
})