import { Send } from 'api';
import { MY_ACCOUNT } from './route';

//### 네트워크 모델 함수이름은 snake_case를 사용해주세요
export function get_my_info() {
	return Send(MY_ACCOUNT, 'GET', undefined, true, false);
}
