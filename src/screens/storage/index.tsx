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
import { jwt_token } from 'utils/properties';
import axios from 'axios';


export const Storage = () => {
	const [btnStatus, setBtnStatus] = useState(true);
	const [btnStatus1, setBtnStatus1] = useState(true);
	const [btnStatus2, setBtnStatus2] = useState(true);


	// 내가받은 괌심
	const [userInfo, setUserInfo] = useState();

	// 내가보낸 괌심




	return (
		<>
			<TopNavigation currentPath={''} />
			<ScrollView contentContainerStyle={styles.scrollContainer}>
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
						</SpaceView>
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

						<TouchableOpacity style={styles.openCloseBtn} onPress={() => setBtnStatus(!btnStatus)}>
							<SpaceView mr={4}>
								<CommonText>{btnStatus ? '더보기' : '접기'}</CommonText>
							</SpaceView>
							<Image
								source={ICON.arrRight}
								style={[styles.iconSize, btnStatus ? styles.rotate90 : styles.rotateN90]}
							/>
						</TouchableOpacity>
						<SpaceView />
					</View>
				</SpaceView>

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

					<TouchableOpacity style={styles.openCloseBtn} onPress={() => setBtnStatus1(!btnStatus1)}>
						<SpaceView mr={4}>
							<CommonText>{btnStatus1 ? '더보기' : '접기'}</CommonText>
						</SpaceView>
						<Image
							source={ICON.arrRight}
							style={[styles.iconSize, btnStatus1 ? styles.rotate90 : styles.rotateN90]}
						/>
					</TouchableOpacity>
					<SpaceView />
				</SpaceView>

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
