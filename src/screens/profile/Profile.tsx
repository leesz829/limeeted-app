import { styles } from 'assets/styles/Styles';
import CommonHeader from 'component/CommonHeader';
import { CommonInput } from 'component/CommonInput';
import SpaceView from 'component/SpaceView';
import { ScrollView, View } from 'react-native';
import * as React from 'react';
import { CommonBtn } from 'component/CommonBtn';

export const Profile = () => {
	return (
		<>
			<CommonHeader title={'내 계정 정보'} />
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<SpaceView mb={24}>
					<CommonInput label={'닉네임'} placeholder="정승 네트워크" rightPen={true} />
				</SpaceView>
				<SpaceView mb={24}>
					<CommonInput label={'이름'} placeholder="배선일" />
				</SpaceView>

				<SpaceView mb={24} viewStyle={styles.halfContainer}>
					<View style={styles.halfItemLeft}>
						<CommonInput label={'성별'} placeholder="남자" />
					</View>

					<View style={styles.halfItemRight}>
						<CommonInput label={'나이'} placeholder="30" />
					</View>
				</SpaceView>

				<SpaceView mb={24}>
					<CommonInput label={'회사명'} placeholder="정승 네트워크" />
				</SpaceView>

				<SpaceView mb={24}>
					<CommonInput label={'계정 ID'} placeholder="heighten@kakao.com" rightPen={true} />
				</SpaceView>
				<SpaceView mb={24}>
					<CommonInput label={'전화번호'} placeholder="01012345678" />
				</SpaceView>

				<SpaceView mb={16}>
					<CommonBtn value={'저장'} type={'primary'} />
				</SpaceView>
			</ScrollView>
		</>
	);
};
