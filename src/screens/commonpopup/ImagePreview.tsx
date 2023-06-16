import CommonHeader from 'component/CommonHeader';
import * as React from 'react';
import { ScrollView, View, Image, Modal, TouchableOpacity, Alert, Text, StyleSheet, Dimensions, FlatList } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ColorType, ScreenNavigationProp, StackParamList, StackScreenProp } from '@types';
import { RouteProp, useNavigation, CommonActions } from '@react-navigation/native';
import SpaceView from 'component/SpaceView';
import { useProfileImg } from 'hooks/useProfileImg';
import { findSourcePath, ICON, IMAGE } from 'utils/imageUtils';
import { CommonBtn } from 'component/CommonBtn';
import Carousel from 'react-native-snap-carousel';


/* ################################################################################################################
###################################################################################################################
###### 프로필 사진 미리보기
###################################################################################################################
################################################################################################################ */
const { width, height } = Dimensions.get('window');

interface Props {
	navigation: StackNavigationProp<StackParamList, 'ImagePreview'>;
	route: RouteProp<StackParamList, 'ImagePreview'>;
}

export const ImagePreview = (props: Props) => {
	const navigation = useNavigation<StackScreenProp>();
	const myImages = useProfileImg();

	const ref = React.useRef();

	const [imgList, setImgList] = React.useState<any>(props.route.params.imgList);

	// 이미지 인덱스
	const [currentIndex, setCurrentIndex] = React.useState(props.route.params.orderSeq-1);

	// 이미지 스크롤 처리
	const handleScroll = (event) => {
		console.log('event :::: ' ,event);
		let contentOffset = event.nativeEvent.contentOffset;
		let index = Math.floor(contentOffset.x / (width-10));
		console.log('index ::::: ' , index);
		setCurrentIndex(index);
	};

	return (
		<>
			<CommonHeader title={'사진 보기'} isLogoType={true} />
			<ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
				<View style={{paddingVertical: 5}}>
					{/* ###### 이미지 indicator */}
					<View style={_styles.pagingContainer}>
						{imgList.map((item, index) => {
							return (
								<View style={_styles.dotContainerStyle} key={'dot' + index}>
									<View style={[_styles.pagingDotStyle, index == currentIndex && _styles.activeDot]} />
								</View>
							)
						})}
					</View>

					{/* <FlatList
						data={imgList}
						renderItem={RenderItem}
						onScroll={handleScroll}
						horizontal
						pagingEnabled
					/> */}

					<Carousel
						ref={ref}
						data={imgList}
						firstItem={currentIndex}
						onSnapToItem={setCurrentIndex}
						sliderWidth={width}
						itemWidth={width}
						pagingEnabled
						renderItem={RenderItem}
					/>
				</View>
			</ScrollView>

			<SpaceView>
				<CommonBtn
					value={'확인'}
					type={'primary'}
					height={60}
					borderRadius={1}
					onPress={() => {
						navigation.canGoBack()
						? navigation.goBack()
						: navigation.dispatch(
							CommonActions.reset({
								index: 1,
								routes: [{ name: 'Login01' }],
							})
						);
					}}
				/>
			</SpaceView>
		</>
	);

	/**
   * 이미지 렌더링
   */
	function RenderItem({ item }) {
		const url = findSourcePath(item?.img_file_path);
		return (
			<>
				<View>
					<Image
						source={url}
						style={{
							width: width,
							height: height * 0.82,
							borderRadius: 20,
						}}
					/>

					{item.status == 'PROGRESS' ? (
						<View style={_styles.badgeIcon(item.status)}>
							<Text style={_styles.authBadgeText(item.status)}>심사중</Text>
						</View>
					) : item.status == 'REFUSE' && (
						<View style={_styles.badgeIcon(item.status)}>
							<Text style={_styles.authBadgeText(item.status)}>반려</Text>
						</View>
					)}
					
				</View>
			</>
		);
	}
};



const _styles = StyleSheet.create({
	pagingContainer: {
		position: 'absolute',
		zIndex: 10,
		alignItems: 'center',
		width,
		flexDirection: 'row',
		justifyContent: 'center',
		top: 18,
	},
	pagingDotStyle: {
		width: 19,
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
		marginRight: 2,
		marginLeft: 2,
	},
	badgeIcon: (status: string) => {
		return {
			width: 38,
			height: 38,
			position: 'absolute',
			top: 10,
			right: 15,
			alignItems: 'center',
			justifyContent: 'center',
			borderWidth: 1,
			borderColor: status == 'PROGRESS' ? '#7986EE' : '#FE0456',
			borderRadius: 20,
      		borderStyle: 'dotted',
		};
	},
	authBadgeText: (status: string) => {
		return {
			fontFamily: 'AppleSDGothicNeoEB00',
			fontSize: 10,
			fontWeight: 'normal',
			fontStyle: 'normal',
			letterSpacing: 0,
			textAlign: 'left',
			color: status == 'PROGRESS' ? '#7986EE' : '#FE0456',
		};
	},
});
  