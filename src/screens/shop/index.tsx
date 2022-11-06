import * as React from 'react';
import { Image, ScrollView, View, Platform, Alert } from 'react-native';
import TopNavigation from 'component/TopNavigation';
import { ICON } from 'utils/imageUtils';
import { layoutStyle, styles } from 'assets/styles/Styles';
import SpaceView from 'component/SpaceView';
import { CommonText } from 'component/CommonText';
import { ColorType } from '@types';
import * as RNIap from 'react-native-iap';

export const Shop = () => {
	let purchaseUpdateSubscription: any;
	let purchaseErrorSubscription: any;
	const [loading, setLoading] = React.useState(false);

	// 결제 요청후 리스폰스를 받을 리스너
	function useShoppingState() {
		const connection = async () => {
			try {
				const init = await RNIap.initConnection();
				const initCompleted = init === true;

				if (initCompleted) {
					if (Platform.OS === 'android') {
						await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
					} else {
						await RNIap.clearTransactionIOS();
					}
				}

				// success listener
				purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
					async (purchase: RNIap.ProductPurchase | RNIap.SubscriptionPurchase) => {
						const receipt = purchase.transactionReceipt
							? purchase.transactionReceipt
							: purchase.purchaseToken;
						// type 오류 방지용 변수, 초기값 세팅 필요시 사용
						const productPurchase: any = null;

						if (receipt) {
							try {
								setLoading(false);
								const ackResult = await RNIap.finishTransaction(
									purchase ? purchase : productPurchase,
								);

								// 구매이력 저장 및 상태 갱신
								if (purchase) {
								}
							} catch (error) {
								console.log('ackError: ', error);
							}
						}
					},
				);

				purchaseErrorSubscription = RNIap.purchaseErrorListener((error: RNIap.PurchaseError) => {
					setLoading(false);

					// 정상적인 에러상황 대응
					if (error && error.code == RNIap.ErrorCode.E_USER_CANCELLED) {
						Alert.alert('구매 취소', '구매를 취소하셨습니다.');
					} else {
						Alert.alert('구매 실패', '구매 중 오류가 발생하였습니다.');
					}
				});
			} catch (error) {
				console.log('connection error: ', error);
			}
		};

		connection();

		return () => {
			if (purchaseUpdateSubscription) {
				purchaseUpdateSubscription.remove();
				purchaseUpdateSubscription = null;
			}

			if (purchaseErrorSubscription) {
				purchaseErrorSubscription.remove();
				purchaseErrorSubscription = null;
			}

			RNIap.endConnection();
		};
	}

	// 구독상품용 변수
	const itemSubs: any = Platform.select({
		ios: ['cash_100'],
		android: ['cash_100'],
	});

	// 단일 상품용 변수
	const itemSkus: any = Platform.select({
		ios: ['cash_100'],
		android: ['cash_100'],
	});

	const getItems = async () => {
		try {
			console.log('1');
			await RNIap.initConnection();
			console.log('2');
			const items = await RNIap.getProducts(itemSkus);
			// const items = await RNIap.getProducts(itemSkus);
			// const items = await RNIap.getProducts(itemSkus);
			// items 저장
			Alert.alert('test data .... ' + items);
		} catch (error) {
			Alert.alert('test data error .... ' + error);
			console.log('get item error: ', error);
		}
	};

	React.useEffect(() => {
		console.log(4);
		getItems();
		console.log(5);
	}, []);

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
					<View style={styles.rowStyle}>
						<SpaceView mr={4} viewStyle={layoutStyle.rowCenter}>
							<Image source={ICON.pass} style={styles.iconSize32} />
							<CommonText fontWeight={'500'}>10</CommonText>
						</SpaceView>
						<View>
							<CommonText fontWeight={'700'}>₩100</CommonText>
						</View>
					</View>
					<View style={styles.rowStyle}>
						<SpaceView mr={4} viewStyle={layoutStyle.rowCenter}>
							<Image source={ICON.pass} style={styles.iconSize32} />
							<CommonText fontWeight={'500'}>30</CommonText>
						</SpaceView>
						<View>
							<CommonText fontWeight={'700'}>₩19,900</CommonText>
						</View>
					</View>
					<View style={styles.rowStyle}>
						<SpaceView mr={4} viewStyle={layoutStyle.rowCenter}>
							<Image source={ICON.pass} style={styles.iconSize32} />
							<CommonText fontWeight={'500'}>70(+10)</CommonText>
						</SpaceView>
						<View>
							<CommonText fontWeight={'700'}>₩39,900</CommonText>
						</View>
					</View>
					<View style={styles.rowStyle}>
						<SpaceView mr={4} viewStyle={layoutStyle.rowCenter}>
							<Image source={ICON.pass} style={styles.iconSize32} />
							<CommonText fontWeight={'500'}>120(+20)</CommonText>
						</SpaceView>
						<View>
							<CommonText fontWeight={'700'}>₩79,900</CommonText>
						</View>
					</View>
					<View style={styles.rowStyle}>
						<SpaceView mr={4} viewStyle={layoutStyle.rowCenter}>
							<Image source={ICON.pass} style={styles.iconSize32} />
							<CommonText fontWeight={'500'}>200(+50)</CommonText>
						</SpaceView>
						<View>
							<CommonText fontWeight={'700'}>₩149,900</CommonText>
						</View>
					</View>
					<View style={styles.rowStyle}>
						<SpaceView mr={4} viewStyle={layoutStyle.rowCenter}>
							<Image source={ICON.pass} style={styles.iconSize32} />
							<CommonText fontWeight={'500'}>500(+100)</CommonText>
						</SpaceView>
						<View>
							<CommonText fontWeight={'700'}>₩299,900</CommonText>
						</View>
					</View>
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
