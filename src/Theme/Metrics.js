import { Dimensions } from 'react-native';
import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';

const { width, height } = Dimensions.get('window');
const Metrics = {
  ScreenWidth: width,
  ScreenHeight: height,
  PointTwoFive: 0.25,
  Zero: 0,
  One: 1,
  Two: 2,
  Three: 3,
  Four: 4,
  Five: 5,
  Six: 6,
  Seven: 7,
  Eight: 8,
  Nine: 9,
  Ten: 10,
  Eleven: 11,
  Twelve: 12,
  Thirteen: 13,
  Fourteen: 14,
  Fifteen: 15,
  Sixteen: 16,
  Eighteen: 18,
  Twenty: 20,
  TwentyEight: 28,
  Thirty: 30,
  ThirtyTwo: 32,
  Fourty: 40,
  Fifty: 50,
  Sixty: 60,
  Seventy: 70,
  Eighty: 80,
  Ninety: 90,
  Hundred: 100,
  OneHundredTen: 110,
  OneHundredTwenty: 120,
  OneHundredThirty: 130,
  OneHundredFourty: 140,
  OneHundredFifty: 150,
  OneHundredFourtyFive: 145,
  OneHundredSixty: 160,
  OneHundredSeventy: 170,
  OneHundredEighty: 180,
  OneHundredNinety: 190,
  TwoHundred: 200,
  TwoHundredSeventyEight: 278,
};

export const Loader = () => {
  setTimeout(() => {
    <Spinner size="large" visible={false} />
  }, 4000);
  return <Spinner size="large" visible={true} />
};

export default Metrics;
