import { ColorType, BottomParamList, ScreenNavigationProp } from '@types';
import { styles } from 'assets/styles/Styles';
import { CommonSwich } from 'component/CommonSwich';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import TopNavigation from 'component/TopNavigation';
import * as React from 'react';
import { Image, ScrollView, View, TouchableOpacity } from 'react-native';
import { ICON, IMAGE } from 'utils/imageUtils';
import LinearGradient from 'react-native-linear-gradient';
import { useState } from 'react';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation } from '@react-navigation/native';
import * as properties from 'utils/properties';

/* ################################################################################################################
###### 보관함
################################################################################################################ */

interface Props {
	navigation : StackNavigationProp<BottomParamList, 'Storage'>;
	route : RouteProp<BottomParamList, 'Storage'>;
}

export const Storage = (props : Props) => {
	const navigation = useNavigation<ScreenNavigationProp>();

	const [btnStatus, setBtnStatus] = useState(true);
	const [btnStatus1, setBtnStatus1] = useState(true);
	const [btnStatus2, setBtnStatus2] = useState(true);

	const [isResSpecialVisible, setIsResSpecialVisible] = React.useState(false);
	const [isReqSpecialVisible, setIsReqSpecialVisible] = React.useState(false);
	const [isMatchSpecialVisible, setIsMatchSpecialVisible] = React.useState(false);

	// 내가 받은 관심
	const [resLikeList, setResLikeList] = React.useState(props.route.params.resLikeList);

	// 내가 보낸 관심
	const [reqLikeList, setReqLikeList] = React.useState(props.route.params.reqLikeList);

	// 성공 매칭
	const [matchTrgtList, setMatchTrgtList] = React.useState(props.route.params.matchTrgtList);

	// 첫 렌더링 때 fetchNews() 한 번 실행
	React.useEffect(() => {

		console.log('resLikeList ::: ', resLikeList);

		//selectMemberStorage();
		
	}, []);

	// 찐심 설정
	const specialInterestFn = async (type:string, value:string) => {
		console.log('type ::::' , type);
		console.log('value ::::' , value);
	
		if(type == "RES") { setIsResSpecialVisible(value == 'Y' ? true : false);
		} else if(type == "REQ") { setIsReqSpecialVisible(value == 'Y' ? true : false);
		} else if(type == "MATCH") { setIsMatchSpecialVisible(value == 'Y' ? true : false); }

	}

	return (
		<>
			<TopNavigation currentPath={''} />
			<ScrollView contentContainerStyle={styles.scrollContainer}>

				{/* ################################################################
				######################	내가 받은 관심 목록 영역 ######################
				################################################################ */}
				<SpaceView mb={32}>
					<SpaceView mb={16}>
						<CommonText fontWeight={'700'} type={'h3'}>
							내가 받은 관심
						</CommonText>
					</SpaceView>

					<SpaceView mb={16} viewStyle={styles.rowStyle}>
						<CommonText fontWeight={'500'}>찐심만 보기</CommonText>
						<CommonSwich
							callbackFn={(value:boolean) => { specialInterestFn('RES', value ? 'Y' : 'N'); }} 
							isOn={false} />
					</SpaceView>

					<View>
						{resLikeList.length > 0 ? (
						<>
							{resLikeList.map((item,index) => (
								<SpaceView key={index} mb={16} viewStyle={styles.halfContainer}>
									{item.map(({ req_member_seq, img_path, dday, special_interest_yn } : { req_member_seq: any, img_path: any, dday: any, special_interest_yn:any }) =>					
										!isResSpecialVisible || (isResSpecialVisible && special_interest_yn == 'Y') ? (
												<View key={req_member_seq} style={styles.halfItemLeft}>
													<View style={styles.favoriteBox}>

														{/* 관심/찐심 구분 아이콘 */}
														<View style={styles.posTopRight}>
															{special_interest_yn != '' && special_interest_yn == 'Y' ? (
																<Image source={ICON.royalpass} style={styles.iconSize32} />
															) : (
																<Image source={ICON.like} style={styles.iconSize32} />
															)}
														</View>

														{/* 썸네일 이미지 */}
														<Image source={{ uri: img_path !== "" ? img_path : undefined }} style={styles.favoriteImg} />

														{/* 썸네일 이미지 그라데이션 효과 */}
														<LinearGradient
															colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)']}
															style={styles.dim}
															start={{ x: 0, y: 0 }}
															end={{ x: 1, y: 1 }}
														/>

														{/* 보관 기간 표시 */}
														<View style={styles.posBottomLeft}>
															<CommonText fontWeight={'700'} color={ColorType.white}>
																D-{dday}
															</CommonText>
														</View>
													</View>
												</View>	
										) : null
									)}
								</SpaceView>
							))}							
						</>
						) : (
						<>
							<View><CommonText>내가 받은 관심이 없습니다.</CommonText></View>
						</>
						)}

						{/* <View style={styles.halfItemLeft}>
							<View style={styles.favoriteBox}>
								<View style={styles.posTopRight}>
									<Image source={ICON.like} style={styles.iconSize32} />
								</View>
								<Image source={IMAGE.main} style={styles.favoriteImg} />
								<LinearGradient
									colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)']}
									style={styles.dim}
									start={{ x: 0, y: 0 }}
									end={{ x: 1, y: 1 }}
								/>
								<View style={styles.posBottomLeft}>
									<CommonText fontWeight={'700'} color={ColorType.white}>
										D-1
									</CommonText>

								</View>
							</View>
						</View>
						<View style={styles.halfItemLeft}>
							<View style={styles.favoriteBox}>
								<View style={styles.posTopRight}>
									<Image source={ICON.like} style={styles.iconSize32} />
								</View>
								<Image source={IMAGE.main} style={styles.favoriteImg} />
								<LinearGradient
									colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)']}
									style={styles.dim}
									start={{ x: 0, y: 0 }}
									end={{ x: 1, y: 1 }}
								/>
								<View style={styles.posBottomLeft}>
									<CommonText fontWeight={'700'} color={ColorType.white}>
										D-1
									</CommonText>

								</View>
							</View>
						</View> */}

						{!btnStatus && (
							<>
								<SpaceView mb={16} viewStyle={styles.halfContainer}>
									<View style={styles.halfItemLeft}>
										<View style={styles.favoriteBox}>
											<View style={styles.posTopRight}>
												<Image source={ICON.like} style={styles.iconSize32} />
											</View>
											<Image source={IMAGE.main} style={styles.favoriteImg} />
											<LinearGradient
												colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)']}
												style={styles.dim}
												start={{ x: 0, y: 0 }}
												end={{ x: 1, y: 1 }}
											/>
											<View style={styles.posBottomLeft}>
												<CommonText fontWeight={'700'} color={ColorType.white}>
													D-1
												</CommonText>
											</View>
										</View>
									</View>
									<View style={styles.halfItemRight}>
										<View style={styles.favoriteBox}>
											<View style={styles.posTopRight}>
												<Image source={ICON.like} style={styles.iconSize32} />
											</View>
											<Image source={IMAGE.main} style={styles.favoriteImg} />
											<LinearGradient
												colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)']}
												style={styles.dim}
												start={{ x: 0, y: 0 }}
												end={{ x: 1, y: 1 }}
											/>
											<View style={styles.posBottomLeft}>
												<CommonText fontWeight={'700'} color={ColorType.white}>
													D-2
												</CommonText>
											</View>
										</View>
									</View>
								</SpaceView>
								<SpaceView mb={16} viewStyle={styles.halfContainer}>
									<View style={styles.halfItemLeft}>
										<View style={styles.favoriteBox}>
											<View style={styles.posTopRight}>
												<Image source={ICON.royalpass} style={styles.iconSize32} />
											</View>
											<Image source={IMAGE.main} style={styles.favoriteImg} />
											<LinearGradient
												colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)']}
												style={styles.dim}
												start={{ x: 0, y: 0 }}
												end={{ x: 1, y: 1 }}
											/>
											<View style={styles.posBottomLeft}>
												<CommonText fontWeight={'700'} color={ColorType.white}>
													D-3
												</CommonText>
											</View>
										</View>
									</View>
									<View style={styles.halfItemRight}>
										<View style={styles.favoriteBox}>
											<View style={styles.posTopRight}>
												<Image source={ICON.royalpass} style={styles.iconSize32} />
											</View>
											<Image source={IMAGE.main} style={styles.favoriteImg} />
											<LinearGradient
												colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)']}
												style={styles.dim}
												start={{ x: 0, y: 0 }}
												end={{ x: 1, y: 1 }}
											/>
											<View style={styles.posBottomLeft}>
												<CommonText fontWeight={'700'} color={ColorType.white}>
													D-4
												</CommonText>
											</View>
										</View>
									</View>
								</SpaceView>
							</>
						)}

						{/* <TouchableOpacity style={styles.openCloseBtn} onPress={() => setBtnStatus(!btnStatus)}>
							<SpaceView mr={4}>
								<CommonText>{btnStatus ? '더보기' : '접기'}</CommonText>
							</SpaceView>
							<Image
								source={ICON.arrRight}
								style={[styles.iconSize, btnStatus ? styles.rotate90 : styles.rotateN90]}
							/>
						</TouchableOpacity>
						<SpaceView /> */}
					</View>
				</SpaceView>

				{/* ################################################################
				######################	내가 보낸 관심 목록 영역 ######################
				################################################################ */}
				<SpaceView mb={32}>
					<SpaceView mb={16}>
						<CommonText fontWeight={'700'} type={'h3'}>
							내가 보낸 관심
						</CommonText>
					</SpaceView>

					<SpaceView mb={16} viewStyle={styles.rowStyle}>
						<CommonText fontWeight={'500'}>찐심만 보기</CommonText>
						<CommonSwich
							callbackFn={(value:boolean) => { specialInterestFn('01', value ? 'Y' : 'N'); }} 
							isOn={false} />
					</SpaceView>

					<View>

						{reqLikeList.length > 0 ? (
						<>
							{reqLikeList.map((item,index) => (
								<SpaceView key={index} mb={16} viewStyle={styles.halfContainer}>
									{item.map(({ req_member_seq, img_path, dday, special_interest_yn } : { req_member_seq: any, img_path: any, dday: any, special_interest_yn:any }) =>					
										!isReqSpecialVisible || (isReqSpecialVisible && special_interest_yn == 'Y') ? (
											<View key={req_member_seq} style={styles.halfItemLeft}>
												<View style={styles.favoriteBox}>

													{/* 관심/찐심 구분 아이콘 */}
													<View style={styles.posTopRight}>
														{special_interest_yn != '' && special_interest_yn == 'Y' ? (
															<Image source={ICON.royalpass} style={styles.iconSize32} />
														) : (
															<Image source={ICON.like} style={styles.iconSize32} />
														)}
													</View>

													{/* 썸네일 이미지 */}
													<Image source={{ uri: img_path !== "" ? img_path : undefined }} style={styles.favoriteImg} />

													{/* 썸네일 이미지 그라데이션 효과 */}
													<LinearGradient
														colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)']}
														style={styles.dim}
														start={{ x: 0, y: 0 }}
														end={{ x: 1, y: 1 }}
													/>

													{/* 보관 기간 표시 */}
													<View style={styles.posBottomLeft}>
														<CommonText fontWeight={'700'} color={ColorType.white}>
															D-{dday}
														</CommonText>
													</View>
												</View>
											</View>	
										) : null
									)}
								</SpaceView>
							))}							
						</>
						) : (
						<>
							<View><CommonText>내가 보낸 관심이 없습니다.</CommonText></View>
						</>
						)}


						


						{!btnStatus1 && (
							<SpaceView mb={16} viewStyle={styles.halfContainer}>
								<View style={styles.halfItemLeft}>
									<View style={styles.favoriteBox}>
										<View style={styles.posTopRight}>
											<Image source={ICON.like} style={styles.iconSize32} />
										</View>
										<Image source={IMAGE.main} style={styles.favoriteImg} />
										<LinearGradient
											colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)']}
											style={styles.dim}
											start={{ x: 0, y: 0 }}
											end={{ x: 1, y: 1 }}
										/>
										<View style={styles.posBottomLeft}>
											<CommonText fontWeight={'700'} color={ColorType.white}>
												D-1
											</CommonText>
										</View>
									</View>
								</View>
								<View style={styles.halfItemRight}>
									<View style={styles.favoriteBox}>
										<View style={styles.posTopRight}>
											<Image source={ICON.like} style={styles.iconSize32} />
										</View>
										<Image source={IMAGE.main} style={styles.favoriteImg} />
										<LinearGradient
											colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)']}
											style={styles.dim}
											start={{ x: 0, y: 0 }}
											end={{ x: 1, y: 1 }}
										/>
										<View style={styles.posBottomLeft}>
											<CommonText fontWeight={'700'} color={ColorType.white}>
												D-2
											</CommonText>
										</View>
									</View>
								</View>
							</SpaceView>
						)}

						{/* <TouchableOpacity style={styles.openCloseBtn} onPress={() => setBtnStatus1(!btnStatus1)}>
						<SpaceView mr={4}>
							<CommonText>{btnStatus1 ? '더보기' : '접기'}</CommonText>
						</SpaceView>
						<Image
							source={ICON.arrRight}
							style={[styles.iconSize, btnStatus1 ? styles.rotate90 : styles.rotateN90]}
						/>
						</TouchableOpacity>
						<SpaceView /> */}

					</View>

				</SpaceView>

				{/* ################################################################
				######################	성공 매칭 목록 영역 ######################
				################################################################ */}
				<SpaceView mb={40}>
					<SpaceView mb={16}>
						<CommonText fontWeight={'700'} type={'h3'}>
							성공 매칭
						</CommonText>
					</SpaceView>

					<SpaceView mb={16} viewStyle={styles.rowStyle}>
						<CommonText fontWeight={'500'}>찐심만 보기</CommonText>
						<CommonSwich
							callbackFn={(value:boolean) => { specialInterestFn('01', value ? 'Y' : 'N'); }} 
							isOn={false} />
					</SpaceView>

					<View>

						{matchTrgtList.length > 0 ? (
						<>
						{matchTrgtList.map((item,index) => (
							<SpaceView key={index} mb={16} viewStyle={styles.halfContainer}>
								{item.map(({ req_member_seq, img_path, dday, special_interest_yn } : { req_member_seq: any, img_path: any, dday: any, special_interest_yn:any }) =>					
									
									!isMatchSpecialVisible || (isMatchSpecialVisible && special_interest_yn == 'Y') ? (
										<View key={req_member_seq} style={styles.halfItemLeft}>
											<View style={styles.favoriteBox}>

												{/* 관심/찐심 구분 아이콘 */}
												<View style={styles.posTopRight}>
													{special_interest_yn != '' && special_interest_yn == 'Y' ? (
														<Image source={ICON.royalpass} style={styles.iconSize32} />
													) : (
														<Image source={ICON.like} style={styles.iconSize32} />
													)}
												</View>

												{/* 썸네일 이미지 */}
												<Image source={{ uri: img_path !== "" ? img_path : undefined }} style={styles.favoriteImg} />

												{/* 썸네일 이미지 그라데이션 효과 */}
												<LinearGradient
													colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)']}
													style={styles.dim}
													start={{ x: 0, y: 0 }}
													end={{ x: 1, y: 1 }}
												/>

												{/* 보관 기간 표시 */}
												{/* <View style={styles.posBottomLeft}>
													<CommonText fontWeight={'700'} color={ColorType.white}>
														D-{dday}
													</CommonText>
												</View> */}
											</View>
										</View>	
									) : null
								)}
							</SpaceView>
						))}							
						</>
						) : (
						<>
							<View><CommonText>성공 매칭이 없습니다.</CommonText></View>
						</>
						)}

					</View>

				</SpaceView>
			</ScrollView>
		</>
	);
};
