import { Image, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import * as React from 'react';
import { IMAGE, START_IMAGE } from 'utils/imageUtils';
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp } from '@types';
import { Color } from 'assets/styles/Color';

const { width } = Dimensions.get('window');
const Startpage = () => {
	const navigation = useNavigation<ScreenNavigationProp>();

	return (
		<ScrollView contentContainerStyle={style.container}>
			<TouchableOpacity style={style.pages} onPress={() => navigation.navigate('Component')}>
				<Image style={style.pageImg} source={IMAGE.common} resizeMode={'contain'} />
				<Text style={style.title}>공용 컴포넌트</Text>
			</TouchableOpacity>
			<TouchableOpacity style={style.pages} onPress={() => navigation.navigate('Title00')}>
				<Image style={style.pageImg} source={START_IMAGE.view1} resizeMode={'contain'} />
				<Text style={style.title}>TITLE_00</Text>
			</TouchableOpacity>
			<TouchableOpacity style={style.pages} onPress={() => navigation.navigate('Signup00')}>
				<Image style={style.pageImg} source={START_IMAGE.view2} resizeMode={'contain'} />
				<Text style={style.title}>signUP_00</Text>
			</TouchableOpacity>
			<TouchableOpacity style={style.pages} onPress={() => navigation.navigate('Signup01')}>
				<Image style={style.pageImg} source={START_IMAGE.view3} resizeMode={'contain'} />
				<Text style={style.title}>signUP_01</Text>
			</TouchableOpacity>
			<TouchableOpacity style={style.pages} onPress={() => navigation.navigate('SignupPopUp')}>
				<Image style={style.pageImg} source={START_IMAGE.view4} resizeMode={'contain'} />
				<Text style={style.title}>PopUp_00</Text>
			</TouchableOpacity>
			<TouchableOpacity style={style.pages} onPress={() => navigation.navigate('Signup02')}>
				<Image style={style.pageImg} source={START_IMAGE.view5} resizeMode={'contain'} />
				<Text style={style.title}>signUP_02</Text>
			</TouchableOpacity>
			<TouchableOpacity style={style.pages} onPress={() => navigation.navigate('Signup03')}>
				<Image style={style.pageImg} source={START_IMAGE.view6} resizeMode={'contain'} />
				<Text style={style.title}>signUP_03</Text>
			</TouchableOpacity>
			<TouchableOpacity style={style.pages} onPress={() => navigation.navigate('SignupPopUp2')}>
				<Image style={style.pageImg} source={START_IMAGE.view7} resizeMode={'contain'} />
				<Text style={style.title}>관심사등록</Text>
			</TouchableOpacity>
			<TouchableOpacity style={style.pages} onPress={() => navigation.navigate('Approval')}>
				<Image style={style.pageImg} source={START_IMAGE.view8} resizeMode={'contain'} />
				<Text style={style.title}>signUP_Approval</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={style.pages}
				onPress={() => navigation.navigate('Main', { screen: 'Matching' })}
			>
				<Image style={style.pageImg} source={START_IMAGE.view9} resizeMode={'contain'} />
				<Text style={style.title}>MATCHING_00</Text>
			</TouchableOpacity>
			<TouchableOpacity style={style.pages} onPress={() => navigation.navigate('CommonPopup')}>
				<Image style={style.pageImg} source={START_IMAGE.view10} resizeMode={'contain'} />
				<Text style={style.title}>POPUP_00_찐심</Text>
			</TouchableOpacity>
			<TouchableOpacity style={style.pages} onPress={() => navigation.navigate('CommonPopup')}>
				<Image style={style.pageImg} source={START_IMAGE.view11} resizeMode={'contain'} />
				<Text style={style.title}>POPUP_00_신고</Text>
			</TouchableOpacity>
			<TouchableOpacity style={style.pages} onPress={() => navigation.navigate('ReportPopup')}>
				<Image style={style.pageImg} source={START_IMAGE.view12} resizeMode={'contain'} />
				<Text style={style.title}>REPORT_00</Text>
			</TouchableOpacity>
			<TouchableOpacity style={style.pages} onPress={() => navigation.navigate('LivePopup')}>
				<Image style={style.pageImg} source={START_IMAGE.view13} resizeMode={'contain'} />
				<Text style={style.title}>LivePopup</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={style.pages}
				onPress={() => {
					navigation.navigate('Main', { screen: 'Live' });
				}}
			>
				<Image style={style.pageImg} source={START_IMAGE.view14} resizeMode={'contain'} />
				<Text style={style.title}>LIVE_00</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={style.pages}
				onPress={() => {
					navigation.navigate('Main', { screen: 'LiveSearch' });
				}}
			>
				<Image style={style.pageImg} source={START_IMAGE.view15} resizeMode={'contain'} />
				<Text style={style.title}>LIVE_01</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={style.pages}
				onPress={() => {
					navigation.navigate('Main', { screen: 'Roby' });
				}}
			>
				<Image style={style.pageImg} source={START_IMAGE.view16} resizeMode={'contain'} />
				<Text style={style.title}>Robby</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={style.pages}
				onPress={() => {
					navigation.navigate('Introduce');
				}}
			>
				<Image style={style.pageImg} source={START_IMAGE.view17} resizeMode={'contain'} />
				<Text style={style.title}>INTRODUCE</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={style.pages}
				onPress={() => {
					navigation.navigate('Board0');
				}}
			>
				<Image style={style.pageImg} source={START_IMAGE.view18} resizeMode={'contain'} />
				<Text style={style.title}>BOARD_00</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={style.pages}
				onPress={() => {
					navigation.navigate('Preference');
				}}
			>
				<Image style={style.pageImg} source={START_IMAGE.view19} resizeMode={'contain'} />
				<Text style={style.title}>PREFERENCE</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={style.pages}
				onPress={() => {
					navigation.navigate('Profile');
				}}
			>
				<Image style={style.pageImg} source={START_IMAGE.view20} resizeMode={'contain'} />
				<Text style={style.title}>Profile</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={style.pages}
				onPress={() => {
					navigation.navigate('Board1');
				}}
			>
				<Image style={style.pageImg} source={START_IMAGE.view21} resizeMode={'contain'} />
				<Text style={style.title}>BOARD_01</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={style.pages}
				onPress={() => {
					navigation.navigate('Main', { screen: 'Profile1' });
				}}
			>
				<Image style={style.pageImg} source={START_IMAGE.view22} resizeMode={'contain'} />
				<Text style={style.title}>Profile1</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={style.pages}
				onPress={() => {
					navigation.navigate('Main', { screen: 'Profile2' });
				}}
			>
				<Image style={style.pageImg} source={START_IMAGE.view23} resizeMode={'contain'} />
				<Text style={style.title}>PROFILE_02</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={style.pages}
				onPress={() => {
					navigation.navigate('Main', { screen: 'Storage' });
				}}
			>
				<Image style={style.pageImg} source={START_IMAGE.view24} resizeMode={'contain'} />
				<Text style={style.title}>PROFILE_02</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={style.pages}
				onPress={() => {
					navigation.navigate('Main', { screen: 'StorageProfile' });
				}}
			>
				<Image style={style.pageImg} source={START_IMAGE.view25} resizeMode={'contain'} />
				<Text style={style.title}>STORAGE_PROFILE</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={style.pages}
				onPress={() => {
					navigation.navigate('Main', { screen: 'Shop' });
				}}
			>
				<Image style={style.pageImg} source={START_IMAGE.view26} resizeMode={'contain'} />
				<Text style={style.title}>SHOP</Text>
			</TouchableOpacity>
		</ScrollView>
	);
};

export default Startpage;

const style = StyleSheet.create({
	container: {
		padding: 20,
		flexDirection: 'row',
		flexWrap: 'wrap',
		backgroundColor: 'white',
	},
	pages: {
		width: (width - 40) / 3,
		marginBottom: 50,
	},
	pageImg: {
		width: (width - 120) / 3,
		height: 230,
		borderWidth: 1,
		borderColor: 'gray',
	},
	title: {
		fontSize: 12,
		fontFamily: 'AppleSDGothicNeoM00',
		color: Color.black2222,
	},
});
