import React, { useCallback, useEffect, useState } from 'react';
import { Image, ScrollView, View, Platform, Alert, FlatList, TouchableOpacity } from 'react-native';
import TopNavigation from 'component/TopNavigation';
import { ICON } from 'utils/imageUtils';
import { layoutStyle, styles } from 'assets/styles/Styles';
import SpaceView from 'component/SpaceView';
import { CommonText } from 'component/CommonText';
import { ColorType } from '@types';
import {
	initConnection,
	getProducts,
	requestPurchase,
	getAvailablePurchases,
} from 'react-native-iap';
import { purchase_product } from 'api/models';
import * as hooksMember from 'hooks/member';
import axios from 'axios';
import * as properties from 'utils/properties';
import { useIsFocused } from '@react-navigation/native';

interface Products {
	products: Product[];
}
interface Product {
	oneTimePurchaseOfferDetails: {
		priceAmountMicros: string;
		formattedPrice: string;
		priceCurrencyCode: string;
	};
	name: string;
	productType: string;
	description: string;
	title: string;
	productId: string;
}
export const Shop = () => {
	const jwtToken = hooksMember.getJwtToken();		// 토큰
	const isFocus = useIsFocused();

	const [products, setProducts] = useState<Products>([]);
	const skus = Platform.select({
		ios: ['cash_100', 'cash_200'],
		android: ['cash_100', 'cash_200'],
	});

	useEffect(() => {
		init();
	}, [isFocus]);

	async function init() {
		const isConnected = await initConnection();
		if (isConnected) {
			const result = await getAvailablePurchases();

			const _products = await getProducts({ skus });
			setProducts(_products);
			console.log(
				'getAvailablePurchases : ',
				JSON.stringify(result),
				'getProducts : ',
				JSON.stringify(_products),
			);
		}

		selectHasUserPoint();
	}

		// 보유 포인트 조회
		const selectHasUserPoint = async () => {
			const result = await axios
				.post(
					properties.api_domain + '/common/util/selectHasUserPoint',
					{
						'api-key': 'U0FNR09CX1RPS0VOXzAx'
					},
					{
						headers: {
							'jwt-token': jwtToken,
						},
					},
				)
				.then(function (response) {
					console.log('selectHasUserPoint response :::: ', response.data);
	
					
				})
				.catch(function (error) {
					console.log('selectHasUserPoint error ::: ', error);
				});
		};
	

	const onPressItem = async (id: string) => {
		try {
			const result = await requestPurchase({
				skus: [id],
				andDangerouslyFinishTransactionAutomaticallyIOS: false,
			});
			const { success, data } = await purchase_product({ msg: result });
			if (success) {
				Alert.alert('구매완료', '상품이 성공적으로 구매되었습니다.', [
					{ text: '확인', onPress: () => {} },
				]);
			}
		} catch (err: any) {
			console.warn(err.code, err.message);
		}
	};
	const RednerProduct = useCallback(
		({ item }: { item: Product }) => (
			<TouchableOpacity style={styles.rowStyle} onPress={() => onPressItem(item?.productId)}>
				<SpaceView mr={4} viewStyle={layoutStyle.rowCenter}>
					<Image source={ICON.pass} style={styles.iconSize32} />
					<CommonText fontWeight={'500'}>{item?.name}</CommonText>
				</SpaceView>
				<View>
					<CommonText fontWeight={'700'}>
						{item?.oneTimePurchaseOfferDetails?.formattedPrice}
					</CommonText>
				</View>
			</TouchableOpacity>
		),
		[products],
	);

	return (
		<>
			<TopNavigation currentPath={''} />
			<ScrollView style={styles.scrollContainer}>
				<SpaceView mb={16}>
					<CommonText fontWeight={'700'} type={'h3'}>
						보유 재화
					</CommonText>
				</SpaceView>

				<SpaceView viewStyle={styles.halfContainer} mb={16}>
					<View style={styles.halfItemLeft}>
						<View style={styles.textContainer}>
							<SpaceView mb={8}>
								<CommonText>보유 패스</CommonText>
							</SpaceView>
							<Image source={ICON.pass} style={styles.iconSize32} />
							<CommonText fontWeight={'700'} type={'h2'}>
								999,999
							</CommonText>
						</View>
					</View>
					<View style={styles.halfItemRight}>
						<View style={styles.textContainer}>
							<SpaceView mb={8}>
								<CommonText>보유 로얄패스</CommonText>
							</SpaceView>
							<Image source={ICON.royalpass} style={styles.iconSize32} />
							<CommonText fontWeight={'700'} type={'h2'}>
								1,000
							</CommonText>
						</View>
					</View>
				</SpaceView>

				<SpaceView viewStyle={[styles.purpleContainer, layoutStyle.rowBetween]} mb={48}>
					<View>
						<CommonText fontWeight={'700'} color={ColorType.white}>
							추천 패키지
						</CommonText>
						<CommonText>300 패스 + 10 로얄패스</CommonText>
					</View>
					<View style={layoutStyle.rowCenter}>
						<SpaceView viewStyle={styles.whiteCircleBox30} mr={8}>
							<CommonText
								fontWeight={'700'}
								textStyle={styles.lineHeight16}
								type={'h6'}
								color={ColorType.white}
							>
								D.C {'\n'}30%
							</CommonText>
						</SpaceView>
						<CommonText fontWeight={'700'} color={ColorType.white} type={'h4'}>
							₩9,900
						</CommonText>
					</View>
				</SpaceView>

				<SpaceView mb={48}>
					<SpaceView mb={16}>
						<CommonText fontWeight={'700'} type={'h3'}>
							패스
						</CommonText>
					</SpaceView>
					<ScrollView>
						{products.map((e, index) => {
							return <RednerProduct item={e} key={'RednerProduct' + index} />;
						})}
					</ScrollView>
					{/* <FlatList
						data={products}
						keyExtractor={(item, index) => item?.productId?.toString() + index?.toString()}
						renderItem={rednerProduct}
					/> */}
				</SpaceView>

				<SpaceView mb={48}>
					<SpaceView mb={16}>
						<CommonText fontWeight={'700'} type={'h3'}>
							로얄패스
						</CommonText>
					</SpaceView>
					<View style={styles.rowStyle}>
						<SpaceView mr={4} viewStyle={layoutStyle.rowCenter}>
							<Image source={ICON.royalpass} style={styles.iconSize32} />
							<CommonText fontWeight={'500'}>5</CommonText>
						</SpaceView>
						<View>
							<CommonText fontWeight={'700'}>₩9,900</CommonText>
						</View>
					</View>
					<View style={styles.rowStyle}>
						<SpaceView mr={4} viewStyle={layoutStyle.rowCenter}>
							<Image source={ICON.pass} style={styles.iconSize32} />
							<CommonText fontWeight={'500'}>10</CommonText>
						</SpaceView>
						<View>
							<CommonText fontWeight={'700'}>₩19,900</CommonText>
						</View>
					</View>
					<View style={styles.rowStyle}>
						<SpaceView mr={4} viewStyle={layoutStyle.rowCenter}>
							<Image source={ICON.pass} style={styles.iconSize32} />
							<CommonText fontWeight={'500'}>20</CommonText>
						</SpaceView>
						<View>
							<CommonText fontWeight={'700'}>₩39,900</CommonText>
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
