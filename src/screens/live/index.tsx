import { useIsFocused, useNavigation } from '@react-navigation/native';
import {
  CommonCode,
  FileInfo,
  LabelObj,
  ProfileImg,
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
import { get_live_members, regist_profile_evaluation } from 'api/models';
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

  // 회원 인상 정보
  const [profileImgList, setProfileImgList] = useState([ProfileImg]);

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

  // ####### 프로필 평가 등록
  const insertProfileAssessment = async () => {
    const body = {
      profile_score: clickFaceScore,
      face_code: clickFaceTypeCode,
      member_seq,
    };
    try {
      const { success, data } = await regist_profile_evaluation(body);

      if (success && data.result_code != '0000') {
        setIsLoad(false);
        getLiveProfileImg();
      }
    } catch (error) {
      console.log(error);
    } finally {
      // 다른 프로필 이미지 정보 재호출
      getLiveProfileImg();
      // 다른 인상정보 재호출
      getFaceType();
    }
    // const result = await axios
    //   .post(
    //     properties.api_domain + '/profile/insertProfileAssessment',
    //     {
    //       'api-key': 'U0FNR09CX1RPS0VOXzAx',
    //       member_seq: profileImgList[0].member_seq,
    //       profile_score: clickFaceScore,
    //       face_code: clickFaceTypeCode,
    //     },
    //     {
    //       headers: {
    //         'jwt-token': jwtToken,
    //       },
    //     }
    //   )
    //   .then(function (response) {
    //     if (response.data.result_code != '0000') {
    //       return false;
    //     }

    //     setIsLoad(false);
    //     getLiveProfileImg();
    //   })
    //   .finally(function () {
    //     // 다른 프로필 이미지 정보 재호출
    //     getLiveProfileImg();
    //     // 다른 인상정보 재호출
    //     getFaceType();
    //   })
    //   .catch(function (error) {
    //     console.log('insertProfileAssessment error ::: ', error);
    //   });
  };

  // LIVE 평가 회원 조회
  const getLiveProfileImg = async () => {
    const { success, data } = await get_live_members({ member_seq });
    if (success) {
      console.log('getLiveProfileImg :', JSON.stringify(data));
    }
    const result = await axios
      .post(
        properties.api_domain + '/match/selectLiveProfileImg',
        {
          'api-key': 'U0FNR09CX1RPS0VOXzAx',
        },
        {
          headers: {
            'jwt-token': jwtToken,
          },
        }
      )
      .then(function (response) {
        if (response.data.result_code != '0000') {
          return false;
        }

        let tmpProfileImgList = [ProfileImg];
        let fileInfoList = [FileInfo];
        fileInfoList = response.data.result;

        // CommonCode
        fileInfoList.map((fileInfo) => {
          tmpProfileImgList.push({
            url:
              properties.img_domain + fileInfo.file_path + fileInfo.file_name,
            member_seq: fileInfo.member_seq,
            name: fileInfo.name,
            comment: fileInfo.comment,
            age: fileInfo.age,
            profile_type: fileInfo.profile_type,
          });
        });
        tmpProfileImgList = tmpProfileImgList.filter((x) => x.url);
        setProfileImgList(tmpProfileImgList);
        setIsLoad(true);
      })
      .catch(function (error) {
        console.log('getLiveProfileImg error ::: ', error);
      });
  };

  // todo :: 조회대상 없을때 어떻게 처리?
  const getFaceType = async () => {
    const result = await axios
      .post(
        properties.api_domain + '/common/selectGroupCodeList',
        {
          'api-key': 'U0FNR09CX1RPS0VOXzAx',
          group_code: 'OPPOSITE_FACE',
        },
        {
          headers: {
            'jwt-token': jwtToken,
          },
        }
      )
      .then(function (response) {
        if (response.data.result_code != '0000') {
          return false;
        }

        let tmpFaceTypeList = [LabelObj];
        let commonCodeList = [CommonCode];
        commonCodeList = response.data.result;

        // CommonCode
        commonCodeList.map((commonCode) => {
          tmpFaceTypeList.push({
            label: commonCode.code_name,
            value: commonCode.common_code,
          });
        });

        setFaceTypeList(tmpFaceTypeList);
      })
      .catch(function (error) {
        console.log('getFaceType error ::: ', error);
      });
  };

  // 첫 렌더링 때 fetchNews() 한 번 실행
  React.useEffect(() => {
    if (!isLoad) {
      // 프로필 이미지 정보
      getLiveProfileImg();
    }

    // 인상정보
    getFaceType();
  }, [isFocus]);

  return profileImgList.length > 0 && isLoad ? (
    <>
      <TopNavigation currentPath={'LIVE'} />
      <ScrollView>
        <SpaceView>
          <ViualSlider
            isNew={profileImgList[0].profile_type == 'NEW' ? true : false}
            onlyImg={true}
            imgUrls={profileImgList}
            profileName={profileImgList[0].name}
            age={profileImgList[0].age}
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
