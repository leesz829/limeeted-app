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
import { Signup01 } from 'screens/signup/Signup01';
import { Signup02 } from 'screens/signup/Signup02';
import { Signup03 } from 'screens/signup/Signup03';
import { Approval } from 'screens/signup/Approval';

import StartPage from 'screens/startpage';
import { Title00 } from 'screens/title';
import { ROUTES } from 'constants/routes';
import { Im_storage } from 'screens/PUBLISHING/Im_storage';
import { Im_storage_list } from 'screens/PUBLISHING/Im_storage_list';
import { Im_live } from 'screens/PUBLISHING/Im_live';
import { lm_superLike } from 'screens/PUBLISHING/lm_superLike';

const AuthStack = createStackNavigator();

export default function AuthNavigation() {
  return (
    <AuthStack.Navigator
      // initialRouteName={ROUTES.LOGIN}
      initialRouteName={'lm_superLike'}
      screenOptions={{ headerShown: false }}
    >
      <AuthStack.Screen name={ROUTES.START_PAGE} component={StartPage} />
      <AuthStack.Screen name={ROUTES.LOGIN} component={Login} />
      <AuthStack.Screen name={ROUTES.LOGIN01} component={Login01} />
      <AuthStack.Screen name={ROUTES.TITLE00} component={Title00} />
      <AuthStack.Screen name={ROUTES.SIGNUP00} component={Signup00} />
      <AuthStack.Screen name={ROUTES.SIGNUP01} component={Signup01} />
      <AuthStack.Screen name={ROUTES.POLICY} component={Policy} />
      <AuthStack.Screen
        name={ROUTES.SECOND_AUTH_POPUP}
        component={SecondAuthPopup}
      />
      <AuthStack.Screen name={ROUTES.SIGNUP02} component={Signup02} />
      <AuthStack.Screen name={ROUTES.SIGNUP03} component={Signup03} />
      <AuthStack.Screen name={ROUTES.APPROVAL} component={Approval} />
      <AuthStack.Screen name={ROUTES.SIGNUP_POPUP2} component={SignupPopUp2} />
      <AuthStack.Screen name={ROUTES.NICE_AUTH} component={NiceAuth} />
      <AuthStack.Screen name={ROUTES.SEARCH_IDPWD} component={SearchIdAndPwd} />

      <AuthStack.Screen name={'Im_storage'} component={Im_storage} />
      <AuthStack.Screen name={'Im_storage_list'} component={Im_storage_list} />
      <AuthStack.Screen name={'Im_live'} component={Im_live} />
      <AuthStack.Screen name={'lm_superLike'} component={lm_superLike} />
    </AuthStack.Navigator>
  );
}
