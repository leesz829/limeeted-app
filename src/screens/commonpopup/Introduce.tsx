import { styles } from 'assets/styles/Styles';
import CommonHeader from 'component/CommonHeader';
import { CommonInput } from 'component/CommonInput';
import SpaceView from 'component/SpaceView';
import { ScrollView, View } from 'react-native';
import * as React from 'react';
import { CommonSelect } from 'component/CommonSelect';
import { CommonBtn } from 'component/CommonBtn';

export const Introduce = () => {
	return (
		<>
			<CommonHeader title={'내 소개하기'} />
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<SpaceView mb={24}>
					<CommonInput label={'한줄 소개'} placeholder="내용을 입력해주세요." />
				</SpaceView>

				<SpaceView mb={24} viewStyle={styles.halfContainer}>
					<View style={styles.halfItemLeft}>
						<CommonSelect label={'업종'} />
					</View>

					<View style={styles.halfItemRight}>
						<CommonSelect label={'직업'} />
					</View>
				</SpaceView>

				<SpaceView mb={24}>
					<CommonInput label={'회사명'} placeholder="정승 네트워크" />
				</SpaceView>

				<SpaceView mb={24} viewStyle={styles.halfContainer}>
					<View style={styles.halfItemLeft}>
						<CommonSelect label={'출신지'} />
					</View>

					<View style={styles.halfItemRight}>
						<CommonSelect label={''} />
					</View>
				</SpaceView>

				<SpaceView mb={24} viewStyle={styles.halfContainer}>
					<View style={styles.halfItemLeft}>
						<CommonSelect label={'활동지역'} />
					</View>

					<View style={styles.halfItemRight}>
						<CommonSelect label={''} />
					</View>
				</SpaceView>

				<SpaceView mb={24}>
					<CommonInput label={'키'} placeholder="175" />
				</SpaceView>

				<SpaceView mb={24}>
					<CommonSelect label={'체형'} />
				</SpaceView>

				<SpaceView mb={24}>
					<CommonSelect label={'종교'} />
				</SpaceView>

				<SpaceView mb={24}>
					<CommonSelect label={'음주'} />
				</SpaceView>

				<SpaceView mb={40}>
					<CommonSelect label={'흡연'} />
				</SpaceView>

				<SpaceView mb={16}>
					<CommonBtn value={'저장'} type={'primary'} />
				</SpaceView>
			</ScrollView>
		</>
	);
};
