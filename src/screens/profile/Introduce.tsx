import { styles, layoutStyle, modalStyle, commonStyle } from 'assets/styles/Styles';
import CommonHeader from 'component/CommonHeader';
import { CommonInput } from 'component/CommonInput';
import SpaceView from 'component/SpaceView';
import { ScrollView, View, StyleSheet, TouchableOpacity, Image, Dimensions, KeyboardAvoidingView, Platform, Text } from 'react-native';
import * as React from 'react';
import { FC, useState, useEffect, useRef } from 'react';
import { CommonSelect } from 'component/CommonSelect';
import { CommonBtn } from 'component/CommonBtn';
import { CommonText } from 'component/CommonText';
import { CommonTextarea } from 'component/CommonTextarea';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  RouteProp,
  useNavigation,
  useIsFocused,
} from '@react-navigation/native';
import {
  ColorType,
  StackParamList,
  BottomParamList,
  ScreenNavigationProp,
} from '@types';
import { useDispatch } from 'react-redux';
import { STACK } from 'constants/routes';
import { useUserInfo } from 'hooks/useUserInfo';
import { get_common_code, update_additional, get_member_introduce, save_member_introduce } from 'api/models';
import { usePopup } from 'Context';
import { myProfile } from 'redux/reducers/authReducer';
import { Color } from 'assets/styles/Color';
import { ICON } from 'utils/imageUtils';
import { Modalize } from 'react-native-modalize';
import { SUCCESS } from 'constants/reusltcode';
import { isEmptyData } from 'utils/functions';
import { CommonLoading } from 'component/CommonLoading';
import { setPartialPrincipal } from 'redux/reducers/authReducer';


/* ################################################################################################################
###################################################################################################################
###### 내 소개하기
###################################################################################################################
################################################################################################################ */

interface Props {
  navigation: StackNavigationProp<StackParamList, 'Introduce'>;
  route: RouteProp<StackParamList, 'Introduce'>;
}

