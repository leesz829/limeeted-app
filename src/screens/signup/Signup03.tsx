import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import { layoutStyle, styles, modalStyle } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import CommonHeader from 'component/CommonHeader';
import { CommonInput } from 'component/CommonInput';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import React, { useRef } from 'react';
import { View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { ICON } from 'utils/imageUtils';
import { Modalize } from 'react-native-modalize';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';


/* ################################################################################################################
###################################################################################################################
###### 닉네임과 소개
###################################################################################################################
################################################################################################################ */

interface Props {
	navigation : StackNavigationProp<StackParamList, 'Signup03'>;
	route : RouteProp<StackParamList, 'Signup03'>;
}

export const Signup03 = (props : Props) => {
	const navigation = useNavigation<ScreenNavigationProp>();

	const [nickname, setNickname] = React.useState('');
	const [comment, setComment] = React.useState('');

	console.log(props.route.params.memberSeq);

	const int_modalizeRef = useRef<Modalize>(null);
	const int_onOpen = () => { int_modalizeRef.current?.open(); };
	const int_onClose = () => {	int_modalizeRef.current?.close(); };

	return (
		<>
			<CommonHeader title={'닉네임과 소개'} />
			<ScrollView contentContainerStyle={[styles.scrollContainer]}>
				<SpaceView mb={24}>
					<CommonText>
						LIMEETED에서 사용할 닉네임과{'\n'}
						한줄소개를 입력해주세요.
					</CommonText>
				</SpaceView>

				<SpaceView mb={24}>
					<CommonInput label="닉네임" 
									placeholder={'회원명'}
									onChangeText={nickname => setNickname(nickname)}  />
				</SpaceView>

				<SpaceView mb={48}>
					<CommonInput label="한줄 소개" 
									placeholder={'서울사람'}
									onChangeText={comment => setComment(comment)} />
				</SpaceView>

				<SpaceView mb={24}>
					<SpaceView mb={8}>
						<CommonText>관심사 표현하기</CommonText>
					</SpaceView>
					<CommonText color={ColorType.gray6666}>
						같은 관심사를 가진 이성을 소개할 수 있도록{'\n'}
						도와드릴게요.
					</CommonText>
				</SpaceView>

				<SpaceView mb={24}>
					<CommonBtn value={'등록 및 수정'} 
								height={48} 
								type={'white'} 
								icon={ICON.plus}
								onPress={int_onOpen} />
				</SpaceView>

				{/* <SpaceView mb={40} mt={24} viewStyle={[layoutStyle.row, layoutStyle.wrap]}>
					{[
						{ text: '스타일1', isActive: false },
						{ text: '해외축구', isActive: false },
						{ text: '영화3', isActive: true },
						{ text: '해외축구', isActive: true },
						{ text: '영화1', isActive: false },
						{ text: '영화1', isActive: false },
						{ text: '영화1', isActive: false },
						{ text: '영화1', isActive: false },
					].map((i, index) => {
						return (
							<SpaceView mr={index % 3 !== 2 ? 8 : 0} key={index + 'reg'}>
								<TouchableOpacity style={[styles.interestBox, i.isActive && styles.boxActive]}>
									<CommonText color={i.isActive ? ColorType.primary : ColorType.gray8888}>
										{i.text}
									</CommonText>
								</TouchableOpacity>
							</SpaceView>
						);
					})}
				</SpaceView> */}

				<SpaceView mb={24}>
					<CommonBtn value={'다음 (4/4)'} 
								type={'primary'}
								onPress={() => {

									console.log("nickname :::: " + nickname);

									axios.post('http://211.104.55.151:8080/member/insertMember04/', {
										memberSeq : props.route.params.memberSeq,
										nickname : nickname,
										comment: comment
									})
									.then(function (response) {
										console.log(response.data.result_code);

										if(response.data.result_code == "0000") {
											navigation.navigate('Approval');
										}
									})
									.catch(function (error) {
										console.log(error);
									});

								}} 
					/>
				</SpaceView>
			</ScrollView>



			{/* ###############################################
							관심사 설정 팝업
			############################################### */}

			<Modalize
				ref={int_modalizeRef}
				adjustToContentHeight={true}
				handleStyle={modalStyle.modalHandleStyle}
				modalStyle={modalStyle.modalContainer}
			>
				<View style={modalStyle.modalHeaderContainer}>
					<CommonText fontWeight={'700'} type={'h3'}>
						관심사 등록
					</CommonText>
					<TouchableOpacity onPress={int_onClose}>
						<Image source={ICON.xBtn} style={styles.iconSize24} />
					</TouchableOpacity>
				</View>

				<View style={modalStyle.modalBody}>
					<SpaceView mb={24}>
						<SpaceView mb={16}>
							<CommonText fontWeight={'500'}>문화생활</CommonText>
						</SpaceView>

						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{ text: '스타일1', isActive: true },
								{ text: '해외축구', isActive: false },
								{ text: '영화1', isActive: false },
							].map((i, index) => {
								return (
									<SpaceView mr={index % 3 !== 2 ? 8 : 0} key={index + 'reg'}>
										<TouchableOpacity style={[styles.interestBox, i.isActive && styles.boxActive]}
															onPress={() => {
																console.log('ddd ::: ' + i.text);
															}} >
											<CommonText
												fontWeight={'500'}
												color={i.isActive ? ColorType.primary : ColorType.gray8888} >
												{i.text}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
					</SpaceView>

					<SpaceView mb={24}>
						<SpaceView mb={16}>
							<CommonText fontWeight={'500'}>영화</CommonText>
						</SpaceView>

						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{ text: '영화1', isActive: true },
								{ text: '영화2', isActive: false },
								{ text: '영화3', isActive: false },
							].map((i, index) => {
								return (
									<SpaceView mr={index % 3 !== 2 ? 8 : 0} key={index + 'movie'}>
										<TouchableOpacity style={[styles.interestBox, i.isActive && styles.boxActive]}>
											<CommonText
												fontWeight={'500'}
												color={i.isActive ? ColorType.primary : ColorType.gray8888}
											>
												{i.text}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
					</SpaceView>

					<SpaceView mb={24}>
						<SpaceView mb={16}>
							<CommonText fontWeight={'500'}>스타일</CommonText>
						</SpaceView>

						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{ text: '스타일1', isActive: true },
								{ text: '스타일2', isActive: false },
								{ text: '스타일3', isActive: false },
							].map((i, index) => {
								return (
									<SpaceView mr={index % 3 !== 2 ? 8 : 0} key={index + 'style'}>
										<TouchableOpacity style={[styles.interestBox, i.isActive && styles.boxActive]}>
											<CommonText
												fontWeight={'500'}
												color={i.isActive ? ColorType.primary : ColorType.gray8888}
											>
												{i.text}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
					</SpaceView>

					<SpaceView mb={24}>
						<SpaceView mb={16}>
							<CommonText fontWeight={'500'}>음식</CommonText>
						</SpaceView>

						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{ text: '음식', isActive: true },
								{ text: '음식2', isActive: false },
								{ text: '음식3', isActive: false },
							].map((i, index) => {
								return (
									<SpaceView mr={index % 3 !== 2 ? 8 : 0} key={index + 'food'}>
										<TouchableOpacity style={[styles.interestBox, i.isActive && styles.boxActive]}>
											<CommonText
												fontWeight={'500'}
												color={i.isActive ? ColorType.primary : ColorType.gray8888}
											>
												{i.text}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
					</SpaceView>

					<SpaceView mb={16}>
						<CommonBtn value={'확인'} type={'primary'} />
					</SpaceView>
				</View>
			</Modalize>

		</>
	);
};
