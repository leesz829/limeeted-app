import { ColorType } from '@types';
import { layoutStyle, styles } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import CommonHeader from 'component/CommonHeader';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import * as React from 'react';
import { View, ScrollView } from 'react-native';

export const Signup02 = () => {
	return (
		<>
			<CommonHeader title={'근사한 프로필 만들기'} />
			<ScrollView contentContainerStyle={[styles.scrollContainer]}>
				<SpaceView mb={24}>
					<CommonText>
						다양한 분위기의 내 모습이 담긴 사진을{'\n'}
						등록해보세요.
					</CommonText>
				</SpaceView>

				<SpaceView mb={48} viewStyle={styles.halfContainer}>
					<View style={styles.halfItemLeft}>
						<View style={styles.tempBoxBig} />
					</View>

					<View style={styles.halfItemRight}>
						<SpaceView mb={16} viewStyle={layoutStyle.row}>
							<SpaceView mr={8}>
								<View style={styles.tempBoxSmall} />
							</SpaceView>
							<SpaceView ml={8}>
								<View style={styles.tempBoxSmall} />
							</SpaceView>
						</SpaceView>

						<SpaceView viewStyle={layoutStyle.row}>
							<SpaceView mr={8}>
								<View style={styles.tempBoxSmall} />
							</SpaceView>
							<SpaceView ml={8}>
								<View style={styles.tempBoxSmall} />
							</SpaceView>
						</SpaceView>
					</View>
				</SpaceView>

				<SpaceView mb={24}>
					<SpaceView mb={8}>
						<CommonText>어떤 사진을 올려야 할까요?</CommonText>
					</SpaceView>
					<CommonText color={ColorType.gray6666}>
						얼굴이 선명히 나오는 사진은 최소 1장 필수에요.{'\n'}
						멋진 무드 속에 담긴 모습이 좋아요.
					</CommonText>
				</SpaceView>

				<SpaceView mb={40}>
					<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
						<SpaceView mr={16}>
							<View style={styles.tempBoxMiddle} />
						</SpaceView>
						<SpaceView mr={16}>
							<View style={styles.tempBoxMiddle} />
						</SpaceView>
						<SpaceView mr={16}>
							<View style={styles.tempBoxMiddle} />
						</SpaceView>
						<SpaceView mr={16}>
							<View style={styles.tempBoxMiddle} />
						</SpaceView>
						<SpaceView mr={16}>
							<View style={styles.tempBoxMiddle} />
						</SpaceView>
						<SpaceView mr={16}>
							<View style={styles.tempBoxMiddle} />
						</SpaceView>
					</ScrollView>
				</SpaceView>

				<SpaceView mb={24}>
					<CommonBtn value={'다음 (3/4)'} type={'primary'} />
				</SpaceView>
			</ScrollView>
		</>
	);
};