export const Introduce = (props: Props) => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const isFocus = useIsFocused();
  const dispatch = useDispatch();
  const { show } = usePopup();  // 공통 팝업
  const { width, height } = Dimensions.get('window');
  const [isLoading, setIsLoading] = useState(false);

  const memberBase = useUserInfo(); // 회원 기본정보

  const [comment, setComment] = React.useState<any>(memberBase?.comment);
  const [introduceComment, setIntroduceComment] = React.useState<any>('');
  const [business, setBusiness] = React.useState<any>(memberBase?.business);
  const [job, setJob] = React.useState<any>(memberBase?.job);
  const [job_name, setJob_name] = React.useState<any>(memberBase?.job_name);
  //const [birthLocal, setBirthLocal] = React.useState(props.route.params.birth_local);
  //const [activeLocal, setActiveLocal] = React.useState(props.route.params.active_local);
  const [mbrHeight, setMbrHeight] = React.useState<any>(memberBase?.height);
  const [form_body, setForm_body] = React.useState<any>(memberBase?.form_body);
  const [religion, setReligion] = React.useState<any>(memberBase?.religion);
  const [drinking, setDrinking] = React.useState<any>(memberBase?.drinking);
  const [smoking, setSmoking] = React.useState<any>(isEmptyData(memberBase?.smoking) ? memberBase?.smoking : '');

  const int_modalizeRef = useRef<Modalize>(null);
  const int_onOpen = () => { int_modalizeRef.current?.open(); };
  const int_onClose = () => { int_modalizeRef.current?.close(); };

  // 클릭 여부
  const [isClickable, setIsClickable] = useState(true);

  // 관심사 목록
  const [intList, setIntList] = React.useState([]);

  // 관심사 체크 목록
  const [checkIntList, setCheckIntList] = React.useState([{code_name: "", common_code: "", interest_seq: ""}]);

  // 관심사 등록 확인 함수
  const int_confirm = () => {
    int_modalizeRef.current?.close();
  };

  // ############################################################ 업종 그룹 코드 목록
  const busiGrpCdList = [
    { label: '일반', value: 'JOB_00' },
    { label: '공군/군사', value: 'JOB_01' },
    { label: '교육/지식/연구', value: 'JOB_02' },
    { label: '경영/사무', value: 'JOB_03' },
    { label: '기획/통계', value: 'JOB_04' },
    { label: '건설/전기', value: 'JOB_05' },
    { label: '금융/회계', value: 'JOB_06' },
    { label: '기계/기술', value: 'JOB_07' },
    { label: '보험/부동산', value: 'JOB_08' },
    { label: '생활', value: 'JOB_09' },
    { label: '식음료/여가/오락', value: 'JOB_10' },
    { label: '법률/행정', value: 'JOB_11' },
    { label: '생산/제조/가공', value: 'JOB_12' },
    { label: '영업/판매/관리', value: 'JOB_13' },
    { label: '운송/유통', value: 'JOB_14' },
    { label: '예체능/예술/디자인', value: 'JOB_15' },
    { label: '의료/건강', value: 'JOB_16' },
    { label: '인터넷/IT', value: 'JOB_17' },
    { label: '미디어', value: 'JOB_18' },
    { label: '기타', value: 'JOB_19' },
  ];

  // 직업 그룹 코드 목록
  const [jobCdList, setJobCdList] = React.useState([{ label: '', value: '' }]);

  // 출신지 지역 코드 목록
  const bLocalGrpCdList = [
    { label: '서울', value: 'LOCA_00' },
    { label: '경기', value: 'LOCA_01' },
    { label: '충북', value: 'LOCA_02' },
    { label: '충남', value: 'LOCA_03' },
    { label: '강원', value: 'LOCA_04' },
    { label: '경북', value: 'LOCA_05' },
    { label: '경남', value: 'LOCA_06' },
    { label: '전북', value: 'LOCA_07' },
    { label: '전남', value: 'LOCA_08' },
    { label: '제주', value: 'LOCA_09' },
  ];

  // 활동지 항목 목록

  // 남자 체형 항목 목록
  const manBodyItemList = [
    { label: '보통', value: 'NORMAL' },
    { label: '마른 체형', value: 'SKINNY' },
    { label: '근육질', value: 'FIT' },
    { label: '건장한', value: 'GIANT' },
    { label: '슬림 근육', value: 'SLIM' },
    { label: '통통한', value: 'CHUBBY' },
  ];

  // 여자 체형 항목 목록
  const womanBodyItemList = [
    { label: '보통', value: 'NORMAL' },
    { label: '마른 체형', value: 'SKINNY' },
    { label: '섹시한', value: 'SEXY' },
    { label: '글래머', value: 'GLAMOUR' },
    { label: '아담한', value: 'COMPACT' },
    { label: '모델핏', value: 'MODEL' },
    { label: '통통한', value: 'CHUBBY' },
  ];

  // 종교 항목 목록
  const religionItemList = [
    { label: '무교(무신론자)', value: 'NONE' },
    { label: '무교(유신론자)', value: 'THEIST' },
    { label: '기독교', value: 'JEJUS' },
    { label: '불교', value: 'BUDDHA' },
    { label: '이슬람', value: 'ALLAH' },
    { label: '천주교', value: 'MARIA' },
  ];

  // 음주 항목 목록
  const drinkItemList = [
    { label: '안마심', value: 'NONE' },
    { label: '가볍게 마심', value: 'LIGHT' },
    { label: '자주 즐김', value: 'HARD' },
  ];

  // 흡연 항목 목록
  const smokItemList = [
    { label: '비흡연', value: 'NONE' },
    { label: '가끔 흡연', value: 'LIGHT' },
    { label: '자주 흡연', value: 'HARD' },
  ];

  // ############################################################ 직업 코드 목록 조회 함수
  const getJobCodeList = async (value: string) => {
    const body = {
      group_code: value
    };
    try {
      setIsLoading(true);
      const { success, data } = await get_common_code(body);
      if(success) {
        switch (data.result_code) {
        case SUCCESS:
          let dataList = new Array();
          data.code_list?.map(
            ({
              group_code,
              common_code,
              code_name,
            }: {
              group_code: any;
              common_code: any;
              code_name: any;
            }) => {
              let dataMap = { label: code_name, value: common_code };
              dataList.push(dataMap);
            }
          );
          setJobCdList(dataList);
          break;
        default:
          show({
            content: '오류입니다. 관리자에게 문의해주세요.' ,
            confirmCallback: function() {}
          });
          break;
        }
      } else {
        show({
          content: '오류입니다. 관리자에게 문의해주세요.' ,
          confirmCallback: function() {}
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }

  };

  // ############################################################ 회원 소개 정보 조회 함수
  const getMemberIntroduce = async (group_code: string) => {
    const body = {
      group_code: group_code
    };
    try {
      setIsLoading(true);
      const { success, data } = await get_member_introduce(body);
      if(success) {
        switch (data.result_code) {
        case SUCCESS:
          let dataList = new Array();
          data?.code_list?.map(
            ({
              group_code,
              common_code,
              code_name,
            }: {
              group_code: any;
              common_code: any;
              code_name: any;
            }) => {
              let dataMap = { label: code_name, value: common_code };
              dataList.push(dataMap);
            }
          );
          setJobCdList(dataList); // 직업 코드 목록
          setIntList(data.int_list); // 관심사 목록

          let setList = new Array();
          data.int_list.map((item, index) => {
            item.list.map((obj, idx) => {
              if(obj.interest_seq != null) {
                setList.push(obj);
              }
            })
          })
    
          setCheckIntList(setList);
          setIntroduceComment(data.member_add?.introduce_comment);
          
          break;
        default:
          show({
            content: '오류입니다. 관리자에게 문의해주세요.' ,
            confirmCallback: function() {}
          });
          break;
        }
      } else {
        show({
          content: '오류입니다. 관리자에게 문의해주세요.' ,
          confirmCallback: function() {}
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // ############################################################ 내 소개하기 저장
  const saveMemberAddInfo = async () => {

    // 중복 클릭 방지 설정
    if(isClickable) {
      setIsClickable(false);
      setIsLoading(true);

      try {

        if(!isEmptyData(comment)) {
          show({ content: '한줄 소개를 입력해 주세요.' });
          return false;
        };
    
        // 업종 선택한 경우 직업 필수 선택 체크
        if(isEmptyData(business) && !isEmptyData(job)) {
          show({ content: '직업을 선택해 주세요.' });
          return false;
        }
    
        const body = {
          comment: comment,
          business: business,
          job: job,
          job_name: job_name,
          height: mbrHeight,
          form_body: form_body,
          religion: religion,
          drinking: drinking,
          smoking: smoking,
          interest_list : checkIntList,
          introduce_comment: introduceComment,
        };

        const { success, data } = await save_member_introduce(body);
        if(success) {
          switch (data.result_code) {
          case SUCCESS:

            // 갱신된 회원 기본 정보 저장
            dispatch(setPartialPrincipal({ mbr_base : data.mbr_base }));

            show({
              type: 'RESPONSIVE',
              content: '내 소개 정보가 저장되었습니다.',
            });

            navigation.navigate(STACK.TAB, {
              screen: 'Roby',
            });
            
            break;
          default:
            show({ content: '오류입니다. 관리자에게 문의해주세요.' });
            break;
          }
        } else {
          show({ content: '오류입니다. 관리자에게 문의해주세요.' });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsClickable(true);
        setIsLoading(false);
      }

    }
  };

  // 셀렉트 박스 콜백 함수
  const busiCdCallbackFn = (value: string) => {
    setBusiness(value);
    getJobCodeList(value);
  };
  const jobCdCallbackFn = (value: string) => {
    setJob(value);
  };
  const bodyCdCallbackFn = (value: string) => {
    setForm_body(value);
  };
  const religionCdCallbackFn = (value: string) => {
    setReligion(value);
  };
  const drinkCdCallbackFn = (value: string) => {
    setDrinking(value);
  };
  const smokCdCallbackFn = (value: string) => {
    setSmoking(value);
  };

  const handleTextChange = (text: String) => {
    if (text.split('\n').length <= 3) {
      setComment(text);
    }
  };

  // 첫 렌더링 때 실행
  React.useEffect(() => {
    if(isFocus) {
      getMemberIntroduce(memberBase.business);

      //if (memberBase.business != '') {
        //getJobCodeList(memberBase.business);
        //getMemberIntroduce(memberBase.business);
      //}
    }

  }, [isFocus]);

  return (
    <>
      {isLoading && <CommonLoading />}

      <CommonHeader title={'내 소개하기'} />
      <ScrollView style={styles.scrollContainerAll}>
        <View style={commonStyle.paddingHorizontal20}>
          <SpaceView mb={24}>
            <SpaceView mb={10} viewStyle={{flexDirection: 'row', alignItems: 'flex-end'}}>
              <CommonText textStyle={_styles.labelStyle2}>한줄 소개</CommonText>
              <Text style={_styles.countText}>({comment.length}/50)</Text>
            </SpaceView>

            <CommonTextarea
                label={''} 
                value={comment}
                onChangeText={(comment) => setComment(comment)}
                placeholder={'한줄 소개를 입력 하세요.'}
                placeholderTextColor={'#c6ccd3'}
                maxLength={50}
                height={70}
                borderRadius={10}
                fontSize={12}
                fontColor={'#333333'}
                onChangeText={ handleTextChange }
            />

            {/* <CommonInput
              label={'한줄 소개'}
              value={comment}
              onChangeText={(comment) => setComment(comment)}
              placeholder={'내용을 입력해 주세요.'}
              placeholderTextColor={'#c6ccd3'}
              borderBottomType={'black'}
            /> */}
          </SpaceView>

          <SpaceView mb={24}>
            <SpaceView mb={10} viewStyle={{flexDirection: 'row', alignItems: 'flex-end'}}>
              <CommonText textStyle={_styles.labelStyle2}>프로필 소개</CommonText>
              <Text style={_styles.countText}>({isEmptyData(introduceComment) ? introduceComment.length : 0}/3000)</Text>
            </SpaceView>

            <CommonTextarea
                label={''}
                value={introduceComment}
                onChangeText={(introduceComment) => setIntroduceComment(introduceComment)}
                placeholder={'자유롭게 나 자신을 소개해 주세요!\n구체적으로 작성할수록 이성에게\n좋은 매력 포인트가 될 수 있어요 😊'}
                placeholderTextColor={'#c6ccd3'}
                maxLength={3000}
                height={150}
                borderRadius={10}
                fontSize={12}
                fontColor={'#333333'}
            />
          </SpaceView>

          <SpaceView mb={24}>
            <SpaceView mb={8}>
              <CommonText textStyle={_styles.labelStyle2}>관심사</CommonText>
            </SpaceView>
            
            {checkIntList.length > 0 &&
              <SpaceView mb={10} mt={15} viewStyle={[layoutStyle.row, layoutStyle.wrap]}>
                {checkIntList.map((i, index) => {
                  return (
                    i.code_name != "" ? (
                      <SpaceView mr={5} key={index + 'reg'}>
                        <View style={[styles.interestBox, styles.boxActive]}>
                          <CommonText color={ColorType.blue697A}>
                            {i.code_name}
                          </CommonText>
                        </View>
                      </SpaceView>
                    ) : null
                  );
                })}
              </SpaceView>
            }

            <SpaceView mb={15} mt={5}>

              <TouchableOpacity style={_styles.btnStyle} onPress={int_onOpen}>
                <CommonText color={'#C7C7C7'} type={'h5'} fontWeight={'200'} textStyle={{marginLeft: 5}}>관심사 변경</CommonText>
              </TouchableOpacity>

            {/*  <CommonBtn value={'관심사 변경'} 
                          height={48} 
                          type={'white'} 
                          icon={ICON.plus}
                          onPress={int_onOpen} /> */}
            </SpaceView>
          </SpaceView>

          <SpaceView mb={24} viewStyle={styles.halfContainer}>
            <View style={styles.halfItemLeft}>
              <CommonSelect
                label={'업종'}
                items={busiGrpCdList}
                selectValue={business}
                callbackFn={busiCdCallbackFn}
              />
            </View>

            <View style={styles.halfItemRight}>
              <CommonSelect
                label={'직업'}
                items={jobCdList}
                selectValue={job}
                callbackFn={jobCdCallbackFn}
              />
            </View>
          </SpaceView>

          {/* <SpaceView mb={24}>
            <CommonInput
              label={'회사명'}
              value={job_name}
              onChangeText={(jobName) => setJob_name(jobName)}
              placeholder={'회사명을 입력해 주세요.'}
              placeholderTextColor={'#c6ccd3'}
            />
          </SpaceView> */}

          {/* <SpaceView mb={24} viewStyle={styles.halfContainer}>
            <View style={styles.halfItemLeft}>
              <CommonSelect label={'출신지'} items={bLocalGrpCdList} setValue={bir} />
            </View>

            <View style={styles.halfItemRight}>
              <CommonSelect label={''} />
            </View>
          </SpaceView> */}

          {/* <SpaceView mb={24} viewStyle={styles.halfContainer}>
            <View style={styles.halfItemLeft}>
              <CommonSelect label={'활동지역'} />
            </View>

            <View style={styles.halfItemRight}>
              <CommonSelect label={''} />
            </View>
          </SpaceView> */}

          <SpaceView mb={24}>
            <CommonInput
              label={'키'}
              keyboardType="number-pad"
              value={mbrHeight}
              onChangeText={(mbrHeight) => setMbrHeight(mbrHeight)}
              placeholder={'키를 입력해 주세요.'}
              placeholderTextColor={'#c6ccd3'}
              maxLength={3}
            />
          </SpaceView>

          <SpaceView mb={24}>
            <CommonSelect
              label={'체형'}
              items={
                memberBase?.gender == 'M' ? manBodyItemList : womanBodyItemList
              }
              selectValue={form_body}
              callbackFn={bodyCdCallbackFn}
            />
          </SpaceView>

          <SpaceView mb={24}>
            <CommonSelect
              label={'종교'}
              items={religionItemList}
              selectValue={religion}
              callbackFn={religionCdCallbackFn}
            />
          </SpaceView>

          <SpaceView mb={24}>
            <CommonSelect
              label={'음주'}
              items={drinkItemList}
              selectValue={drinking}
              callbackFn={drinkCdCallbackFn}
            />
          </SpaceView>

          <SpaceView mb={40}>
            <CommonSelect
              label={'흡연'}
              items={smokItemList}
              selectValue={smoking}
              callbackFn={smokCdCallbackFn}
            />
          </SpaceView>
        </View>

      </ScrollView>

      <SpaceView>
        <CommonBtn
          value={'저장'}
          type={'primary'}
          height={60}
          borderRadius={1}
          onPress={() => {
            saveMemberAddInfo();
          }}
        />
      </SpaceView>




      {/* #############################################################################
                      관심사 설정 팝업
      ############################################################################# */}

      <Modalize
        ref={int_modalizeRef}
        adjustToContentHeight = {false}
        handleStyle={modalStyle.modalHandleStyle}
        modalStyle={modalStyle.modalContainer}
        modalHeight={height - 150}
        FooterComponent={
          <>
            <SpaceView>
              <CommonBtn value={'저장(' + checkIntList.length + '/20)'} 
                    type={'primary'}
                    height={60}
                    borderRadius={1}
                    onPress={int_confirm}/>
            </SpaceView>
          </>
        }
        HeaderComponent={
          <>
            <View style={modalStyle.modalHeaderContainer}>
              <CommonText fontWeight={'700'} type={'h4'}>
                관심사 등록(최대 20개)
              </CommonText>
              <TouchableOpacity onPress={int_onClose} hitSlop={commonStyle.hipSlop20}>
                <Image source={ICON.xBtn2} style={styles.iconSize18} />
              </TouchableOpacity>
            </View>
          </>
        } > 

        <View style={modalStyle.modalBody}>
          {intList.map((item, index) => (
            <SpaceView mt={20} mb={10} key={item.group_code + '_' + index}>
              <SpaceView mb={16}>
                <CommonText fontWeight={'700'}>{item.group_code_name}</CommonText>
              </SpaceView>

              <View style={[_styles.rowStyle]}>
                {item.list.map((i, idx) => {
                  let tmpCommonCode = '';
                  let tmpCnt = 0;
  
                  for (let j = 0; j < checkIntList.length; j++) {
                    if(checkIntList[j].common_code == i.common_code){
                      tmpCommonCode = i.common_code
                      tmpCnt = j;
                      break;
                    }
                  }

                  return (
                    <SpaceView key={i.common_code} mr={5}>
                      <TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
                                onPress={() => {
                                  if(checkIntList.length > 19 && i.common_code !== tmpCommonCode) {
                                    /* if(Platform.OS == 'android') {
                                      show({
                                        title: '알림',
                                        content: '' ,
                                        confirmCallback: function() {}
                                      });
                                    } */
                                  } else {
                                    if(i.common_code === tmpCommonCode){
                                      setCheckIntList(checkIntList.filter(value => value.common_code != tmpCommonCode))
                                    } else {
                                      setCheckIntList(intValue => [...intValue, i])
                                    }
                                  }
                                }}>
                        <CommonText
                          fontWeight={'500'}
                          color={i.common_code === tmpCommonCode ? ColorType.blue697A : ColorType.grayb1b1} >
                          {i.code_name}
                        </CommonText>
                      </TouchableOpacity>
                    </SpaceView>
                  )
                })} 
              </View>
            </SpaceView>
          ))}
        </View>
      </Modalize>


    </>
  );
};




const _styles = StyleSheet.create({
  labelStyle: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'AppleSDGothicNeoR00',
    color: Color.gray6666,
  },
  labelStyle2: {
    fontSize: 17,
    lineHeight: 23,
    fontFamily: 'AppleSDGothicNeoEB00',
    color: Color.balck333333,
  },
  rowStyle : {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  btnStyle: {
    width: '100%',
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dotted',
    borderColor: '#C7C7C7',
    flexDirection: 'row',
  },
  countText: {
    marginLeft: 3,
    fontFamily: 'AppleSDGothicNeoR00',
    fontSize: 13,
    color: '#363636',
  },

});