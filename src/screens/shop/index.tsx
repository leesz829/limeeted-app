import * as React from 'react';
import { Image, ScrollView, View } from 'react-native';
import TopNavigation from 'component/TopNavigation';
import { ICON } from 'utils/imageUtils';
import { layoutStyle, styles } from 'assets/styles/Styles';
import SpaceView from 'component/SpaceView';
import { CommonText } from 'component/CommonText';
import { ColorType } from '@types';

export const Shop = () => {
	return (
		<>
			<TopNavigation currentPath={''} />
			<ScrollView style={styles.scrollContainer}>
				<SpaceView mb={16}>
					<CommonText type={'h3'}>보유 재화</CommonText>
				</SpaceView>

				<SpaceView viewStyle={styles.halfContainer} mb={16}>
					<View style={styles.halfItemLeft}>
						<View style={styles.textContainer}>
							<SpaceView mb={8}>
								<CommonText>보유 패스</CommonText>
							</SpaceView>
							<Image source={ICON.pass} style={styles.iconSize32} />
							<CommonText type={'h2'}>999,999</CommonText>
						</View>
					</View>
					<View style={styles.halfItemRight}>
						<View style={styles.textContainer}>
							<SpaceView mb={8}>
								<CommonText>보유 로얄패스</CommonText>
							</SpaceView>
							<Image source={ICON.royalpass} style={styles.iconSize32} />
							<CommonText type={'h2'}>1,000</CommonText>
						</View>
					</View>
				</SpaceView>

				<SpaceView viewStyle={[styles.purpleContainer, layoutStyle.rowBetween]} mb={48}>
					<View>
						<CommonText color={ColorType.white}>추천 패키지</CommonText>
						<CommonText>300 패스 + 10 로얄패스</CommonText>
					</View>
					<View style={layoutStyle.rowCenter}>
						<SpaceView viewStyle={styles.whiteCircleBox30} mr={8}>
							<CommonText textStyle={styles.lineHeight16} type={'h6'} color={ColorType.white}>
								D.C {'\n'}30%
							</CommonText>
						</SpaceView>
						<CommonText color={ColorType.white} type={'h4'}>
							₩9,900
						</CommonText>
					</View>
				</SpaceView>

				<SpaceView mb={48}>
					<SpaceView mb={16}>
						<CommonText type={'h3'}>보유 재화</CommonText>
					</SpaceView>
					<View style={styles.rowStyle}>
						<SpaceView mr={4} viewStyle={layoutStyle.rowCenter}>
							<Image source={ICON.pass} style={styles.iconSize32} />
							<CommonText>10</CommonText>
						</SpaceView>
						<View>
							<CommonText>₩9,900</CommonText>
						</View>
					</View>
					<View style={styles.rowStyle}>
						<SpaceView mr={4} viewStyle={layoutStyle.rowCenter}>
							<Image source={ICON.pass} style={styles.iconSize32} />
							<CommonText>30</CommonText>
						</SpaceView>
						<View>
							<CommonText>₩19,900</CommonText>
						</View>
					</View>
					<View style={styles.rowStyle}>
						<SpaceView mr={4} viewStyle={layoutStyle.rowCenter}>
							<Image source={ICON.pass} style={styles.iconSize32} />
							<CommonText>70(+10)</CommonText>
						</SpaceView>
						<View>
							<CommonText>₩39,900</CommonText>
						</View>
					</View>
					<View style={styles.rowStyle}>
						<SpaceView mr={4} viewStyle={layoutStyle.rowCenter}>
							<Image source={ICON.pass} style={styles.iconSize32} />
							<CommonText>120(+20)</CommonText>
						</SpaceView>
						<View>
							<CommonText>₩79,900</CommonText>
						</View>
					</View>
					<View style={styles.rowStyle}>
						<SpaceView mr={4} viewStyle={layoutStyle.rowCenter}>
							<Image source={ICON.pass} style={styles.iconSize32} />
							<CommonText>200(+50)</CommonText>
						</SpaceView>
						<View>
							<CommonText>₩149,900</CommonText>
						</View>
					</View>
					<View style={styles.rowStyle}>
						<SpaceView mr={4} viewStyle={layoutStyle.rowCenter}>
							<Image source={ICON.pass} style={styles.iconSize32} />
							<CommonText>500(+100)</CommonText>
						</SpaceView>
						<View>
							<CommonText>₩299,900</CommonText>
						</View>
					</View>
				</SpaceView>

				<SpaceView mb={48}>
					<SpaceView mb={16}>
						<CommonText type={'h3'}>로얄패스</CommonText>
					</SpaceView>
					<View style={styles.rowStyle}>
						<SpaceView mr={4} viewStyle={layoutStyle.rowCenter}>
							<Image source={ICON.royalpass} style={styles.iconSize32} />
							<CommonText>5</CommonText>
						</SpaceView>
						<View>
							<CommonText>₩9,900</CommonText>
						</View>
					</View>
					<View style={styles.rowStyle}>
						<SpaceView mr={4} viewStyle={layoutStyle.rowCenter}>
							<Image source={ICON.pass} style={styles.iconSize32} />
							<CommonText>10</CommonText>
						</SpaceView>
						<View>
							<CommonText>₩19,900</CommonText>
						</View>
					</View>
					<View style={styles.rowStyle}>
						<SpaceView mr={4} viewStyle={layoutStyle.rowCenter}>
							<Image source={ICON.pass} style={styles.iconSize32} />
							<CommonText>20</CommonText>
						</SpaceView>
						<View>
							<CommonText>₩39,900</CommonText>
						</View>
					</View>
				</SpaceView>

				<SpaceView mb={60}>
					<SpaceView viewStyle={styles.dotTextContainer} mb={16}>
						<View style={styles.dot} />
						<CommonText color={ColorType.gray6666}>모든 상품은 VAT 포함된 가격입니다.</CommonText>
					</SpaceView>

					<SpaceView viewStyle={styles.dotTextContainer} mb={16}>
						<View style={styles.dot} />
						<CommonText color={ColorType.gray6666}>
							구매 완료 후 7일 이내에 청약철회가 가능합니다.
						</CommonText>
					</SpaceView>

					<SpaceView viewStyle={styles.dotTextContainer}>
						<View style={styles.dot} />
						<CommonText color={ColorType.gray6666}>
							청약철회 시 대상 상품의 수량이 보유 수량에서 차감됩니다.
						</CommonText>
					</SpaceView>
				</SpaceView>
			</ScrollView>
		</>
	);
};
