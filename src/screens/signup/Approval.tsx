import { layoutStyle, styles } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import * as React from 'react';
import { View, Image } from 'react-native';
import { IMAGE } from 'utils/imageUtils';

export const Approval = () => {
	return (
		<View style={[styles.container, layoutStyle.justifyCenter]}>
			<View style={layoutStyle.alignCenter}>
				<SpaceView mb={24}>
					<Image source={IMAGE.logo} style={styles.logo} />
				</SpaceView>
				<SpaceView>
					<CommonText textStyle={layoutStyle.textCenter}>
						가입 심사가 진행 중입니다.{'\n'}
						심사 기간은 1~3일이며,{'\n'}
						결과는 PUSH 메시지로 전송됩니다.
					</CommonText>
				</SpaceView>
			</View>
			<SpaceView viewStyle={styles.bottomBtnContainer} mb={24}>
				<CommonBtn value={'프로필 수정하기'} />
			</SpaceView>
		</View>
	);
};
