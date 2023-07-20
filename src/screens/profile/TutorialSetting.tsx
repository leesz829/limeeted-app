import { styles, modalStyle, layoutStyle, commonStyle } from 'assets/styles/Styles';
import CommonHeader from 'component/CommonHeader';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import { ScrollView, View, StyleSheet, Dimensions, Text } from 'react-native';
import * as React from 'react';
import { StackParamList, ScreenNavigationProp } from '@types';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, CommonActions, useIsFocused } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useUserInfo } from 'hooks/useUserInfo';
import { update_additional } from 'api/models';
import { usePopup } from 'Context';
import { setPartialPrincipal } from 'redux/reducers/authReducer';
import ToggleSwitch from 'toggle-switch-react-native';
import { Color } from 'assets/styles/Color';
import { isEmptyData } from 'utils/functions';


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

  const [isChkData, setIsChkData] = React.useState({
    isDaily: (!isEmptyData(memberBase?.tutorial_daily_yn) || memberBase?.tutorial_daily_yn == 'Y') ? true : false,
    isLive: (!isEmptyData(memberBase?.tutorial_live_yn) || memberBase?.tutorial_live_yn == 'Y') ? true : false,
    isRoby: (!isEmptyData(memberBase?.tutorial_roby_yn) || memberBase?.tutorial_roby_yn == 'Y') ? true : false,
    isProfile: (!isEmptyData(memberBase?.tutorial_profile_yn) || memberBase?.tutorial_profile_yn == 'Y') ? true : false,
    isShop: (!isEmptyData(memberBase?.tutorial_shop_yn) || memberBase?.tutorial_shop_yn == 'Y') ? true : false,
    isSubscriptionItem: (!isEmptyData(memberBase?.tutorial_subscription_item_yn) || memberBase?.tutorial_subscription_item_yn == 'Y') ? true : false,
    isPackageItem: (!isEmptyData(memberBase?.tutorial_package_item_yn) || memberBase?.tutorial_package_item_yn == 'Y') ? true : false,
  });

  const saveMemberTutorialInfo = async (isAll:boolean, type:string, value:boolean) => {
    let body = {};

    if(!isAll) {
      if(type == 'DAILY') { body = { tutorial_daily_yn: value ? 'Y' : 'N' }; setIsChkData({...isChkData, isDaily: value});
      } else if(type == 'LIVE') { body = { tutorial_live_yn: value ? 'Y' : 'N' }; setIsChkData({...isChkData, isLive: value});
      } else if(type == 'ROBY') { body = { tutorial_roby_yn: value ? 'Y' : 'N' }; setIsChkData({...isChkData, isRoby: value});
      } else if(type == 'PROFILE') { body = { tutorial_profile_yn: value ? 'Y' : 'N' }; setIsChkData({...isChkData, isProfile: value});
      } else if(type == 'SHOP') { body = { tutorial_shop_yn: value ? 'Y' : 'N' }; setIsChkData({...isChkData, isShop: value});
      } else if(type == 'SUBSCRIPTION_ITEM') { body = { tutorial_subscription_item_yn: value ? 'Y' : 'N' }; setIsChkData({...isChkData, isSubscriptionItem: value});
      } else if(type == 'PACKAGE_ITEM') { body = { tutorial_package_item_yn: value ? 'Y' : 'N' }; setIsChkData({...isChkData, isPackageItem: value});
      }

      if(!value) {
        setAllSelected(false);
      }
    } else {
      let applyValue = value ? 'Y' : 'N';

      body = {
        tutorial_daily_yn: applyValue,
        tutorial_live_yn: applyValue,
        tutorial_roby_yn: applyValue,
        tutorial_profile_yn: applyValue,
        tutorial_shop_yn: applyValue,
        tutorial_subscription_item_yn: applyValue,
        tutorial_package_item_yn: applyValue,
      }

      setIsChkData({
        isDaily: value,
        isLive: value,
        isRoby: value,
        isProfile: value,
        isShop: value,
        isSubscriptionItem: value,
        isPackageItem: value,
      });
    };

    const { success, data } = await update_additional(body);
    if(success) {
      if(null != data.mbr_base && typeof data.mbr_base != 'undefined') {
        dispatch(setPartialPrincipal({
          mbr_base : data.mbr_base
        }));
      };
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

  React.useEffect(() => {
    if(!isChkData.isDaily || !isChkData.isLive || !isChkData.isRoby || !isChkData.isProfile || !isChkData.isShop || !isChkData.isSubscriptionItem || !isChkData.isPackageItem) {
      setAllSelected(false);
    }

    if(isChkData.isDaily && isChkData.isLive && isChkData.isRoby && isChkData.isProfile && isChkData.isShop && isChkData.isSubscriptionItem && isChkData.isPackageItem) {
        setAllSelected(true);
    }

  }, [isChkData]);



  return (
    <>
      <CommonHeader title={'튜토리얼 설정'} />

      <ScrollView contentContainerStyle={[ styles.scrollContainerAll ]} style={{backgroundColor: '#fff'}}>
        <SpaceView viewStyle={{paddingHorizontal: 20}}>

          <SpaceView viewStyle={layoutStyle.rowBetween} mb={20}>
            <CommonText fontWeight={'200'} type={'h3'}>튜토리얼이 필요한 메뉴를{'\n'}선택해주세요.</CommonText>
            <View style={[layoutStyle.rowBetween, _styles.allChkArea]}>
              <CommonText textStyle={_styles.allChkText}>전체 선택</CommonText>
              
              <ToggleSwitch
                isOn={allSelected}
                onColor={Color.primary}
                offColor={Color.grayDDDD}
                size="small"
                onToggle={(isOn) => saveMemberTutorialInfo(true, '', isOn)}
                trackOffStyle={{width: 45 ,height: 20}}
              />
            </View> 
          </SpaceView>

          <SpaceView>

            <SpaceView viewStyle={_styles.manageProfile}>
              <Text style={_styles.profileText}>데일리뷰</Text>

              <ToggleSwitch
                isOn={isChkData.isDaily}
                onColor={Color.primary}
                offColor={Color.grayDDDD}
                size="small"
                onToggle={(isOn) => saveMemberTutorialInfo(false, 'DAILY', isOn)}
                trackOffStyle={{width: 45 ,height: 20}}
              />
            </SpaceView>

            <SpaceView viewStyle={_styles.manageProfile}>
              <Text style={_styles.profileText}>라이브</Text>
              
              <ToggleSwitch
                isOn={isChkData.isLive}
                onColor={Color.primary}
                offColor={Color.grayDDDD}
                size="small"
                onToggle={(isOn) => saveMemberTutorialInfo(false, 'LIVE', isOn)}
                trackOffStyle={{width: 45 ,height: 20}}
              />
            </SpaceView>

            <SpaceView viewStyle={_styles.manageProfile}>
              <Text style={_styles.profileText}>마이홈</Text>
              
              <ToggleSwitch
                isOn={isChkData.isRoby}
                onColor={Color.primary}
                offColor={Color.grayDDDD}
                size="small"
                onToggle={(isOn) => saveMemberTutorialInfo(false, 'ROBY', isOn)}
                trackOffStyle={{width: 45 ,height: 20}}
              />
            </SpaceView>

            <SpaceView viewStyle={_styles.manageProfile}>
              <Text style={_styles.profileText}>프로필 관리</Text>
             
              <ToggleSwitch
                isOn={isChkData.isProfile}
                onColor={Color.primary}
                offColor={Color.grayDDDD}
                size="small"
                onToggle={(isOn) => saveMemberTutorialInfo(false, 'PROFILE', isOn)}
                trackOffStyle={{width: 45 ,height: 20}}
              />
            </SpaceView>

            <SpaceView viewStyle={_styles.manageProfile}>
              <Text style={_styles.profileText}>상점과 인벤토리</Text>
              
              <ToggleSwitch
                isOn={isChkData.isShop}
                onColor={Color.primary}
                offColor={Color.grayDDDD}
                size="small"
                onToggle={(isOn) => saveMemberTutorialInfo(false, 'SHOP', isOn)}
                trackOffStyle={{width: 45 ,height: 20}}
              />
            </SpaceView>

            <SpaceView viewStyle={_styles.manageProfile}>
              <Text style={_styles.profileText}>상점 부스팅 상품</Text>
              
              <ToggleSwitch
                isOn={isChkData.isSubscriptionItem}
                onColor={Color.primary}
                offColor={Color.grayDDDD}
                size="small"
                onToggle={(isOn) => saveMemberTutorialInfo(false, 'SUBSCRIPTION_ITEM', isOn)}
                trackOffStyle={{width: 45 ,height: 20}}
              />
            </SpaceView>

            <SpaceView viewStyle={_styles.manageProfile}>
              <Text style={_styles.profileText}>상점 패키지 상품</Text>
             
              <ToggleSwitch
                isOn={isChkData.isPackageItem}
                onColor={Color.primary}
                offColor={Color.grayDDDD}
                size="small"
                onToggle={(isOn) => saveMemberTutorialInfo(false, 'PACKAGE_ITEM', isOn)}
                trackOffStyle={{width: 45 ,height: 20}}
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