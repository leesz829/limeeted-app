import { styles, layoutStyle, modalStyle } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import CommonHeader from 'component/CommonHeader';
import { CommonText } from 'component/CommonText';
import { CommonInput } from 'component/CommonInput';
import SpaceView from 'component/SpaceView';
import React, { useRef } from 'react';
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { ICON, findSourcePath } from 'utils/imageUtils';
import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import {
  RouteProp,
  useNavigation,
  useIsFocused,
} from '@react-navigation/native';
import { Modalize } from 'react-native-modalize';
import { SecondAuthPopup } from 'screens/commonpopup/SecondAuthPopup';
import * as properties from 'utils/properties';
import AsyncStorage from '@react-native-community/async-storage';
import { useDispatch } from 'react-redux';
import * as mbrReducer from 'redux/reducers/mbrReducer';
import {
  get_member_profile_authentication,
  get_member_second_detail,
  save_profile_auth,
} from 'api/models';
import { usePopup } from 'Context';
import { useMemberseq } from 'hooks/useMemberseq';
import { useSecondAth } from 'hooks/useSecondAth';
import storeKey from 'constants/storeKey';
import { STACK } from 'constants/routes';
import { verticalStackLayout } from 'react-native-reanimated-carousel/lib/typescript/layouts/stack';
import { SUCCESS } from 'constants/reusltcode';

/* ################################################################################################################
###################################################################################################################
###### 2차 인증 정보
###################################################################################################################
################################################################################################################ */

