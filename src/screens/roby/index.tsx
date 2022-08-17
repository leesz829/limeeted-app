import { ColorType, StackParamList, BottomParamList, ScreenNavigationProp} from '@types';
import { layoutStyle, styles } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import { CommonSwich } from 'component/CommonSwich';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import { ToolTip } from 'component/Tooltip';
import TopNavigation from 'component/TopNavigation';
import * as React from 'react';
import { Image, ScrollView, View, TouchableOpacity } from 'react-native';
import { ICON, IMAGE, PROFILE_IMAGE } from 'utils/imageUtils';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { UserInfo } from '@types';
import { jwt_token } from 'utils/properties';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

/* ################################################################################################################
###### 로비
################################################################################################################ */

interface Props {
	navigation : StackNavigationProp<BottomParamList, 'Roby'>;
	route : RouteProp<BottomParamList, 'Roby'>;
}

export const Roby = (props : Props) => {
	const navigation = useNavigation<ScreenNavigationProp>();

	// 회원정보
	const [userInfo, setUserInfo] = useState(UserInfo);

	const getUserInfo = async () => {
		const result = await axios.post('http://192.168.35.131:8080/member/selectMemberInfo', {
			'api-key' : 'U0FNR09CX1RPS0VOXzAx'
		}
		, {
			headers: {
				'jwt-token' : String(await jwt_token())
			}
		})
		.then(function (response) {
			
			if(response.data.result_code != '0000'){
				console.log(response.data.result_msg);
				return false;
			}

			setUserInfo(response.data.result)
		})
		.catch(function (error) {
			console.log('error ::: ' , error);
		});
	}


	// 첫 렌더링 때 fetchNews() 한 번 실행
	useEffect(() => {
		// 유저 정보
		getUserInfo()
	}, []);
	
	let [memberSeq, setMemberSeq] = React.useState('');
	let [name, setName] = React.useState('');
	let [age, setAge] = React.useState('');
	let [comment, setComment] = React.useState('');

	AsyncStorage.getItem('member_info', (err, result) => {
		const member = JSON.parse(result);
		console.log('아이디는 ' + member.name);

		setMemberSeq(member.memberSeq);
		setName(member.name);
		setAge(member.age);
		setComment(member.comment);
	});

	return (
		<>
			<TopNavigation currentPath={''} />
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<SpaceView mb={16}>
					<CommonText fontWeight={'700'} type={'h3'}>
						내 정보
					</CommonText>
				</SpaceView>

				<SpaceView mb={48} viewStyle={layoutStyle.alignCenter}>
					<SpaceView mb={8}>
						<Image source={PROFILE_IMAGE.profileM1} style={styles.profileImg} />
						{/* <Image source={{uri : props.route.params.mstImg}} style={styles.profileImg} /> */}
						<View style={styles.profilePenContainer}>

							<TouchableOpacity onPress={() => {
													navigation.navigate('Introduce');
												}}>
								<Image source={ICON.pen} style={styles.iconSize24} />
							</TouchableOpacity>
						</View>
					</SpaceView>

					<SpaceView mb={4}>
						<CommonText fontWeight={'700'} type={'h4'}>
							{name}, {age}
						</CommonText>
					</SpaceView>
					<SpaceView mb={16} viewStyle={styles.levelContainer}>
						<CommonText color={ColorType.gray6666} type={'h6'}>
							LV.1
						</CommonText>
					</SpaceView>

					<CommonText color={ColorType.gray6666}>{comment}</CommonText>
				</SpaceView>

				<View>
					<SpaceView mb={16}>
						<TouchableOpacity style={[layoutStyle.row, layoutStyle.alignCenter]}
															onPress={() => {
																navigation.navigate('Main', { 
																	screen: 'Profile1'
																});
															}}>
							<CommonText type={'h3'} fontWeight={'700'}>
								프로필 관리
							</CommonText>
							<Image source={ICON.arrRight} style={styles.iconSize} />
						</TouchableOpacity>
					</SpaceView>

					<SpaceView mb={16} viewStyle={styles.halfContainer}>
						<View style={[styles.halfItemLeft, styles.profileContainer, layoutStyle.alignCenter]}>
							<SpaceView mb={4}>
								<CommonText fontWeight={'700'} type={'h2'}>
									5
								</CommonText>
							</SpaceView>
							<SpaceView mb={24} viewStyle={layoutStyle.rowCenter}>
								<Image source={ICON.star} style={styles.iconSize24} />
							</SpaceView>
							<ToolTip title={'기여 평점'} desc={'프로필 평점'} position={'bottomLeft'} />
						</View>

						<View style={[styles.halfItemRight, styles.profileContainer, layoutStyle.alignCenter]}>
							<SpaceView mb={4}>
								<CommonText fontWeight={'700'} type={'h2'}>
									4
								</CommonText>
							</SpaceView>

							<SpaceView mb={24} viewStyle={layoutStyle.rowCenter}>
								<Image source={ICON.star} style={styles.iconSize24} />
							</SpaceView>
							<ToolTip position={'bottomRight'} title={'프로필 평점'} desc={'프로필 평점'} />
						</View>
					</SpaceView>

					<SpaceView mb={48}>
						<CommonBtn
							type="purple"
							value="프로필 재심사"
							icon={ICON.refresh}
							iconSize={24}
							iconPosition={'right'}
						/>
					</SpaceView>
				</View>

				<SpaceView mb={48}>
					<SpaceView mb={16}>
						<SpaceView mb={16}>
							<CommonText fontWeight={'700'} type={'h3'}>
								보관함
							</CommonText>
						</SpaceView>
						<View style={styles.rowStyle}>
							<CommonText fontWeight={'500'}>
								새 관심
								<CommonText color={ColorType.primary}> 0</CommonText>건
							</CommonText>

							<Image source={ICON.arrRight} style={styles.iconSize} />
						</View>

						<ScrollView horizontal={true}>
							<SpaceView viewStyle={styles.circleBox} mr={16} />
							<SpaceView viewStyle={styles.circleBox} mr={16} />
							<SpaceView viewStyle={styles.circleBox} mr={16} />
							<SpaceView viewStyle={styles.circleBox} mr={16} />
							<SpaceView viewStyle={styles.circleBox} mr={16} />
							<SpaceView viewStyle={styles.circleBox} mr={16} />
							<SpaceView viewStyle={styles.circleBox} mr={16} />
							<SpaceView viewStyle={styles.circleBox} mr={16} />
							<SpaceView viewStyle={styles.circleBox} />
						</ScrollView>
					</SpaceView>

					<View style={styles.rowStyle}>
						<CommonText fontWeight={'500'}>
							새 매칭
							<CommonText color={ColorType.primary}> 0</CommonText>건
						</CommonText>

						<Image source={ICON.arrRight} style={styles.iconSize} />
					</View>

					<ScrollView horizontal={true}>
						<SpaceView viewStyle={styles.circleBox} mr={16} />
						<SpaceView viewStyle={styles.circleBox} mr={16} />
						<SpaceView viewStyle={styles.circleBox} mr={16} />
						<SpaceView viewStyle={styles.circleBox} mr={16} />
						<SpaceView viewStyle={styles.circleBox} mr={16} />
						<SpaceView viewStyle={styles.circleBox} mr={16} />
						<SpaceView viewStyle={styles.circleBox} mr={16} />
						<SpaceView viewStyle={styles.circleBox} mr={16} />
						<SpaceView viewStyle={styles.circleBox} />
					</ScrollView>
				</SpaceView>

				<SpaceView mb={48}>
					<SpaceView mb={16}>
						<CommonText fontWeight={'700'} type={'h3'}>
							매칭 설정
						</CommonText>
					</SpaceView>

					<TouchableOpacity style={styles.rowStyle}>
						<CommonText fontWeight={'500'}>내 선호 이성</CommonText>
						<Image source={ICON.arrRight} style={styles.iconSize} />
					</TouchableOpacity>

					<View style={styles.rowStyle}>
						<ToolTip title={'내 프로필 공개'} desc={'내 프로필 공개'} />
						<CommonSwich />
					</View>

					<View style={styles.rowStyle}>
						<ToolTip title={'아는 사람 소개'} desc={'아는 사람 소개'} />
						<CommonSwich />
					</View>
				</SpaceView>

				<SpaceView mb={40}>
					<SpaceView mb={16}>
						<CommonText fontWeight={'700'} type={'h3'}>
							그 외
						</CommonText>
					</SpaceView>
					<TouchableOpacity style={styles.rowStyle}>
						<CommonText fontWeight={'500'}>최근 소식</CommonText>
						<Image source={ICON.arrRight} style={styles.iconSize} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.rowStyle}>
						<CommonText fontWeight={'500'}>내 계정 정보</CommonText>
						<Image source={ICON.arrRight} style={styles.iconSize} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.rowStyle}>
						<CommonText fontWeight={'500'}>이용약관</CommonText>
						<Image source={ICON.arrRight} style={styles.iconSize} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.rowStyle}>
						<CommonText fontWeight={'500'}>개인정보 취급방침</CommonText>
						<Image source={ICON.arrRight} style={styles.iconSize} />
					</TouchableOpacity>
				</SpaceView>
			</ScrollView>
		</>
	);
};
