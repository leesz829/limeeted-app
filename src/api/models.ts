import AsyncStorage from '@react-native-community/async-storage';
import { Send } from 'api';
import properties from 'utils/properties';
import * as route from './route';

//### 네트워크 모델 함수이름은 snake_case를 사용해주세요

//========================GET==========================
export async function some_get_functions() {
	return Send('any route', 'GET', undefined, true, false);
}
//=====================================================

//========================POST=========================

/* 로그인 체크 */
export async function get_login_chk(id: string, password: string) {
	//const member_seq = await properties.get_json_data('member_seq');
	const push_token = await AsyncStorage.getItem('FCM_TOKEN');
	const body = {
		'api-key': 'U0FNR09CX1RPS0VOXzAx',
		email_id: id,
		password: password,
		push_token: push_token,
	};

	return Send(route.LOGIN, 'POST', body, true, false);
}
export async function signup_with_social(type: string, msg: any) {
	//const member_seq = await properties.get_json_data('member_seq');
	const push_token = await AsyncStorage.getItem('FCM_TOKEN');
	const body = {
		'api-key': 'U0FNR09CX1RPS0VOXzAx',
		push_token: push_token,
		msg,
		type,
	};

	return Send(route.LOGIN, 'POST', body, true, false);
}

export async function purchase_product(
	device_gubun: any
	, buy_price: any
	, item_name: any
	, item_code: any
	, result_msg: any
	, result_code: any
	, receiptData: any
) {

	const receiptDataJson = JSON.parse(receiptData);

	const body = {
		'api-key': 'U0FNR09CX1RPS0VOXzAx'
		, device_gubun: device_gubun
		, buy_price: buy_price
		, item_name: item_name
		, item_code: item_code
		, result_msg: JSON.stringify(result_msg)
		, result_code: result_code
		, acknowledged: receiptDataJson.acknowledged
		, package_name: receiptDataJson.packageName
		, product_id: receiptDataJson.productId
		, purchase_state: receiptDataJson.purchaseState
		, purchase_time: receiptDataJson.purchaseTime
		, purchase_token: receiptDataJson.purchaseToken
		, quantity: receiptDataJson.quantity
	}

	return Send(route.PURCHASE, 'POST', body, true, false);
}

export async function get_my_info() {
	const member_seq = await properties.get_json_data('member_seq');
	const body = {
		'api-key': 'U0FNR09CX1RPS0VOXzAx',
		member_seq,
	};

	return Send(route.MY_ACCOUNT, 'POST', body, true, false);
}

//=====================================================

//========================PUT=======================
export async function some_update_functions() {
	return Send('any route', 'PUT', undefined, true, false);
}
//=====================================================

//========================DELETE=======================
export async function some_delete_functions() {
	return Send('any route', 'DELETE', undefined, true, false);
}
//=====================================================
