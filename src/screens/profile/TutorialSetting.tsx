import { styles, modalStyle, layoutStyle, commonStyle } from 'assets/styles/Styles';
import CommonHeader from 'component/CommonHeader';
import { CommonInput } from 'component/CommonInput';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import { ScrollView, View, Modal, TouchableOpacity, Alert, StyleSheet, Dimensions, Text } from 'react-native';
import * as React from 'react';
import { CommonBtn } from 'component/CommonBtn';
import { StackParamList, ScreenNavigationProp, ColorType } from '@types';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, CommonActions, useIsFocused } from '@react-navigation/native';
import * as hooksMember from 'hooks/member';
import { useDispatch } from 'react-redux';
import { ROUTES, STACK } from 'constants/routes';
import { clearPrincipal } from 'redux/reducers/authReducer';
import { useUserInfo } from 'hooks/useUserInfo';
import { update_setting, member_logout, update_member_exit, update_additional } from 'api/models';
import { usePopup } from 'Context';
import { myProfile } from 'redux/reducers/authReducer';
import { SUCCESS } from 'constants/reusltcode';
import { CommonSwich } from 'component/CommonSwich';
import { setPartialPrincipal } from 'redux/reducers/authReducer';
import ToggleSwitch from 'toggle-switch-react-native';
import { Color } from 'assets/styles/Color';


/* ################################################################################################################
###################################################################################################################
###### 내 계정 정보
###################################################################################################################
################################################################################################################ */

interface Props {
  navigation: StackNavigationProp<StackParamList, 'TutorialSetting'>;
  route: RouteProp<StackParamList, 'TutorialSetting'>;
}

