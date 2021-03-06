import { NavigationContainer, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import { styles } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import CommonHeader from 'component/CommonHeader';
import { CommonInput } from 'component/CommonInput';
import { CommonText } from 'component/CommonText';
import { CommonSelect } from 'component/CommonSelect';
import SpaceView from 'component/SpaceView';
import * as React from 'react';
import { View, Image, ScrollView, Alert, StyleSheet, Text } from 'react-native';
import { ICON } from 'utils/imageUtils';
import axios from 'axios';
import { Color } from 'assets/styles/Color';
import RNPickerSelect from 'react-native-picker-select';

interface Props {
	navigation : StackNavigationProp<StackParamList, 'Signup0'>;
	route : RouteProp<StackParamList, 'Signup0'>;
}

export const Signup0 = (props : Props) => {
	const navigation = useNavigation<ScreenNavigationProp>();

	console.log("kakaoId ::: " + props.route.params.kakaoId);

	const [id, setId] = React.useState(props.route.params.kakaoId);
	//const [name, setName] = React.useState(props.route.params.name);
	const [name, setName] = React.useState('');
	const [age, setAge] = React.useState('');
	const [gender, setGender] = React.useState('');
	const [hp, setHp] = React.useState('');

	return (
		<>
			<CommonHeader title={'가입정보'} />
			<ScrollView contentContainerStyle={[styles.scrollContainer]}>
				<SpaceView mb={24}>
					<CommonText>
						본인 인증을 기반으로 회원님의 정보가{'\n'}
						자동입력됩니다..
					</CommonText>
				</SpaceView>

				{/* <CommonInput 
						label="아이디" 
						value={id} 
						onChangeText={id => setId(id)} />

				<View style={styles.infoContainer}>
					<SpaceView mt={4}>
						<Image source={ICON.info} style={styles.iconSize} />
					</SpaceView>

					<SpaceView ml={8}>
						<CommonText color={ColorType.gray6666}>
							카카오를 통해 로그인하여, 비밀번호 입력없이 편하게{'\n'}
							이용하실 수 있습니다.
						</CommonText>
					</SpaceView>
				</View> */}

				<SpaceView mb={24}>
					<CommonInput 
							label="이름" 
							value={name} 
							onChangeText={name => setName(name)} />
				</SpaceView>

				<SpaceView mb={24}>
					<View style={styles.halfContainer}>
						<View style={styles.halfItemLeft}>
							<CommonInput 
									label="나이" 
									value={age}
									onChangeText={age => setAge(age)} />
						</View>
						<View style={styles.halfItemRight}>
							{/* <CommonInput 
									label="성별" 
									value={gender} 
									onChangeText={gender => setGender(gender)} /> */}
							{/* <CommonSelect label={'성별'}  /> */}

							<View style={selectStyles.selectContainer}>
								<View>
									<Text style={selectStyles.labelStyle}>성별</Text>
									<View style={selectStyles.inputContainer}>
										<RNPickerSelect
											style={pickerSelectStyles}
											useNativeAndroidPickerStyle={false}
											onValueChange={gender => setGender(gender)}
											value={'M'}
											items={[
												/* { label: '선택', value: '' }, */
												{ label: '남자', value: 'M' },
												{ label: '여자', value: 'F' }
											]}
										/>
									</View>
								</View>
								<View style={selectStyles.selectImgContainer}>
									<Image source={ICON.arrRight} style={selectStyles.icon} />
								</View>
							</View>

						</View>
					</View>
				</SpaceView>

				<SpaceView mb={24}>
					<CommonInput 
							label="전화번호" 
							value={hp} 
							onChangeText={hp => setHp(hp)} 
				/>
				</SpaceView>
				<SpaceView mb={24}>
					<CommonBtn value={'다음 (1/4)'} 
								type={'primary'} 
								onPress={() => {

									axios.post('http://211.104.55.151:8080/member/insertMemberInfo/', {
										kakao_id : id,
										nickname: name,
										name: name,
										age : age,
										gender : gender,
										phone_number : hp
									})
									.then(function (response) {
										console.log(response.data.result_code);

										if(response.data.result_code == "0000") {
											navigation.navigate('Signup1', {
												memberSeq : response.data.memberSeq
											});
										}
									})
									.catch(function (error) {
										console.log(error);
									});

									//navigation.navigate('Signup1');
								}}
					/>
				</SpaceView>
			</ScrollView>
		</>
	);
};


const selectStyles = StyleSheet.create({
	selectImgContainer: {
		position: 'absolute',
		height: '100%',
		justifyContent: 'center',
		right: 16,
	},
	selectContainer: {},
	labelContainer: {
		marginBottom: 8,
	},
	labelStyle: {
		fontSize: 14,
		lineHeight: 20,
		fontFamily: 'AppleSDGothicNeoR',
		color: Color.gray6666,
		marginBottom: 8,
	},
	inputContainer: {
		paddingBottom: 8,
		borderBottomWidth: 1,
		borderBottomColor: Color.grayDDDD,
	},
	icon: {
		width: 16,
		height: 16,
		transform: [{ rotate: '90deg' }],
	},
});

const pickerSelectStyles = StyleSheet.create({
	inputIOS: {
		fontSize: 16,
		lineHeight: 24,
		color: Color.black2222,
		fontFamily: 'AppleSDGothicNeoM',
		padding: 0,
		marginTop: 8,
	},
	inputAndroid: {
		fontSize: 16,
		lineHeight: 24,
		color: Color.black2222,
		fontFamily: 'AppleSDGothicNeoM',
		padding: 0,
	},
});
