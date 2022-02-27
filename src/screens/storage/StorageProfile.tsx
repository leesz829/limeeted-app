import * as React from 'react';
import { Image, ScrollView, View } from 'react-native';
import TopNavigation from 'component/TopNavigation';
import { ICON } from 'utils/imageUtils';
import { layoutStyle, styles } from 'assets/styles/Styles';
import SpaceView from 'component/SpaceView';
import { CommonText } from 'component/CommonText';
import { ColorType } from '@types';
import { ViualSlider } from 'component/ViualSlider';
import { CommonBtn } from 'component/CommonBtn';

export const StorageProfile = () => {
	return (
		<>
			<TopNavigation currentPath={''} />
			<ScrollView>
				<ViualSlider onlyImg={true} />

				<SpaceView viewStyle={styles.container}>
					<SpaceView viewStyle={styles.halfContainer} mb={48}>
						<View style={styles.halfItemLeft4}>
							<CommonBtn value={'거절'} height={48} />
						</View>
						<View style={styles.halfItemRight4}>
							<CommonBtn value={'수락'} type={'primary'} height={48} />
						</View>
					</SpaceView>

					<SpaceView viewStyle={styles.textContainer} mb={48}>
						<SpaceView mb={8}>
							<Image source={ICON.wait} style={styles.iconSize48} />
						</SpaceView>
						<CommonText>매칭 대기중</CommonText>
						<CommonText color={ColorType.gray6666}>
							상대방이 회원님의 관심을 두고 고민 중인가봐요.
						</CommonText>
					</SpaceView>

					<SpaceView mb={48}>
						<SpaceView mb={8}>
							<CommonText type={'h3'}>인사말 건네기</CommonText>
						</SpaceView>
						<SpaceView mb={16}>
							<CommonText>상대 이성에게 반가운 인사말을 건내보세요.</CommonText>
						</SpaceView>
						<SpaceView mb={8} viewStyle={styles.textContainer}>
							<CommonText>카카오톡 ID</CommonText>
							<CommonText type={'h5'}>
								영역을 터치하면 상대 이성의 카카오톡 ID가 복사됩니다
							</CommonText>
						</SpaceView>

						<CommonBtn value={'카카오톡 열기'} type={'kakao'} icon={ICON.kakao} iconSize={24} />
					</SpaceView>

					<SpaceView viewStyle={layoutStyle.rowBetween} mb={16}>
						<View>
							<CommonText type={'h3'}>프로필 2차 인증</CommonText>
						</View>

						<View style={[layoutStyle.rowBetween]}>
							<View style={styles.statusBtn}>
								<CommonText type={'h6'} color={ColorType.white}>
									ALL
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
							</View>

							<View style={styles.profileBox}>
								<Image source={ICON.vehicle} style={styles.iconSize48} />
								<CommonText type={'h5'}>차량</CommonText>
							</View>
						</View>
					</SpaceView>
				</SpaceView>
			</ScrollView>
		</>
	);
};
