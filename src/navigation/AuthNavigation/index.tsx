import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SecondAuthPopup } from 'screens/commonpopup/SecondAuthPopup';
import { SignupPopUp2 } from 'screens/commonpopup/SignupPopUp2';
import { Login } from 'screens/login';
import { Login01 } from 'screens/login/login';
import { NiceAuth } from 'screens/login/niceAuth';
import { SearchIdAndPwd } from 'screens/login/SearchIdAndPwd';
import { Signup00 } from 'screens/signup';
import { Policy } from 'screens/signup/policy';
import { SignUp_Check } from 'screens/signup/SignUp_Check';
import { SignUp_ID } from 'screens/signup/SignUp_ID';
import { SignUp_Password } from 'screens/signup/SignUp_Password';
import { SignUp_Image } from 'screens/signup/SignUp_Image';
import { SignUp_Nickname } from 'screens/signup/SignUp_Nickname';
import { SignUp_AddInfo } from 'screens/signup/SignUp_AddInfo';
import { SignUp_Interest } from 'screens/signup/SignUp_Interest';
import { SignUp_Introduce } from 'screens/signup/SignUp_Introduce';
import { SignUp_Auth } from 'screens/signup/SignUp_Auth';
import { Signup01 } from 'screens/signup/Signup01';
import { Signup02 } from 'screens/signup/Signup02';
import { Signup03 } from 'screens/signup/Signup03';
import { Approval } from 'screens/signup/Approval';

import StartPage from 'screens/startpage';
import { Title00 } from 'screens/title';
import { ROUTES } from 'constants/routes';

const AuthStack = createStackNavigator();

export default function AuthNavigation() {
  return (
    <AuthStack.Navigator
      initialRouteName={ROUTES.LOGIN01}
      screenOptions={{ headerShown: false }}
    >
      <AuthStack.Screen name={ROUTES.START_PAGE} component={StartPage} />
      <AuthStack.Screen name={ROUTES.LOGIN} component={Login} />
      <AuthStack.Screen name={ROUTES.LOGIN01} component={Login01} />
      <AuthStack.Screen name={ROUTES.TITLE00} component={Title00} />
      <AuthStack.Screen name={ROUTES.SIGNUP00} component={Signup00} />
      <AuthStack.Screen name={ROUTES.SIGNUP_CHECK} component={SignUp_Check} />
      <AuthStack.Screen name={ROUTES.SIGNUP_ID} component={SignUp_ID} />
      <AuthStack.Screen name={ROUTES.SIGNUP_PASSWORD} component={SignUp_Password} />
      <AuthStack.Screen name={ROUTES.SIGNUP_IMAGE} component={SignUp_Image} />
      <AuthStack.Screen name={ROUTES.SIGNUP_NICKNAME} component={SignUp_Nickname} />
      <AuthStack.Screen name={ROUTES.SIGNUP_ADDINFO} component={SignUp_AddInfo} />
      <AuthStack.Screen name={ROUTES.SIGNUP_INTEREST} component={SignUp_Interest} />
      <AuthStack.Screen name={ROUTES.SIGNUP_INTRODUCE} component={SignUp_Introduce} />
      <AuthStack.Screen name={ROUTES.SIGNUP_AUTH} component={SignUp_Auth} />
      <AuthStack.Screen name={ROUTES.SIGNUP01} component={Signup01} />
      <AuthStack.Screen name={ROUTES.POLICY} component={Policy} />
      <AuthStack.Screen name={ROUTES.SECOND_AUTH_POPUP} component={SecondAuthPopup} />
      <AuthStack.Screen name={ROUTES.SIGNUP02} component={Signup02} />
      <AuthStack.Screen name={ROUTES.SIGNUP03} component={Signup03} />
      <AuthStack.Screen name={ROUTES.APPROVAL} component={Approval} />
      <AuthStack.Screen name={ROUTES.SIGNUP_POPUP2} component={SignupPopUp2} />
      <AuthStack.Screen name={ROUTES.NICE_AUTH} component={NiceAuth} />
      <AuthStack.Screen name={ROUTES.SEARCH_IDPWD} component={SearchIdAndPwd} />
    </AuthStack.Navigator>
  );
}