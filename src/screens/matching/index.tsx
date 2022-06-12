import * as React from 'react';
import { Image, ScrollView, View } from 'react-native';
import TopNavigation from 'component/TopNavigation';
import { ICON } from 'utils/imageUtils';
import { layoutStyle, styles } from 'assets/styles/Styles';
import SpaceView from 'component/SpaceView';
import { CommonText } from 'component/CommonText';
import { ColorType, BottomParamList } from '@types';
import { ViualSlider } from 'component/ViualSlider';
import { MainProfileSlider } from 'component/MainProfileSlider';
import { CommonBtn } from 'component/CommonBtn';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation } from '@react-navigation/native';

/* ################################################################################################################
###################################################################################################################
###### 매칭
###################################################################################################################
################################################################################################################ */

interface Props {
	navigation : StackNavigationProp<BottomParamList, 'Roby'>;
	route : RouteProp<BottomParamList, 'Roby'>;
}

export const Matching = (props : Props) => {

	const randomNum = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
	console.log("randomNum ::: " + randomNum);

	return (
		<>
			<TopNavigation currentPath={'LIMEETED'} />
			<ScrollView>
				<ViualSlider num={randomNum} />

				<SpaceView pt={48} viewStyle={styles.container}>
					<SpaceView viewStyle={layoutStyle.rowBetween} mb={16}>
						<View>
							<CommonText fontWeight={'700'} type={'h3'}>
								프로필 2차 인증
							</CommonText>
						</View>

						<View style={[layoutStyle.rowBetween]}>
							<View style={styles.statusBtn}>
								<CommonText type={'h6'} color={ColorType.white}>
									TIER 4
								</CommonText>
							</View>
							<Image source={ICON.medalAll} style={styles.iconSize32} />
						</View>
					</SpaceView>

					<SpaceView mb={48}>
						<SpaceView viewStyle={[layoutStyle.rowBetween]} mb={16}>
							<View style={styles.profileBox}>
								<Image source={ICON.job} style={styles.iconSize48} />
								<CommonText type={'h5'}>직업</CommonText>
							</View>

							<View style={styles.profileBox}>
								<Image source={ICON.degree} style={styles.iconSize48} />
								<CommonText type={'h5'}>학위</CommonText>
							</View>

							<View style={styles.profileBox}>
								<Image source={ICON.income} style={styles.iconSize48} />
								<CommonText type={'h5'}>소득</CommonText>
							</View>
						</SpaceView>

						<View style={[layoutStyle.rowBetween]}>
							<View style={styles.profileBox}>
								<Image source={ICON.asset} style={styles.iconSize48} />
								<CommonText type={'h5'}>자산</CommonText>
							</View>

							<View style={styles.profileBox}>
								<Image source={ICON.sns} style={styles.iconSize48} />
								<CommonText type={'h5'}>SNS</CommonText>
								<View style={styles.disabled} />
							</View>

							<View style={styles.profileBox}>
								<Image source={ICON.vehicle} style={styles.iconSize48} />
								<CommonText type={'h5'}>차량</CommonText>
							</View>
						</View>
					</SpaceView>

					<SpaceView mb={54}>
						<SpaceView mb={16}>
							<CommonText fontWeight={'700'} type={'h3'}>
								프로필 활동지수
							</CommonText>
						</SpaceView>

						<MainProfileSlider />
					</SpaceView>

					<SpaceView mb={24}>
						<SpaceView viewStyle={layoutStyle.rowBetween} mb={16}>
							<View>
								<CommonText fontWeight={'700'} type={'h3'}>
									인터뷰
								</CommonText>
							</View>

							<View style={[layoutStyle.rowBetween]}>
								<SpaceView mr={6}>
									<Image source={ICON.info} style={styles.iconSize} />
								</SpaceView>
								<CommonText type={'h5'}>
									<CommonText fontWeight={'700'} type={'h5'}>
										15개의 질의
									</CommonText>
									가 등록되어있어요
								</CommonText>
							</View>
						</SpaceView>
						<View style={styles.interviewContainer}>
							<SpaceView mb={32} viewStyle={layoutStyle.row}>
								<SpaceView mr={16}>
									<Image source={ICON.manage} style={styles.iconSize40} />
								</SpaceView>

								<View style={styles.interviewLeftTextContainer}>
									<CommonText type={'h5'}>
										첫번째 질문이에요{'\n'}
										질문에 성실하게 답해주세요
									</CommonText>
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

								<View style={styles.interviewLeftTextContainer}>
									<CommonText type={'h5'}>
										두번째 질문이에요{'\n'}
										질문에 성실하게 답해주세요
									</CommonText>
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

					<SpaceView mb={40}>
						<CommonBtn value={'신고'} icon={ICON.siren} iconSize={24} />
					</SpaceView>
				</SpaceView>
			</ScrollView>
		</>
	);
};
