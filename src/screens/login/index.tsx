import { ColorType } from '@types';
import { layoutStyle, styles } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import * as React from 'react';
import { View, Image, Alert } from 'react-native';
import { ICON, IMAGE } from 'utils/imageUtils';
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp } from '@types';

import axios from 'axios';

export const Login = () => {
	const navigation = useNavigation<ScreenNavigationProp>();

	return (
		<View style={[styles.container, layoutStyle.justifyCenter]}>
			<View style={layoutStyle.alignCenter}>
				<SpaceView mb={8}>
					<CommonText color={ColorType.grayAAAA} type={'h5'}>
						LIMIT + MEET
					</CommonText>
				</SpaceView>
				<SpaceView mb={8}>
					<Image source={IMAGE.logo} style={styles.logo} />
				</SpaceView>
				<SpaceView mb={200}>
					<CommonText>믿음가는 사람들의 인연</CommonText>
				</SpaceView>
			</View>
			<SpaceView viewStyle={styles.bottomBtnContainer} mb={24}>
				<SpaceView mb={16}>
					<CommonBtn value={'로그인'} />
				</SpaceView>
				<CommonBtn value={'카카오로 시작하기'} 
							type={'kakao'} 
							icon={ICON.kakao} 
							iconSize={24} 
							onPress={() => {

								/*axios.post('http://192.168.35.29:8080/member/login/', {
									kakao_id: 'kakaotestid'
								})
								.then(function (response) {
									console.log(response);
								})
								.catch(function (error) {
									console.log(error);
								});*/

								navigation.navigate('Signup0')
							}}/>
			</SpaceView>
		</View>
	);
};
