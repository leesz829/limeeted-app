import * as React from 'react';
import { useState, useEffect} from 'react';
import { ScrollView } from 'react-native';
import TopNavigation from 'component/TopNavigation';
import { styles } from 'assets/styles/Styles';
import SpaceView from 'component/SpaceView';
import { CommonText } from 'component/CommonText';
import { ViualSlider } from 'component/ViualSlider';
import { RadioCheckBox } from 'component/RadioCheckBox';
import { jwt_token } from 'utils/properties';
import { CommonCode, LabelObj, ProfileImg } from '@types';
import axios from 'axios';

export const Live = () => {

	// 공통코드
	const [commonCodeList, setCommonCodeList] = useState([CommonCode]);

	// 회원 인상 정보
	const [profileImg, setProfileImg] = useState([ProfileImg]);

	// 회원 인상 정보
	const [faceTypeList, setFaceTypeList] = useState([LabelObj]);

	const getProfileImg = async () => {
		
		const result = await axios.post('http://192.168.35.131:8080/match/selectProfileImg', {
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

			setProfileImg(response.data);
		})
		.catch(function (error) {
			console.log('error ::: ' , error);
		});
	}

	const getFaceType = async () => {
		
		const result = await axios.post('http://192.168.35.131:8080/common/selectGroupCodeList', {
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

			const tmpfaceTypeList = [LabelObj];

			setCommonCodeList(response.data.result)

			commonCodeList.map(commonCode => {
				tmpfaceTypeList.push({label: commonCode.code_name, value:commonCode.common_code})
			});

			setFaceTypeList(tmpfaceTypeList.filter(Boolean));
		})
		.catch(function (error) {
			console.log('error ::: ' , error);
		});
	}

	// 첫 렌더링 때 fetchNews() 한 번 실행
	useEffect(() => {
		// 프로필 이미지 목록
		getProfileImg();
		
		// 인상정보
		getFaceType();
	}, []);
	
	return (
		<>
			<TopNavigation currentPath={'LIVE'} />
			<ScrollView>
				<SpaceView>
					<ViualSlider isNew={true} status={'ing'} />
				</SpaceView>

				<SpaceView viewStyle={styles.container} pt={48}>
					<SpaceView mb={16}>
						<CommonText fontWeight={'700'} type={'h3'}>
							인상을 선택해주세요.
						</CommonText>
					</SpaceView>
					{
						faceTypeList != null? <RadioCheckBox items={faceTypeList} /> : null
					}
				</SpaceView>
			</ScrollView>
		</>
	);
};
