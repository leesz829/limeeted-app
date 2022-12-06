import AsyncStorage from '@react-native-community/async-storage';
import * as properties from 'utils/properties';

// 보관함 전달 데이터 구성
export const getStorageListData = (
	list: [
		{
			match_seq: any;
			req_member_seq: any;
			res_member_seq: any;
			file_name: any;
			file_path: any;
			int_after_day: any;
			special_interest_yn: any;
		},
	],
) => {
	let arrayList = new Array();
	let dataList = new Array();
	let hNum = 0;
	list.map(
		({
			match_seq,
			req_member_seq,
			res_member_seq,
			file_name,
			file_path,
			int_after_day,
			special_interest_yn,
		}: {
			match_seq: any;
			req_member_seq: any;
			res_member_seq: any;
			file_name: any;
			file_path: any;
			int_after_day: any;
			special_interest_yn: any;
		}) => {
			const img_path = properties.api_domain + '/uploads' + file_path + file_name;
			const dataJson = { match_seq: '', req_member_seq: '', res_member_seq: '', img_path: '', dday: 0, special_interest_yn: '' };
			const dday_mod = 7 - Number(int_after_day);

			dataJson.match_seq = match_seq;
			dataJson.req_member_seq = req_member_seq;
			dataJson.res_member_seq = res_member_seq;
			dataJson.img_path = img_path;
			dataJson.dday = dday_mod;
			dataJson.special_interest_yn = special_interest_yn;

			dataList.push(dataJson);
			hNum++;

			let chk = false;
			if (dataList.length == 2) {
				chk = true;
				arrayList.push(dataList);
				dataList = new Array();
			}

			if (!chk && hNum == list.length) {
				arrayList.push(dataList);
			}
		},
	);

	return arrayList;
};
