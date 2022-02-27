import { ColorType } from '@types';
import { layoutStyle, styles } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import { CommonSwich } from 'component/CommonSwich';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import { ToolTip } from 'component/Tooltip';
import TopNavigation from 'component/TopNavigation';
import * as React from 'react';
import { Image, ScrollView, View, TouchableOpacity } from 'react-native';
import { ICON, IMAGE } from 'utils/imageUtils';

export const Roby = () => {
	return (
		<>
			<TopNavigation currentPath={''} />
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<SpaceView mb={16}>
					<CommonText type={'h3'}>내 정보</CommonText>
				</SpaceView>

				<SpaceView mb={48} viewStyle={layoutStyle.alignCenter}>
					<SpaceView mb={8}>
						<Image source={IMAGE.main} style={styles.profileImg} />
						<View style={styles.profilePenContainer}>
							<Image source={ICON.pen} style={styles.iconSize24} />
						</View>
					</SpaceView>

					<SpaceView mb={4}>
						<CommonText type={'h4'}>회원닉네임, 31</CommonText>
					</SpaceView>
					<SpaceView mb={16} viewStyle={styles.levelContainer}>
						<CommonText color={ColorType.gray6666} type={'h6'}>
							LV.6
						</CommonText>
					</SpaceView>

					<CommonText color={ColorType.gray6666}>한줄 소개 내용이 출력됩니다</CommonText>
				</SpaceView>

				<SpaceView mb={16} viewStyle={styles.halfContainer}>
					<View style={[styles.halfItemLeft, styles.profileContainer, layoutStyle.alignCenter]}>
						<SpaceView mb={4}>
							<CommonText type={'h2'}>7.5</CommonText>
						</SpaceView>

						<SpaceView mb={24} viewStyle={layoutStyle.rowCenter}>
							<Image source={ICON.star} style={styles.iconSize24} />
							<Image source={ICON.star} style={styles.iconSize24} />
							<Image source={ICON.star} style={styles.iconSize24} />
							<Image source={ICON.starHalf} style={styles.iconSize24} />
							<Image source={ICON.starEmpty} style={styles.iconSize24} />
						</SpaceView>
						<ToolTip title={'기여 평점'} desc={'프로필 평점'} position={'bottomLeft'} />
					</View>

					<View style={[styles.halfItemRight, styles.profileContainer, layoutStyle.alignCenter]}>
						<SpaceView mb={4}>
							<CommonText type={'h2'}>7.5</CommonText>
						</SpaceView>

						<SpaceView mb={24} viewStyle={layoutStyle.rowCenter}>
							<Image source={ICON.star} style={styles.iconSize24} />
							<Image source={ICON.star} style={styles.iconSize24} />
							<Image source={ICON.star} style={styles.iconSize24} />
							<Image source={ICON.starHalf} style={styles.iconSize24} />
							<Image source={ICON.starEmpty} style={styles.iconSize24} />
						</SpaceView>
						<ToolTip position={'bottomRight'} title={'프로필 평점'} desc={'프로필 평점'} />
					</View>
				</SpaceView>

				<SpaceView mb={48}>
					<CommonBtn
						type="purple"
						value="프로필 재심사"
						icon={ICON.refresh}
						iconSize={24}
						iconPosition={'right'}
					/>
				</SpaceView>

				<SpaceView mb={48}>
					<SpaceView mb={16}>
						<SpaceView mb={16}>
							<CommonText type={'h3'}>보관함</CommonText>
						</SpaceView>
						<View style={styles.rowStyle}>
							<CommonText>
								새 관심
								<CommonText color={ColorType.primary}> 8</CommonText>건
							</CommonText>

							<Image source={ICON.arrRight} style={styles.iconSize} />
						</View>

						<ScrollView horizontal={true}>
							<SpaceView viewStyle={styles.circleBox} mr={16} />
							<SpaceView viewStyle={styles.circleBox} mr={16} />
							<SpaceView viewStyle={styles.circleBox} mr={16} />
							<SpaceView viewStyle={styles.circleBox} mr={16} />
							<SpaceView viewStyle={styles.circleBox} mr={16} />
							<SpaceView viewStyle={styles.circleBox} mr={16} />
							<SpaceView viewStyle={styles.circleBox} mr={16} />
							<SpaceView viewStyle={styles.circleBox} mr={16} />
							<SpaceView viewStyle={styles.circleBox} />
						</ScrollView>
					</SpaceView>

					<View style={styles.rowStyle}>
						<CommonText>
							새 매칭
							<CommonText color={ColorType.primary}> 8</CommonText>건
						</CommonText>

						<Image source={ICON.arrRight} style={styles.iconSize} />
					</View>

					<ScrollView horizontal={true}>
						<SpaceView viewStyle={styles.circleBox} mr={16} />
						<SpaceView viewStyle={styles.circleBox} mr={16} />
						<SpaceView viewStyle={styles.circleBox} mr={16} />
						<SpaceView viewStyle={styles.circleBox} mr={16} />
						<SpaceView viewStyle={styles.circleBox} mr={16} />
						<SpaceView viewStyle={styles.circleBox} mr={16} />
						<SpaceView viewStyle={styles.circleBox} mr={16} />
						<SpaceView viewStyle={styles.circleBox} mr={16} />
						<SpaceView viewStyle={styles.circleBox} />
					</ScrollView>
				</SpaceView>

				<SpaceView mb={48}>
					<SpaceView mb={16}>
						<CommonText type={'h3'}>매칭 설정</CommonText>
					</SpaceView>

					<TouchableOpacity style={styles.rowStyle}>
						<CommonText>내 선호 이성</CommonText>
						<Image source={ICON.arrRight} style={styles.iconSize} />
					</TouchableOpacity>

					<View style={styles.rowStyle}>
						<ToolTip title={'내 프로필 공개'} desc={'내 프로필 공개'} />
						<CommonSwich />
					</View>

					<View style={styles.rowStyle}>
						<ToolTip title={'아는 사람 소개'} desc={'아는 사람 소개'} />
						<CommonSwich />
					</View>
				</SpaceView>

				<SpaceView mb={40}>
					<SpaceView mb={16}>
						<CommonText type={'h3'}>그 외</CommonText>
					</SpaceView>
					<TouchableOpacity style={styles.rowStyle}>
						<CommonText>최근 소식</CommonText>
						<Image source={ICON.arrRight} style={styles.iconSize} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.rowStyle}>
						<CommonText>내 계정 정보</CommonText>
						<Image source={ICON.arrRight} style={styles.iconSize} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.rowStyle}>
						<CommonText>이용약관</CommonText>
						<Image source={ICON.arrRight} style={styles.iconSize} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.rowStyle}>
						<CommonText>개인정보 취급방침</CommonText>
						<Image source={ICON.arrRight} style={styles.iconSize} />
					</TouchableOpacity>
				</SpaceView>
			</ScrollView>
		</>
	);
};
