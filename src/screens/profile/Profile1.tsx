import * as React from 'react';
import { Image, ScrollView, TextInput, View } from 'react-native';
import { ICON } from 'utils/imageUtils';
import { layoutStyle, styles } from 'assets/styles/Styles';
import SpaceView from 'component/SpaceView';
import { CommonText } from 'component/CommonText';
import { ColorType } from '@types';
import { ProfileItem } from 'component/MainProfileSlider';
import CommonHeader from 'component/CommonHeader';
import { CommonBtn } from 'component/CommonBtn';

export const Profile1 = () => {
	return (
		<>
			<CommonHeader title={'프로필 관리'} />
			<ScrollView contentContainerStyle={styles.hasFloatingBtnContainer}>
				<SpaceView viewStyle={styles.container}>
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
					<SpaceView mb={54}>
						<SpaceView mb={16}>
							<CommonText type={'h3'}>내 프로필 평점</CommonText>
						</SpaceView>

						<SpaceView>
							<ProfileItem isOnlyProfileItem={true} />
						</SpaceView>
					</SpaceView>

					<SpaceView>
						<SpaceView viewStyle={layoutStyle.rowBetween} mb={16}>
							<View>
								<CommonText type={'h3'}>인터뷰</CommonText>
							</View>

							<View style={[layoutStyle.rowBetween]}>
								<SpaceView mr={6}>
									<Image source={ICON.info} style={styles.iconSize} />
								</SpaceView>
								<CommonText type={'h5'}>
									<CommonText type={'h5'}>15개의 질의</CommonText>가 등록되어있어요
								</CommonText>
							</View>
						</SpaceView>
						<View style={styles.interviewContainer}>
							<SpaceView mb={32} viewStyle={layoutStyle.row}>
								<SpaceView mr={16}>
									<Image source={ICON.manage} style={styles.iconSize40} />
								</SpaceView>

								<View style={layoutStyle.row}>
									<View style={styles.interviewLeftTextContainer}>
										<TextInput
											value={'첫번째 질문이에요 질문에 성실하게 답해주세요'}
											multiline={true}
											style={styles.inputTextStyle}
										/>
									</View>
									<SpaceView ml={8}>
										<Image source={ICON.penCircleGray} style={styles.iconSize24} />
									</SpaceView>
								</View>
							</SpaceView>

							<SpaceView mb={32} viewStyle={[layoutStyle.row, layoutStyle.selfEnd]}>
								<SpaceView viewStyle={styles.interviewRightTextContainer} mr={16}>
									<CommonText type={'h5'} color={ColorType.white}>
										첫번째 질문에 대한 답변이에요{'\n'}
										저는 이렇게 생각해요{'\n'}
										관현악이며, 새 풀이 것이다. 얼음 뛰노는{'\n'}
										예가 많이 인생에 힘있다.
									</CommonText>
								</SpaceView>
								<SpaceView>
									<Image source={ICON.boy} style={styles.iconSize40} />
								</SpaceView>
							</SpaceView>

							<SpaceView mb={32} viewStyle={layoutStyle.row}>
								<SpaceView mr={16}>
									<Image source={ICON.manage} style={styles.iconSize40} />
								</SpaceView>

								<View style={layoutStyle.row}>
									<View style={styles.interviewLeftTextContainer}>
										<TextInput
											value={'두번째 질문이에요'}
											multiline={true}
											style={styles.inputTextStyle}
										/>
									</View>
									<SpaceView ml={8}>
										<Image source={ICON.penCircleGray} style={styles.iconSize24} />
									</SpaceView>
								</View>
							</SpaceView>

							<SpaceView viewStyle={[layoutStyle.row, layoutStyle.selfEnd]}>
								<SpaceView viewStyle={styles.interviewRightTextContainer} mr={16}>
									<CommonText type={'h5'} color={ColorType.white}>
										그림자는 때까지 내려온 얼마나{'\n'}
										봄바람을 수 무한한 끓는다.
									</CommonText>
								</SpaceView>
								<SpaceView>
									<Image source={ICON.boy} style={styles.iconSize40} />
								</SpaceView>
							</SpaceView>
						</View>
					</SpaceView>
				</SpaceView>
			</ScrollView>
			<View style={styles.bottomBtnContainer}>
				<CommonBtn value={'저장'} type={'primary'} />
			</View>
		</>
	);
};
