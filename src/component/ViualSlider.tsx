import * as React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import type { FC } from 'react';
import SpaceView from './SpaceView';
import { useState } from 'react';
import { ICON, IMAGE } from 'utils/imageUtils';
import { CommonText } from './CommonText';
import { ColorType } from '@types';
import { layoutStyle } from 'assets/styles/Styles';
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');
interface Props {
	isNew?: boolean;
	status?: string;
	onlyImg?: boolean;
	num: number;
}

/**
 *
 * @param {boolean} isNew 신규 사용자 여부
 * @param {string} status 상태 사진 오른쪽 끝에 나타는 아이콘
 * @param {boolean} onlyImg 이미지와 닉네임 거리만 나타남
 * @returns
 */
export const ViualSlider: FC<Props> = (props) => {

	console.log("props.num1111 :::: " + props.num);

	let name = "김설현";
	let age = "27";

	if(props.num == 1) {
		name = "김설현";
		age = "27";
	} else {
		name = "조보아";
		age = "30";
	}


	//const [data] = useState([{}, {}, {}, {}, {}, {}]);
	const [data] = useState([{}]);
	const [currentIndex, setCurrentIndex] = useState(0);


	return (
		<SpaceView>
			<View style={styles.processContainer}>
				{props.status ? (
					props.status === 'ing' ? (
						<Image source={ICON.process} style={styles.iconSize40} />
					) : (
						<Image source={ICON.badge} style={styles.iconSize40} />
					)
				) : (
					<></>
				)}
			</View>

			<View style={styles.pagingContainer}>
				{data.map((_, index) => (
					<View style={styles.dotContainerStyle} key={'dot' + index}>
						<View style={[styles.pagingDotStyle, index === currentIndex && styles.activeDot]} />
					</View>
				))}
			</View>
			<View>
				<Carousel
					onScrollEnd={(_, current) => setCurrentIndex(current)}
					loop={false}
					data={data}
					width={width}
					height={480}
					renderItem={() => <RenderItem num={props.num} />}
				/>
				<View style={styles.viusalDescContainer}>
					<SpaceView mb={8} viewStyle={[layoutStyle.row, layoutStyle.alignCenter]}>
						<CommonText fontWeight={'700'} type={'h3'} color={ColorType.white}>
							{name}, {age}
						</CommonText>

						{props.isNew && (
							<SpaceView ml={8}>
								<Image source={ICON.new} style={styles.iconSize40} />
							</SpaceView>
						)}
					</SpaceView>

					<SpaceView mb={16}>
						<View style={layoutStyle.row}>
							<CommonText color={ColorType.white}>15km</CommonText>
							<Image source={ICON.distance} style={styles.iconSize} />
						</View>

						{props.onlyImg ? (
							<></>
						) : (
							<CommonText color={ColorType.white}>한줄 소개 내용이 출력됩니다</CommonText>
						)}
					</SpaceView>

					{props.onlyImg ? (
						<></>
					) : (
						<View style={layoutStyle.rowBetween}>
							<View style={styles.useActionBoxSmall}>
								<Image source={ICON.close} style={[styles.iconSize32]} />
							</View>
							<View style={styles.useActionBox}>
								<SpaceView mr={4}>
									<Image source={ICON.royalpass} style={styles.iconSize32} />
								</SpaceView>
								<CommonText fontWeight={'700'} type={'h6'} color={ColorType.white}>
									찐심
								</CommonText>
							</View>
							<View style={styles.useActionBox}>
								<SpaceView mr={4}>
									<Image source={ICON.like} style={styles.iconSize32} />
								</SpaceView>
								<CommonText fontWeight={'700'} type={'h6'} color={ColorType.white}>
									관심
								</CommonText>
							</View>
						</View>
					)}
				</View>
			</View>
		</SpaceView>
	);
};

const RenderItem = (props : Props) => {

	let imgUrl = "http://211.104.55.151:8080/uploads/profile/rn_image_picker_lib_temp_588375c0-b878-4887-993a-39ce54a84b40.jpg";
	console.log("props.num :::: " + props.num);

	if(props.num == 1) {
		imgUrl = "http://211.104.55.151:8080/uploads/profile/rn_image_picker_lib_temp_588375c0-b878-4887-993a-39ce54a84b40.jpg";
	} else {
		imgUrl = "http://211.104.55.151:8080/uploads/profile/rn_image_picker_lib_temp_c82a4d9a-30eb-4196-9bac-fe86757a7c37.jpg";
	}

	return (

		<View>
			{/* <Image source={IMAGE.main} style={styles.visualImage} /> */}
			<Image source={{uri : imgUrl}} style={styles.visualImage} />
			{/* <Image source={{uri : 'http://211.104.55.151:8080/uploads/profile/rn_image_picker_lib_temp_6813179b-95c7-416c-84da-51ab9ca0dbc1.jpg'}} style={styles.visualImage} /> */}			
		</View>
	);
};

const styles = StyleSheet.create({
	useActionBox: {
		width: (width - 104) / 2,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0,0,0,0.3)',
		borderRadius: 8,
		flexDirection: 'row',
	},
	useActionBoxSmall: {
		width: 40,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0,0,0,0.3)',
		borderRadius: 8,
	},
	viusalDescContainer: {
		width: width - 48,
		position: 'absolute',
		left: 24,
		bottom: 24,
	},
	visualImage: {
		width,
		height: 480,
	},
	pagingContainer: {
		position: 'absolute',
		zIndex: 10,
		alignItems: 'center',
		width,
		flexDirection: 'row',
		justifyContent: 'center',
		top: 10,
	},
	pagingDotStyle: {
		width: 12,
		height: 2,
		backgroundColor: 'rgba(255,255,255,0.3)',
		borderRadius: 4,
	},
	activeDot: {
		backgroundColor: 'white',
	},
	pagingContainerStyle: {
		paddingTop: 16,
	},
	dotContainerStyle: {
		marginRight: 4,
		marginLeft: 4,
	},
	iconSize: {
		width: 24,
		height: 24,
	},
	iconSize32: {
		width: 32,
		height: 32,
	},
	iconSize40: {
		width: 40,
		height: 40,
	},
	processContainer: {
		position: 'absolute',
		right: 16,
		top: 16,
		zIndex: 10,
	},
});
