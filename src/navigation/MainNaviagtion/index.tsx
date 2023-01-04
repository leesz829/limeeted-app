import { createStackNavigator } from '@react-navigation/stack';
import { STACK } from 'constants/routes';
import { useIsLogedin } from 'hooks/useIsLogin';
import AuthNavigation from 'navigation/AuthNavigation';
import CommonNavigation from 'navigation/CommonNavigation';
import React from 'react';
import BottomNavigation from '../TabNavigation';

const MainStack = createStackNavigator();

const MainStackNavigation = () => {
  // const dispatch = useDispatch();
  const isLogin = useIsLogedin();

  // useEffect(() => {
  //   authCheck();
  // }, []);
  // async function authCheck() {
  //   const token = await AsyncStorage.getItem(JWT_TOKEN);
  //   if (token) {
  //     dispatch(myProfile());
  //   }
  // }

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
