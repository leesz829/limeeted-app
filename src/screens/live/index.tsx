import { useIsFocused, useNavigation } from '@react-navigation/native';
import {
  CommonCode,
  FileInfo,
  LabelObj,
  ProfileImg,
  LiveMemberInfo,
  LiveProfileImg,
  ScreenNavigationProp,
} from '@types';
import { styles } from 'assets/styles/Styles';
import axios from 'axios';
import { CommonText } from 'component/CommonText';
import { RadioCheckBox } from 'component/RadioCheckBox';
import SpaceView from 'component/SpaceView';
import TopNavigation from 'component/TopNavigation';
import { ViualSlider } from 'component/ViualSlider';
import * as React from 'react';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import * as properties from 'utils/properties';

import { LivePopup } from 'screens/commonpopup/LivePopup';
import { LiveSearch } from 'screens/live/LiveSearch';

import * as hooksMember from 'hooks/member';
import { get_live_members, regist_profile_evaluation, get_common_code } from 'api/models';
import { useMemberseq } from 'hooks/useMemberseq';

/* ################################################################################################################
###### LIVE
################################################################################################################ */

export const Live = () => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const member_seq = useMemberseq();
  const isFocus = useIsFocused();

  const jwtToken = hooksMember.getJwtToken(); // 토큰

  // 로딩 상태 체크
  const [isLoad, setIsLoad] = useState(false);

  // 회원 인상 정보
  const [faceTypeList, setFaceTypeList] = useState([LabelObj]);

  // LIVE 회원 기본 정보
  const [liveMemberInfo, setLiveMemberInfo] = useState(LiveMemberInfo);

  // LIVE 회원 프로필 사진 목록
  const [liveProfileImg, setLiveProfileImg] = useState([LiveProfileImg]);
  //const [profileImgList, setProfileImgList] = useState([ProfileImg]);

  // 팝업 이벤트 제어 변수
  const [clickEventFlag, setClickEventFlag] = useState(false);

  // 이상형 타입 코드
  const [clickFaceTypeCode, setClickFaceTypeCode] = useState('');

  // 이상형 타입
  const [clickFaceType, setClickFaceType] = useState('');

  // 선택한 인상 점수
  let clickFaceScore = '';

  // 팝업 화면 콜백 함수
  const callBackFunction = (flag: boolean, faceType: string, score: string) => {
    setClickEventFlag(flag);

    let tmpClickFaceType = faceType ? faceType : clickFaceType;
    setClickFaceTypeCode(tmpClickFaceType);

    for (let idx in faceTypeList) {
      if (faceTypeList[idx].value == tmpClickFaceType) {
        setClickFaceType(faceTypeList[idx].label);
        break;
      }
    }

    if (score) {
      clickFaceScore = score;
      setFaceTypeList([LabelObj]);
      insertProfileAssessment();
    }
  };

  // ######################################################### 프로필 평가 등록
  const insertProfileAssessment = async () => {
    const body = {
      profile_score: clickFaceScore,
      face_code: clickFaceTypeCode,
      member_seq: liveMemberInfo.member_seq
    };
    try {
      const { success, data } = await regist_profile_evaluation(body);

      if (success && data.result_code != '0000') {
        setIsLoad(false);
        getLiveMatchTrgt();
      }
    } catch (error) {
      console.log(error);
    } finally {
      // 다른 프로필 이미지 정보 재호출
      getLiveMatchTrgt();
      // 다른 인상정보 재호출
      //getFaceType();
    }
  };

  // ######################################################### LIVE 평가 회원 조회
  const getLiveMatchTrgt = async () => {
    const { success, data } = await get_live_members();
    if (success) {

      if(data.result_code == '0000') {
        let tmpMemberInfo = LiveMemberInfo;
        let tmpProfileImgList = [LiveProfileImg];
        let tmpFaceTypeList = [LabelObj];
        let commonCodeList = [CommonCode];

        tmpMemberInfo = data.live_member_info;

        // LIVE 회원 프로필 사진
        data.live_profile_img_list.map((item) => {
          tmpProfileImgList.push({
            url: properties.img_domain + item.file_path + item.file_name
            , member_img_seq: item.member_img_seq
            , order_seq: item.order_seq
          });
        });

        // 인상 유형 목록
        commonCodeList = data.face_type_list;

        // CommonCode
        commonCodeList.map((commonCode) => {
          tmpFaceTypeList.push({
            label: commonCode.code_name,
            value: commonCode.common_code,
          });
        });

        
        setLiveMemberInfo(tmpMemberInfo);

        tmpProfileImgList = tmpProfileImgList.filter((x) => x.url);
        setLiveProfileImg(tmpProfileImgList);
        setFaceTypeList(tmpFaceTypeList);
        setIsLoad(true);
      }
    }
  };

  // 첫 렌더링 때 fetchNews() 한 번 실행
  React.useEffect(() => {
    if (!isLoad) {
      // Live 매칭 대상 조회
      getLiveMatchTrgt();
    }
  }, [isFocus]);

  return liveProfileImg.length > 0 && isLoad ? (
    <>
      <TopNavigation currentPath={'LIVE'} />
      <ScrollView>
        <SpaceView>
          <ViualSlider
            isNew={liveMemberInfo.live_trgt_type == 'NEW' ? true : false}
            onlyImg={true}
            imgUrls={liveProfileImg}
            profileName={liveMemberInfo.name}
            age={liveMemberInfo.age}
          />
        </SpaceView>

        <SpaceView viewStyle={styles.container} pt={48}>
          <SpaceView mb={16}>
            <CommonText fontWeight={'700'} type={'h3'}>
              인상을 선택해주세요.
            </CommonText>
          </SpaceView>

          {faceTypeList.length > 0 && (
            <RadioCheckBox
              items={faceTypeList}
              callBackFunction={callBackFunction}
            />
          )}
        </SpaceView>
      </ScrollView>

      {clickEventFlag && (
        <LivePopup
          callBackFunction={callBackFunction}
          faceType={clickFaceType}
        />
      )}
    </>
  ) : (
    <LiveSearch />
  );
};