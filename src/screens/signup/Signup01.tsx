import { styles, layoutStyle, modalStyle } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import CommonHeader from 'component/CommonHeader';
import { CommonText } from 'component/CommonText';
import { CommonInput } from 'component/CommonInput';
import SpaceView from 'component/SpaceView';
import React, { useRef } from 'react';
import { View, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ICON } from 'utils/imageUtils';
import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Modalize } from 'react-native-modalize';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

interface Props {
	navigation : StackNavigationProp<StackParamList, 'Signup1'>;
	route : RouteProp<StackParamList, 'Signup1'>;
}


export const Signup1 = (props : Props) => {
	const navigation = useNavigation<ScreenNavigationProp>();

	const state = {
		avatar : ''
	}

	const {id}  = props.route.params;
	const {name} = props.route.params;
	const {age}  = props.route.params;
	const {gender}  = props.route.params;
	const {hp}  = props.route.params;

	// 직업 Pop
	const job_modalizeRef = useRef<Modalize>(null);
	const job_onOpen = () => { job_modalizeRef.current?.open(); };
	const job_onClose = () => {	job_modalizeRef.current?.close(); };

	// 학위 Pop
	const deg_modalizeRef = useRef<Modalize>(null);
	const deg_onOpen = () => { deg_modalizeRef.current?.open(); };
	const deg_onClose = () => {	deg_modalizeRef.current?.close(); };


	const showImage = () => {

		const options = {
			noData: true,
			mediaType: 'photo' as const
		}

		launchImageLibrary(options, (response) => {
	
			if(response.assets) {
				const imageArray = response.assets[0].uri;
				console.warn(imageArray);
			}
		})

		/*launchCamera({mediaType:'photo'}, response => {
			console.warn(response);
		});*/

	
	  }


	return (
		<>
			<CommonHeader title={'프로필 2차 인증'} />
			<ScrollView contentContainerStyle={[styles.scrollContainer]}>

				<SpaceView mb={24}>
					<CommonText>
						아래 버튼 선택 후 인증 뱃지를 등록할 수 있습니다.{'\n'}
						뱃지를 추가하여 자신을 어필해보세요.
					</CommonText>
				</SpaceView>

				<SpaceView mb={24}>
					<SpaceView mb={16}>
						<View style={styles.halfContainer}>
							<TouchableOpacity style={styles.halfItemLeft} 
												onPress={job_onOpen}
							>
								<View style={styles.badgeBox}>
									<SpaceView mb={16}>
										<Image source={ICON.job} style={styles.iconSize40} />
									</SpaceView>

									<SpaceView mb={8}>
										<View style={[layoutStyle.row, layoutStyle.alignCenter]}>
											<CommonText>직업</CommonText>
											<Image source={ICON.arrRight} style={styles.iconSize} />
										</View>
									</SpaceView>

									<CommonText color={ColorType.gray6666} type={'h5'}>
										프로필 2차 인증 위한{'\n'}
										직업 설명 문구
									</CommonText>
								</View>
							</TouchableOpacity>

							<TouchableOpacity style={styles.halfItemRight}
												onPress={deg_onOpen}
							>
								<View style={styles.badgeBox}>
									<SpaceView mb={16}>
										<Image source={ICON.degree} style={styles.iconSize40} />
									</SpaceView>

									<SpaceView mb={8}>
										<View style={[layoutStyle.row, layoutStyle.alignCenter]}>
											<CommonText>학위</CommonText>
											<Image source={ICON.arrRight} style={styles.iconSize} />
										</View>
									</SpaceView>

									<CommonText color={ColorType.gray6666} type={'h5'}>
										프로필 2차 인증 위한{'\n'}
										학위 설명 문구
									</CommonText>
								</View>
							</TouchableOpacity>
						</View>
					</SpaceView>

					<SpaceView mb={16}>
						<View style={styles.halfContainer}>
							<TouchableOpacity style={styles.halfItemLeft}>
								<View style={styles.badgeBox}>
									<SpaceView mb={16}>
										<Image source={ICON.asset} style={styles.iconSize40} />
									</SpaceView>

									<SpaceView mb={8}>
										<View style={[layoutStyle.row, layoutStyle.alignCenter]}>
											<CommonText>소득</CommonText>
											<Image source={ICON.arrRight} style={styles.iconSize} />
										</View>
									</SpaceView>

									<CommonText color={ColorType.gray6666} type={'h5'}>
										프로필 2차 인증 위한{'\n'}
										소득 설명 문구
									</CommonText>
								</View>
							</TouchableOpacity>

							<TouchableOpacity style={styles.halfItemRight}>
								<View style={styles.badgeBox}>
									<SpaceView mb={16}>
										<Image source={ICON.income} style={styles.iconSize40} />
									</SpaceView>

									<SpaceView mb={8}>
										<View style={[layoutStyle.row, layoutStyle.alignCenter]}>
											<CommonText>자산</CommonText>
											<Image source={ICON.arrRight} style={styles.iconSize} />
										</View>
									</SpaceView>

									<CommonText color={ColorType.gray6666} type={'h5'}>
										프로필 2차 인증 위한{'\n'}
										자산 설명 문구
									</CommonText>
								</View>
							</TouchableOpacity>
						</View>
					</SpaceView>

					<SpaceView>
						<View style={styles.halfContainer}>
							<TouchableOpacity style={styles.halfItemLeft}>
								<View style={styles.badgeBox}>
									<SpaceView mb={16}>
										<Image source={ICON.sns} style={styles.iconSize40} />
									</SpaceView>

									<SpaceView mb={8}>
										<View style={[layoutStyle.row, layoutStyle.alignCenter]}>
											<CommonText>SNS</CommonText>
											<Image source={ICON.arrRight} style={styles.iconSize} />
										</View>
									</SpaceView>

									<CommonText color={ColorType.gray6666} type={'h5'}>
										프로필 2차 인증 위한{'\n'}
										SNS 설명 문구
									</CommonText>
								</View>
							</TouchableOpacity>

							<TouchableOpacity style={styles.halfItemRight}>
								<View style={styles.badgeBox}>
									<SpaceView mb={16}>
										<Image source={ICON.vehicle} style={styles.iconSize40} />
									</SpaceView>

									<SpaceView mb={8}>
										<View style={[layoutStyle.row, layoutStyle.alignCenter]}>
											<CommonText>차량</CommonText>
											<Image source={ICON.arrRight} style={styles.iconSize} />
										</View>
									</SpaceView>

									<CommonText color={ColorType.gray6666} type={'h5'}>
										프로필 2차 인증 위한{'\n'}
										차량 설명 문구
									</CommonText>
								</View>
							</TouchableOpacity>
						</View>
					</SpaceView>
				</SpaceView>

				<SpaceView mb={24}>
					<CommonBtn 
							value={'다음 (2/4)'} 
							type={'primary'} 
							onPress={() => {
								navigation.navigate('Signup02');
							}}
					/>
				</SpaceView>
			</ScrollView>


			
			{/* ###############################################
								직업 인증 팝업
			############################################### */}
			<Modalize
				ref={job_modalizeRef}
				adjustToContentHeight={true}
				handleStyle={modalStyle.modalHandleStyle}
				modalStyle={modalStyle.modalContainer}
			>
				<View style={modalStyle.modalHeaderContainer}>
					<CommonText type={'h3'}>직업 인증</CommonText>
					<TouchableOpacity onPress={job_onClose}>
						
						<Image source={ICON.xBtn} style={styles.iconSize24} />
					</TouchableOpacity>
				</View>

				<View style={modalStyle.modalBody}>
					<View>
						<SpaceView mb={32}>
							<CommonInput label="직업" placeholder={'직업을 입력해주세요. (예 : 프로그래머)'} />
						</SpaceView>
					</View>

					<SpaceView mb={24}>
						<SpaceView mb={16}>
							<View style={styles.dotTextContainer}>
								<View style={styles.dot} />
								<CommonText color={ColorType.gray6666}>
									자신의 커리어를 증명할 수 있는 명함 또는 증명서를 올려주세요.
								</CommonText>
							</View>
						</SpaceView>

						<SpaceView>
							<View style={styles.dotTextContainer}>
								<View style={styles.dot} />
								<CommonText color={ColorType.gray6666}>
									허용 증명서 : 재직증명서, 건강보험자격득실확인서, 직업라이센스
								</CommonText>
							</View>
						</SpaceView>
					</SpaceView>

					<SpaceView mb={24}>
						<CommonBtn value={'등록 및 수정'} 
									height={48} 
									type={'white'} 
									icon={ICON.plus}
									onPress={() => {
										showImage();
									}} />
					</SpaceView>

					<SpaceView mb={16}>
						<CommonBtn value={'확인'} type={'primary'} />
					</SpaceView>
				</View>
			</Modalize>

			{/* ###############################################
								학위 인증 팝업
			############################################### */}
			<Modalize
				ref={deg_modalizeRef}
				adjustToContentHeight={true}
				handleStyle={modalStyle.modalHandleStyle}
				modalStyle={modalStyle.modalContainer}
			>
				<View style={modalStyle.modalHeaderContainer}>
					<CommonText type={'h3'}>학위 인증</CommonText>
					<TouchableOpacity onPress={deg_onClose}>
						<Image source={ICON.xBtn} style={styles.iconSize24} />
					</TouchableOpacity>
				</View>

				<View style={modalStyle.modalBody}>
					<View>
						<SpaceView mb={32}>
							<CommonInput label="직업" placeholder={'직업을 입력해주세요. (예 : 프로그래머)'} />
						</SpaceView>
					</View>

					<SpaceView mb={24}>
						<SpaceView mb={16}>
							<View style={styles.dotTextContainer}>
								<View style={styles.dot} />
								<CommonText color={ColorType.gray6666}>
									자신의 커리어를 증명할 수 있는 명함 또는 증명서를 올려주세요.
								</CommonText>
							</View>
						</SpaceView>

						<SpaceView>
							<View style={styles.dotTextContainer}>
								<View style={styles.dot} />
								<CommonText color={ColorType.gray6666}>
									허용 증명서 : 재직증명서, 건강보험자격득실확인서, 직업라이센스
								</CommonText>
							</View>
						</SpaceView>
					</SpaceView>

					<SpaceView mb={24}>
						<CommonBtn value={'등록 및 수정'} height={48} type={'white'} icon={ICON.plus} />
					</SpaceView>

					<SpaceView mb={16}>
						<CommonBtn value={'확인'} type={'primary'} />
					</SpaceView>
				</View>
			</Modalize>


		</>
	);
};
