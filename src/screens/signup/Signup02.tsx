import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import { layoutStyle, styles } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import CommonHeader from 'component/CommonHeader';
import { CommonText } from 'component/CommonText';
import { ImagePicker } from 'component/ImagePicker';
import SpaceView from 'component/SpaceView';
import * as React from 'react';
import { View, ScrollView, Image } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import RNFetchBlob from 'rn-fetch-blob';
import { ICON, PROFILE_IMAGE } from 'utils/imageUtils';
import axios from 'axios';
import { Value } from 'react-native-reanimated';

/* ################################################################################################################
###################################################################################################################
###### 근사한 프로필 만들기
###################################################################################################################
################################################################################################################ */

interface Props {
	navigation : StackNavigationProp<StackParamList, 'Signup02'>;
	route : RouteProp<StackParamList, 'Signup02'>;
}


export const Signup02 = (props : Props) => {
	const navigation = useNavigation<ScreenNavigationProp>();

	const imgFileData01 = { uri : "", fileName : "", type : "" }
	const imgFileData02 = { uri : "", fileName : "", type : "" }
	const imgFileData03 = { uri : "", fileName : "", type : "" }
	const imgFileData04 = { uri : "", fileName : "", type : "" }
	const imgFileData05 = { uri : "", fileName : "", type : "" }

	const imgFileJson = {
		uri : "",
		fileName : "",
		type : ""
	}

	const fileCallBack1 = (uri:string, fileName:string, fileSize: number, type: string) => {
		imgFileData01.uri = uri; imgFileData01.fileName = fileName;	imgFileData01.type = type;

		/* imgFileJson.uri = uri;
		imgFileJson.fileName = fileName;
		imgFileJson.type = type;

		console.log("???? ::: " + Object.values(imgFileJson)[1]); */
	};

	const fileCallBack2 = (uri:string, fileName:string, fileSize: number, type: string) => {
		imgFileData02.uri = uri; imgFileData02.fileName = fileName;	imgFileData02.type = type;
	};

	const fileCallBack3 = (uri:string, fileName:string, fileSize: number, type: string) => {
		imgFileData03.uri = uri; imgFileData03.fileName = fileName;	imgFileData03.type = type;
	};

	const fileCallBack4 = (uri:string, fileName:string, fileSize: number, type: string) => {
		imgFileData04.uri = uri; imgFileData04.fileName = fileName;	imgFileData04.type = type;
	};

	const fileCallBack5 = (uri:string, fileName:string, fileSize: number, type: string) => {
		imgFileData05.uri = uri; imgFileData05.fileName = fileName;	imgFileData05.type = type;
	};

	return (
		<>
			<CommonHeader title={'근사한 프로필 만들기'} />
			<ScrollView contentContainerStyle={[styles.scrollContainer]}>
				<SpaceView mb={24}>
					<CommonText fontWeight={'500'}>
						다양한 분위기의 내 모습이 담긴 사진을{'\n'}
						등록해보세요.
					</CommonText>
				</SpaceView>

				<SpaceView mb={48} viewStyle={styles.halfContainer}>
					<View style={styles.halfItemLeft}>
						<ImagePicker isBig={true} callbackFn={fileCallBack1} />
					</View>

					<View style={styles.halfItemRight}>
						<SpaceView mb={16} viewStyle={layoutStyle.row}>
							<SpaceView mr={8}>
								<ImagePicker isBig={false} callbackFn={fileCallBack2} />
							</SpaceView>
							<SpaceView ml={8}>
								<ImagePicker isBig={false} callbackFn={fileCallBack2} />
							</SpaceView>
						</SpaceView>

						<SpaceView viewStyle={layoutStyle.row}>
							<SpaceView mr={8}>
								<ImagePicker isBig={false} callbackFn={fileCallBack2} />
							</SpaceView>
							<SpaceView ml={8}>
								<ImagePicker isBig={false} callbackFn={fileCallBack2} />
							</SpaceView>
						</SpaceView>
					</View>
				</SpaceView>

				<SpaceView mb={24}>
					<SpaceView mb={8}>
						<CommonText fontWeight={'500'}>어떤 사진을 올려야 할까요?</CommonText>
					</SpaceView>
					<CommonText color={ColorType.gray6666}>
						얼굴이 선명히 나오는 사진은 최소 1장 필수에요.{'\n'}
						멋진 무드 속에 담긴 모습이 좋아요.
					</CommonText>
				</SpaceView>

				<SpaceView mb={40}>
					<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
						<SpaceView mr={16}>
							<View style={styles.tempBoxMiddle}>
								<Image source={PROFILE_IMAGE.maleTmp1} style={styles.profileTmpImg} />
							</View>
						</SpaceView>
						<SpaceView mr={16}>
							<View style={styles.tempBoxMiddle}>
								<Image source={PROFILE_IMAGE.maleTmp2} style={styles.profileTmpImg} />
							</View>
						</SpaceView>
						<SpaceView mr={16}>
							<View style={styles.tempBoxMiddle}>
								<Image source={PROFILE_IMAGE.maleTmp3} style={styles.profileTmpImg} />
							</View>
						</SpaceView>
						<SpaceView mr={16}>
							<View style={styles.tempBoxMiddle}>
								<Image source={PROFILE_IMAGE.maleTmp4} style={styles.profileTmpImg} />
							</View>
						</SpaceView>
						<SpaceView mr={16}>
							<View style={styles.tempBoxMiddle}>
								<Image source={PROFILE_IMAGE.maleTmp5} style={styles.profileTmpImg} />
							</View>
						</SpaceView>
						<SpaceView mr={16}>
							<View style={styles.tempBoxMiddle}>
								<Image source={PROFILE_IMAGE.maleTmp6} style={styles.profileTmpImg} />
							</View>
						</SpaceView>
					</ScrollView>
				</SpaceView>

				<SpaceView mb={24}>
					<CommonBtn value={'다음 (3/4)'} 
								type={'primary'}
								onPress={() => {

									const data = new FormData();

									const file01 = { uri: imgFileData01.uri, type: imgFileData01.type, name: imgFileData01.fileName };
									const file02 = { uri: imgFileData02.uri, type: imgFileData02.type, name: imgFileData02.fileName };
									const file03 = { uri: imgFileData03.uri, type: imgFileData03.type, name: imgFileData03.fileName };
									const file04 = { uri: imgFileData04.uri, type: imgFileData04.type, name: imgFileData04.fileName };
									const file05 = { uri: imgFileData05.uri, type: imgFileData05.type, name: imgFileData05.fileName };

									data.append("memberSeq", props.route.params.memberSeq);
									if(imgFileData01.uri != "" && typeof imgFileData01.uri != "undefined") {	data.append("file01", file01); }
									if(imgFileData02.uri != "" && typeof imgFileData02.uri != "undefined") {	data.append("file02", file02); }
									if(imgFileData03.uri != "" && typeof imgFileData03.uri != "undefined") {	data.append("file03", file03); }
									if(imgFileData04.uri != "" && typeof imgFileData04.uri != "undefined") {	data.append("file04", file04); }
									if(imgFileData05.uri != "" && typeof imgFileData05.uri != "undefined") {	data.append("file05", file05); }

									console.log(data);

									fetch('http://211.104.55.151:8080/member/insertMemberProfile/', {
										method: 'POST',
										body: data,
									})
									.then((response) => response.json())
									.then((response) => {
										console.log('response :::: ', response);

										if(response.result_code == "0000") {
											navigation.navigate('Signup03', {
												memberSeq : props.route.params.memberSeq
											});
										}
									})
									.catch((error) => {
										console.log('error', error);
									});

								}} 
					/>
				</SpaceView>
			</ScrollView>
		</>
	);
};
