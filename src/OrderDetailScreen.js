import React, { useState, useEffect } from "react";
import Headers from "./Components/Headers/Headers";
import { Image, ScrollView, Text, TouchableOpacity, View, Modal, StyleSheet, TextInput, ToastAndroid } from "react-native";
import Colors from "./Theme/Colors";
import metrics from "./Theme/Metrics";
import IconChoose from 'react-native-vector-icons/FontAwesome';
import IconClose from 'react-native-vector-icons/Fontisto';
import ReviewModal from "./Screens/OrderScreen/Components/ReviewModal";
import { Icon } from "react-native-elements";
import { useRoute } from "@react-navigation/native";
import Fonts from "./Theme/Fonts";
import { width } from "./Screens/Notification/NotificationScreen";
import { Picker } from '@react-native-picker/picker';
import Appurl from "./API/Constant";
import { useSelector } from "react-redux";
import { showToastMessage, staticImage } from "./Utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Metrics from "./Theme/Metrics";
import moment from "moment";
import StarRating from "./Components/StarRating";
import { height } from "./UploadProduct/Deal";

const OrderDetailScreen = ({ navigation }) => {
  const route = useRoute()
  const { isDelivered } = route.params
  const [visibleReviewModal, setVisibleReviewModal] = useState(false)
  const [rating, setRating] = useState(0)
  const [ratingForDeal, setRatingForDeal] = useState(0)
  const [review, setReview] = useState('')
  const [reviewForDeal, setReviewForDeal] = useState('')
  const [reviewId, setReviewId] = useState('')
  const [reviewIdForDeal, setReviewIdForDeal] = useState('')
  const [modalVisible, setModalVisible] = useState(false);
  const [isLiked1, setIsLiked1] = useState(false)
  const [isLiked2, setIsLiked2] = useState(false)
  const [isLiked3, setIsLiked3] = useState(false)
  const [isLiked4, setIsLiked4] = useState(false)
  const [isLiked5, setIsLiked5] = useState(false)
  const [discount, setDiscount] = useState(route?.params?.productDiscount ? route?.params?.productDiscount : '');
  const [productPrice, setProductPrice] = useState(route?.params?.productPrice ? route?.params?.productPrice : '');
  const [productDeatils, setProductDeatils] = useState(route?.params?.productDeatil ? route?.params?.productDeatil : '');
  const [productId, setProductId] = useState(route?.params?.productID ? route?.params?.productID : '');
  const [orderID, setOrderId] = useState(route?.params?.orderID ? route?.params?.orderID : '');
  const [cartID, setCartID] = useState(route?.params?.cartID ? route?.params?.cartID : '');
  const [deliveryAdd, setDeliveryAdd] = useState(route?.params?.DeliveryAddress ? route?.params?.DeliveryAddress : '');
  const token = useSelector(state => state?.user?.token ? state.user.token : '')
  const [size, setSize] = useState(route?.params?.Size ? route?.params?.Size : '');
  const [quantity, setQuantity] = useState(route?.params?.quantity ? route?.params?.quantity : '');
  const [dealDetail, setDealDetail] = useState(route?.params?.dealDetail ? route?.params?.dealDetail : '');
  const [date, setdate] = useState(route?.params?.item ? route?.params?.item : '');
  const [order_status, setOrder_status] = useState(route?.params?.itemOrder_status ? route?.params?.itemOrder_status : '');
  const [return_product, setReturn_product] = useState(route?.params?.return_product ? route?.params?.return_product : '');


  const onCloseReviewModal = () => {
    setVisibleReviewModal(false)
  }
  const onOpenReviewModal = () => {
    setVisibleReviewModal(true)
  }
  const onSubmit = () => {
    setreview()
  }
  const onEditReviewModal = (rating, review) => {
    if (!review) { showToastMessage('please fill in'); return }
    if (!rating) { showToastMessage('please fill in'); return }
    let form = new FormData()
    form.append('product', productId)
    form.append('rating', rating)
    form.append('review', review)
    fetch(`${Appurl.POST_REVIEW_RATING}${reviewId}/`, {
      method: 'PUT',
      headers: { Authorization: `Token ${token}` },
      body: form
    }).then(res => res.json())
      .then(response => {
        if (response && response.id) {
          showToastMessage('Thanks for Rating us')
          setVisibleReviewModal(false)
        }
      })
  }
  const onEditReviewModalForDeal = (rating, review) => {
    if (!review) { showToastMessage('please fill in'); return }
    if (!rating) { showToastMessage('please fill in'); return }
    let form = new FormData()
    form.append('product', dealDetail?.deal_id)
    form.append('rating', rating)
    form.append('review', review)
    fetch(`${Appurl.POST_REVIEW_RATING}${reviewId}/`, {
      method: 'PUT',
      headers: { Authorization: `Token ${token}` },
      body: form
    }).then(res => res.json())
      .then(response => {
        if (response && response.id) {
          showToastMessage('Thanks for Rating us')
          setVisibleReviewModal(false)
        }
      })
  }
  const onDeleteReviewDeal = () => {
    // console.log(`${Appurl.POST_REVIEW_RATING_FOR_DEAL}${reviewId}/`,);
    // console.log(token);
    fetch(`${Appurl.POST_REVIEW_RATING_FOR_DEAL}${reviewId}/`, {
      method: 'DELETE',
      headers: { Authorization: `Token ${token}` },
    })
      .then(res => res.json())
      .then(response => {
        if (response && response?.message == "Deals rating review delete successfully.") {
          showToastMessage('Review deleted')
          setRating(0)
          setReviewId()
          setReview('')
          navigation.navigate("MyOrderScreen")
          // setVisibleReviewModal(false)
          // navigation.navigate("MyOrderScreen")
        }
      })
  }
  const onDeleteReviewProduct = () => {
    fetch(`${Appurl.POST_REVIEW_RATING}${reviewId}/`, {
      method: 'DELETE',
      headers: { Authorization: `Token ${token}` },
    })
      .then(res => res.json())
      .then(response => {
        showToastMessage('Review deleted')
        setRating(0)
        setReviewId()
        setReview('')
        navigation.navigate("MyOrderScreen")
        // setVisibleReviewModal(false)
      })
  }
  const onSubmitRatingAndReview = (rating, review) => {
    if (!review) { showToastMessage('please fill in'); return }
    if (!rating) { showToastMessage('please fill in'); return }
    let form = new FormData()
    form.append('product', productId)
    form.append('rating', rating)
    form.append('review', review)

    fetch(Appurl.POST_REVIEW_RATING, {
      method: 'POST',
      headers: { Authorization: `Token ${token}` },
      body: form
    })
      .then(res => res.json())
      .then(response => {
        if (response && response.data) {
          showToastMessage('Thanks for Rating us')
          setRating(rating)
          setReview(review)
          setReviewId(response?.data?.id)
          setVisibleReviewModal(false)
        }
      })
  }
  const onSubmitRatingAndReviewForDeal = (rating, review) => {
    if (!review) { showToastMessage('please fill in'); return }
    if (!rating) { showToastMessage('please fill in'); return }
    let form = new FormData()
    form.append('deal', dealDetail?.deal_id)
    form.append('rating', rating)
    form.append('review', review)
    fetch(Appurl.POST_REVIEW_RATING_FOR_DEAL, {
      method: 'POST',
      headers: { Authorization: `Token ${token}` },
      body: form
    })
      .then(res => res.json())
      .then(response => {
        if (response && response.data) {
          showToastMessage('Thanks for Rating us')
          setRating(rating)
          setReview(review)
          setReviewId(response?.data?.id)
          setVisibleReviewModal(false)
        }
      })
  }
  const returnProduct = () => {
    if (isLiked1 || isLiked2 || isLiked3 || isLiked4 || isLiked5) {
      let form = new FormData()
      form.append('order', orderID)
      form.append('return_product', productId)
      fetch(Appurl.RETURN_PRODUCT, {
        method: 'PUT',
        headers: { Authorization: `Token ${token}` },
        body: form
      }).then(res => res.json())
        .then(response => {
          if (response) {
            showToastMessage('Product returned successfully')
            setModalVisible(false)
            navigation.navigate("MyOrderScreen")
          }
        })
    }
    else {
      showToastMessage('please fill in'); return
    }

  }

  if (!dealDetail) {
    return (
      <ScrollView style={{ backgroundColor: 'white', flex: 1 }}>
        <View >
          <View style={{ flexDirection: 'row', paddingTop: 10 }}>
            <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
              <Image source={{ uri: productDeatils?.images?.[0]?.product_images ? Appurl.ROOT + productDeatils?.images?.[0]?.product_images : staticImage }} style={{ width: Metrics.ScreenWidth / 3, height: Metrics.ScreenWidth / 3 }} />
            </View>
            <View style={{ flex: 3 }}>
              <Text style={{ fontSize: 12, fontFamily: Fonts.RobotoBold, paddingTop: 5 }} ellipsizeMode={"tail"} numberOfLines={1}>{productDeatils?.product_name}</Text>
              <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 8, }}>
                <View style={{ flexDirection: 'row',/*  justifyContent: 'center', */ alignItems: 'center', }}>
                  <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoRegular, fontSize: 14 }}>Size</Text>
                  <Text style={{ marginLeft: 10, fontSize: 12, fontFamily: Fonts.RobotoMedium }}>{size}</Text>
                </View>
                <View style={{ flexDirection: 'row', /* justifyContent: 'center', */ alignItems: 'center', marginLeft: 30 }}>
                  <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoRegular, fontSize: 14 }}>Qty</Text>
                  <Text style={{ marginLeft: 10, fontSize: 12, fontFamily: Fonts.RobotoMedium }}>{quantity}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginVertical: 5, paddingTop: 5 }}>
                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: Fonts.RobotoMedium }}>{Math.trunc(productPrice * quantity - productPrice * quantity * discount / 100)}</Text>
                <Text style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid', marginHorizontal: 10, fontSize: 12, color: Colors.app_grey, fontFamily: Fonts.RobotoMedium }}>
                  {productPrice * quantity}
                </Text>
                <Text style={{ color: '#F89225', fontSize: 12, fontFamily: Fonts.RobotoMedium }}>{discount}%</Text>
              </View>
              {/* <Text style={{ color: 'black', fontFamily: Fonts.RobotoRegular, paddingTop: 10 }}>Delivered by {productDeatils?.created_on ? moment(productDeatils?.created_on).format('ddd, hA') : ''}</Text> */}
              <View style={{ marginVertical: 5, }}>
                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: Fonts.RobotoRegular }}>{date ? moment(date).format('MMM Do YYYY') : ''}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ backgroundColor: Colors.backgroundColor, flex: 1 }}>
          <View style={[styles.containerMAin, modalVisible ? { opacity: 0.1 } : 'white']}>
            <View
              contentContainerStyle={{ backgroundColor: Colors.white, padding: 10 }}
              showsVerticalScrollIndicator={false}
            >

              {/* <View style={{ backgroundColor: Colors.black, marginVertical: 20, marginTop: 40, padding: 10, marginHorizontal: 16 }}>
                <Text style={{ color: Colors.white, fontFamily: Fonts.RobotoBold, fontSize: 16 }}>Delivered</Text>
                <Text style={{ color: Colors.white, opacity: 0.8, fontSize: 12, fontFamily: Fonts.RobotoLight }}>on Sun, 15, Feb 2022</Text>
              </View> */}
              <View style={{ padding: 10, backgroundColor: Colors.greyFA, marginVertical: 5, marginHorizontal: 16, marginTop: 30 }}>
                <Text style={{ fontFamily: Fonts.RobotoBold, color: Colors.black, }}>Delivery Address</Text>
                <Text style={{ fontFamily: Fonts.RobotoBold, color: Colors.black, fontSize: 12 }}>{deliveryAdd?.name}</Text>
                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: Fonts.RobotoRegular }}>{deliveryAdd?.full_address},{deliveryAdd?.locality}, {deliveryAdd?.city}</Text>
                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: Fonts.RobotoRegular }}>{deliveryAdd?.state}, {deliveryAdd?.pin_code}</Text>
                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: Fonts.RobotoRegular }}>{deliveryAdd?.mobile}</Text>
              </View>



              <View style={{ padding: 10, backgroundColor: Colors.greyFA, marginVertical: 5, marginHorizontal: 16 }}>
                <Text style={{ fontFamily: Fonts.RobotoBold, color: Colors.black, }}>Tracking Detail</Text>
                <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                  <View style={{ flex: 2, justifyContent: 'center', paddingVertical: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                      {(order_status == 'new_order' || 'delivered' || 'shipped') ?
                        <View style={{ borderRadius: 200, width: 18, height: 18, justifyContent: 'center', borderWidth: 1, borderColor: Colors.black, backgroundColor: '#228b22' }}>
                          <Icon name={'check'} size={15} color="white" />
                        </View>
                        :
                        <View style={{ borderRadius: 200, width: 18, height: 18, justifyContent: 'center', borderWidth: 1, borderColor: Colors.black, }}>
                          <Icon name={'check'} size={15} color="black" />
                        </View>
                      }
                      <View style={{ flex: 1, height: 2, backgroundColor: Colors.black }} />
                    </View>
                    <View style={{ height: 20 }}>
                      <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoRegular }}>Packed</Text>
                    </View>


                  </View>
                  <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                      <View style={{ flex: 1, height: 2, backgroundColor: Colors.black }} />
                      {(order_status == 'delivered' || 'shipped') ?
                        <View style={{ borderRadius: 200, width: 18, height: 18, justifyContent: 'center', borderWidth: 1, borderColor: Colors.black, backgroundColor: '#228b22' }}>
                          <Icon name={'check'} size={15} color="white" />
                        </View>
                        :
                        <View style={{ borderRadius: 200, width: 18, height: 18, justifyContent: 'center', borderWidth: 1, borderColor: Colors.black, }}>
                          <Icon name={'check'} size={15} color="black" />
                        </View>
                      }
                      <View style={{ flex: 1, height: 2, backgroundColor: Colors.black }} />
                    </View>
                    <View style={{ height: 20 }}>
                      <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoRegular }}>Shipped</Text>
                    </View>


                  </View>
                  <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                      <View style={{ flex: 1, height: 2, backgroundColor: Colors.black }} />
                      {(order_status == 'delivered' || 'shipped') ?
                        <View style={{ borderRadius: 200, width: 18, height: 18, justifyContent: 'center', borderWidth: 1, borderColor: Colors.black, backgroundColor: '#228b22' }}>
                          <Icon name={'check'} size={15} color="white" />
                        </View>
                        :
                        <View style={{ borderRadius: 200, width: 18, height: 18, justifyContent: 'center', borderWidth: 1, borderColor: Colors.black, }}>
                          <Icon name={'check'} size={15} color="black" />
                        </View>
                      }
                      <View style={{ flex: 0.2, backgroundColor: Colors.black }} />
                    </View>
                    <View style={{ height: 20, marginLeft: 40 }}>
                      <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoRegular }}>Delivered</Text>
                    </View>

                  </View>
                  {/* <View style={{ flex: 2, justifyContent: 'center', alignItems: 'flex-end', paddingVertical: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                          <View style={{ flex: 1, height: 2, backgroundColor: Colors.black }} />
                          <View style={{ borderRadius: 200, width: 18, height: 18, justifyContent: 'center', borderWidth: 1, borderColor: Colors.black }}>

                          </View>
                        </View>
                        <View style={{ height: 20 }}>
                          <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoRegular }}></Text>
                        </View>
                      </View> */}
                </View>
              </View>




              <View style={{ padding: 10, backgroundColor: Colors.greyFA, marginVertical: 5, marginHorizontal: 16 }}>
                <Text style={{ fontFamily: Fonts.RobotoBold, color: Colors.black, }}>Price Detail</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoRegular }}>Total MRP</Text>
                  <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoBold }}>{productPrice * quantity}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoRegular }}>Discount Price</Text>
                  <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoBold }}>{Math.trunc(productPrice * quantity - (productPrice * quantity - productPrice * quantity * discount / 100))}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoRegular }}>Convenience Fee</Text>
                  <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoBold }}>Free</Text>
                </View>



              </View>
              <View style={{ padding: 10, backgroundColor: Colors.greyFA, marginVertical: 5, marginHorizontal: 16 }}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold }}>Total Amount</Text>
                  <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoBold }}>{Math.trunc(productPrice * quantity - productPrice * quantity * discount / 100)}</Text>
                </View>
              </View>
              {
                !review
                  ?
                  <TouchableOpacity onPress={() => onOpenReviewModal()} style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderWidth: 1, borderColor: Colors.app_grey, borderRadius: 7, marginVertical: 20, marginHorizontal: 20 }}
                  >
                    <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold }}>Write Review</Text>
                  </TouchableOpacity>
                  :
                  <>
                    <View style={{ marginVertical: 10, marginHorizontal: 16 }}>
                      {/* <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold }}>Reviews</Text> */}
                      {/* <View style={{ borderWidth: 1, borderColor: Colors.borderColor, borderRadius: 5, padding: 5 }}>
                      <Text style={{ fontSize: 12, fontFamily: Fonts.RobotoRegular }}>24 Sept 2021</Text>
                      <Text style={{ color: Colors.black, fontSize: 12, marginVertical: 5, fontFamily: Fonts.RobotoRegular }}>The point of using lorem ipsum that it has a more-or-less normal distribution of letters</Text>
                    </View> */}
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 20, }}>
                      <TouchableOpacity onPress={() => setVisibleReviewModal(true)} style={{ backgroundColor: Colors.black, width: 120, justifyContent: 'center', alignItems: 'center', paddingVertical: 15, borderRadius: 5, marginHorizontal: 10 }}>
                        <Text style={{ color: Colors.white, fontFamily: Fonts.RobotoBold, fontSize: 12 }}>
                          Edit Review
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => onDeleteReviewProduct()} style={{ backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.borderColor, width: 120, justifyContent: 'center', alignItems: 'center', paddingVertical: 15, borderRadius: 5, marginHorizontal: 10 }}>
                        <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold, fontSize: 12 }}>
                          Delete Review
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>

              }

              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.containerModal}>
                  <Text style={styles.textReview}>Review</Text>

                  <View style={{ flexDirection: 'row', margin: 8 }}>
                    <TouchableOpacity style={styles.iconModal}
                      onPress={() => setModalVisible(false)}>
                      <IconClose name="close" size={18} color={'black'} />
                    </TouchableOpacity>

                    <IconChoose name={isLiked1 ? "circle" : 'circle-thin'} size={18} color={'black'}
                      onPress={() => setIsLiked1(!isLiked1)} />
                    <Text style={{ fontFamily: Fonts.RobotoRegular, marginLeft: 7 }}>Size Problem</Text>
                  </View>

                  <View style={{ flexDirection: 'row', margin: 8 }}>
                    <IconChoose name={isLiked2 ? "circle" : 'circle-thin'} size={18} color={'black'}
                      onPress={() => setIsLiked2(!isLiked2)} />
                    <Text style={{ fontFamily: Fonts.RobotoRegular, marginLeft: 7 }}>Color not good</Text>
                  </View>

                  <View style={{ flexDirection: 'row', margin: 8 }}>
                    <IconChoose name={isLiked3 ? "circle" : 'circle-thin'} size={18} color={'black'}
                      onPress={() => setIsLiked3(!isLiked3)} />
                    <Text style={{ fontFamily: Fonts.RobotoRegular, marginLeft: 7 }}>Materials not good</Text>
                  </View>

                  <View style={{ flexDirection: 'row', margin: 8 }}>
                    <IconChoose name={isLiked4 ? "circle" : 'circle-thin'} size={18} color={'black'}
                      onPress={() => setIsLiked4(!isLiked4)} />
                    <Text style={{ fontFamily: Fonts.RobotoRegular, marginLeft: 7 }}>Cloth Stitches loose</Text>
                  </View>

                  <View style={{ flexDirection: 'row', margin: 8, }}>
                    <IconChoose name={isLiked5 ? "circle" : 'circle-thin'} size={18} color={'black'}
                      onPress={() => setIsLiked5(!isLiked5)} />
                    <Text style={{ fontFamily: Fonts.RobotoRegular, marginLeft: 7 }}>Any other</Text>
                  </View>

                  <TouchableOpacity style={styles.buttonmodal}
                    onPress={() => returnProduct()}>
                    <Text style={{ color: 'white', fontFamily: Fonts.RobotoMedium }}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </Modal>

              {(return_product == true) ?

                <View style={{ backgroundColor: '#228b22', paddingVertical: 14, paddingHorizontal: 40, marginHorizontal: 19, borderRadius: 5, marginBottom: 40, alignSelf: 'center', marginTop: 20 }}>
                  <Text style={{ color: 'white', fontFamily: Fonts.RobotoBold }}>Return in progress</Text>
                </View>
                :
                <TouchableOpacity style={{ backgroundColor: 'black', paddingVertical: 14, paddingHorizontal: 40, marginHorizontal: 19, borderRadius: 5, marginBottom: 40, alignSelf: 'center', marginTop: 20 }}
                  onPress={() => setModalVisible(true)}>
                  <Text style={{ color: 'white', fontFamily: Fonts.RobotoBold }}>Return</Text>
                </TouchableOpacity>
              }
            </View>
          </View>

          <ReviewModal
            visible={visibleReviewModal}
            onCloseReviewModal={onCloseReviewModal}
            onSubmit={(rating, review) => {
              if (!reviewId) onSubmitRatingAndReview(rating, review)
              else onEditReviewModal(rating, review)
            }}
          />
        </View>
      </ScrollView>
    )
  }
  else {
    return (
      <ScrollView style={{ backgroundColor: 'white', flex: 1 }}>
        <View >
          <View style={{ flexDirection: 'row', paddingTop: 10 }}>
            <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
              <Image source={{ uri: dealDetail?.deal_product?.[0]?.images?.[0]?.product_images ? Appurl.ROOT + dealDetail?.deal_product?.[0]?.images?.[0]?.product_images : staticImage }} style={{ width: Metrics.ScreenWidth / 3.5, height: Metrics.ScreenWidth / 3.5 }} />
            </View>
            <View style={{ flex: 3 }}>
              <Text style={{ fontSize: 12, fontFamily: Fonts.RobotoBold, paddingTop: 5 }} ellipsizeMode={"tail"} numberOfLines={1}>{dealDetail?.deal_name}</Text>
              <View style={{ flexDirection: 'row', marginVertical: 5, paddingTop: 10 }}>
                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: Fonts.RobotoMedium }}>{dealDetail?.deal_price}</Text>
                <Text style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid', marginHorizontal: 10, fontSize: 12, color: Colors.app_grey, fontFamily: Fonts.RobotoMedium }}>
                  {dealDetail?.total_price}
                </Text>
                <Text style={{ color: '#F89225', fontSize: 12, fontFamily: Fonts.RobotoMedium }}>{Math.trunc(100 - dealDetail?.deal_price * 100 / dealDetail?.total_price)}%</Text>
              </View>
              {/* <Text style={{ color: 'black', fontFamily: Fonts.RobotoRegular, paddingTop: 10 }}>Delivered by {dealDetail?.created_on ? moment(dealDetail?.created_on).format('ddd, hA') : ''}</Text> */}
              <View style={{ marginVertical: 5, }}>
                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: Fonts.RobotoRegular }}>{date ? moment(date).format('MMM Do YYYY') : ''}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ backgroundColor: Colors.backgroundColor, flex: 1 }}>
          <View style={[styles.containerMAin, modalVisible ? { opacity: 0.1 } : 'white']}>
            <View
              contentContainerStyle={{ backgroundColor: Colors.white, padding: 10 }}
              showsVerticalScrollIndicator={false}
            >

              {/* <View style={{ backgroundColor: Colors.black, marginVertical: 20, marginTop: 40, padding: 10, marginHorizontal: 16 }}>
                <Text style={{ color: Colors.white, fontFamily: Fonts.RobotoBold, fontSize: 16 }}>Delivered</Text>
                <Text style={{ color: Colors.white, opacity: 0.8, fontSize: 12, fontFamily: Fonts.RobotoLight }}>on Sun, 15, Feb 2022</Text>
              </View> */}
              <View style={{ padding: 10, backgroundColor: Colors.greyFA, marginVertical: 5, marginHorizontal: 16, marginTop: 30 }}>
                <Text style={{ fontFamily: Fonts.RobotoBold, color: Colors.black, }}>Delivery Address</Text>
                <Text style={{ fontFamily: Fonts.RobotoBold, color: Colors.black, fontSize: 12 }}>{deliveryAdd?.name}</Text>
                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: Fonts.RobotoRegular }}>{deliveryAdd?.full_address},{deliveryAdd?.locality}, {deliveryAdd?.city}</Text>
                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: Fonts.RobotoRegular }}>{deliveryAdd?.state}, {deliveryAdd?.pin_code}</Text>
                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: Fonts.RobotoRegular }}>{deliveryAdd?.mobile}</Text>
              </View>

              <View style={{ padding: 10, backgroundColor: Colors.greyFA, marginVertical: 5, marginHorizontal: 16 }}>
                <Text style={{ fontFamily: Fonts.RobotoBold, color: Colors.black, }}>Tracking Detail</Text>
                <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                  <View style={{ flex: 2, justifyContent: 'center', paddingVertical: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                      {(order_status == 'new_order' || 'delivered' || 'shipped') ?
                        <View style={{ borderRadius: 200, width: 18, height: 18, justifyContent: 'center', borderWidth: 1, borderColor: Colors.black, backgroundColor: '#228b22' }}>
                          <Icon name={'check'} size={15} color="white" />
                        </View>
                        :
                        <View style={{ borderRadius: 200, width: 18, height: 18, justifyContent: 'center', borderWidth: 1, borderColor: Colors.black, }}>
                          <Icon name={'check'} size={15} color="black" />
                        </View>
                      }
                      <View style={{ flex: 1, height: 2, backgroundColor: Colors.black }} />
                    </View>
                    <View style={{ height: 20 }}>
                      <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoRegular }}>Packed</Text>
                    </View>


                  </View>
                  <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                      <View style={{ flex: 1, height: 2, backgroundColor: Colors.black }} />
                      {(order_status == 'delivered' || 'shipped') ?
                        <View style={{ borderRadius: 200, width: 18, height: 18, justifyContent: 'center', borderWidth: 1, borderColor: Colors.black, backgroundColor: '#228b22' }}>
                          <Icon name={'check'} size={15} color="white" />
                        </View>
                        :
                        <View style={{ borderRadius: 200, width: 18, height: 18, justifyContent: 'center', borderWidth: 1, borderColor: Colors.black, }}>
                          <Icon name={'check'} size={15} color="black" />
                        </View>
                      }
                      <View style={{ flex: 1, height: 2, backgroundColor: Colors.black }} />
                    </View>
                    <View style={{ height: 20 }}>
                      <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoRegular }}>Shipped</Text>
                    </View>


                  </View>
                  <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                      <View style={{ flex: 1, height: 2, backgroundColor: Colors.black }} />
                      {(order_status == 'delivered' || 'shipped') ?
                        <View style={{ borderRadius: 200, width: 18, height: 18, justifyContent: 'center', borderWidth: 1, borderColor: Colors.black, backgroundColor: '#228b22' }}>
                          <Icon name={'check'} size={15} color="white" />
                        </View>
                        :
                        <View style={{ borderRadius: 200, width: 18, height: 18, justifyContent: 'center', borderWidth: 1, borderColor: Colors.black, }}>
                          <Icon name={'check'} size={15} color="black" />
                        </View>
                      }
                      <View style={{ flex: 0.2, backgroundColor: Colors.black }} />
                    </View>
                    <View style={{ height: 20, marginLeft: 40 }}>
                      <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoRegular }}>Delivered</Text>
                    </View>

                  </View>
                  {/* <View style={{ flex: 2, justifyContent: 'center', alignItems: 'flex-end', paddingVertical: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                          <View style={{ flex: 1, height: 2, backgroundColor: Colors.black }} />
                          <View style={{ borderRadius: 200, width: 18, height: 18, justifyContent: 'center', borderWidth: 1, borderColor: Colors.black }}>

                          </View>
                        </View>
                        <View style={{ height: 20 }}>
                          <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoRegular }}></Text>
                        </View>
                      </View> */}
                </View>
              </View>

              <View style={{ padding: 10, backgroundColor: Colors.greyFA, marginVertical: 5, marginHorizontal: 16 }}>
                <Text style={{ fontFamily: Fonts.RobotoBold, color: Colors.black, }}>Price Detail</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoRegular }}>Total MRP</Text>
                  <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoBold }}>{dealDetail?.total_price}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoRegular }}>Discount Price</Text>
                  <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoBold }}>{dealDetail?.discount}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoRegular }}>Convenience Fee</Text>
                  <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoBold }}>Free</Text>
                </View>



              </View>
              <View style={{ padding: 10, backgroundColor: Colors.greyFA, marginVertical: 5, marginHorizontal: 16 }}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold }}>Total Amount</Text>
                  <Text style={{ fontSize: 12, color: Colors.black, fontFamily: Fonts.RobotoBold }}>{dealDetail?.deal_price}</Text>
                </View>
              </View>
              {
                !review
                  ?
                  <TouchableOpacity onPress={() => onOpenReviewModal()} style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderWidth: 1, borderColor: Colors.app_grey, borderRadius: 7, marginVertical: 20, marginHorizontal: 20 }}
                  >
                    <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold }}>Write Review</Text>
                  </TouchableOpacity>
                  :
                  <>
                    <View style={{ marginVertical: 10, marginHorizontal: 16 }}>
                      {/* <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold }}>Reviews</Text> */}
                      {/* <View style={{ borderWidth: 1, borderColor: Colors.borderColor, borderRadius: 5, padding: 5 }}>
                              <Text style={{ fontSize: 12, fontFamily: Fonts.RobotoRegular }}>24 Sept 2021</Text>
                              <Text style={{ color: Colors.black, fontSize: 12, marginVertical: 5, fontFamily: Fonts.RobotoRegular }}>The point of using lorem ipsum that it has a more-or-less normal distribution of letters</Text>
                            </View> */}
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 20, }}>
                      <TouchableOpacity onPress={() => setVisibleReviewModal(true)} style={{ backgroundColor: Colors.black, width: 120, justifyContent: 'center', alignItems: 'center', paddingVertical: 15, borderRadius: 5, marginHorizontal: 10 }}>
                        <Text style={{ color: Colors.white, fontFamily: Fonts.RobotoBold, fontSize: 12 }}>
                          Edit Review
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => onDeleteReviewDeal()} style={{ backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.borderColor, width: 120, justifyContent: 'center', alignItems: 'center', paddingVertical: 15, borderRadius: 5, marginHorizontal: 10 }}>
                        <Text style={{ color: Colors.black, fontFamily: Fonts.RobotoBold, fontSize: 12 }}>
                          Delete Review
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>

              }

              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.containerModal}>
                  <Text style={styles.textReview}>Review</Text>

                  <View style={{ flexDirection: 'row', margin: 8 }}>
                    <TouchableOpacity style={styles.iconModal}
                      onPress={() => setModalVisible(false)}>
                      <IconClose name="close" size={18} color={'black'} />
                    </TouchableOpacity>

                    <IconChoose name={isLiked1 ? "circle" : 'circle-thin'} size={18} color={'black'}
                      onPress={() => setIsLiked1(!isLiked1)} />
                    <Text style={{ fontFamily: Fonts.RobotoRegular, marginLeft: 7 }}>Size Problem</Text>
                  </View>

                  <View style={{ flexDirection: 'row', margin: 8 }}>
                    <IconChoose name={isLiked2 ? "circle" : 'circle-thin'} size={18} color={'black'}
                      onPress={() => setIsLiked2(!isLiked2)} />
                    <Text style={{ fontFamily: Fonts.RobotoRegular, marginLeft: 7 }}>Color not good</Text>
                  </View>

                  <View style={{ flexDirection: 'row', margin: 8 }}>
                    <IconChoose name={isLiked3 ? "circle" : 'circle-thin'} size={18} color={'black'}
                      onPress={() => setIsLiked3(!isLiked3)} />
                    <Text style={{ fontFamily: Fonts.RobotoRegular, marginLeft: 7 }}>materialis not good</Text>
                  </View>

                  <View style={{ flexDirection: 'row', margin: 8 }}>
                    <IconChoose name={isLiked4 ? "circle" : 'circle-thin'} size={18} color={'black'}
                      onPress={() => setIsLiked4(!isLiked4)} />
                    <Text style={{ fontFamily: Fonts.RobotoRegular, marginLeft: 7 }}>Cloth Stitches loose</Text>
                  </View>

                  <View style={{ flexDirection: 'row', margin: 8, }}>
                    <IconChoose name={isLiked5 ? "circle" : 'circle-thin'} size={18} color={'black'}
                      onPress={() => setIsLiked5(!isLiked5)} />
                    <Text style={{ fontFamily: Fonts.RobotoRegular, marginLeft: 7 }}>Any other</Text>
                  </View>

                  <TouchableOpacity style={styles.buttonmodal}
                    onPress={() => returnProduct()}>
                    <Text style={{ color: 'white', fontFamily: Fonts.RobotoMedium }}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </Modal>

              {/* 
              {(return_product == false) ?
                <TouchableOpacity style={{ backgroundColor: 'black', paddingVertical: 14, paddingHorizontal: 40, marginHorizontal: 19, borderRadius: 5, marginBottom: 40, alignSelf: 'center', marginTop: 20 }}
                  onPress={() => setModalVisible(true)}>
                  <Text style={{ color: 'white', fontFamily: Fonts.RobotoBold }}>Return</Text>
                </TouchableOpacity>
                :
                <View style={{ backgroundColor: '#228b22', paddingVertical: 14, paddingHorizontal: 40, marginHorizontal: 19, borderRadius: 5, marginBottom: 40, alignSelf: 'center', marginTop: 20 }}>
                  <Text style={{ color: 'white', fontFamily: Fonts.RobotoBold }}>Return in progress</Text>
                </View>
              } */}
            </View>
          </View>

          <ReviewModal
            visible={visibleReviewModal}
            onCloseReviewModal={onCloseReviewModal}
            onSubmit={(rating, review) => {
              if (!reviewIdForDeal) onSubmitRatingAndReviewForDeal(rating, review)
              else onEditReviewModalForDeal(rating, review)
            }}
          />
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  containerMAin: {
    flex: 1,
    backgroundColor: Colors.white
  },
  containerModal: {
    // height: height / 2.7,
    width: width / 1.2,
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 10,
    justifyContent: "center",
    top: width / 1.4,
    // elevation:2
  },
  textReview: {
    fontFamily: Fonts.RobotoBold,
    fontSize: 17,
    alignSelf: 'center',
    color: 'black',
    paddingTop: 25

  },
  iconModal: {
    position: 'absolute',
    top: -40,
    right: 0

  },

  textinputmodal: {
    padding: 25,
    backgroundColor: '#eee',
    marginHorizontal: 10,
    borderRadius: 5,
    fontFamily: Fonts.RobotoRegular,
    color: 'black'

  },
  buttonmodal: {
    backgroundColor: 'orange',
    alignSelf: 'center',
    padding: 8,
    paddingHorizontal: 35,
    borderRadius: 10,
    margin: 30,
    fontFamily: Fonts.RobotoMedium
  },
  buttonmodal: {
    backgroundColor: 'orange',
    alignSelf: 'center',
    padding: 8,
    paddingHorizontal: 35,
    borderRadius: 10,
    margin: 30,
    fontFamily: Fonts.RobotoMedium
  },
  textReview: {
    fontFamily: Fonts.RobotoBold,
    fontSize: 17,
    alignSelf: 'center',
    color: 'black',
    paddingTop: 25

  },

})
export default OrderDetailScreen
