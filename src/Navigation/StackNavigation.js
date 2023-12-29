import React from 'react';
import { Pressable, TouchableOpacity, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from "../Screens/SplashScreen/SplashScreen";
import SigninScreen from "../Screens/Auth/SigninScreen";
import SignupScreen from "../Screens/Auth/SignupScreen";
import ForgotPasswordScreen from "../Screens/Auth/ForgotPasswordScreen";
import ResetPassFromSignIn from "../Screens/Auth/ResetPassFromSignIn";
import OTPScreen from "../Screens/Auth/OTPScreen";
import ResetPasswordScreen from "../Screens/Auth/ResetPasswordScreen";
import HomeScreen from "../Screens/Home/HomeScreen";
import DrawerNavigation from "./DrawerNavigation";
import SearchScreen from "../Screens/Search/SearchScreen";
import ProfileScreen from "../Screens/Profile/ProfileScreen";
import Notification from "../Screens/Notification"
import FavouriteScreen from "../Screens/Favourite/FavouriteScreen";
import ChatScreen from "../Screens/Chat/ChatScreen";
import Transaction from "../Screens/Transaction";
import ChangePasswordScreen from "../Screens/Auth/ChangePasswordScreen";
import ProductDetailScreen from "../Screens/Home/ProductDetailScreen";
import RatingAndReviewScreen from "../Screens/Home/RatingAndReviewScreen";
import MyOrderScreen from "../Screens/OrderScreen/MyOrderScreen";
import MyProductDetailScreen from '../Screens/Product/MyProductDetailScreen';
import AddressScreen from "../Screens/Address/AddressScreen";
import AddressAlreadyExist from '../Screens/Address/AddressAlreadyExist';
import AddressScreenEdit from '../Screens/Address/AddressScreenEdit';
import ShoppingbagScreen from "../Screens/Home/ShoppingbagScreen/ShoppingbagScreen";
import PaymentScreen from "../Screens/Home/PaymentScreen";
import PaymentAlreadyExist from "../Screens/Home/PaymentAlreadyExist";
import UploadProductScreen from '../UploadProduct/UploadProductScreen';
// import OrderDetailScreen from "../Screens/OrderScreen/OrderDetailScreen";
import UploadProduct from "../UploadProduct"
import WishList from "../WishList"
import Messanger from '../Messanger';
import MyProductScreen from '../MyProductScreen'
import MyOrdersDelivered from '../MyOrdersDelivered';
import OrderDetailScreen from '../OrderDetailScreen';
import ApplePayment from '../ApplePayment';
import PaymentSuccessScreen from '../PaymentSuccessScreen';
import OrderShippedScreen from '../OrderShippedScreen';
import Privacy from '../Privacy';
import CommentsIcon from "../CommentsIcon";
import CommentsIconForDeal from "../CommentsIconForDeal";
import Inbox from '../Inbox'
import ProductDetailsDeal from '../ProductDetailsDeal'
import AddAnnouncement from '../AddAnnouncement';
import SubscriptionPymnt from '../SubscriptionPymnt';
import OtpProfileDeactive from '../OtpProfileDeactive';
import SearchNew from '../SearchNew/Deal'
import PasswordForgetSetPass from '../Screens/Auth/PasswordForgetSetPass';
import DealBuyNow from '../DealBuyNow';
import { Icon } from 'react-native-elements';
import dealList from '../dealList';
import UploadEditProduct from "../UploadEditProduct";
import DealEdit from '../UploadEditProduct/DealEdit';
import UploadProductScreenEdit from '../UploadEditProduct/UploadProductScreenEdit';
import ShowProductsForAnOrder from '../Screens/Product/Component/NewOrders/ShowProductsForAnOrder';
import ConfirmOrderScreen from '../Screens/Product/Component/ConfirmOrders/ConfirmOrderScreen';
import ShowShippedordersProduct from '../Screens/Product/Component/ShippedOrders/ShowShippedordersProduct';
import DeliveredOrders from '../Screens/Product/Component/DeliveredOrderScreen/DeliveredOrders';
import ScannerForZelle from '../Screens/Home/ScannerForZelle';
import ShowTransactionForProduct from '../ShowTransactionForProduct';
import MessageOrderDetails from '../MessageOrderDetails';
import HomeScreenEdit from "../Screens/Home/HomeScreenEdit"
import HomeProductEdit from "../Screens/Home/HomeProductEdit"
import EditedHomeProductEdit from '../Screens/Home/EditedHomeProductEdit';
import EditedHomeScreenedit from '../Screens/Home/EditedHomeScreenedit';

const Stack = createNativeStackNavigator();
const InitialScreens = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SplashScreen"
        options={withHeaderOptions(navigation, '')}
        component={SplashScreen}
      />
      <Stack.Screen
        name="Auth"
        options={withHeaderOptions(navigation, '')}
        component={Auth}
      />
      <Stack.Screen
        name="HomeScreen"
        options={withHeaderOptions(navigation, '')}
        component={HomeScreen}
      />

      <Stack.Screen
        name={"DrawerNavigation"}
        options={withHeaderOptions(navigation, '')}
        component={DrawerNavigation}
      />
    </Stack.Navigator>

  );
};

