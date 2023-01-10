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
import * as properties from 'utils/properties';

interface Props {
	navigation: StackNavigationProp<StackParamList, 'Signup00'>;
	route: RouteProp<StackParamList, 'Signup00'>;
}

export const Signup00 = (props: Props) => {
	const navigation = useNavigation<ScreenNavigationProp>();

	const [ci, setCi] = React.useState(props.route.params.ci);
	const [id, setId] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [passwordChk, setPasswordChk] = React.useState('');
	const [name, setName] = React.useState(props.route.params.name);
	const [age, setAge] = React.useState(function () {
		let age_d;
		let today = new Date();
		let birthDay = props.route.params.birthday;
		let birthYear = birthDay.substring(0, 4);
		age_d = Number(today.getFullYear()) - Number(birthYear) + 1;
		return age_d.toString();
	});
	const [gender, setGender] = React.useState(props.route.params.gender);
	const [mobile, setMobile] = React.useState(props.route.params.mobile.replace(/[^0-9]/g, '').replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`));
	const [birthday, setBirthday] = React.useState(props.route.params.birthday);
	const [snsType, setSnsType] = React.useState(props.route.params.sns_type);
	const [snsToken, setSnsToken] = React.useState(props.route.params.sns_token);

	// 성별 항목 목록
	const genderItemList = [
		{ label: '남자', value: 'M' },
		{ label: '여자', value: 'W' },
	];

	const genderCallbackFn = (value: string) => {
		setGender(value);
	};

	return (
		<>
			<CommonHeader title={'가입정보'} />
			<ScrollView contentContainerStyle={[styles.scrollContainer]}>
				<SpaceView mb={24}>
					<CommonText>
						본인 인증을 기반으로 회원님의 정보가{'\n'}
						자동입력됩니다.
					</CommonText>
				</SpaceView>

				<CommonInput label="아이디" value={id} onChangeText={(id) => setId(id)} />

				<View style={styles.infoContainer}>
					<SpaceView mt={4}>
						<Image source={ICON.info} style={styles.iconSize} />
					</SpaceView>

					<SpaceView ml={8}>
						<CommonText color={ColorType.gray6666}>아이디는 이메일로 입력해 주세요.</CommonText>
					</SpaceView>
				</View>

				<SpaceView mb={24}>
					<CommonInput
						label="비밀번호"
						value={password}
						onChangeText={(password) => setPassword(password)}
						isMasking={true}
						maxLength={20}
					/>
				</SpaceView>

				<SpaceView mb={24}>
					<CommonInput
						label="비밀번호 확인"
						value={passwordChk}
						onChangeText={(passwordChk) => setPasswordChk(passwordChk)}
						isMasking={true}
						maxLength={20}
					/>
				</SpaceView>

				<SpaceView mb={24}>
					<CommonInput
						label="이름"
						value={name}
						onChangeText={(name) => setName(name)}
						maxLength={5}
						disabled={true}
					/>
				</SpaceView>

				<SpaceView mb={24}>
					<View style={styles.halfContainer}>
						<View style={styles.halfItemLeft}>
							<CommonInput
								label="나이"
								value={age}
								keyboardType="number-pad"
								onChangeText={(age) => setAge(age)}
								disabled={true}
								maxLength={2}
							/>
						</View>
						<View style={styles.halfItemRight}>
							<CommonInput label="성별" value={gender == 'M' ? '남자' : '여자'} disabled={true} />

							{/* <View style={selectStyles.selectContainer}>
								<View>
									<CommonSelect label={'성별'} items={genderItemList} selectValue={gender} callbackFn={genderCallbackFn} />
								</View>
								<View style={selectStyles.selectImgContainer}>
									<Image source={ICON.arrRight} style={selectStyles.icon} />
								</View>
							</View> */}
						</View>
					</View>
				</SpaceView>

				<SpaceView mb={24}>
					<CommonInput
						label="전화번호"
						value={mobile}
						onChangeText={(mobile) => setMobile(mobile)}
						keyboardType="number-pad"
						maxLength={13}
						disabled={true}
					/>
				</SpaceView>
				<SpaceView mb={24}>
					<CommonBtn
						value={'다음 (1/4)'}
						type={'primary'}
						onPress={() => {
							if (id == '') {
								Alert.alert('알림', '아이디를 입력해 주세요.', [{ text: '확인' }]);
								return;
							}

							let regEmail = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
							if(!regEmail.test(id)){
								Alert.alert('알림', '이메일 형식의 아이디가 아닙니다.', [{ text: '확인' }]);
								return;
							}
							
							if (password == '') {
								Alert.alert('알림', '비밀번호를 입력해 주세요.', [{ text: '확인' }]);
								return;
							}

							let regPass = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/;
							if((!regPass.test(password))){
								Alert.alert('알림', '영문, 숫자 조합으로 8-20자리 입력해주세요.', [{ text: '확인' }]);
								return;
							}

							if (passwordChk == '') {
								Alert.alert('알림', '비밀번호 확인을 입력해 주세요.', [{ text: '확인' }]);
								return;
							}
							if (password != passwordChk) {
								Alert.alert('알림', '비밀번호 확인이 맞지 않습니다.', [{ text: '확인' }]);
								return;
							}

							axios
								.post(properties.api_domain + '/join/insertMemberInfo/', {
									id: id,
									password: password,
									name: name,
									gender: gender,
									phone_number: mobile,
									ci: ci,
									birthday: birthday,
									sns_type: snsType,
									sns_token: snsToken
								})
								.then(function (response) {
									console.log(response.data);

									if (response.data.result_code == '0000') {
										navigation.navigate('Signup01', {
											memberSeq: response.data.member_seq,
										});
									}
								})
								.catch(function (error) {
									console.log(error);
								});
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
		fontFamily: 'AppleSDGothicNeoR00',
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
		fontFamily: 'AppleSDGothicNeoM00',
		padding: 0,
		marginTop: 8,
	},
	inputAndroid: {
		fontSize: 16,
		lineHeight: 24,
		color: Color.black2222,
		fontFamily: 'AppleSDGothicNeoM00',
		padding: 0,
	},
});
