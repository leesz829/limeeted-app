import { StyleSheet, Dimensions } from 'react-native';
import { Color } from './Color';

const { width, height } = Dimensions.get('window');
export const styles = StyleSheet.create({
	dim: { position: 'absolute', width: '100%', height: '100%', borderRadius: 16 },
	openCloseBtn: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		height: 40,
	},
	logo: { width: 220, height: 90 },
	logoMark: { width: 80, height: 80 },
	rotate90: { transform: [{ rotate: '90deg' }] },
	rotateN90: { transform: [{ rotate: '-90deg' }] },
	rotate180: { transform: [{ rotate: '180deg' }] },
	favoriteBox: {},
	posTopRight: {
		position: 'absolute',
		top: 8,
		right: 8,
		zIndex: 1,
	},
	posBottomLeft: {
		position: 'absolute',
		bottom: 16,
		left: 16,
		zIndex: 1,
	},
	favoriteImg: {
		width: '100%',
		height: 156,
		borderRadius: 16,
	},
	whiteBack: { backgroundColor: 'white' },
	hasFloatingBtnContainer: { paddingBottom: 80, backgroundColor: 'white' },
	inputTextStyle: {
		fontFamily: 'AppleSDGothicNeoM',
		fontSize: 14,
		lineHeight: 22,
		color: Color.black2222,
	},
	inputTextStyle_type02: {
		fontFamily: 'AppleSDGothicNeoM',
		fontSize: 14,
		lineHeight: 22,
		width: width - 150,
		color: Color.white,
		flexShrink:1
	},
	bottomBtnContainer: {
		width: width - 32,
		position: 'absolute',
		left: 16,
		bottom: 16,
	},
	scrollContainer: {
		paddingTop: 24,
		paddingLeft: 16,
		paddingRight: 16,
		backgroundColor: 'white',
	},
	container: {
		paddingTop: 24,
		paddingLeft: 16,
		paddingRight: 16,
		backgroundColor: 'white',
		flex: 1,
	},
	infoContainer: {
		flexDirection: 'row',
		marginTop: 16,
		marginBottom: 24,
	},
	iconSize: {
		width: 16,
		height: 16,
	},
	iconSize24: {
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
	iconSize48: {
		width: 48,
		height: 48,
	},
	halfContainer: {
		flexDirection: 'row',
		overflow: 'visible',
		zIndex: 3,
	},
	halfItemLeft4: { flex: 1, marginRight: 4, overflow: 'visible', zIndex: 1 },
	halfItemRight4: { flex: 1, marginLeft: 4, overflow: 'visible', zIndex: 2 },
	halfItemLeft: {
		//flex: 1,
		marginRight: 8,
		overflow: 'visible',
		zIndex: 1,
		width: (width - 40) / 2
	},
	halfItemRight: {
		flex: 1,
		marginLeft: 8,
		overflow: 'visible',
		zIndex: 2,
	},
	badgeBox: {
		width: (width - 48) / 2,
		height: (width - 48) / 2,
		padding: 16,
		backgroundColor: Color.grayF8F8,
		borderRadius: 16,
	},
	rowStyle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		height: 48,
		alignItems: 'center',
	},
	dot: {
		width: 4,
		height: 4,
		borderRadius: 20,
		backgroundColor: Color.gray8888,
		marginRight: 4,
		marginTop: 12,
	},
	dotTextContainer: {
		flexDirection: 'row',
	},
	boxPlusIcon: {
		width: '50%',
		height: '50%',
	},
	tempBoxBig: {
		width: (width - 40) / 2,
		height: (width - 40) / 2,
		backgroundColor: Color.grayF8F8,
		borderRadius: 16,
		alignItems: 'center',
		justifyContent: 'center',
	},
	tempBoxMiddle: {
		width: (width - 80) / 2,
		height: (width - 80) / 2,
		backgroundColor: Color.grayF8F8,
		borderRadius: 16,
		alignItems: 'center',
		justifyContent: 'center',
	},
	tempBoxSmall: {
		width: (width - 80) / 4,
		height: (width - 72) / 4,
		backgroundColor: Color.grayF8F8,
		borderRadius: 16,
		alignItems: 'center',
		justifyContent: 'center',
	},
	interestBox: {
		width: (width - 48) / 3,
		height: 40,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: Color.grayDDDD,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 8,
	},
	boxTextActive: {
		color: Color.primary,
	},
	boxActive: {
		borderColor: Color.primary,
	},
	statusBtn: {
		borderRadius: 12,
		backgroundColor: Color.purple,
		paddingHorizontal: 8,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 2,
	},
	profileBox: {
		width: (width - 50) / 3,
		height: (width - 50) / 3,
		backgroundColor: Color.grayEEEE,
		borderRadius: 16,
		alignItems: 'center',
		justifyContent: 'center',
	},
	disabled: {
		position: 'absolute',
		left: 0,
		top: 0,
		height: '100%',
		width: '100%',
		backgroundColor: 'rgba(0,0,0,0.7)',
		borderRadius: 16,
	},
	interviewContainer: {
		paddingVertical: 40,
		paddingHorizontal: 16,
		width,
		left: -16,
		backgroundColor: Color.paleBlue,
		borderTopLeftRadius: 32,
		borderTopRightRadius: 32,
	},
	interviewLeftTextContainer: {
		padding: 16,
		backgroundColor: 'white',
		borderRadius: 16,
		borderTopLeftRadius: 0,
		maxWidth: 200,
	},
	interviewRightTextContainer: {
		padding: 16,
		backgroundColor: Color.primary,
		borderRadius: 16,
		borderTopRightRadius: 0,
		maxWidth: 300,
	},
	profileImg: {
		width: 104,
		height: 104,
		borderRadius: 52,
	},

	profileTmpImg: {
		width: 160,
		height: 160,
		borderRadius: 16,
	},

	profilePenContainer: {
		position: 'absolute',
		bottom: 0,
		right: 0,
	},
	purpleContainer: {
		backgroundColor: Color.purple,
		padding: 16,
		borderRadius: 16,
	},
	levelContainer: {
		paddingHorizontal: 8,
		paddingVertical: 2,
		backgroundColor: Color.grayF8F8,
		borderRadius: 12,
	},
	profileContainer: {
		backgroundColor: Color.grayF8F8,
		borderRadius: 16,
		padding: 24,
	},
	circleBox: {
		width: 64,
		height: 64,
		borderRadius: 32,
		backgroundColor: Color.grayEEEE,
	},
	circleBoxImg: {
		width: 64,
		height: 64,
		borderRadius: 32,
	},
	whiteCircleBox30: {
		backgroundColor: 'rgba(255,255,255,0.3)',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 100,
		paddingVertical: 4,
		paddingHorizontal: 8,
		width: 50,
		height: 50,
	},
	lineHeight16: {
		lineHeight: 16,
	},
	questionContainer: {
		backgroundColor: 'white',
		borderRadius: 16,
		borderWidth: 1,
		borderColor: Color.grayEEEE,
		paddingVertical: 16,
		paddingHorizontal: 60,
	},
	questionItemTextContainer: {
		flex: 1,
		backgroundColor: 'white',
		borderRadius: 16,
		shadowColor: 'black',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.7,
		shadowRadius: 3.84,
		elevation: 2,
		height: 52,
		justifyContent: 'center',
		paddingLeft: 16,
		paddingRight: 16,
	},
	questionIconContainer: {
		height: 52,
		justifyContent: 'center',
		width: 50,
		alignItems: 'flex-end',
	},
	searchInputContainer: {
		flex: 1,
		backgroundColor: 'white',
		borderRadius: 16,
		borderWidth: 1,
		borderColor: Color.grayEEEE,
		paddingLeft: 16,
		paddingRight: 50,
		height: 52,
		justifyContent: 'center',
	},
	searchInputIconContainer: {
		position: 'absolute',
		right: 16,
	},
	searchDeleteBtnContainer: {
		position: 'absolute',
		right: 50,
	},
	searchInput: {
		padding: 0,
		margin: 0,
		fontSize: 14,
		fontFamily: 'AppleSDGothicNeoR',
		color: Color.black2222,
	},
	textContainer: {
		padding: 24,
		alignItems: 'center',
		borderRadius: 16,
		backgroundColor: Color.grayF8F8,
	},
});

