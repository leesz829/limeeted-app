import * as React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, FlatList } from 'react-native';
import type { FC } from 'react';
import SpaceView from './SpaceView';
import { useState, useEffect } from 'react';
import { ICON, IMAGE } from 'utils/imageUtils';
import { CommonText } from './CommonText';
import { ColorType } from '@types';
import { layoutStyle } from 'assets/styles/Styles';
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');
interface Props {
	imgUrls?: { url: string }[];
	profileName?: string;
	age?: string;
	status?: string;
	comment?: string;
	isNew?: boolean;
	onlyImg?: boolean;
	num?: number;
	callBackFunction?: (activeType: string) => void;
}

/**
 *
 * @param {boolean} isNew 신규 사용자 여부
 * @param {string} status 상태 사진 오른쪽 끝에 나타는 아이콘
 * @param {boolean} onlyImg 이미지와 닉네임 거리만 나타남
 * @returns
 */
export const ViualSlider: FC<Props> = (props: Props) => {
	const [currentIndex, setCurrentIndex] = React.useState(0);

	const callBackFunction = (activeType: string) => {
		console.log('activeType ::: ', activeType);

		props.callBackFunction && props.callBackFunction(activeType);
	};

	const handleScroll = (event) => {
		let contentOffset = event.nativeEvent.contentOffset;
		let index = Math.floor(contentOffset.x / 300);
		setCurrentIndex(index);
	};
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
				{props.imgUrls &&
					props.imgUrls.map((item, index) => (
						<View style={styles.dotContainerStyle} key={'dot' + index}>
							<View style={[styles.pagingDotStyle, index === currentIndex && styles.activeDot]} />
						</View>
					))}
			</View>

			<View>
				<FlatList
					onScroll={handleScroll}
					showsHorizontalScrollIndicator={false}
					pagingEnabled={true}
					horizontal={true}
					data={props.imgUrls}
					renderItem={(data) => <RenderItem imgUrl={data} />}
				/>

				<View style={styles.viusalDescContainer}>
					<SpaceView mb={8} viewStyle={[layoutStyle.row, layoutStyle.alignCenter]}>
						<CommonText fontWeight={'700'} type={'h3'} color={ColorType.white}>
							{props.profileName}, {props.age}
						</CommonText>

						{props.isNew && (
							<SpaceView ml={8}>
								<Image source={ICON.new} style={styles.iconSize40} />
							</SpaceView>
						)}
					</SpaceView>

					<SpaceView mb={16}>
						{/* <View style={layoutStyle.row}>
							<CommonText color={ColorType.white}>15km</CommonText>
							<Image source={ICON.distance} style={styles.iconSize} />
						</View> */}

						{props.onlyImg ? (
							<></>
						) : (
							<CommonText color={ColorType.white}>{props.comment}</CommonText>
						)}
					</SpaceView>

					{props.onlyImg ? (
						<></>
					) : (
						<View style={layoutStyle.rowBetween}>
							<View style={styles.useActionBoxSmall}>
								<TouchableOpacity onPress={() => callBackFunction('pass')}>
									<Image source={ICON.close} style={[styles.iconSize32]} />
								</TouchableOpacity>
							</View>
							<View style={styles.useActionBox}>
								<TouchableOpacity onPress={() => callBackFunction('sincere')}>
									<SpaceView mr={4}>
										<Image source={ICON.royalpass} style={styles.iconSize32} />
									</SpaceView>
								</TouchableOpacity>
								<TouchableOpacity onPress={() => callBackFunction('sincere')}>
									<CommonText fontWeight={'700'} type={'h6'} color={ColorType.white}>
										찐심
									</CommonText>
								</TouchableOpacity>
							</View>
							<View style={styles.useActionBox}>
								<TouchableOpacity onPress={() => callBackFunction('interest')}>
									<SpaceView mr={4}>
										<Image source={ICON.like} style={styles.iconSize32} />
									</SpaceView>
								</TouchableOpacity>
								<TouchableOpacity onPress={() => callBackFunction('interest')}>
									<CommonText fontWeight={'700'} type={'h6'} color={ColorType.white}>
										관심
									</CommonText>
								</TouchableOpacity>
							</View>
						</View>
					)}
				</View>
			</View>
		</SpaceView>
	);
};

const RenderItem = (imgObj: any) => {
	return (
		<View>
			{!imgObj.imgUrl.item.url ? (
				<Image
					source={{
						uri: 'http://118.67.134.149:8080/uploads/profile/rn_image_picker_lib_temp_6813179b-95c7-416c-84da-51ab9ca0dbc1.jpg',
					}}
					style={styles.visualImage}
				/>
			) : (
				<Image source={{ uri: imgObj.imgUrl.item.url }} style={styles.visualImage} />
			)}

			{/* {
				!imgObj.imgUrl.item.url ?
				<Image source={{uri : 'http://118.67.134.149:8080/uploads/profile/rn_image_picker_lib_temp_6813179b-95c7-416c-84da-51ab9ca0dbc1.jpg'}} style={styles.visualImage} />
				: <Image source={{uri : 'http://118.67.134.149:8080/uploads/tmp/rn_image_picker_lib_temp_27af3da1-87a1-4275-951f-3ff7ad09cec3.jpg'}} style={styles.visualImage} />
			} */}
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