const withHeaderOptions = (navigation, title = '') => {
  // console.log('navigation', navigation);
  return {
    title: title,
    headerStyle: {
      backgroundColor: 'black',
      borderBottomColor: '#eee',
      borderBottomWidth: 1.2,
    },
    headerTitleStyle: {
      textAlign: 'left',
      // fontFamily: Font.Medium,
      fontSize: 17,
      color: "white"
    },
    headerTintColor: "#e3ae2a",
    headerRight: React.useCallback(() => {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {(title == 'Products' || title == 'Deal') && <View style={{ paddingHorizontal: 10 }} >
            <Icon name='shopping-bag' type='font-awesome' size={17} color={'#e3ae2a'} onPress={() => { navigation.navigate('ShoppingbagScreen') }} />
          </View>}
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            {/* <TouchableOpacity onPress={() => { navigation.navigate('Inbox') }}> */}
            {/* <TouchableOpacity onPress={() => { navigation.navigate('SigninScreen') }}> */}
            <Icon name="menu" type='MaterialIcons' size={22} color={'#e3ae2a'} style={{}} />
          </TouchableOpacity>
        </View>
      );
    }),
  };
};
const withoutHeaderOption = (navigation, isHeader = true, title = '') => {
  return {
    title: title,
    gestureEnabled: false,
    swipeEnabled: false,
    headerTintColor: '#000',
    headerStyle: {
      backgroundColor: '#fff',
      borderBottomColor: '#eee',
      borderBottomWidth: 1.2,
    },
    headerShown: isHeader,
  };
};

