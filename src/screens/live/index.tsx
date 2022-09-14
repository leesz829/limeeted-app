import * as React from 'react';
import { useState, useEffect, useRef} from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import TopNavigation from 'component/TopNavigation';
import { styles } from 'assets/styles/Styles';
import SpaceView from 'component/SpaceView';
import { CommonText } from 'component/CommonText';
import { ViualSlider } from 'component/ViualSlider';
import { RadioCheckBox } from 'component/RadioCheckBox';
import { jwt_token, JWTdomain} from 'utils/properties';
import { ColorType, CommonCode, LabelObj, ProfileImg, FileInfo} from '@types';
import axios from 'axios';

import { LivePopup } from 'screens/commonpopup/LivePopup';


export const Live = () => {
	
	// 회원 인상 정보
	const [faceTypeList, setFaceTypeList] = useState([LabelObj]);
	// 회원 인상 정보
	const [profileImgList, setProfileImgList] = useState([ProfileImg]);
	// 팝업 이벤트 제어 변수
	const [clickEventFlag, setClickEventFlag] = useState(false);
	// 팝업 이벤트 제어 변수
	const [clickFaceType, setClickFaceType] = useState('');
	// 선택한 인상 점수
	let clickFaceScore = '';

	// 팝업 화면 콜백 함수
	const callBackFunction = (flag:boolean, faceType:string, score:string) =>{
		setClickEventFlag(flag);

		let tmpClickFaceType =  faceType?faceType:clickFaceType;
		setClickFaceType(tmpClickFaceType);

		 
		for(let idx in faceTypeList){
			if(faceTypeList[idx].value == tmpClickFaceType){
				setClickFaceType(faceTypeList[idx].label); 
				break;
			} 
		}
		
		if(score){
			clickFaceScore = score;
			insertProfileAssessment();
		}
	}
	
	const insertProfileAssessment = async () => {

		const result = await axios.post(JWTdomain() + '/profile/insertProfileAssessment', {
			'api-key' : 'U0FNR09CX1RPS0VOXzAx'
			, 'member_seq' : profileImgList[0].member_seq
			, 'profile_score' : clickFaceScore
			, 'face_code' : clickFaceType
		}
		, { 
			headers: {
				'jwt-token' : String(await jwt_token())
			}
		})
		.then(function (response) {
			if(response.data.result_code != '0000'){	
				return false;
			}

			// 다른 프로필 이미지 정보 재호출
			getLiveProfileImg();	
			// 다른 인상정보 재호출
			getFaceType();		
		})
		.catch(function (error) {
			console.log('insertProfileAssessment error ::: ', error);
		});
	}

	
	const getLiveProfileImg = async () => {
		const result = await axios.post(JWTdomain() + '/file/selectLiveProfileImg', {
			'api-key' : 'U0FNR09CX1RPS0VOXzAx'
		}
		, { 
			headers: {
				'jwt-token' : String(await jwt_token())
			}
		})
		.then(function (response) {
			if(response.data.result_code != '0000'){	
				return false;
			}

			let tmpProfileImgList = [ProfileImg];
			let fileInfoList = [FileInfo]
			fileInfoList = response.data.result;
			
			// CommonCode
			fileInfoList.map(fileInfo => {
				tmpProfileImgList.push({
									url : JWTdomain() + fileInfo.file_path
									, member_seq : fileInfo.member_seq
									, name : fileInfo.name
									, comment : fileInfo.comment
									, age : fileInfo.age
									, profile_type : fileInfo.profile_type
				})

				
			});
			tmpProfileImgList = tmpProfileImgList.filter(x => x.url);
			setProfileImgList(tmpProfileImgList);
		})
		.catch(function (error) {
			console.log('getFaceType error ::: ', error);
		});
	}


	// todo :: 조회대상 없을때 어떻게 처리?
	const getFaceType = async () => {
		
		const result = await axios.post(JWTdomain() + '/common/selectGroupCodeList', {
			'api-key' : 'U0FNR09CX1RPS0VOXzAx'
			, 'group_code' : 'OPPOSITE_FACE'
		}
		, {
			headers: {
				'jwt-token' : String(await jwt_token())
			}
		})
		.then(function (response) {
			if(response.data.result_code != '0000'){	
				return false;
			}

			let tmpFaceTypeList = [LabelObj];
			let commonCodeList = [CommonCode];
			commonCodeList = response.data.result;
			
			// CommonCode
			commonCodeList.map(commonCode => {
				tmpFaceTypeList.push({label: commonCode.code_name, value:commonCode.common_code})
			});

			 setFaceTypeList(tmpFaceTypeList);
		})
		.catch(function (error) {
			console.log('getFaceType error ::: ' , error);
		});
	}


	// 첫 렌더링 때 fetchNews() 한 번 실행
	useEffect(() => {
		// 프로필 이미지 정보
		getLiveProfileImg();
		
		// 인상정보
		getFaceType();
	}, []);
	
	
	return (
		<>
			<TopNavigation currentPath={'LIVE'} />
			<ScrollView>
				<SpaceView>
					<ViualSlider isNew={true} onlyImg={true} imgUrls={profileImgList} profileName={profileImgList[0].name} age={profileImgList[0].age}/>
				</SpaceView>

				<SpaceView viewStyle={styles.container} pt={48}>
					<SpaceView mb={16}>
						<CommonText fontWeight={'700'} type={'h3'} >
							인상을 선택해주세요.
						</CommonText>
					</SpaceView>
					
					<RadioCheckBox items={faceTypeList} callBackFunction={callBackFunction} />
				</SpaceView>
			</ScrollView>

			{clickEventFlag && <LivePopup callBackFunction={callBackFunction} faceType={clickFaceType}/> }
		</>
	);
};
