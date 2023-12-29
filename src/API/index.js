import axios from 'axios';
import Appurl from '../API/Constant'; // For export default we dont need to write {}
import { showToastMessage } from '../Utils'; // fot non export default  we need  { }

export const Login = data => {
    return axios
        .post(Appurl.LOGIN, data)
        .then(res => {
            return res;
        })
        .catch(e => console.log('err from API index ::: ', e));
};
export const GoogleLogin = data => {
    return fetch(Appurl.GOOGLEAPI, {
        method: 'POST',
        body: data,
    })
        .then(response => response.json())
        .then(response => response)

        .catch(e => console.log(e));
};
export const callSignInWithAppleAPI = (data) => {
    // console.log("data :: url ::: ", data, "::::",Appurl.APPLEAPI)
    return fetch(Appurl.APPLEAPI, {
        method: 'POST',
        body: data,
    })
        .then(response => response.json())
        .then((response) => {
            console.log("response from apple auth ::::", response)
            return response
        })

        .catch(e => console.log(e));
};
export const update_firebasetoken = (data, token) => {
    // console.log('data, token ::: push', data, token);
    return axios
        .post(Appurl.PUSH_NOTIFICATION, data, {
            headers: { Authorization: `Token ${token}` },
        })
        .then(res => {
            // console.log('res', res);
            return res;
        })
        .catch(e =>
            showToastMessage('Something went wrong while updating firebase token'),
        );
};

export const getBanner = token => {
    return axios
        .get(Appurl.BANNER, {
            headers: { Authorization: `Token ${token}` },
        })
        .then(res => res)
        .catch(e => showToastMessage('Something went wrong'));
};

export const ProductListing = token => {
    return axios
        .get(Appurl.ProductListing, {
            headers: { Authorization: `Token ${token}` },
        })
        .then(res => res);
    // .catch(e => showToastMessage('Something went wrong'))
};
export const Likes = (id, token) => {
    return axios
        .get(`${Appurl.GET_LIKE}${id}`, {
            headers: { Authorization: `Token ${token}` },
        })
        .then(res => res)
        .catch(e => showToastMessage('Something went wrong'));
};
export const addToFavourite = (data, token) => {
    return axios
        .put(Appurl.Put_Heart, data, {
            headers: { Authorization: `Token ${token}` },
        })
        .then(res => {
            // console.log('res', res);
            return res;
        })
        .catch(e => showToastMessage('Something went wrong'));
};

export const addToFavouriteDeal = (data, token) => {
    return axios
        .put(Appurl.DEAL_FAVOURITE_ADD, data, {
            headers: { Authorization: `Token ${token}` },
        })
        .then(res => res)
        .catch(e => showToastMessage('Something went wrong'));
};
export const removefromFavourite = (data, token) => {
    return axios
        .put(Appurl.REMOVE_FAVOURITE_DEAL, data, {
            headers: { Authorization: `Token ${token}` },
        })
        .then(res => res)
        .catch(e => showToastMessage('Something went wrong'));
};
export const removefromFavouriteProduct = (data, token) => {
    return axios
        .put(Appurl.REMOVE_FAVOURITE, data, {
            headers: { Authorization: `Token ${token}` },
        })
        .then(res => res)
        .catch(e => showToastMessage('Something went wrong'));
};
export const DeletefromFavouriteProduct = (data, token) => {
    return axios
        .put(Appurl.REMOVE_FAVOURITE, data, {
            headers: { Authorization: `Token ${token}` },
        })
        .then(res => res)
        .catch(e => showToastMessage('Something went wrong'));
};

export const DeleteInboxUser = (data, token) => {
    return axios
        .delete(Appurl.REMOVE_USER_FROM_INBOX, data, {
            headers: { Authorization: `Token ${token}` },
        })
        .then(res => res)
        .catch(e => showToastMessage('Something went wrong'));
};

export const MOVETOTHEBAG = (data, token) => {
    return axios
        .put(Appurl.POST_ADD_TO_CARD, data, {
            headers: { Authorization: `Token ${token}` },
        })
        .then(res => res)
        .catch(e => showToastMessage('Something went wrong'));
};
export const DeletefromFavourite = (data, token) => {
    return axios
        .put(Appurl.REMOVE_FAVOURITE_DEAL, data, {
            headers: { Authorization: `Token ${token}` },
        })
        .then(res => res)
        .catch(e => showToastMessage('Something went wrong'));
};

