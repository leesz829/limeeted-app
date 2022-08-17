import * as React from 'react';
import { useState, useEffect} from 'react';
import { Image, ScrollView, View } from 'react-native';
import TopNavigation from 'component/TopNavigation';
import { ICON } from 'utils/imageUtils';
import { layoutStyle, styles } from 'assets/styles/Styles';
import SpaceView from 'component/SpaceView';
import { CommonText } from 'component/CommonText';
import { ViualSlider } from 'component/ViualSlider';
import { MainProfileSlider } from 'component/MainProfileSlider';
import { CommonBtn } from 'component/CommonBtn';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { jwt_token } from 'utils/properties';
import { ColorType
	, BottomParamList
	, Interview
	, UserInfo
} from '@types';
import axios from 'axios';

/* ################################################################################################################
매칭
###################ttt############################################################################################# */

interface Props {
	navigation : StackNavigationProp<BottomParamList, 'Roby'>;
	route : RouteProp<BottomParamList, 'Roby'>;
}

export const Matching = (props : Props) => {

	const randomNum = Math.floor(Math.random() * (2 - 1 + 1)) + 1;

	// 인터뷰 정보
	const [interviews, setInterviews] = useState([Interview]);
	// 회원정보
	const [userInfo, setUserInfo] = useState(UserInfo);

	const getUserInfo = async () => {
		const result = await axios.post('http://192.168.35.131:8080/token/decode', {
			'api-key' : 'U0FNR09CX1RPS0VOXzAx'
		}
		, {
			headers: {
				'jwt-token' : String(await jwt_token())
			}
		})
		.then(function (response) {
			console.log('response ::: ', response);
			
			if(response.data.result_code != '0000'){
				console.log(response.data.result_msg);
				return false;
			}
		})
		.catch(function (error) {
			console.log('error ::: ' , error);
		});
	}

		
	const setMemberInterview = async () => {
		// interview param
		const result = await axios.post('http://192.168.35.131:8080/member/interview', {
			'api-key' : 'U0FNR09CX01FTUJFUl8wMw=='
		}
		, {
			headers: {
				'jwt-token' : String(await jwt_token())
			}
		})
		.then(function (response) {
			if(response.data.result_code != '0000'){
				console.log('오류... TODO: 오류 팝업 확인 필요');
				return false;
			}
			setInterviews(response.data.result);
		})
		.catch(function (error) {
			console.log('error ::: ' , error);
		});
	}

	// 첫 렌더링 때 fetchNews() 한 번 실행
	useEffect(() => {
		// 유저 정보
		getUserInfo()

		// 인터뷰
		setMemberInterview();
	}, []);



	return (
		<>
			<TopNavigation currentPath={'LIMEETED'} />
			<ScrollView>
				<ViualSlider num={randomNum} />

				<SpaceView pt={48} viewStyle={styles.container}>
					<SpaceView viewStyle={layoutStyle.rowBetween} mb={16}>
						<View>
							<CommonText fontWeight={'700'} type={'h3'}>
								프로필 2차 인증
							</CommonText>
						</View>
						<View style={[layoutStyle.rowBetween]}>
							<View style={styles.statusBtn}>
								<CommonText type={'h6'} color={ColorType.white}>
									TIER 4
								</CommonText>
							</View>
							<Image source={ICON.medalAll} style={styles.iconSize32} />
						</View>
					</SpaceView>

					<SpaceView mb={48}>
						<SpaceView viewStyle={[layoutStyle.rowBetween]} mb={16}>
							<View style={styles.profileBox}>
								<Image source={ICON.job} style={styles.iconSize48} />
								<CommonText type={'h5'}>직업</CommonText>
							</View>

							<View style={styles.profileBox}>
								<Image source={ICON.degree} style={styles.iconSize48} />
								<CommonText type={'h5'}>학위</CommonText>
							</View>

							<View style={styles.profileBox}>
								<Image source={ICON.income} style={styles.iconSize48} />
								<CommonText type={'h5'}>소득</CommonText>
							</View>
						</SpaceView>

						<View style={[layoutStyle.rowBetween]}>
							<View style={styles.profileBox}>
								<Image source={ICON.asset} style={styles.iconSize48} />
								<CommonText type={'h5'}>자산</CommonText>
							</View>

							<View style={styles.profileBox}>
								<Image source={ICON.sns} style={styles.iconSize48} />
								<CommonText type={'h5'}>SNS</CommonText>
								<View style={styles.disabled} />
							</View>

							<View style={styles.profileBox}>
								<Image source={ICON.vehicle} style={styles.iconSize48} />
								<CommonText type={'h5'}>차량</CommonText>
							</View>
						</View>
					</SpaceView>

					<SpaceView mb={54}>
						<SpaceView mb={16}>
							<CommonText fontWeight={'700'} type={'h3'}>
								프로필 활동지수
							</CommonText>
						</SpaceView>

						<MainProfileSlider />
					</SpaceView>

					<SpaceView mb={24}>
						<SpaceView viewStyle={layoutStyle.rowBetween} mb={16}>
							<View>
								<CommonText fontWeight={'700'} type={'h3'}>
									인터뷰
								</CommonText>
							</View>

							<View style={[layoutStyle.rowBetween]}>
								<SpaceView mr={6}>
									<Image source={ICON.info} style={styles.iconSize} />
								</SpaceView>
								<CommonText type={'h5'}>
									{
										interviews != null? 
											<>
											<CommonText fontWeight={'700'} type={'h5'}>
												{interviews.length}개의 질의
											</CommonText>
											가 등록되어있어요
											</>
										: <>
											<CommonText fontWeight={'700'} type={'h5'}>
												등록된 질의가 없습니다.
											</CommonText>
										</>

									}
									
								</CommonText>
							</View>
						</SpaceView>
						<View style={styles.interviewContainer}>
							{
							interviews != null ?
								interviews.map(interview => (
									<>
									<SpaceView mb={32} viewStyle={layoutStyle.row}>
										<SpaceView mr={16}>
											<Image source={ICON.manage} style={styles.iconSize40} />
										</SpaceView>

										<View style={styles.interviewLeftTextContainer}>
											<CommonText type={'h5'}>
												{interview.code_name}
											</CommonText>
										</View>
									</SpaceView>

									<SpaceView mb={32} viewStyle={[layoutStyle.row, layoutStyle.selfEnd]}>
										<SpaceView viewStyle={styles.interviewRightTextContainer} mr={16}>
											<CommonText type={'h5'} color={ColorType.white}>
												{interview.answer}
											</CommonText>
										</SpaceView>
										<SpaceView>
											<Image source={ICON.boy} style={styles.iconSize40} />
										</SpaceView>
									</SpaceView>
									</>
								)) :
								<>
								<SpaceView mb={32} viewStyle={layoutStyle.row}>
									<SpaceView mr={16}>
										<Image source={ICON.manage} style={styles.iconSize40} />
									</SpaceView>

									<View style={styles.interviewLeftTextContainer}>
										<CommonText type={'h5'}>
											질문을 등록해주세요
										</CommonText>
									</View>
								</SpaceView>
								</>
							}
						</View>
					</SpaceView>

					<SpaceView mb={40}>
						<CommonBtn value={'신고'} icon={ICON.siren} iconSize={24} />
					</SpaceView>
				</SpaceView>
			</ScrollView>
		</>
	);
};
