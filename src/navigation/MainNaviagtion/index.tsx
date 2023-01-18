import { createStackNavigator } from '@react-navigation/stack';
import { STACK } from 'constants/routes';
import { useIsLogedin } from 'hooks/useIsLogin';
import { useUserInfo } from 'hooks/useUserInfo';
import AuthNavigation from 'navigation/AuthNavigation';
import CommonNavigation from 'navigation/CommonNavigation';
import React from 'react';
import BottomNavigation from '../TabNavigation';

const MainStack = createStackNavigator();

const MainStackNavigation = () => {
  const isLogin = useIsLogedin();
  const me = useUserInfo();
  console.log('isLogin', isLogin);
  console.log('me', me);

  return (
    <MainStack.Navigator
      // initialRouteName={isLogin ? STACK.TAB : STACK.AUTH}
      screenOptions={{ headerShown: false }}
    >
      {isLogin ? (
        <MainStack.Screen name={STACK.TAB} component={BottomNavigation} />
      ) : (
        <MainStack.Screen name={STACK.AUTH} component={AuthNavigation} />
      )}
      {/* <MainStack.Screen name={STACK.AUTH} component={AuthNavigation} />
      <MainStack.Screen name={STACK.TAB} component={BottomNavigation} /> */}
      <MainStack.Screen name={STACK.COMMON} component={CommonNavigation} />
    </MainStack.Navigator>
  );
};

export default MainStackNavigation;
export type MainStackParamList = {
  COMMON: undefined;
  AUTH: undefined;
  TAB: undefined;
};