export const TutorialSetting = (props: Props) => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const dispatch = useDispatch();
  const { width, height } = Dimensions.get('window');
  const isFocus = useIsFocused();

  const { show } = usePopup(); // 공통 팝업
  const memberBase = useUserInfo(); // 회원 기본정보

  const [allSelected, setAllSelected] = React.useState<boolean>(false);
  const [dailyYn, setDailyYn] = React.useState<any>(memberBase?.tutorial_daily_yn);
  const [liveYn, setLiveYn] = React.useState<any>(memberBase?.tutorial_live_yn);
  const [robyYn, setRobyYn] = React.useState<any>(memberBase?.tutorial_roby_yn);
  const [profileYn, setProfileYn] = React.useState<any>(memberBase?.tutorial_profile_yn);
  const [shopYn, setShopYn] = React.useState<any>(memberBase?.tutorial_shop_yn);
  const [subscriptionItemYn, setSubscriptionItemYn] = React.useState<any>(memberBase?.tutorial_subscription_item_yn);
  const [packageItemYn, setPackageItemYn] = React.useState<any>(memberBase?.tutorial_package_item_yn);
  

  const saveMemberTutorialInfo = async (isAll:boolean, type:string, value:string) => {
    let body = {};

    if(!isAll) {
      if(type == 'DAILY') { body = { tutorial_daily_yn: value };
      } else if(type == 'LIVE') { body = { tutorial_live_yn: value };
      } else if(type == 'ROBY') { body = { tutorial_roby_yn: value };
      } else if(type == 'PROFILE') { body = { tutorial_profile_yn: value };
      } else if(type == 'SHOP') { body = { tutorial_shop_yn: value };
      } else if(type == 'SUBSCRIPTION_ITEM') { body = { tutorial_subscription_item_yn: value };
      } else if(type == 'PACKAGE_ITEM') { body = { tutorial_package_item_yn: value };
      }
    } else {
      body = {
        tutorial_daily_yn: value,
        tutorial_live_yn: value,
        tutorial_roby_yn: value,
        tutorial_profile_yn: value,
        tutorial_shop_yn: value,
        tutorial_subscription_item_yn: value,
        tutorial_package_item_yn: value,
      }

      if(value == 'Y') {
        setDailyYn('Y');
        setLiveYn('Y');
        setRobyYn('Y');
        setProfileYn('Y');
        setShopYn('Y');
        setSubscriptionItemYn('Y');
        setPackageItemYn('Y');
      } else {
        setDailyYn('N');
        setLiveYn('N');
        setRobyYn('N');
        setProfileYn('N');
        setShopYn('N');
        setSubscriptionItemYn('N');
        setPackageItemYn('N');
      }
    };

    const { success, data } = await update_additional(body);
    if(success) {
      if(null != data.mbr_base && typeof data.mbr_base != 'undefined') {
        dispatch(setPartialPrincipal({
          mbr_base : data.mbr_base
        }));
      };

      /* if(isAll) {
        if(value == 'Y') {
          setDailyYn('Y');
          setLiveYn('Y');
          setRobyYn('Y');
          setProfileYn('Y');
          setShopYn('Y');
          setSubscriptionItemYn('Y');
          setPackageItemYn('Y');
        } else {
          setDailyYn('N');
          setLiveYn('N');
          setRobyYn('N');
          setProfileYn('N');
          setShopYn('N');
          setSubscriptionItemYn('N');
          setPackageItemYn('N');
        }
      } */
    }
  }

  // ######################################################################################## 초기 실행 함수
  React.useEffect(() => {
    if(isFocus) {
      if(memberBase?.tutorial_daily_yn == 'Y' && memberBase?.tutorial_live_yn == 'Y' && memberBase?.tutorial_roby_yn == 'Y' &&
      memberBase?.tutorial_profile_yn == 'Y' && memberBase?.tutorial_shop_yn == 'Y' && memberBase?.tutorial_subscription_item_yn == 'Y' &&
      memberBase?.tutorial_package_item_yn == 'Y') {
        setAllSelected(true);
      }
    };
  }, [isFocus]);

  return (
    <>
      <CommonHeader title={'튜토리얼 설정'} />

      <ScrollView contentContainerStyle={[ styles.scrollContainerAll ]} style={{backgroundColor: '#fff'}}>
        <SpaceView viewStyle={{paddingHorizontal: 20}}>

          <SpaceView viewStyle={layoutStyle.rowBetween} mb={20}>
            <CommonText fontWeight={'200'} type={'h3'}>튜토피얼이 필요한 메뉴를{'\n'}선택해주세요.</CommonText>
            <View style={[layoutStyle.rowBetween, _styles.allChkArea]}>
              <CommonText textStyle={_styles.allChkText}>전체 선택</CommonText>
              <CommonSwich
                callbackFn={(value: boolean) => { saveMemberTutorialInfo(true, '', value ? 'Y' : 'N') }}
                isOn={allSelected}
                height={20} />
            </View> 
          </SpaceView>

          <SpaceView>

            <SpaceView viewStyle={_styles.manageProfile}>
              <Text style={_styles.profileText}>데일리뷰</Text>

              {/* <ToggleSwitch
                isOn={dailyYn == 'Y' ? true : false}
                onColor={Color.primary}
                offColor={Color.grayDDDD}
                size="small"
                onToggle={(isOn) => saveMemberTutorialInfo(false, 'DAILY', isOn ? 'Y' : 'N')}
                trackOffStyle={{width: 45 ,height: 20}}
              /> */}

              <CommonSwich
                callbackFn={(value: boolean) => {
                  saveMemberTutorialInfo(false, 'DAILY', value ? 'Y' : 'N');
                }}
                isOn={dailyYn == 'Y' ? true : false}
              />
            </SpaceView>

            <SpaceView viewStyle={_styles.manageProfile}>
              <Text style={_styles.profileText}>라이브</Text>
              <CommonSwich
                callbackFn={(value: boolean) => {
                  saveMemberTutorialInfo(false, 'LIVE', value ? 'Y' : 'N');
                }}
                isOn={liveYn == 'Y' ? true : false}
              />
            </SpaceView>

            <SpaceView viewStyle={_styles.manageProfile}>
              <Text style={_styles.profileText}>마이홈</Text>
              <CommonSwich
                callbackFn={(value: boolean) => {
                  saveMemberTutorialInfo(false, 'ROBY', value ? 'Y' : 'N');
                }}
                isOn={robyYn == 'Y' ? true : false}
              />
            </SpaceView>

            <SpaceView viewStyle={_styles.manageProfile}>
              <Text style={_styles.profileText}>프로필 관리</Text>
              <CommonSwich
                callbackFn={(value: boolean) => {
                  saveMemberTutorialInfo(false, 'PROFILE', value ? 'Y' : 'N');
                }}
                isOn={profileYn == 'Y' ? true : false}
              />
            </SpaceView>

            <SpaceView viewStyle={_styles.manageProfile}>
              <Text style={_styles.profileText}>상점과 인벤토리</Text>
              <CommonSwich
                callbackFn={(value: boolean) => {
                  saveMemberTutorialInfo(false, 'SHOP', value ? 'Y' : 'N');
                }}
                isOn={shopYn == 'Y' ? true : false}
              />
            </SpaceView>

            <SpaceView viewStyle={_styles.manageProfile}>
              <Text style={_styles.profileText}>상점 부스팅 상품</Text>
              <CommonSwich
                callbackFn={(value: boolean) => {
                  saveMemberTutorialInfo(false, 'SUBSCRIPTION_ITEM', value ? 'Y' : 'N');
                }}
                isOn={subscriptionItemYn == 'Y' ? true : false}
              />
            </SpaceView>

            <SpaceView viewStyle={_styles.manageProfile}>
              <Text style={_styles.profileText}>상점 패키지 상품</Text>
              <CommonSwich
                callbackFn={(value: boolean) => {
                  saveMemberTutorialInfo(false, 'PACKAGE_ITEM', value ? 'Y' : 'N');
                }}
                isOn={packageItemYn == 'Y' ? true : false}
              />
            </SpaceView>

          </SpaceView>
        </SpaceView>
      </ScrollView>
    </>
  );
};

const _styles = StyleSheet.create({
  allChkArea: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  allChkText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 15,
    color: '#333333',
    marginRight: 7,
  },
  manageProfile: {
    height: 62,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ebe9ef',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 15,
  },
  profileText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#646467',
  },

});