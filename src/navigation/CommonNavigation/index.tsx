import { createStackNavigator } from '@react-navigation/stack';
import { StackParamList } from '@types';
import { LivePopup } from 'screens/commonpopup/LivePopup';
import { ReportPopup } from 'screens/commonpopup/ReportPopup';
import { NiceAuth } from 'screens/login/niceAuth';
import StartPage from 'screens/startpage';
import BottomNavigation from '../TabNavigation';

import Component from 'component';
import { CommonPopup } from 'screens/commonpopup';
import { Board0 } from 'screens/commonpopup/Board0';
import { Board1 } from 'screens/commonpopup/Board1';
import { Introduce } from 'screens/commonpopup/Introduce';
import { Preference } from 'screens/commonpopup/Preference';
import { Profile } from 'screens/profile/Profile';
import { Profile1 } from 'screens/profile/Profile1';
import { Profile2 } from 'screens/profile/Profile2';
import { CustomerInquiry } from 'screens/profile/CustomerInquiry';
import { ChangePassword } from 'screens/profile/ChangePassword';
import { SecondAuth } from 'screens/profile/SecondAuth';
import { Sample } from 'screens/sample/sample';
import { Approval } from 'screens/signup/Approval';
import { Storage } from 'screens/storage/index';
import { StorageProfile } from 'screens/storage/StorageProfile';

import React from 'react';
import PointReward from 'screens/shop/PointReward';
import Inventory from 'screens/shop/Inventory';
import MileageShop from 'screens/shop/MileageShop';
import MileageHistory from 'screens/shop/MileageHistory';
import LimitInfo from 'screens/shop/LimitInfo';
import AuctionDetail from 'screens/shop/AuctionDetail';
import MileageOrder from 'screens/shop/MileageOrder';
import GifticonDetail from 'screens/shop/GifticonDetail';
import ItemMatching from 'screens/matching/ItemMatching';

const CommonStack = createStackNavigator<StackParamList>();

const CommonNavigation = () => {
  return (
    <CommonStack.Navigator screenOptions={{ headerShown: false }}>
      <CommonStack.Screen name="Component" component={Component} />
      <CommonStack.Screen name="Main" component={BottomNavigation} />
      <CommonStack.Screen name="StartPage" component={StartPage} />
      <CommonStack.Screen name="CommonPopup" component={CommonPopup} />
      <CommonStack.Screen name="ReportPopup" component={ReportPopup} />
      <CommonStack.Screen name="LivePopup" component={LivePopup} />
      <CommonStack.Screen name="Introduce" component={Introduce} />
      <CommonStack.Screen name="Board0" component={Board0} />
      <CommonStack.Screen name="Board1" component={Board1} />
      <CommonStack.Screen name="Preference" component={Preference} />
      <CommonStack.Screen name="Profile" component={Profile} />
      <CommonStack.Screen name="Profile1" component={Profile1} />
      <CommonStack.Screen name="Profile2" component={Profile2} />
      <CommonStack.Screen name="ChangePassword" component={ChangePassword} />
      <CommonStack.Screen name="CustomerInquiry" component={CustomerInquiry} />
      <CommonStack.Screen name="SecondAuth" component={SecondAuth} />
      <CommonStack.Screen name="Approval" component={Approval} />
      <CommonStack.Screen name="Sample" component={Sample} />
      <CommonStack.Screen name="NiceAuth" component={NiceAuth} />
      <CommonStack.Screen name="StorageProfile" component={StorageProfile} />
      <CommonStack.Screen name="Storage" component={Storage} />
      <CommonStack.Screen name="PointReward" component={PointReward} />
      <CommonStack.Screen name="Inventory" component={Inventory} />
      <CommonStack.Screen name="MileageShop" component={MileageShop} />
      <CommonStack.Screen name="MileageHistory" component={MileageHistory} />
      <CommonStack.Screen name="LimitInfo" component={LimitInfo} />
      <CommonStack.Screen name="AuctionDetail" component={AuctionDetail} />
      <CommonStack.Screen name="MileageOrder" component={MileageOrder} />
      <CommonStack.Screen name="GifticonDetail" component={GifticonDetail} />
      <CommonStack.Screen name="ItemMatching" component={ItemMatching} />
    </CommonStack.Navigator>
  );
};

export default CommonNavigation;
