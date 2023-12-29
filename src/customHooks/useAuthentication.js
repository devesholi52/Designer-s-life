import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { changeTokenValue, setUserInfo } from '../redux/reducers/userReducer';

function useAuthentication(props) {
    const dispatch = useDispatch()
    const [token, setToken] = useState(null);

    /**Fetch token from storage only once */
    const getUserToken = async () => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            setToken(token);
        } else {
            setToken({});
        }
        isAuthenticated();
    };

    const isAuthenticated = () => {
        if (token?.length > 5) return true;
        return false;
    };

    const initialRouteName = () => {
        let initialRouteName = null;
        if (!isAuthenticated() && token === null) {
            initialRouteName = 'Splash';
        } else if (token) {
            initialRouteName = 'Home';
        }
        // else {
        //   initialRouteName = ScreenNames.SendOtpViaEmailMobile;
        // }

        return initialRouteName;
    };

    return {
        isAuthenticated: isAuthenticated(),
        initialRoute: initialRouteName(),
        token: token,
        getUserToken: getUserToken,
    };
}

export default useAuthentication;