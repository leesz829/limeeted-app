import { ColorType } from '@types';
import { layoutStyle, styles } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import * as React from 'react';
import { View, Image } from 'react-native';
import { ICON, IMAGE } from 'utils/imageUtils';

export const Title00 = () => {
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
				<SpaceView>
					<CommonText>믿음가는 사람들의 인연</CommonText>
				</SpaceView>
			</View>
			<SpaceView viewStyle={styles.bottomBtnContainer} mb={24}>
				<SpaceView mb={16}>
					<CommonBtn value={'로그인'} />
				</SpaceView>
				<CommonBtn value={'카카오로 시작하기'} type={'kakao'} icon={ICON.kakao} iconSize={24} />
			</SpaceView>
		</View>
	);
};