export const SecondAuth = () => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const dispatch = useDispatch();
  const isFocus = useIsFocused();

  const { show } = usePopup(); // 공통 팝업

  const memberSeq = useMemberseq(); // 회원번호
  const mbrSecondAuthList = useSecondAth(); // 회원 2차 인증 정보

  // ############################################################################# 프로필 2차 인증 데이터
  const [secondData, setSecondData] = React.useState({
    jobData: {},
    eduData: {},
    incomeData: {},
    assetData: {},
    snsData: {},
    vehicleData: {},
  });

  // 이미지 파일
  const [filePathData, setFilePathData] = React.useState({
    filePath01: '',
    filePath02: '',
    filePath03: '',
  });

  // 직업 Pop
  const job_modalizeRef = useRef<Modalize>(null);
  const job_onOpen = () => {
    getMemberSecondDetail('JOB');
  };
  const job_onClose = () => {
    job_modalizeRef.current?.close();
  };

  // 학위 Pop
  const edu_modalizeRef = useRef<Modalize>(null);
  const edu_onOpen = () => {
    getMemberSecondDetail('EDU');
  };
  const edu_onClose = () => {
    edu_modalizeRef.current?.close();
  };

  // 소득 Pop
  const income_modalizeRef = useRef<Modalize>(null);
  const income_onOpen = () => {
    getMemberSecondDetail('INCOME');
  };
  const income_onClose = () => {
    income_modalizeRef.current?.close();
  };

  // 자산 Pop
  const asset_modalizeRef = useRef<Modalize>(null);
  const asset_onOpen = () => {
    getMemberSecondDetail('ASSET');
  };
  const asset_onClose = () => {
    asset_modalizeRef.current?.close();
  };

  // SNS Pop
  const sns_modalizeRef = useRef<Modalize>(null);
  const sns_onOpen = () => {
    getMemberSecondDetail('SNS');
  };
  const sns_onClose = () => {
    sns_modalizeRef.current?.close();
  };

  // 차량 Pop
  const vehicle_modalizeRef = useRef<Modalize>(null);
  const vehicle_onOpen = () => {
    getMemberSecondDetail('VEHICLE');
  };
  const vehicle_onClose = () => {
    vehicle_modalizeRef.current?.close();
  };

  // ############################################################################# 최초 실행
  React.useEffect(() => {
    authDataSet(mbrSecondAuthList);

    //getMemberProfileSecondAuth();
  }, [isFocus]);

  // ############################################################################# 프로필 2차 인증 정보 조회 함수
  const getMemberProfileSecondAuth = async () => {
    try {
      const { success, data } = await get_member_profile_authentication();
      if (success) {
        if (data.result_code == '0000') {
          authDataSet(data.auth_list);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  // ############################################################################# 인증 데이터 셋팅
  const authDataSet = async (dataList: []) => {
    let jobData = {};
    let eduData = {};
    let incomeData = {};
    let assetData = {};
    let snsData = {};
    let vehicleData = {};

    dataList.map(function (item, index) {
      if (item.common_code === 'JOB') {
        jobData = item;
      } else if (item.common_code === 'EDU') {
        eduData = item;
      } else if (item.common_code === 'INCOME') {
        incomeData = item;
      } else if (item.common_code === 'ASSET') {
        assetData = item;
      } else if (item.common_code === 'SNS') {
        snsData = item;
      } else if (item.common_code === 'VEHICLE') {
        vehicleData = item;
      }
    });

    setSecondData({
      ...secondData,
      jobData,
      eduData,
      incomeData,
      assetData,
      snsData,
      vehicleData,
    });
  };

  // ############################################################################# 2차인증 상세 목록 조회
  const getMemberSecondDetail = async (type: string) => {
    setFilePathData({
      filePath01: '',
      filePath02: '',
      filePath03: '',
    });

    const body = {
      second_auth_code: type,
    };
    try {
      const { success, data } = await get_member_second_detail(body);
      if (success) {
        switch (data.result_code) {
          case SUCCESS:
            let filePath01 = '';
            let filePath02 = '';
            let filePath03 = '';
            data.auth_detail_list.map(
              ({
                img_file_path,
                order_seq,
              }: {
                img_file_path: any;
                order_seq: any;
              }) => {
                if (order_seq == 1) {
                  filePath01 = findSourcePath(img_file_path);
                } else if (order_seq == 2) {
                  filePath02 = findSourcePath(img_file_path);
                } else if (order_seq == 3) {
                  filePath03 = findSourcePath(img_file_path);
                }
              }
            );

            setFilePathData({
              filePath01: filePath01,
              filePath02: filePath02,
              filePath03: filePath03,
            });

            if (type === 'JOB') {
              job_modalizeRef.current?.open();
            } else if (type === 'EDU') {
              edu_modalizeRef.current?.open();
            } else if (type === 'INCOME') {
              income_modalizeRef.current?.open();
            } else if (type === 'ASSET') {
              asset_modalizeRef.current?.open();
            } else if (type === 'SNS') {
              sns_modalizeRef.current?.open();
            } else if (type === 'VEHICLE') {
              vehicle_modalizeRef.current?.open();
            }

            break;
          default:
            show({
              content: '오류입니다. 관리자에게 문의해주세요.',
              confirmCallback: function () {},
            });
            break;
        }
      } else {
        show({
          content: '오류입니다. 관리자에게 문의해주세요.',
          confirmCallback: function () {},
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  // ############################################################################# 2차인증 저장 함수
  const saveSecondAuth = async (type: string, file_list: any) => {
    const body = {
      file_list: file_list,
    };
    try {
      const { success, data } = await save_profile_auth(body);

      if (success) {
        if (data.result_code == '0000') {
          show({
            content: '심사 요청 되었습니다.',
            confirmCallback: function () {
              if (type == 'JOB') {
                job_onClose();
              } else if (type == 'EDU') {
                edu_onClose();
              } else if (type == 'INCOME') {
                income_onClose();
              } else if (type == 'ASSET') {
                asset_onClose();
              } else if (type == 'SNS') {
                sns_onClose();
              } else if (type == 'VEHICLE') {
                vehicle_onClose();
              }
            },
          });
        } else {
          show({ content: '오류입니다. 관리자에게 문의해주세요.' });
          return false;
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  /* const saveSecondAuth = async () => {
    const data = new FormData();

    data.append('memberSeq', memberSeq);
    data.append('job_name', secondData.jobItem);
    data.append('edu_ins', secondData.eduItem);
    data.append('instagram_id', secondData.snsItem);
    data.append('vehicle', secondData.vehicleItem);

    if (secondData.jobFile.uri != '') {
      data.append('jobFile', secondData.jobFile);
    }
    if (secondData.eduFile.uri != '') {
      data.append('eduFile', secondData.eduFile);
    }
    if (secondData.incomeFile.uri != '') {
      data.append('incomeFile', secondData.incomeFile);
    }
    if (secondData.assetFile.uri != '') {
      data.append('assetFile', secondData.assetFile);
    }
    if (secondData.snsFile.uri != '') {
      data.append('snsFile', secondData.snsFile);
    }
    if (secondData.vehicleFile.uri != '') {
      data.append('vehicleFile', secondData.vehicleFile);
    }

    console.log('data ::: ', data);

    fetch(properties.api_domain + '/member/saveProfileSecondAuth/', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'jwt-token': await AsyncStorage.getItem(storeKey.JWT_TOKEN),
      },
      body: data,
    })
      .then((response) => response.json())
      .then((response) => {
        const goPress = async () => {
          try {
            dispatch(mbrReducer.setBase(JSON.stringify(response.memberBase)));
            dispatch(
              mbrReducer.setSecondAuth(JSON.stringify(response.memberSndAuthList))
            );
            navigation.navigate(STACK.COMMON, { screen: 'Profile1' });
          } catch (error) {
            console.log(error);
          }
        };

        goPress();
      })
      .catch((error) => {
        console.log('error', error);
      });
  }; */

  return (
    <>
      <CommonHeader title={'프로필 2차 인증'} />
      <ScrollView contentContainerStyle={[styles.scrollContainer]}>
        <SpaceView mb={24}>
          <CommonText>
            아래 버튼 선택 후 인증 뱃지를 등록할 수 있습니다.{'\n'}
            뱃지를 추가하여 자신을 어필해보세요.
          </CommonText>
        </SpaceView>

        <SpaceView mb={24}>
          <SpaceView mb={16}>
            <View style={styles.halfContainer}>
              {/* ############################################################## 직업인증 */}
              <AuthItemRender data={secondData.jobData} pressFn={job_onOpen} />

              {/* ############################################################## 학위인증 */}
              <AuthItemRender data={secondData.eduData} pressFn={edu_onOpen} />
            </View>
          </SpaceView>

          <SpaceView mb={16}>
            <View style={styles.halfContainer}>
              {/* ############################################################## 소득인증 */}
              <AuthItemRender
                data={secondData.incomeData}
                pressFn={income_onOpen}
              />

              {/* ############################################################## 자산인증 */}
              <AuthItemRender
                data={secondData.assetData}
                pressFn={asset_onOpen}
              />
            </View>
          </SpaceView>

          <SpaceView>
            <View style={styles.halfContainer}>
              {/* ############################################################## SNS인증 */}
              <AuthItemRender data={secondData.snsData} pressFn={sns_onOpen} />

              {/* ############################################################## 차량인증 */}
              <AuthItemRender
                data={secondData.vehicleData}
                pressFn={vehicle_onOpen}
              />
            </View>
          </SpaceView>
        </SpaceView>

        {/* <SpaceView mb={24}>
          <CommonBtn
            value={'확인'}
            type={'primary'}
            onPress={() => {
              //saveSecondAuth();
              saveSecondAuth_test();
            }}
          />
        </SpaceView> */}
      </ScrollView>

      {/* ###############################################
								직업 인증 팝업
			############################################### */}
      <Modalize
        ref={job_modalizeRef}
        adjustToContentHeight={true}
        handleStyle={modalStyle.modalHandleStyle}
        modalStyle={modalStyle.modalContainer}
      >
        <SecondAuthPopup
          type={'JOB'}
          onCloseFn={job_onClose}
          saveFn={saveSecondAuth}
          filePath01={filePathData.filePath01}
          filePath02={filePathData.filePath02}
          filePath03={filePathData.filePath03}
        />
      </Modalize>

      {/* ###############################################
								학위 인증 팝업
			############################################### */}
      <Modalize
        ref={edu_modalizeRef}
        adjustToContentHeight={true}
        handleStyle={modalStyle.modalHandleStyle}
        modalStyle={modalStyle.modalContainer}
      >
        <SecondAuthPopup
          type={'EDU'}
          onCloseFn={edu_onClose}
          saveFn={saveSecondAuth}
          filePath01={filePathData.filePath01}
          filePath02={filePathData.filePath02}
          filePath03={filePathData.filePath03}
        />
      </Modalize>

      {/* ###############################################
								소득 인증 팝업
			############################################### */}
      <Modalize
        ref={income_modalizeRef}
        adjustToContentHeight={true}
        handleStyle={modalStyle.modalHandleStyle}
        modalStyle={modalStyle.modalContainer}
      >
        <SecondAuthPopup
          type={'INCOME'}
          onCloseFn={income_onClose}
          saveFn={saveSecondAuth}
          filePath01={filePathData.filePath01}
          filePath02={filePathData.filePath02}
          filePath03={filePathData.filePath03}
        />
      </Modalize>

      {/* ###############################################
								자산 인증 팝업
			############################################### */}
      <Modalize
        ref={asset_modalizeRef}
        adjustToContentHeight={true}
        handleStyle={modalStyle.modalHandleStyle}
        modalStyle={modalStyle.modalContainer}
      >
        <SecondAuthPopup
          type={'ASSET'}
          onCloseFn={asset_onClose}
          saveFn={saveSecondAuth}
          filePath01={filePathData.filePath01}
          filePath02={filePathData.filePath02}
          filePath03={filePathData.filePath03}
        />
      </Modalize>

      {/* ###############################################
								SNS 인증 팝업
			############################################### */}
      <Modalize
        ref={sns_modalizeRef}
        adjustToContentHeight={true}
        handleStyle={modalStyle.modalHandleStyle}
        modalStyle={modalStyle.modalContainer}
      >
        <SecondAuthPopup
          type={'SNS'}
          onCloseFn={sns_onClose}
          saveFn={saveSecondAuth}
          filePath01={filePathData.filePath01}
          filePath02={filePathData.filePath02}
          filePath03={filePathData.filePath03}
        />
      </Modalize>

      {/* ###############################################
								차량 인증 팝업
			############################################### */}
      <Modalize
        ref={vehicle_modalizeRef}
        adjustToContentHeight={true}
        handleStyle={modalStyle.modalHandleStyle}
        modalStyle={modalStyle.modalContainer}
      >
        <SecondAuthPopup
          type={'VEHICLE'}
          onCloseFn={vehicle_onClose}
          saveFn={saveSecondAuth}
          filePath01={filePathData.filePath01}
          filePath02={filePathData.filePath02}
          filePath03={filePathData.filePath03}
        />
      </Modalize>
    </>
  );
};

{
  /* #######################################################################################################
								인증 아이템 렌더링
####################################################################################################### */
}
const AuthItemRender = (dataObj: any) => {
  const data = dataObj.data;

  let imgSrc: any = '';
  let authDesc = '';

  if (data.common_code == 'JOB') {
    imgSrc = ICON.job;
    authDesc = '내 커리어를 확인할 수 있는 명함 또는 증명서를 올려주세요';
  } else if (data.common_code == 'EDU') {
    imgSrc = ICON.degree;
    authDesc = '대학교/대학원의 재학증명서/졸업증명를 올려주세요.';
  } else if (data.common_code == 'INCOME') {
    imgSrc = ICON.income;
    authDesc = '내 소득 자료를 올려주세요.';
  } else if (data.common_code == 'ASSET') {
    imgSrc = ICON.asset;
    authDesc = '은행에서 발급해주는 잔고 증명서를 올려주세요.';
  } else if (data.common_code == 'SNS') {
    imgSrc = ICON.sns;
    authDesc = '내 인스타 ID가 보이는 스크린샷을 올려주세요.';
  } else if (data.common_code == 'VEHICLE') {
    imgSrc = ICON.vehicle;
    authDesc = '차량 등록등 또는 자동차보험가입 증빙 자료를 올려주세요.';
  }

  return (
    <TouchableOpacity style={styles.halfItemLeft} onPress={dataObj.pressFn}>
      <View style={styles.badgeBox}>
        <SpaceView mb={16}>
          <Image source={imgSrc} style={styles.iconSize40} />
        </SpaceView>

        {data.auth_level !== '' && typeof data.auth_level !== 'undefined' ? (
          <View style={[layoutStyle.row, _styles.levelArea]}>
            <CommonText textStyle={_styles.levelAreaLevelName}>LV</CommonText>
            <CommonText textStyle={_styles.levelAreaLevelValue}>
              {data.auth_level}
            </CommonText>
          </View>
        ) : null}

        <View style={[layoutStyle.row, _styles.statusArea]}>
          {data.auth_status == 'PROGRESS' ? (
            <CommonText>심사중</CommonText>
          ) : null}
          {typeof data.auth_status == 'undefined' ? (
            <CommonText>인증안함</CommonText>
          ) : null}
        </View>

        <SpaceView mb={8}>
          <View style={[layoutStyle.row, layoutStyle.alignCenter]}>
            <CommonText>{data.code_name}</CommonText>
            <Image source={ICON.arrRight} style={styles.iconSize} />
          </View>
        </SpaceView>

        <CommonText color={ColorType.gray6666} type={'h6'} lineHeight={15}>
          {authDesc}
        </CommonText>
      </View>
    </TouchableOpacity>
  );
};

const _styles = StyleSheet.create({
  levelArea: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  statusArea: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  levelAreaLevelName: {
    fontSize: 14,
    marginRight: 8,
  },
  levelAreaLevelValue: {
    fontSize: 20,
  },
});
