import { useRef } from 'react';
import {
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import type { FC, useState, useEffect } from 'react';
import * as React from 'react';
import CommonHeader from 'component/CommonHeader';
import { layoutStyle, modalStyle, styles } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import { ICON } from 'utils/imageUtils';
import SpaceView from 'component/SpaceView';
import { CommonBtn } from 'component/CommonBtn';
import { CommonSelect } from 'component/CommonSelect';
import { CommonInput } from 'component/CommonInput';
import axios from 'axios';
import * as properties from 'utils/properties';
import RNPickerSelect from 'react-native-picker-select';
import { Color } from 'assets/styles/Color';

/* ################################################################################################################
###################################################################################################################
###### 내 선호 이성
###################################################################################################################
################################################################################################################ */

interface Props {
  onCloseFn: () => void;

  idealTypeData: {
    ideal_type_seq: string;
    want_local1: string;
    want_local2: string;
    want_age_min: string;
    want_age_max: string;
    want_business1: string;
    want_business2: string;
    want_business3: string;
    want_job1: string;
    want_job2: string;
    want_job3: string;
    want_person1: string;
    want_person2: string;
    want_person3: string;
  };
}

export const Preference: FC<Props> = (props) => {
  console.log('iddd ::::: ', props.idealTypeData);

  const [idealTypeSeq, setIdealTypeSeq] = React.useState<any>('');
  const [wantLocal1, setWantLocal1] = React.useState<any>('');
  const [wantLocal2, setWantLocal2] = React.useState<any>('');
  const [wantAgeMin, setWantAgeMin] = React.useState<any>(
    props.idealTypeData.want_age_min
  );
  const [wantAgeMax, setWantAgeMax] = React.useState<any>(
    props.idealTypeData.want_age_max
  );
  const [wantBusiness1, setWantBusiness1] = React.useState<any>('');
  const [wantBusiness2, setWantBusiness2] = React.useState<any>('');
  const [wantBusiness3, setWantBusiness3] = React.useState<any>('');
  const [wantJob1, setWantJob1] = React.useState<any>('');
  const [wantJob2, setWantJob2] = React.useState<any>('');
  const [wantJob3, setWantJob3] = React.useState<any>('');
  const [wantPerson1, setWantPerson1] = React.useState<any>('');
  const [wantPerson2, setWantPerson2] = React.useState<any>('');
  const [wantPerson3, setWantPerson3] = React.useState<any>('');

  const [wantBusi1, setWantBus1] = React.useState<any>('');
  const [wantBusi2, setWantBus2] = React.useState<any>('');
  const [wantBusi3, setWantBus3] = React.useState<any>('');

  // 업종 그룹 코드 목록
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
  const [jobCdList1, setJobCdList1] = React.useState([
    { label: '', value: '' },
  ]);
  const [jobCdList2, setJobCdList2] = React.useState([
    { label: '', value: '' },
  ]);
  const [jobCdList3, setJobCdList3] = React.useState([
    { label: '', value: '' },
  ]);

  // 여자 인상 항목 목록
  const gFaceItemList = [
    { label: '다정해보여요', value: 'FACE_G_01' },
    { label: '웃는게 예뻐요', value: 'FACE_G_02' },
    { label: '스타일이 남달라요', value: 'FACE_G_03' },
    { label: '피부가 좋아요', value: 'FACE_G_04' },
    { label: '눈이 예뻐요', value: 'FACE_G_05' },
    { label: '현모양처상', value: 'FACE_G_06' },
  ];

  // 남자 인상 항목 목록
  const mFaceItemList = [
    { label: '다정해보여요', value: 'FACE_M_01' },
    { label: '스타일이 남달라요', value: 'FACE_M_02' },
    { label: '피부가 좋아요', value: 'FACE_M_03' },
    { label: '오똑한 콧날', value: 'FACE_M_04' },
    { label: '넓은 어깨', value: 'FACE_M_05' },
    { label: '요섹남', value: 'FACE_M_06' },
  ];

  // 직업 코드 목록 조회 함수
  const getJobCodeList = async (type: string) => {
    let paramBusinessCd = '';

    if (type == '01') {
      paramBusinessCd = wantBusiness1;
    } else if (type == '02') {
      paramBusinessCd = wantBusiness2;
    } else if (type == '03') {
      paramBusinessCd = wantBusiness3;
    }

    const result = await axios
      .post(
        properties.api_domain + '/common/selectGroupCodeList',
        {
          'api-key': 'U0FNR09CX1RPS0VOXzAx',
          group_code: paramBusinessCd,
        },
        {
          headers: {
            'jwt-token': String(await properties.jwt_token()),
          },
        }
      )
      .then(function (response) {
        if (response.data.result_code != '0000') {
          console.log(response.data.result_msg);
          return false;
        } else {
          if (null != response.data.result) {
            let dataList = new Array();
            response.data?.result?.map(
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

            if (type == '01') {
              setJobCdList1(dataList);
            } else if (type == '02') {
              setJobCdList2(dataList);
            } else if (type == '02') {
              setJobCdList3(dataList);
            }
          }
        }
      })
      .catch(function (error) {
        console.log('error ::: ', error);
      });
  };

  // 셀렉트 박스 콜백 함수
  const busi1CallbackFn = (value: string) => {
    setWantBus1(value);
  };
  const busi2CallbackFn = (value: string) => {
    setWantBus2(value);
  };
  const busi3CallbackFn = (value: string) => {
    setWantBus3(value);
  };
  const jobCd1CallbackFn = (value: string) => {
    setWantJob1(value);
  };
  const jobCd2CallbackFn = (value: string) => {
    setWantJob2(value);
  };
  const jobCd3CallbackFn = (value: string) => {
    setWantJob3(value);
  };
  const wantPerson1CallbackFn = (value: string) => {
    setWantPerson1(value);
  };
  const wantPerson2CallbackFn = (value: string) => {
    setWantPerson2(value);
  };
  const wantPerson3CallbackFn = (value: string) => {
    setWantPerson3(value);
  };

  // 첫 렌더링 때 실행
  React.useEffect(() => {
    console.log('1111111');
    if (wantBusiness1 != '') {
      getJobCodeList('01');
    }
    if (wantBusiness2 != '') {
      getJobCodeList('02');
    }
    if (wantBusiness3 != '') {
      getJobCodeList('03');
    }
  }, []);

  // 업종 상태 관리
  React.useEffect(() => {
    if (wantBusiness1 != '') {
      getJobCodeList('01');
    }
  }, [wantBusiness1]);
  React.useEffect(() => {
    if (wantBusiness2 != '') {
      getJobCodeList('02');
    }
  }, [wantBusiness2]);
  React.useEffect(() => {
    if (wantBusiness3 != '') {
      getJobCodeList('03');
    }
  }, [wantBusiness3]);

  const modalizeRef = useRef<Modalize>(null);
  const onOpen = () => {
    modalizeRef.current?.open();
  };

  const onClose = () => {
    modalizeRef.current?.close();
  };

  return (
    <View style={layoutStyle.flex1}>
      <CommonHeader title={'내 선호 이성'} />
      <CommonBtn value={'Open the modal'} onPress={onOpen} type={'primary'} />

      <Modalize
        ref={modalizeRef}
        handleStyle={modalStyle.modalHandleStyle}
        modalStyle={modalStyle.modalContainer}
      >
        <View style={modalStyle.modalHeaderContainer}>
          <CommonText fontWeight={'700'} type={'h3'}>
            내 선호 이성
          </CommonText>
          <TouchableOpacity onPress={props.onCloseFn}>
            <Image source={ICON.xBtn} style={styles.iconSize24} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={modalStyle.modalBody}>
          <SpaceView mb={32}>
            <SpaceView mb={16}>
              <CommonText fontWeight={'700'} type={'h4'}>
                나이
              </CommonText>
            </SpaceView>

            <SpaceView viewStyle={styles.halfContainer}>
              <View style={styles.halfItemLeft}>
                <CommonInput
                  label={'최소'}
                  placeholder={'입력'}
                  keyboardType="number-pad"
                  value={wantAgeMin}
                  onChangeText={(wantAgeMin) => setWantAgeMin(wantAgeMin)}
                  maxLength={2}
                />
              </View>

              <View style={styles.halfItemRight}>
                <CommonInput
                  label={'최대'}
                  placeholder={'입력'}
                  keyboardType="number-pad"
                  value={wantAgeMax}
                  onChangeText={(wantAgeMax) => setWantAgeMax(wantAgeMax)}
                  maxLength={2}
                />
              </View>
            </SpaceView>
          </SpaceView>

          <SpaceView mb={32}>
            <SpaceView mb={16}>
              <CommonText fontWeight={'700'} type={'h4'}>
                거리
              </CommonText>
            </SpaceView>

            <SpaceView viewStyle={styles.halfContainer}>
              <View style={styles.halfItemLeft}>
                <CommonInput
                  label={'최소'}
                  placeholder={'입력'}
                  keyboardType="number-pad"
                  value={wantLocal1}
                  onChangeText={(wantLocal1) => setWantLocal1(wantLocal1)}
                  maxLength={2}
                />
              </View>

              <View style={styles.halfItemRight}>
                <CommonInput
                  label={'최대'}
                  placeholder={'입력'}
                  keyboardType="number-pad"
                  value={wantLocal2}
                  onChangeText={(wantLocal2) => setWantLocal2(wantLocal2)}
                  maxLength={2}
                />
              </View>
            </SpaceView>
          </SpaceView>

          <SpaceView mb={32}>
            <SpaceView mb={16}>
              <CommonText fontWeight={'700'} type={'h4'}>
                직업
              </CommonText>
            </SpaceView>
            <SpaceView mb={24} viewStyle={styles.halfContainer}>
              <View style={styles.halfItemLeft}>
                <CommonSelect
                  label={'업종'}
                  items={busiGrpCdList}
                  selectValue={wantBusi1}
                  callbackFn={busi1CallbackFn}
                />
              </View>

              <View style={styles.halfItemRight}>
                <CommonSelect
                  label={'직업'}
                  items={jobCdList1}
                  selectValue={wantJob1}
                  callbackFn={jobCd1CallbackFn}
                />
              </View>
            </SpaceView>
            <SpaceView mb={24} viewStyle={styles.halfContainer}>
              <View style={styles.halfItemLeft}>
                <CommonSelect
                  label={'업종'}
                  items={busiGrpCdList}
                  selectValue={wantBusi2}
                  callbackFn={busi2CallbackFn}
                />
              </View>

              <View style={styles.halfItemRight}>
                <CommonSelect
                  label={'직업'}
                  items={jobCdList1}
                  selectValue={wantJob2}
                  callbackFn={jobCd2CallbackFn}
                />
              </View>
            </SpaceView>
            <SpaceView viewStyle={styles.halfContainer}>
              <View style={styles.halfItemLeft}>
                <CommonSelect
                  label={'업종'}
                  items={busiGrpCdList}
                  selectValue={wantBusi3}
                  callbackFn={busi3CallbackFn}
                />
              </View>

              <View style={styles.halfItemRight}>
                <CommonSelect
                  label={'직업'}
                  items={jobCdList1}
                  selectValue={wantJob3}
                  callbackFn={jobCd3CallbackFn}
                />
              </View>
            </SpaceView>
          </SpaceView>

          <SpaceView mb={40}>
            <SpaceView mb={16}>
              <CommonText fontWeight={'700'} type={'h4'}>
                인상
              </CommonText>
            </SpaceView>
            <SpaceView mb={24}>
              <CommonSelect
                label={'인상'}
                items={gFaceItemList}
                selectValue={wantPerson1}
                callbackFn={wantPerson1CallbackFn}
              />
            </SpaceView>
            <SpaceView mb={24}>
              <CommonSelect
                label={'인상'}
                items={gFaceItemList}
                selectValue={wantPerson2}
                callbackFn={wantPerson2CallbackFn}
              />
            </SpaceView>
            <SpaceView>
              {/* <View style={styles1.selectContainer}>
								<View>
									<Text style={styles1.labelStyle}>{'인상'}</Text>
									<View style={styles1.inputContainer}>
										<RNPickerSelect
											style={pickerSelectStyles}
											useNativeAndroidPickerStyle={false}
											onValueChange={wantPerson3 => setWantPerson3(wantPerson3)}
											value={wantPerson3}
											items={gFaceItemList}
										/>
									</View>
								</View>
								<View style={styles1.selectImgContainer}>
									<Image source={ICON.arrRight} style={styles1.icon} />
								</View>
							</View> */}

              <CommonSelect
                label={'인상'}
                items={gFaceItemList}
                selectValue={wantPerson3}
                callbackFn={wantPerson3CallbackFn}
              />
            </SpaceView>
          </SpaceView>

          <SpaceView mb={16}>
            <CommonBtn
              value={'저장'}
              type={'primary'}
              onPress={() => {
                console.log('asdsaldkmlmk');
              }}
            />
          </SpaceView>
        </ScrollView>
      </Modalize>
    </View>
  );
};