export const layoutStyle = StyleSheet.create({
	flex1: { flex: 1 },
	row: { flexDirection: 'row' },
	alignCenter: { alignItems: 'center' },
	alignStart: { alignItems: 'flex-start' },
	alignEnd: { alignItems: 'flex-end' },
	justifyCenter: { justifyContent: 'center' },
	justifyBetween: { justifyContent: 'space-between' },
	justifyStart: { justifyContent: 'flex-start' },
	justifyEnd: { justifyContent: 'flex-end' },
	selfEnd: { alignSelf: 'flex-end' },
	selfStart: { alignSelf: 'flex-start' },
	wrap: { flexWrap: 'wrap' },
	noWrap: { flexWrap: 'nowrap' },
	columCenter: { alignItems: 'center', justifyContent: 'center' },
	rowCenter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
	rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
	textCenter: { textAlign: 'center' },
	textLeft: { textAlign: 'left' },
	textRight: { textAlign: 'right' },
	lineFontGray: { textDecorationLine: 'underline' },
	mb10: { marginBottom: 10},
	mb20: { marginBottom: 20}
});

export const modalStyle = StyleSheet.create({
	modalHandleStyle: {
		display: 'none',
	},
	modalContainer: {
		paddingTop: 16,
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
	},
	modalHeaderContainer: {
		height: 56,
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 24,
		paddingLeft: 16,
		paddingRight: 16,
		alignItems: 'center',
	},
	modalBody: {
		paddingLeft: 16,
		paddingRight: 16,
		zIndex: 10,
	},
	modalBackground: {
		height,
		backgroundColor: 'rgba(0,0,0,0.7)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	modalStyle1: {
		width: width - 32,
		backgroundColor: 'white',
		borderRadius: 16,
		height: 186,
		paddingTop: 32,
		paddingLeft: 16,
		paddingRight: 16,
	},
	modalBtnContainer: {
		width: width - 32,
		position: 'absolute',
		bottom: 0,
		borderTopWidth: 1,
		borderTopColor: Color.grayEEEE,
		flexDirection: 'row',
		justifyContent: 'space-between',
		left: 0,
	},
	modalBtn: {
		flex: 1,
		alignItems: 'center',
		paddingTop: 16,
		paddingBottom: 16,
	},
	modalBtnline: {
		borderRightWidth: 1,
		borderRightColor: Color.grayEEEE,
	},
	textContainer: {
		padding: 24,
		alignItems: 'center',
		borderRadius: 16,
		backgroundColor: Color.grayF8F8,
	},
});