export const editProduct = (id, token) => {
    return axios
        .get(`${Appurl.ProductListing}${id}/`, {
            headers: { Authorization: `Token ${token}` },
        })
        .then(res => res)
        .catch(e => showToastMessage('Something went wrong'));
};

export const editDeal = (id, token) => {
    return axios
        .get(`${Appurl.dealGet}${id}/`, {
            headers: { Authorization: `Token ${token}` },
        })
        .then(res => res)
        .catch(e => showToastMessage('Something went wrong'));
};
export const searchProduct = (value, token) => {
    return axios
        .get(`${Appurl.GET_SEARCH}${value}`, {
            headers: { Authorization: `Token ${token}` },
        })
        .then(res => res)
        .catch(e => showToastMessage('Something went wrong'));
};
export const searchProductDeal = (value, token) => {
    return axios
        .get(`${Appurl.GET_SEARCH_DEAL}${value}`, {
            headers: { Authorization: `Token ${token}` },
        })
        .then(res => res)
        .catch(e => showToastMessage('Something went wrong'));
};

export const searchInbox = (value, token) => {
    // console.log(`${Appurl.GET_SEARCH_DEAL}${value}`, token);
    // return axios
    //     .put(Appurl.GET_SEARCH_INBOX, value, {
    //         headers: { Authorization: `Token ${token}` },
    //     })
    //     .then(res => res)
    //     .catch(e => showToastMessage('Something went wrong'));
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${token}`);
    var formdata = new FormData();
    formdata.append("user_name", "fd");

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    };

    return fetch("https://lifeofdesigner.keycorp.in/api/v1/chat/search_inbox/", requestOptions)
        .then(response => response.json())
        .then(result => result)
        .catch(error => console.log('error', error));
};



export const getParticularProductData = (id, token) => {
    console.log(`${Appurl.GET_PARTICULAR_PRODUCT_DATA}${id}/`, token);
    return axios
        .get(`${Appurl.GET_PARTICULAR_PRODUCT_DATA}${id}/`, {
            headers: { Authorization: `Token ${token}` },
        })
        .then(res => res);
    // .catch(e => showToastMessage('Something went wrong'))
};

export const getParticularDealData = (id, token) => {
    return axios
        .get(`${Appurl.GET_PARTICULAR_DEAL_DATA}${id}`, {
            headers: { Authorization: `Token ${token}` },
        })
        .then(res => res)
        .catch(e => showToastMessage('Something went wrong'));
};

export const getParticularDealDataUpdated = (id, token) => {
    return axios
        .get(`${Appurl.GET_PARTICULAR_DEAL_DATA_UPDATED}${id}`, {
            headers: { Authorization: `Token ${token}` },
        })
        .then(res => res)
        .catch(e => showToastMessage('Something went wrong'));
};

export const getShoppingbag = token => {
    return axios
        .get(`${Appurl.GET_SHOPPING_BAG}`, {
            headers: { Authorization: `Token ${token}` },
        })
        .then(res => res)
        .catch(e => showToastMessage('Something went wrong'));
};

export const getCartProducts = token => {
    return axios.get(`${Appurl.GET_SHOPPING_BAG}`, {
        headers: { Authorization: `Token ${token}` },
    }).then(res => res)
        .catch(e => e);
};

export const updateProductSize = (id, data, token) => {
    return fetch(`${Appurl.UPDATE_CART}${id}/`, {
        method: 'PUT',
        body: data,
        headers: { Authorization: `Token ${token}` }
    })
        .then(response => response.json())
        .then(response => response)
        .catch(e => e);
};

export const deleteCartProduct = (id, token) => {
    return axios.delete(`${Appurl.POST_ADD_TO_CARD}${id}/`, {
        headers: { Authorization: `Token ${token}` },
    }).then(res => res)
        .catch(e => e);
}

export const getAddressList = token => {
    return axios.get(`${Appurl.GET_DELIVERY_ADDRESS}`, {
        headers: { Authorization: `Token ${token}` },
    }).then(res => res)
        .catch(e => e);
};
export const getCardList = token => {
    return axios.get(`${Appurl.CARD_DATA}`, {
        headers: { Authorization: `Token ${token}` },
    }).then(res => res)
        .catch(e => e);
};
export const postCardList = token => {
    return axios.post(`${Appurl.CARD_DATA}`, {
        headers: { Authorization: `Token ${token}` },
    }).then(res => res)
        .catch(e => e);
};