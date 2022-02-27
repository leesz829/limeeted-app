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

export const Storage = () => {
	const [btnStatus, setBtnStatus] = useState(false);
	return (
		<>
			<TopNavigation currentPath={''} />
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<SpaceView mb={32}>
					<SpaceView mb={16}>
						<CommonText type={'h3'}>내가 받은 관심</CommonText>
					</SpaceView>

					<SpaceView mb={16} viewStyle={styles.rowStyle}>
						<CommonText>로얄패스만 보기</CommonText>
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
										<CommonText color={ColorType.white}>D-1</CommonText>
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
										<CommonText color={ColorType.white}>D-2</CommonText>
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
										<CommonText color={ColorType.white}>D-3</CommonText>
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
										<CommonText color={ColorType.white}>D-4</CommonText>
									</View>
								</View>
							</View>
						</SpaceView>

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
						<CommonText type={'h3'}>내가 보낸 관심</CommonText>
					</SpaceView>

					<SpaceView mb={16} viewStyle={styles.rowStyle}>
						<CommonText>로얄패스만 보기</CommonText>
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
									<CommonText color={ColorType.white}>D-1</CommonText>
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
									<CommonText color={ColorType.white}>D-2</CommonText>
								</View>
							</View>
						</View>
					</SpaceView>

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
				</SpaceView>

				<SpaceView mb={40}>
					<SpaceView mb={16}>
						<CommonText type={'h3'}>관심 공유</CommonText>
					</SpaceView>

					<SpaceView mb={16} viewStyle={styles.rowStyle}>
						<CommonText>로얄패스만 보기</CommonText>
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
										<CommonText color={ColorType.white}>D-1</CommonText>
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
										<CommonText color={ColorType.white}>D-2</CommonText>
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
										<CommonText color={ColorType.white}>D-3</CommonText>
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
										<CommonText color={ColorType.white}>D-4</CommonText>
									</View>
								</View>
							</View>
						</SpaceView>

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
			</ScrollView>
		</>
	);
};
