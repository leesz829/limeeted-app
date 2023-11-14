import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import { Color } from 'assets/styles/Color';
import { commonStyle, styles } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import CommonHeader from 'component/CommonHeader';
import { CommonInput } from 'component/CommonInput';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import * as React from 'react';
import { Image, ScrollView, StyleSheet, View, Platform, Text, Dimensions } from 'react-native';
import { ICON, IMAGE } from 'utils/imageUtils';
import * as properties from 'utils/properties';
import { usePopup } from 'Context';
import { SUCCESS, MEMBER_EMAIL_DUP } from 'constants/reusltcode';
import { regist_member_base_info } from 'api/models';
import { ROUTES } from 'constants/routes';
import { isEmptyData } from 'utils/functions';
import LinearGradient from 'react-native-linear-gradient';


/* ################################################################################################################
###################################################################################################################
###### 회원가입 - 닉네임
###################################################################################################################
################################################################################################################ */

interface Props {
  navigation: StackNavigationProp<StackParamList, 'SignUp_Nickname'>;
  route: RouteProp<StackParamList, 'SignUp_Nickname'>;
}

const { width, height } = Dimensions.get('window');

export const SignUp_Nickname = (props: Props) => {
  const navigation = useNavigation<ScreenNavigationProp>();

  const { show } = usePopup();  // 공통 팝업
  const [isClickable, setIsClickable] = React.useState(true); // 클릭 여부


  return (
    <>
      <LinearGradient
        colors={['#3D4348', '#1A1E1C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={_styles.wrap}
      >
        <ScrollView>
          <SpaceView>
            <Text>닉네임</Text>
          </SpaceView>

        </ScrollView>

        <SpaceView>
          <CommonBtn
            value={'다음'}
            type={'primary'}
            height={60}
            borderRadius={1}
            onPress={() => {
              navigation.navigate({
                name : ROUTES.SIGNUP_ADDINFO
              });
            }}
          />
        </SpaceView>
      </LinearGradient>      
    </>
  );
};



/* ################################################################################################################
###### Style 영역
################################################################################################################ */

const _styles = StyleSheet.create({
  wrap: {
    minHeight: height,
  },
});