import React, { useRef } from 'react';
import type { FC, useState, useEffect } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import CommonHeader from 'component/CommonHeader';
import { layoutStyle, modalStyle, styles } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import { ICON } from 'utils/imageUtils';
import { CommonInput } from 'component/CommonInput';
import SpaceView from 'component/SpaceView';
import { CommonBtn } from 'component/CommonBtn';
import { ColorType } from '@types';
import { ImagePicker } from 'component/ImagePicker';

/* ################################################################################################################
###################################################################################################################
###### 2차 인증 팝업
###### 1. type
###### - JOB : 직업
###### - EDU : 학위
###### - INCOME : 소득
###### - ASSET : 자산
###### - SNS : SNS
###### - VEHICE : 차량
###################################################################################################################
################################################################################################################ */

interface Props {
	type: string;
	onCloseFn: () => void;
	callbackFn: (
			uri:string
			, fileName:string
			, fileSize: number
			, type: string
			, item: string
	) => void;
	orgFileUrl: string;
	itemTxt: string;
}

export const SecondAuthPopup : FC<Props> = (props) => {
	const type = props.type;
	let title = "";
	let itemNm = "";
	let placeholderTxt = "";
	let etcTxt01 = "";
	let etcTxt02 = "";

	const fileInfo = { uri : "", fileName : "", fileSize : 0, type : "" }
	const [item, setItem] = React.useState(props.itemTxt);

	if(type == "JOB") {
		title = "직업";
		itemNm = "직업";
		placeholderTxt = "직업을 입력해주세요. (예 : 삼성전자 마케팅)";
		etcTxt01 = "자신의 커리어를 증명할 수 있는 명함 또는 증명서를 올려주세요.";
		etcTxt02 = "허용 증명서 : 재직 증명서, 건강보헝 자격 득실 증명서, 직업 라이선스";
	} else if(type == "EDU") {
		title = "학업";
		itemNm = "교육기관";
		placeholderTxt = "출신 교육기관을 입력해주세요. (예 : 서울대 컴퓨터 공학과)";
		etcTxt01 = "자신의 출식 대학교 또는 대학원 등의 재학증명서 또는 졸업 증명서 등을 올려주세요.";
		etcTxt02 = "그외의 고등 교육기관의 경우는 관리자의 주관적 판단에 의해 결정될 수 있으니 참고바랍니다.";
	} else if(type == "INCOME") {
		title = "소득";
		etcTxt01 = "가장 최근의 급여 명세서를 올려주세요.";
		etcTxt02 = "직업 인증과 이름이 다를 경우 관리자의 판단에 따라 반려될 수 있으니 참고해주세요.";
	} else if(type == "ASSET") {
		title = "자산";
		etcTxt01 = "은행에서 발급 받을 수 있는 잔고 증명서를 올려주세요. 잔고가 5억 이상인 경우 프로필 2차 인증을 승인 받을 수 있습니다.";
	} else if(type == "SNS") {
		title = "SNS";
		itemNm = "인스타ID";
		placeholderTxt = "인스타그램 ID를 입력해주세요.";
		etcTxt01 = "자신의 인스타 계정을 연동시켜주세요. 팔로워 수 10000명 이상이 되면 프로필 2차 인증이 승인됩니다.";
		etcTxt02 = "ID를 정확히 입력해주셔야 인증 승인이 가능합니다.";
	} else if(type == "VEHICLE") {
		title = "차량";
		itemNm = "모델명";
		placeholderTxt = "소유중인 차량 모델을 입력해주세요. (예 : 제네시스 G80)";
		etcTxt01 = "소유차량을 증명할 수 있는 차량 등록등 또는 자동차 보험 가입 현황을 올려주세요.";
	}

	const imgCallBackFn = ( uri:string, fileName:string, fileSize: number, type: string) => {
		fileInfo.uri = uri; fileInfo.fileName = fileName; fileInfo.fileSize = fileSize;	fileInfo.type = type;
	};

	return (
		<View style={layoutStyle.flex1}>
			
			<View style={modalStyle.modalHeaderContainer}>
				<CommonText fontWeight={'700'} type={'h3'}>
					{title} 인증
				</CommonText>
				<TouchableOpacity onPress={props.onCloseFn}>
					<Image source={ICON.xBtn} style={styles.iconSize24} />
				</TouchableOpacity>
			</View>

			<View style={modalStyle.modalBody}>

				{itemNm != "" ? (
					<View>
						<SpaceView mb={32}>
							<CommonInput label={itemNm} 
											placeholder={placeholderTxt} 
											onChangeText={item => setItem(item)}
											value={item} />
						</SpaceView>
					</View>
				) : null}

				<SpaceView mb={24}>
					<SpaceView mb={16}>
						<View style={styles.dotTextContainer}>
							<View style={styles.dot} />
							<CommonText color={ColorType.gray6666}>
								{etcTxt01}
							</CommonText>
						</View>
					</SpaceView>

					{etcTxt02 != "" ? (
						<SpaceView>
							<View style={styles.dotTextContainer}>
								<View style={styles.dot} />
								<CommonText color={ColorType.gray6666}>
									{etcTxt02}
								</CommonText>
							</View>
						</SpaceView>
					) : null}

				</SpaceView>

				{/* <SpaceView mb={24}>
					<CommonBtn value={'등록 및 수정'} height={48} type={'white'} icon={ICON.plus} />
				</SpaceView> */}

				<SpaceView mb={24} viewStyle={layoutStyle.alignCenter}>
					<ImagePicker isBig={true} callbackFn={imgCallBackFn} uriParam={props.orgFileUrl} />
				</SpaceView>

				<SpaceView mb={16}>
					<CommonBtn value={'확인'} 
							   type={'primary'}
							   	onPress={() => {
									if("" != fileInfo.uri || "" != item) {
										props.callbackFn(
												fileInfo.uri
												, fileInfo.fileName
												, fileInfo.fileSize
												, fileInfo.type
												, item
										);
									};

									props.onCloseFn();

							   	}}  />
				</SpaceView>
			</View>
		</View>


	);
};
