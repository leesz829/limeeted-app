import { Send } from 'api';
import properties from 'utils/properties';
import { MY_ACCOUNT } from './route';

//### 네트워크 모델 함수이름은 snake_case를 사용해주세요

//========================GET==========================
export async function some_get_functions() {
	return Send('any route', 'GET', undefined, true, false);
}
//=====================================================

//========================POST=========================

export async function get_my_info() {
	const member_seq = await properties.get_json_data('member_seq');
	const body = {
		'api-key': 'U0FNR09CX1RPS0VOXzAx',
		member_seq,
	};

	return Send(MY_ACCOUNT, 'POST', body, true, false);
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
