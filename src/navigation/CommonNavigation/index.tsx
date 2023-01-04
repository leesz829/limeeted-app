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
import { SecondAuth } from 'screens/profile/SecondAuth';
import { Sample } from 'screens/sample/sample';
import { Approval } from 'screens/signup/Approval';

import React from 'react';
const CommonStack = createStackNavigator<StackParamList>();

const CommonNavigation = () => {
  return (
    <CommonStack.Navigator screenOptions={{ headerShown: true }}>
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
      <CommonStack.Screen name="SecondAuth" component={SecondAuth} />
      <CommonStack.Screen name="Approval" component={Approval} />
      <CommonStack.Screen name="Sample" component={Sample} />
      <CommonStack.Screen name="NiceAuth" component={NiceAuth} />
    </CommonStack.Navigator>
  );
};

export default CommonNavigation;