const Auth = ({ navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SplashScreen" options={{ headerShown: false }} component={SplashScreen} />
      <Stack.Screen name="SigninScreen" options={{ headerShown: false }} component={SigninScreen} />
      <Stack.Screen name="SignupScreen" options={{ headerShown: false }} component={SignupScreen} />
      <Stack.Screen name="ForgotPasswordScreen" options={{ headerShown: false }} component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassFromSignIn" options={{ headerShown: false }} component={ResetPassFromSignIn} />
      <Stack.Screen name="PasswordForgetSetPass" options={{ headerShown: false }} component={PasswordForgetSetPass} />
      <Stack.Screen name="OTPScreen" options={{ headerShown: false }} component={OTPScreen} />
      <Stack.Screen name="ResetPasswordScreen" options={{ headerShown: false }} component={ResetPasswordScreen} />
      <Stack.Screen name={"DrawerNavigation"} options={{ headerShown: false }} component={DrawerNavigation} />
      <Stack.Screen name="ChangePasswordScreen" options={withHeaderOptions(navigation, 'Change Password')} component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
};

const Home = ({ navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeScreen" options={withHeaderOptions(navigation, 'Products')} component={HomeScreen} />
      <Stack.Screen name="HomeScreenEdit" options={withHeaderOptions(navigation, 'Select Products')} component={HomeScreenEdit} />
      <Stack.Screen name="HomeProductEdit" options={withHeaderOptions(navigation, 'Select Products')} component={HomeProductEdit} />
      <Stack.Screen name="EditedHomeProductEdit" options={withHeaderOptions(navigation, 'Select Products')} component={EditedHomeProductEdit} />
      <Stack.Screen name="EditedHomeScreenedit" options={withHeaderOptions(navigation, 'Select Products')} component={EditedHomeScreenedit} />
      <Stack.Screen name="ProfileScreen" options={withHeaderOptions(navigation, 'Profile')} component={ProfileScreen} />
      {/* <Stack.Screen name="SigninScreen" options={{ headerShown: false }} component={SigninScreen} /> */}
      <Stack.Screen name="CommentsIcon" options={withHeaderOptions(navigation, 'Comments')} component={CommentsIcon} />
      <Stack.Screen name="MyOrderScreen" options={withHeaderOptions(navigation, 'Orders')} component={MyOrderScreen} />
      <Stack.Screen name="WishList" options={withHeaderOptions(navigation, 'Wishlist')} component={WishList} />
      <Stack.Screen name="OrderDetailScreen" options={withHeaderOptions(navigation, 'Order Detail')} component={OrderDetailScreen} />
      <Stack.Screen name="ApplePayment" options={withHeaderOptions(navigation, 'Apple Payment')} component={ApplePayment} />
      <Stack.Screen name="PaymentSuccessScreen" options={{ headerShown: false }} component={PaymentSuccessScreen} />
      <Stack.Screen name="OrderShippedScreen" options={withHeaderOptions(navigation, 'Order Detail')} component={OrderShippedScreen} />
      <Stack.Screen name="MyOrdersDelivered" options={withHeaderOptions(navigation, 'Order Detail')} component={MyOrdersDelivered} />
      <Stack.Screen name="Messanger" options={withHeaderOptions(navigation, 'Chat')} component={Messanger} />
      <Stack.Screen name="MessageOrderDetails" options={withHeaderOptions(navigation, 'Chat')} component={MessageOrderDetails} />
      <Stack.Screen name="AddAnnouncement" options={withHeaderOptions(navigation, 'Announcement')} component={AddAnnouncement} />
      <Stack.Screen name="SubscriptionPymnt" options={withHeaderOptions(navigation, 'Payment')} component={SubscriptionPymnt} />
      <Stack.Screen name="SearchNew" options={withHeaderOptions(navigation, 'Deal')} component={SearchNew} />
      <Stack.Screen name="ChatScreen" options={withHeaderOptions(navigation, 'Chat')} component={ChatScreen} />
      <Stack.Screen name="Inbox" options={withHeaderOptions(navigation, 'Inbox')} component={Inbox} />
      <Stack.Screen name="Transaction" options={withHeaderOptions(navigation, 'Transaction')} component={Transaction} />
      <Stack.Screen name="ChangePasswordScreen" options={withHeaderOptions(navigation, 'Change Password')} component={ChangePasswordScreen} />
      <Stack.Screen name="ProductDetailScreen" options={{ headerShown: false }} component={ProductDetailScreen} />
      <Stack.Screen name="RatingAndReviewScreen" options={withHeaderOptions(navigation, 'Rating and Review')} component={RatingAndReviewScreen} />
      <Stack.Screen name="OrdersScreens" options={withHeaderOptions(navigation, '')} component={OrdersScreens} />
      <Stack.Screen name="MyProductScreen" options={withHeaderOptions(navigation, 'My Product')} component={MyProductScreen} />
      <Stack.Screen name="MyProductDetailScreen" options={withHeaderOptions(navigation, 'Order Details')} component={MyProductDetailScreen} />
      <Stack.Screen name="AddressScreen" options={withHeaderOptions(navigation, 'Address')} component={AddressScreen} />
      <Stack.Screen name="AddressScreenEdit" options={withHeaderOptions(navigation, 'Address')} component={AddressScreenEdit} />
      <Stack.Screen name="AddressAlreadyExist" options={withHeaderOptions(navigation, 'Address')} component={AddressAlreadyExist} />
      <Stack.Screen name="PaymentAlreadyExist" options={withHeaderOptions(navigation, 'Payment')} component={PaymentAlreadyExist} />
      <Stack.Screen name="ShoppingbagScreen" options={withHeaderOptions(navigation, 'Shopping bag')} component={ShoppingbagScreen} />
      <Stack.Screen name="PaymentScreen" options={withHeaderOptions(navigation, 'Payment')} component={PaymentScreen} />
      <Stack.Screen name="ScannerForZelle" options={withHeaderOptions(navigation, 'Scan')} component={ScannerForZelle} />
      <Stack.Screen name="UploadProduct" options={withHeaderOptions(navigation, 'Upload Products')} component={UploadProduct} />
      <Stack.Screen name="UploadEditProduct" options={withHeaderOptions(navigation, 'Upload Products')} component={UploadEditProduct} />
      <Stack.Screen name="DealEdit" options={withHeaderOptions(navigation, 'Edit Deal')} component={DealEdit} />
      <Stack.Screen name="UploadProductScreenEdit" options={withHeaderOptions(navigation, 'Edit Product')} component={UploadProductScreenEdit} />
      <Stack.Screen name="Privacy" options={withHeaderOptions(navigation, 'Privacy')} component={Privacy} />
      <Stack.Screen name="ShowProductsForAnOrder" options={withHeaderOptions(navigation, 'Products')} component={ShowProductsForAnOrder} />
      <Stack.Screen name="ShowTransactionForProduct" options={withHeaderOptions(navigation, 'Transaction')} component={ShowTransactionForProduct} />
      <Stack.Screen name="ConfirmOrderScreen" options={withHeaderOptions(navigation, 'Products')} component={ConfirmOrderScreen} />
      <Stack.Screen name="ShowShippedordersProduct" options={withHeaderOptions(navigation, 'Products')} component={ShowShippedordersProduct} />
      <Stack.Screen name="DeliveredOrders" options={withHeaderOptions(navigation, 'Products')} component={DeliveredOrders} />
      <Stack.Screen name="ProductDetailsDeal" options={{ headerShown: false }} component={ProductDetailsDeal} />

    </Stack.Navigator>
  )
}

const Deal = ({ navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SearchNew" options={withHeaderOptions(navigation, 'Deal')} component={SearchNew} />
      <Stack.Screen name="HomeScreenEdit" options={withHeaderOptions(navigation, 'Select Products')} component={HomeScreenEdit} />
      <Stack.Screen name="HomeProductEdit" options={withHeaderOptions(navigation, 'Select Products')} component={HomeProductEdit} />
      <Stack.Screen name="EditedHomeProductEdit" options={withHeaderOptions(navigation, 'Select Products')} component={EditedHomeProductEdit} />
      <Stack.Screen name="EditedHomeScreenedit" options={withHeaderOptions(navigation, 'Select Products')} component={EditedHomeScreenedit} />
      <Stack.Screen name="ProfileScreen" options={withHeaderOptions(navigation, 'Profile')} component={ProfileScreen} />
      <Stack.Screen name="CommentsIconForDeal" options={withHeaderOptions(navigation, 'Comment')} component={CommentsIconForDeal} />
      {/* <Stack.Screen name="Chat" options={withHeaderOptions(navigation, '')} component={Chat} /> */}
      <Stack.Screen name="UploadProduct" options={withHeaderOptions(navigation, 'Upload Products')} component={UploadProduct} />
      <Stack.Screen name="DealEdit" options={withHeaderOptions(navigation, 'Edit Deal')} component={DealEdit} />
      <Stack.Screen name="dealList" options={withHeaderOptions(navigation, 'Superb Amazing Deal ')} component={dealList} />
      <Stack.Screen name="ProductDetailsDeal" options={{ headerShown: false }} component={ProductDetailsDeal} />
      <Stack.Screen name="MyOrderScreen" options={withHeaderOptions(navigation, 'Orders')} component={MyOrderScreen} />
      <Stack.Screen name="ChatScreen" options={withHeaderOptions(navigation, 'Chat')} component={ChatScreen} />
      <Stack.Screen name="ProductDetailScreen" options={{ headerShown: false }} component={ProductDetailScreen} />
      <Stack.Screen name="OrderDetailScreen" options={withHeaderOptions(navigation, 'Order Detail')} component={OrderDetailScreen} />
      <Stack.Screen name="ApplePayment" options={withHeaderOptions(navigation, 'Apple Payment')} component={ApplePayment} />
      <Stack.Screen name="PaymentSuccessScreen" options={{ headerShown: false }} component={PaymentSuccessScreen} />
      <Stack.Screen name="OrderShippedScreen" options={withHeaderOptions(navigation, 'Order Detail')} component={OrderShippedScreen} />
      <Stack.Screen name="MyOrdersDelivered" options={withHeaderOptions(navigation, 'Order Detail')} component={MyOrdersDelivered} />
      <Stack.Screen name="Messanger" options={withHeaderOptions(navigation, 'Chat')} component={Messanger} />
      <Stack.Screen name="MessageOrderDetails" options={withHeaderOptions(navigation, 'Chat')} component={MessageOrderDetails} />
      <Stack.Screen name="AddAnnouncement" options={withHeaderOptions(navigation, 'Announcement')} component={AddAnnouncement} />
      <Stack.Screen name="SubscriptionPymnt" options={withHeaderOptions(navigation, 'Payment')} component={SubscriptionPymnt} />
      <Stack.Screen name="Inbox" options={withHeaderOptions(navigation, 'Inbox')} component={Inbox} />
      <Stack.Screen name="Transaction" options={withHeaderOptions(navigation, 'Transaction')} component={Transaction} />
      <Stack.Screen name="ChangePasswordScreen" options={withHeaderOptions(navigation, 'Change Password')} component={ChangePasswordScreen} />
      <Stack.Screen name="RatingAndReviewScreen" options={withHeaderOptions(navigation, 'Rating and Review')} component={RatingAndReviewScreen} />
      <Stack.Screen name="OrdersScreens" options={withHeaderOptions(navigation, '')} component={OrdersScreens} />
      <Stack.Screen name="MyProductScreen" options={withHeaderOptions(navigation, 'My Product')} component={MyProductScreen} />
      <Stack.Screen name="MyProductDetailScreen" options={withHeaderOptions(navigation, 'Order Details')} component={MyProductDetailScreen} />
      <Stack.Screen name="AddressScreen" options={withHeaderOptions(navigation, 'Address')} component={AddressScreen} />
      <Stack.Screen name="AddressScreenEdit" options={withHeaderOptions(navigation, 'Address')} component={AddressScreenEdit} />
      <Stack.Screen name="AddressAlreadyExist" options={withHeaderOptions(navigation, 'Address')} component={AddressAlreadyExist} />
      <Stack.Screen name="PaymentAlreadyExist" options={withHeaderOptions(navigation, 'Payment')} component={PaymentAlreadyExist} />
      <Stack.Screen name="ShoppingbagScreen" options={withHeaderOptions(navigation, 'Shopping bag')} component={ShoppingbagScreen} />
      <Stack.Screen name="PaymentScreen" options={withHeaderOptions(navigation, 'Payment')} component={PaymentScreen} />
      <Stack.Screen name="ScannerForZelle" options={withHeaderOptions(navigation, 'Scan')} component={ScannerForZelle} />
      <Stack.Screen name="UploadEditProduct" options={withHeaderOptions(navigation, 'Upload Products')} component={UploadEditProduct} />
      <Stack.Screen name="UploadProductScreenEdit" options={withHeaderOptions(navigation, 'Edit Product')} component={UploadProductScreenEdit} />
      <Stack.Screen name="Privacy" options={withHeaderOptions(navigation, 'Privacy')} component={Privacy} />
      <Stack.Screen name="ShowProductsForAnOrder" options={withHeaderOptions(navigation, 'Products')} component={ShowProductsForAnOrder} />
      <Stack.Screen name="ConfirmOrderScreen" options={withHeaderOptions(navigation, 'Products')} component={ConfirmOrderScreen} />
      <Stack.Screen name="ShowShippedordersProduct" options={withHeaderOptions(navigation, 'Products')} component={ShowShippedordersProduct} />
      <Stack.Screen name="DeliveredOrders" options={withHeaderOptions(navigation, 'Products')} component={DeliveredOrders} />
      <Stack.Screen name="ShowTransactionForProduct" options={withHeaderOptions(navigation, 'Transaction')} component={ShowTransactionForProduct} />
    </Stack.Navigator>
  )
}

const OrdersScreens = ({ navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MyOrderScreen" options={withHeaderOptions(navigation, 'Orders')} component={MyOrderScreen} />
      <Stack.Screen name="OrderDetailScreen" options={withHeaderOptions(navigation, 'Order Detail')} component={OrderDetailScreen} />
      <Stack.Screen name="OrderShippedScreen" options={withHeaderOptions(navigation, 'Order Detail')} component={OrderShippedScreen} />
      <Stack.Screen name="ChatScreen" options={withHeaderOptions(navigation, 'Chat')} component={ChatScreen} />
      <Stack.Screen name="MyProductDetailScreen" options={withHeaderOptions(navigation, 'Order Details')} component={MyProductDetailScreen} />
    </Stack.Navigator>
  )
}


const Favourite = ({ navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="WishList" options={withHeaderOptions(navigation, 'Wishlist')} component={WishList} />
      <Stack.Screen name="HomeScreenEdit" options={withHeaderOptions(navigation, 'Select Products')} component={HomeScreenEdit} />
      <Stack.Screen name="HomeProductEdit" options={withHeaderOptions(navigation, 'Select Products')} component={HomeProductEdit} />
      <Stack.Screen name="EditedHomeProductEdit" options={withHeaderOptions(navigation, 'Select Products')} component={EditedHomeProductEdit} />
      <Stack.Screen name="EditedHomeScreenedit" options={withHeaderOptions(navigation, 'Select Products')} component={EditedHomeScreenedit} />
      <Stack.Screen name="ProfileScreen" options={withHeaderOptions(navigation, 'Profile')} component={ProfileScreen} />
      <Stack.Screen name="ProductDetailsDeal" options={{ headerShown: false }} component={ProductDetailsDeal} />
      <Stack.Screen name="MyOrderScreen" options={withHeaderOptions(navigation, 'Orders')} component={MyOrderScreen} />
      <Stack.Screen name="ChatScreen" options={withHeaderOptions(navigation, 'Chat')} component={ChatScreen} />
      <Stack.Screen name="ProductDetailScreen" options={{ headerShown: false }} component={ProductDetailScreen} />
      <Stack.Screen name="OrderDetailScreen" options={withHeaderOptions(navigation, 'Order Detail')} component={OrderDetailScreen} />
      <Stack.Screen name="ApplePayment" options={withHeaderOptions(navigation, 'Apple Payment')} component={ApplePayment} />
      <Stack.Screen name="PaymentSuccessScreen" options={{ headerShown: false }} component={PaymentSuccessScreen} />
      <Stack.Screen name="OrderShippedScreen" options={withHeaderOptions(navigation, 'Order Detail')} component={OrderShippedScreen} />
      <Stack.Screen name="MyOrdersDelivered" options={withHeaderOptions(navigation, 'Order Detail')} component={MyOrdersDelivered} />
      <Stack.Screen name="Messanger" options={withHeaderOptions(navigation, 'Chat')} component={Messanger} />
      <Stack.Screen name="MessageOrderDetails" options={withHeaderOptions(navigation, 'Chat')} component={MessageOrderDetails} />
      <Stack.Screen name="AddAnnouncement" options={withHeaderOptions(navigation, 'Announcement')} component={AddAnnouncement} />
      <Stack.Screen name="SubscriptionPymnt" options={withHeaderOptions(navigation, 'Payment')} component={SubscriptionPymnt} />
      <Stack.Screen name="Inbox" options={withHeaderOptions(navigation, 'Inbox')} component={Inbox} />
      <Stack.Screen name="Transaction" options={withHeaderOptions(navigation, 'Transaction')} component={Transaction} />
      <Stack.Screen name="ChangePasswordScreen" options={withHeaderOptions(navigation, 'Change Password')} component={ChangePasswordScreen} />
      <Stack.Screen name="RatingAndReviewScreen" options={withHeaderOptions(navigation, 'Rating and Review')} component={RatingAndReviewScreen} />
      <Stack.Screen name="OrdersScreens" options={withHeaderOptions(navigation, '')} component={OrdersScreens} />
      <Stack.Screen name="MyProductScreen" options={withHeaderOptions(navigation, 'My Product')} component={MyProductScreen} />
      <Stack.Screen name="MyProductDetailScreen" options={withHeaderOptions(navigation, 'Order Details')} component={MyProductDetailScreen} />
      <Stack.Screen name="AddressScreen" options={withHeaderOptions(navigation, 'Address')} component={AddressScreen} />
      <Stack.Screen name="AddressScreenEdit" options={withHeaderOptions(navigation, 'Address')} component={AddressScreenEdit} />
      <Stack.Screen name="AddressAlreadyExist" options={withHeaderOptions(navigation, 'Address')} component={AddressAlreadyExist} />
      <Stack.Screen name="PaymentAlreadyExist" options={withHeaderOptions(navigation, 'Payment')} component={PaymentAlreadyExist} />
      <Stack.Screen name="ShoppingbagScreen" options={withHeaderOptions(navigation, 'Shopping bag')} component={ShoppingbagScreen} />
      <Stack.Screen name="PaymentScreen" options={withHeaderOptions(navigation, 'Payment')} component={PaymentScreen} />
      <Stack.Screen name="ScannerForZelle" options={withHeaderOptions(navigation, 'Scan')} component={ScannerForZelle} />
      <Stack.Screen name="UploadProduct" options={withHeaderOptions(navigation, 'Upload Products')} component={UploadProduct} />
      <Stack.Screen name="UploadEditProduct" options={withHeaderOptions(navigation, 'Upload Products')} component={UploadEditProduct} />
      <Stack.Screen name="DealEdit" options={withHeaderOptions(navigation, 'Edit Deal')} component={DealEdit} />
      <Stack.Screen name="UploadProductScreenEdit" options={withHeaderOptions(navigation, 'Edit Product')} component={UploadProductScreenEdit} />
      <Stack.Screen name="Privacy" options={withHeaderOptions(navigation, 'Privacy')} component={Privacy} />
      <Stack.Screen name="ShowProductsForAnOrder" options={withHeaderOptions(navigation, 'Products')} component={ShowProductsForAnOrder} />
      <Stack.Screen name="ConfirmOrderScreen" options={withHeaderOptions(navigation, 'Products')} component={ConfirmOrderScreen} />
      <Stack.Screen name="ShowShippedordersProduct" options={withHeaderOptions(navigation, 'Products')} component={ShowShippedordersProduct} />
      <Stack.Screen name="DeliveredOrders" options={withHeaderOptions(navigation, 'Products')} component={DeliveredOrders} />
      <Stack.Screen name="ShowTransactionForProduct" options={withHeaderOptions(navigation, 'Transaction')} component={ShowTransactionForProduct} />

    </Stack.Navigator>
  )
}

// const Notification = () => {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="NotificationScreen"
//         options={withHeaderOptions(navigation, '')}
//         component={NotificationScreen}
//       />

//       <Stack.Screen
//         name="UploadProduct"
//         options={withHeaderOptions(navigation, '')}
//         component={UploadProduct}
//       />

//       <Stack.Screen
//         name="Chat"
//         options={withHeaderOptions(navigation, '')}
//         component={Chat}
//       />

//       <Stack.Screen
//         name="TransactionScreen"
//         options={withHeaderOptions(navigation, '')}
//         component={TransactionScreen}
//       />

//       <Stack.Screen
//         name="Orders"
//         options={withHeaderOptions(navigation, '')}
//         component={Orders}
//       />
//     </Stack.Navigator>
//   )
// }

const Chat = ({ navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={"InboxScreen"} options={withHeaderOptions(navigation, '')} component={InboxScreen} />
      <Stack.Screen name="ChatScreen" options={withHeaderOptions(navigation, 'Chat')} component={ChatScreen} />
      <Stack.Screen name="UploadProduct" options={withHeaderOptions(navigation, 'Upload Products')} component={UploadProduct} />
      <Stack.Screen name="UploadEditProduct" options={withHeaderOptions(navigation, 'Upload Products')} component={UploadEditProduct} />
      <Stack.Screen name="DealEdit" options={withHeaderOptions(navigation, 'Edit Deal')} component={DealEdit} />
      <Stack.Screen name="UploadProductScreenEdit" options={withHeaderOptions(navigation, 'Edit Product')} component={UploadProductScreenEdit} />
    </Stack.Navigator>
  )
}

const Profile = ({ navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileScreen" options={withHeaderOptions(navigation, 'Profile')} component={ProfileScreen} />
      {/* <Stack.Screen name="AddAnnouncement" options={withHeaderOptions(navigation, 'Announcement')} component={AddAnnouncement} />
      <Stack.Screen name="WishList" options={withHeaderOptions(navigation, 'Wishlist')} component={WishList} />
      <Stack.Screen name="Chat" options={withHeaderOptions(navigation, '')} component={Chat} />
      <Stack.Screen name="TransactionScreen" options={withHeaderOptions(navigation, 'Transaction')} component={TransactionScreen} />
      <Stack.Screen name="SigninScreen" options={{ headerShown: false }} component={SigninScreen} />
      <Stack.Screen name="SignupScreen" options={{ headerShown: false }} component={SignupScreen} />
      <Stack.Screen name="ForgotPasswordScreen" options={{ headerShown: false }} component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassFromSignIn" options={{ headerShown: false }} component={ResetPassFromSignIn} />
      <Stack.Screen name="PasswordForgetSetPass" options={{ headerShown: false }} component={PasswordForgetSetPass} />
      <Stack.Screen name="OTPScreen" options={{ headerShown: false }} component={OTPScreen} />
      <Stack.Screen name="ResetPasswordScreen" options={{ headerShown: false }} component={ResetPasswordScreen} />
      <Stack.Screen name="MyProductDetailScreen" options={withHeaderOptions(navigation, 'Order Details')} component={MyProductDetailScreen} />  */}
      {/* <Stack.Screen name="HomeScreen" options={withHeaderOptions(navigation, 'Products')} component={HomeScreen} /> */}
      {/* <Stack.Screen name="SigninScreen" options={{ headerShown: false }} component={SigninScreen} /> */}
      {/* <Stack.Screen name="CommentsIcon" options={withHeaderOptions(navigation, 'Comments')} component={CommentsIcon} /> */}
      <Stack.Screen name="MyOrderScreen" options={withHeaderOptions(navigation, 'Orders')} component={MyOrderScreen} />
      <Stack.Screen name="OrderDetailScreen" options={withHeaderOptions(navigation, 'Order Detail')} component={OrderDetailScreen} />
      <Stack.Screen name="ApplePayment" options={withHeaderOptions(navigation, 'Apple Payment')} component={ApplePayment} />
      <Stack.Screen name="PaymentSuccessScreen" options={{ headerShown: false }} component={PaymentSuccessScreen} />
      <Stack.Screen name="OrderShippedScreen" options={withHeaderOptions(navigation, 'Order Detail')} component={OrderShippedScreen} />
      <Stack.Screen name="MyOrdersDelivered" options={withHeaderOptions(navigation, 'Order Detail')} component={MyOrdersDelivered} />
      <Stack.Screen name="Messanger" options={withHeaderOptions(navigation, 'Chat')} component={Messanger} />
      <Stack.Screen name="MessageOrderDetails" options={withHeaderOptions(navigation, 'Chat')} component={MessageOrderDetails} />
      <Stack.Screen name="SubscriptionPymnt" options={withHeaderOptions(navigation, 'Payment')} component={SubscriptionPymnt} />
      <Stack.Screen name="AddAnnouncement" options={withHeaderOptions(navigation, 'Announcement')} component={AddAnnouncement} />
      <Stack.Screen name="ChatScreen" options={withHeaderOptions(navigation, 'Chat')} component={ChatScreen} />
      <Stack.Screen name="Inbox" options={withHeaderOptions(navigation, 'Inbox')} component={Inbox} />
      <Stack.Screen name="Transaction" options={withHeaderOptions(navigation, 'Transaction')} component={Transaction} />
      <Stack.Screen name="ChangePasswordScreen" options={withHeaderOptions(navigation, 'Change Password')} component={ChangePasswordScreen} />
      <Stack.Screen name="ProductDetailScreen" options={{ headerShown: false }} component={ProductDetailScreen} />
      <Stack.Screen name="RatingAndReviewScreen" options={withHeaderOptions(navigation, 'Rating and Review')} component={RatingAndReviewScreen} />
      <Stack.Screen name="OrdersScreens" options={withHeaderOptions(navigation, '')} component={OrdersScreens} />
      <Stack.Screen name="MyProductScreen" options={withHeaderOptions(navigation, 'My Product')} component={MyProductScreen} />
      <Stack.Screen name="MyProductDetailScreen" options={withHeaderOptions(navigation, 'Order Details')} component={MyProductDetailScreen} />
      <Stack.Screen name="AddressScreen" options={withHeaderOptions(navigation, 'Address')} component={AddressScreen} />
      <Stack.Screen name="AddressScreenEdit" options={withHeaderOptions(navigation, 'Address')} component={AddressScreenEdit} />
      <Stack.Screen name="AddressAlreadyExist" options={withHeaderOptions(navigation, 'Address')} component={AddressAlreadyExist} />
      <Stack.Screen name="PaymentAlreadyExist" options={withHeaderOptions(navigation, 'Payment')} component={PaymentAlreadyExist} />
      <Stack.Screen name="ShoppingbagScreen" options={withHeaderOptions(navigation, 'Shopping bag')} component={ShoppingbagScreen} />
      <Stack.Screen name="PaymentScreen" options={withHeaderOptions(navigation, 'Payment')} component={PaymentScreen} />
      <Stack.Screen name="ScannerForZelle" options={withHeaderOptions(navigation, 'Scan')} component={ScannerForZelle} />
      <Stack.Screen name="UploadProduct" options={withHeaderOptions(navigation, 'Upload Products')} component={UploadProduct} />
      <Stack.Screen name="UploadEditProduct" options={withHeaderOptions(navigation, 'Upload Products')} component={UploadEditProduct} />
      <Stack.Screen name="DealEdit" options={withHeaderOptions(navigation, 'Edit Deal')} component={DealEdit} />
      <Stack.Screen name="UploadProductScreenEdit" options={withHeaderOptions(navigation, 'Edit Product')} component={UploadProductScreenEdit} />
      <Stack.Screen name="Privacy" options={withHeaderOptions(navigation, 'Privacy')} component={Privacy} />
      <Stack.Screen name="ShowProductsForAnOrder" options={withHeaderOptions(navigation, 'Products')} component={ShowProductsForAnOrder} />
      <Stack.Screen name="ConfirmOrderScreen" options={withHeaderOptions(navigation, 'Products')} component={ConfirmOrderScreen} />
      <Stack.Screen name="ShowShippedordersProduct" options={withHeaderOptions(navigation, 'Products')} component={ShowShippedordersProduct} />
      <Stack.Screen name="DeliveredOrders" options={withHeaderOptions(navigation, 'Products')} component={DeliveredOrders} />
      <Stack.Screen name="OtpProfileDeactive" options={withHeaderOptions(navigation, 'Deactivate Profile')} component={OtpProfileDeactive} />
      <Stack.Screen name="ShowTransactionForProduct" options={withHeaderOptions(navigation, 'Transaction')} component={ShowTransactionForProduct} />
      <Stack.Screen name="HomeScreenEdit" options={withHeaderOptions(navigation, 'Select Products')} component={HomeScreenEdit} />
      <Stack.Screen name="HomeProductEdit" options={withHeaderOptions(navigation, 'Select Products')} component={HomeProductEdit} />
      <Stack.Screen name="EditedHomeProductEdit" options={withHeaderOptions(navigation, 'Select Products')} component={EditedHomeProductEdit} />
      <Stack.Screen name="EditedHomeScreenedit" options={withHeaderOptions(navigation, 'Select Products')} component={EditedHomeScreenedit} />
      <Stack.Screen name="ProductDetailsDeal" options={{ headerShown: false }} component={ProductDetailsDeal} />

    </Stack.Navigator>
  )
}

export { InitialScreens, Auth, Home, Deal, Profile, Notification, Favourite, Chat };
