import { layoutStyle, styles } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import * as React from 'react';
import { View, Image } from 'react-native';
import { IMAGE } from 'utils/imageUtils';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ColorType, ScreenNavigationProp, StackParamList } from '@types';

interface Props {
  navigation: StackNavigationProp<StackParamList, 'Approval'>;
  route: RouteProp<StackParamList, 'Approval'>;
}

export const Approval = (props: Props) => {
  const navigation = useNavigation<ScreenNavigationProp>();

  const memberSeq = props.route.params.memberSeq; // 회원 번호
  const accessType = props.route.params.accessType; //

  return (
    <View style={[styles.container, layoutStyle.justifyCenter]}>
      <View style={layoutStyle.alignCenter}>
        <SpaceView mb={24}>
          <Image source={IMAGE.logo} style={styles.logo} />
        </SpaceView>
        <SpaceView>
          <CommonText textStyle={layoutStyle.textCenter}>
            가입 심사가 진행 중입니다.{'\n'}
            심사 기간은 1~3일이며,{'\n'}
            결과는 PUSH 메시지로 전송됩니다.
          </CommonText>
        </SpaceView>
      </View>
      <SpaceView viewStyle={styles.bottomBtnContainer} mb={24}>
        <CommonBtn
          value={'프로필 수정하기'}
          onPress={() => {
            if (accessType == 'LOGIN') {
              navigation.reset({
                routes: [{ name: 'Login01' }],
              });
            } else {
              navigation.navigate('Signup03', {
                memberSeq: memberSeq,
              });
            }
          }}
        />
      </SpaceView>
    </View>
  );
};
