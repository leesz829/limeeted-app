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
	const body = {
		'api-key': 'U0FNR09CX1RPS0VOXzAx',
		kakao_id: id,
		passwordddd: password,
	};

	return Send(route.MY_ACCOUNT, 'POST', body, true, false);
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
