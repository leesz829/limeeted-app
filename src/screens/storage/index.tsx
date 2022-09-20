import { ColorType } from '@types';
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
import * as properties from 'utils/properties';

/* ################################################################################################################
###### 보관함
################################################################################################################ */

export const Storage = () => {
	const [btnStatus, setBtnStatus] = useState(true);
	const [btnStatus1, setBtnStatus1] = useState(true);
	const [btnStatus2, setBtnStatus2] = useState(true);


	// 내가받은 관심
	const [resLikeList, setResLikeList] = React.useState(
		[
			[{ req_member_seq : String, img_path : '', dday : Number}]
		]
	);

	// 내가보낸 관심
	const [reqLikeList, setReqLikeList] = React.useState(
		[
			[{ res_like_member_seq : String, img_path : '', dday : Number}]
		]
	);

	// 첫 렌더링 때 fetchNews() 한 번 실행
	React.useEffect(() => {
		selectMemberStorage();
		
	}, []);
	
	// 회원 보관함 조회
	const selectMemberStorage = async () => {

		const result = await axios.post(properties.api_domain + '/member/selectMemberStorage', {
			'api-key' : 'U0FNR09CX1RPS0VOXzAx'
			, 'member_seq' : String(await properties.get_json_data('member_seq'))
		}
		, {
			headers: {
				'jwt-token' : String(await properties.jwt_token())
			}
		})
		.then(function (response) {
			console.log("resLikeList :::: ", response.data.resLikeList);

			if(response.data.result_code != '0000'){
				console.log(response.data.result_msg);
				return false;
			} else {

				// 받은 관심 목록 셋팅
				if(null != response.data.resLikeList) {
					let arrayList = new Array();
					let dataList = new Array();
					let hNum = 0;
					response.data?.resLikeList?.map(({ req_member_seq, file_name, file_path, dday } : { req_member_seq: any, file_name: any, file_path: any, dday: any}) => {
						const img_path = properties.api_domain + '/uploads' + file_path + file_name;
						const dataJson = { req_member_seq: String, img_path: '', dday: 0 };
						const dday_mod = 7-Number(dday);

						dataJson.req_member_seq(req_member_seq);
						dataJson.img_path = img_path;
						dataJson.dday = dday_mod;

						dataList.push(dataJson);
						hNum++;

						let chk = false;
						if(dataList.length == 2) {
							chk = true;
							arrayList.push(dataList);
							dataList = new Array();
						}

						if(!chk && hNum == response.data.resLikeList.length) {
							arrayList.push(dataList);
						}
					});
					
					setResLikeList(arrayList);
				}

				// 보낸 관심 목록 셋팅
				if(null != response.data.reqLikeList) {
					let arrayList = new Array();
					let dataList = new Array();
					let hNum = 0;
					response.data?.reqLikeList?.map(({ res_like_member_seq, file_name, file_path, dday }: { res_like_member_seq: any, file_name: any, file_path: any, dday: any }) => {
						const img_path = properties.api_domain + '/uploads' + file_path + file_name;
						const dataJson = { res_like_member_seq : String, img_path : '', dday: 0 };
						const dday_mod = 7-Number(dday);

						dataJson.res_like_member_seq(res_like_member_seq);
						dataJson.img_path = img_path;
						dataJson.dday = dday_mod;

						dataList.push(dataJson);
						hNum++;

						let chk = false;
						if(dataList.length == 2) {
							chk = true;
							arrayList.push(dataList);
							dataList = new Array();
						}

						if(!chk && hNum == response.data.reqLikeList.length) {
							arrayList.push(dataList);
						}
					});
					setReqLikeList(arrayList);
				}

			}

		})
		.catch(function (error) {
			console.log('error ::: ' , error);
		});
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
						<CommonText fontWeight={'500'}>로얄패스만 보기</CommonText>
						<CommonSwich />
					</SpaceView>

					<View>
						{resLikeList.map((v, i) => (
							<>
								<SpaceView mb={16} viewStyle={styles.halfContainer}>
									{resLikeList[i].map((_, j) => (
										<View style={styles.halfItemLeft}>
											<View style={styles.favoriteBox}>

												{/* 관심/찐심 구분 아이콘 */}
												<View style={styles.posTopRight}>
													<Image source={ICON.like} style={styles.iconSize32} />
												</View>

												{/* 썸네일 이미지 */}
												<Image source={{ uri: _.img_path !== "" ? _.img_path : undefined }} style={styles.favoriteImg} />

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
														D-{_.dday}
													</CommonText>
												</View>
											</View>
										</View>
									))}
								</SpaceView>
							</>
						))}
				
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
						<CommonText fontWeight={'500'}>로얄패스만 보기</CommonText>
						<CommonSwich />
					</SpaceView>

					<View>

						{reqLikeList.map((v, i) => (
							<>
								<SpaceView mb={16} viewStyle={styles.halfContainer}>
									{reqLikeList[i].map((_, j) => (
										<View style={styles.halfItemLeft}>
											<View style={styles.favoriteBox}>

												{/* 관심/찐심 구분 아이콘 */}
												<View style={styles.posTopRight}>
													<Image source={ICON.like} style={styles.iconSize32} />
												</View>

												{/* 썸네일 이미지 */}
												<Image source={{ uri: _.img_path !== "" ? _.img_path : undefined }} style={styles.favoriteImg} />

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
														D-{_.dday}
													</CommonText>
												</View>
											</View>
										</View>
									))}
								</SpaceView>
							</>
						))}


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
				######################	관심 공유 목록 영역 ######################
				################################################################ */}
				<SpaceView mb={40}>
					<SpaceView mb={16}>
						<CommonText fontWeight={'700'} type={'h3'}>
							관심 공유
						</CommonText>
					</SpaceView>

					<SpaceView mb={16} viewStyle={styles.rowStyle}>
						<CommonText fontWeight={'500'}>로얄패스만 보기</CommonText>
						<CommonSwich />
					</SpaceView>

					<View>
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

						{!btnStatus2 && (
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
						)}
						<TouchableOpacity
							style={styles.openCloseBtn}
							onPress={() => setBtnStatus2(!btnStatus2)}
						>
							<SpaceView mr={4}>
								<CommonText>{btnStatus2 ? '더보기' : '접기'}</CommonText>
							</SpaceView>
							<Image
								source={ICON.arrRight}
								style={[styles.iconSize, btnStatus2 ? styles.rotate90 : styles.rotateN90]}
							/>
						</TouchableOpacity>
						<SpaceView />
					</View>
				</SpaceView>
			</ScrollView>
		</>
	);
};
