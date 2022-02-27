import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { ColorType, ScreenNavigationProp } from '@types';
import { styles } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import CommonHeader from 'component/CommonHeader';
import { CommonInput } from 'component/CommonInput';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import * as React from 'react';
import { View, Image, ScrollView, Alert } from 'react-native';
import { ICON } from 'utils/imageUtils';

export const Signup0 = ({}) => {
	const navigation = useNavigation<ScreenNavigationProp>();

	const [id, setId] = React.useState('');
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
						자동입력됩니다.
					</CommonText>
				</SpaceView>

				<CommonInput 
						label="아이디" 
						value={id} 
						onChangeText={id => setId(id)} 
				/>

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
				</View>

				<SpaceView mb={24}>
					<CommonInput 
							label="이름" 
							value={name} 
							onChangeText={name => setName(name)} 
					 />
				</SpaceView>

				<SpaceView mb={24}>
					<View style={styles.halfContainer}>
						<View style={styles.halfItemLeft}>
							<CommonInput 
									label="나이" 
									value={age} 
									onChangeText={name => setAge(age)} 
							/>
						</View>
						<View style={styles.halfItemRight}>
							<CommonInput 
									label="성별" 
									value={gender} 
									onChangeText={gender => setGender(gender)} 
							/>
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
					<CommonBtn value={'다음 (2/4)'} 
								type={'primary'} 
								onPress={() => {

									Alert.alert(id);

									var daslkd = {};

									//navigation.navigate('Signup1', daslkd);
									navigation.navigate('Signup1', { 
										id : id,
										name : 'lsz'
									});
								}}
					/>
				</SpaceView>
			</ScrollView>
		</>
	);
};
