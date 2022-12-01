import { styles } from 'assets/styles/Styles';
import CommonHeader from 'component/CommonHeader';
import { CommonInput } from 'component/CommonInput';
import SpaceView from 'component/SpaceView';
import { ScrollView, View } from 'react-native';
import * as React from 'react';
import { CommonBtn } from 'component/CommonBtn';
import { StackParamList, ScreenNavigationProp } from '@types';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as properties from 'utils/properties';
import AsyncStorage from '@react-native-community/async-storage';
import * as hooksMember from 'hooks/member';
import { useDispatch } from 'react-redux';
import * as mbrReducer from 'redux/reducers/mbrReducer';

/* ################################################################################################################
###################################################################################################################
###### 내 계정 정보
###################################################################################################################
################################################################################################################ */

interface Props {
	navigation: StackNavigationProp<StackParamList, 'Profile'>;
	route: RouteProp<StackParamList, 'Profile'>;
}

export const Profile = (props: Props) => {
	const navigation = useNavigation<ScreenNavigationProp>();
	const dispatch = useDispatch();	

	const jwtToken = hooksMember.getJwtToken();		// 토큰
	const memberSeq = hooksMember.getMemberSeq();	// 회원번호

	const [nickname, setNickname] = React.useState<any>(props.route.params.nickname);
	const [name, setName] = React.useState<any>(props.route.params.name);
	const [gender, setGender] = React.useState<any>(props.route.params.gender);
	const [age, setAge] = React.useState<any>(props.route.params.age);
	const [phoneNumber, setPhoneNumber] = React.useState<any>(props.route.params.phone_number);

	// 내 계정 정보 저장
	const saveMemberBase = async () => {
		const result = await axios
			.post(
				properties.api_domain + '/member/saveMemberBase',
				{
					'api-key': 'U0FNR09CX1RPS0VOXzAx',
					member_seq: memberSeq,
					nickname: nickname,
				},
				{
					headers: {
						'jwt-token': jwtToken,
					},
				},
			)
			.then(function (response) {
				console.log('job code :::: ', response.data);

				if (response.data.result_code != '0000') {
					console.log(response.data.result_msg);
					return false;
				} else {
					dispatch(mbrReducer.setBase(JSON.stringify(response.data.memberBase)));

					navigation.navigate('Main', {
						screen: 'Roby'
					});
				}
			})
			.catch(function (error) {
				console.log('error ::: ', error);
			});
	};

	return (
		<>
			<CommonHeader title={'내 계정 정보'} />
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<SpaceView mb={24}>
					<CommonInput
						label={'닉네임'}
						placeholder=""
						value={nickname}
						onChangeText={(nickname) => setNickname(nickname)}
						rightPen={true}
					/>
				</SpaceView>
				<SpaceView mb={24}>
					<CommonInput label={'이름'} placeholder="" value={name} disabled={true} />
				</SpaceView>

				<SpaceView mb={24} viewStyle={styles.halfContainer}>
					<View style={styles.halfItemLeft}>
						<CommonInput
							label={'성별'}
							placeholder=""
							value={gender == 'M' ? '남자' : '여자'}
							disabled={true}
						/>
					</View>

					<View style={styles.halfItemRight}>
						<CommonInput label={'나이'} placeholder="" value={age} disabled={true} />
					</View>
				</SpaceView>

				{/* <SpaceView mb={24}>
					<CommonInput 
						label={'회사명'} 
						placeholder="" />
				</SpaceView> */}

				{/* <SpaceView mb={24}>
					<CommonInput label={'계정 ID'} placeholder="heighten@kakao.com" rightPen={true} />
				</SpaceView> */}

				<SpaceView mb={24}>
					<CommonInput label={'전화번호'} placeholder="" value={phoneNumber} disabled={true} />
				</SpaceView>

				<SpaceView mb={16}>
					<CommonBtn value={'저장'} type={'primary'} onPress={saveMemberBase} />
				</SpaceView>
			</ScrollView>
		</>
	);
};
