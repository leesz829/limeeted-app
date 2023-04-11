import { styles, layoutStyle, modalStyle } from 'assets/styles/Styles';
import CommonHeader from 'component/CommonHeader';
import { CommonInput } from 'component/CommonInput';
import SpaceView from 'component/SpaceView';
import { ScrollView, View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import * as React from 'react';
import { FC, useState, useEffect, useRef } from 'react';
import { CommonSelect } from 'component/CommonSelect';
import { CommonBtn } from 'component/CommonBtn';
import { CommonText } from 'component/CommonText';
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
import { get_common_code, update_additional, get_member_introduce } from 'api/models';
import { usePopup } from 'Context';
import { myProfile } from 'redux/reducers/authReducer';
import { Color } from 'assets/styles/Color';
import { ICON } from 'utils/imageUtils';
import { Modalize } from 'react-native-modalize';
import { SUCCESS } from 'constants/reusltcode';


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

  const memberBase = useUserInfo(); // 회원 기본정보

  const [comment, setComment] = React.useState<any>(memberBase.comment);
  const [business, setBusiness] = React.useState<any>(memberBase.business);
  const [job, setJob] = React.useState<any>(memberBase.job);
  const [job_name, setJob_name] = React.useState<any>(memberBase.job_name);
  //const [birthLocal, setBirthLocal] = React.useState(props.route.params.birth_local);
  //const [activeLocal, setActiveLocal] = React.useState(props.route.params.active_local);
  const [mbrHeight, setMbrHeight] = React.useState<any>(memberBase.height);
  const [form_body, setForm_body] = React.useState<any>(memberBase.form_body);
  const [religion, setReligion] = React.useState<any>(memberBase.religion);
  const [drinking, setDrinking] = React.useState<any>(memberBase.drinking);
  const [smoking, setSmoking] = React.useState<any>(memberBase.smoking);

  const int_modalizeRef = useRef<Modalize>(null);
	const int_onOpen = () => { int_modalizeRef.current?.open(); };
	const int_onClose = () => {	int_modalizeRef.current?.close(); };

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

  // 체형 항목 목록
  const manBodyItemList = [
    { label: '보통', value: 'NORMAL' },
    { label: '마른 체형', value: 'SKINNY' },
    { label: '근육질', value: 'FIT' },
    { label: '건장한', value: 'GIANT' },
  ];

  const womanBodyItemList = [
    { label: '보통', value: 'NORMAL' },
    { label: '마른 체형', value: 'SKINNY' },
    { label: '섹시한', value: 'SEXY' },
    { label: '글래머', value: 'GLAMOUR' },
  ];

  // 종교 항목 목록
  const religionItemList = [
    { label: '무교', value: 'NONE' },
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
			
		}

  };

  // ############################################################ 회원 소개 정보 조회 함수
  const getMemberIntroduce = async (group_code: string) => {
    const body = {
      group_code: group_code
    };
    try {
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
          setJobCdList(dataList);       // 직업 코드 목록
          setIntList(data.int_list);   // 관심사 목록


          let setList = new Array();
					data.int_list.map((item, index) => {
						item.list.map((obj, idx) => {
							if(obj.interest_seq != null) {
								setList.push(obj);
							}
						})
					})
		
					setCheckIntList(setList);
					
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
			
		}

  };

  // ############################################################ 내 소개하기 저장
  const saveMemberAddInfo = async () => {
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
      interest_list : checkIntList
    };
    try {
			const { success, data } = await update_additional(body);
			if(success) {
				switch (data.result_code) {
				case SUCCESS:
          dispatch(myProfile());
          show({ content: '저장되었습니다.' });
          /* navigation.navigate(STACK.TAB, {
            screen: 'Roby',
          }); */					
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

  // 첫 렌더링 때 실행
  React.useEffect(() => {
    getMemberIntroduce(memberBase.business);

    //if (memberBase.business != '') {
      //getJobCodeList(memberBase.business);
      //getMemberIntroduce(memberBase.business);
    //}
  }, [isFocus]);

  return (
    <>
      <CommonHeader title={'내 소개하기'} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <SpaceView mb={24}>
          <CommonInput
            label={'한줄 소개'}
            value={comment}
            onChangeText={(comment) => setComment(comment)}
            placeholder={'한줄 소개를 입력해 주세요.'}
            placeholderTextColor={'#c6ccd3'}
          />
        </SpaceView>

        <SpaceView mb={24}>
					<SpaceView mb={8}>
						<CommonText textStyle={_styles.labelStyle2}>관심사</CommonText>
					</SpaceView>
          
          {checkIntList.length > 0 &&
            <SpaceView mb={40} mt={15} viewStyle={[layoutStyle.row, layoutStyle.wrap]}>
              {checkIntList.map((i, index) => {
                return (
                  i.code_name != "" ? (
                    <SpaceView mr={index % 3 !== 2 ? 8 : 0} key={index + 'reg'}>
                      <View style={[styles.interestBox, styles.boxActive]}>
                        <CommonText color={ColorType.primary}>
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
            <CommonBtn value={'관심사 변경'} 
							          height={48} 
								        type={'white'} 
								        icon={ICON.plus}
								        onPress={int_onOpen} />
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
              memberBase.gender == 'M' ? manBodyItemList : womanBodyItemList
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

        <SpaceView mb={16}>
          <CommonBtn
            value={'저장'}
            type={'primary'}
            onPress={() => {
              saveMemberAddInfo();
            }}
          />
        </SpaceView>
      </ScrollView>




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
						<SpaceView mb={16}>
							<CommonBtn value={'저장'} 
										type={'primary'}
										onPress={int_confirm}/>
						</SpaceView>
					</>
				}
				HeaderComponent={
					<>
						<View style={modalStyle.modalHeaderContainer}>
							<CommonText fontWeight={'700'} type={'h3'}>
								관심사 등록
							</CommonText>
							<TouchableOpacity onPress={int_onClose}>
								<Image source={ICON.xBtn} style={styles.iconSize24} />
							</TouchableOpacity>
						</View>
					</>
				} >	

				<View style={modalStyle.modalBody}>
					{intList.map((item, index) => (
						<SpaceView mb={24} key={item.group_code + '_' + index}>
							<SpaceView mb={16}>
								<CommonText fontWeight={'500'}>{item.group_code_name}</CommonText>
							</SpaceView>

							<View style={[_styles.rowStyle, layoutStyle.justifyBetween]}>
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
										<SpaceView key={i.common_code}>
											<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
																onPress={() => {
																	if(i.common_code === tmpCommonCode){
																		setCheckIntList(checkIntList.filter(value => value.common_code != tmpCommonCode))
																	} else {
																		setCheckIntList(intValue => [...intValue, i])
																	}
																}}>
												<CommonText
													fontWeight={'500'}
													color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
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
	}
});
