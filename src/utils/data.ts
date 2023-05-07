import AsyncStorage from '@react-native-community/async-storage';
import * as properties from 'utils/properties';
import { findSourcePath } from 'utils/imageUtils';

// 보관함 전달 데이터 구성
export const getStorageListData = (
   list: [
      {
         match_seq: any;
         req_member_seq: any;
         res_member_seq: any;
         img_file_path: any;
         int_after_day: any;
         special_interest_yn: any;
         req_profile_open_yn: any;
         res_profile_open_yn: any;
         nickname: any;
         age: any;
         height: any;
         job_name: any;
         member_status: any;
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
         img_file_path,
         int_after_day,
         special_interest_yn,
         req_profile_open_yn,
         res_profile_open_yn,
         nickname,
         age,
         height,
         job_name,
         member_status,
      }: {
         match_seq: any;
         req_member_seq: any;
         res_member_seq: any;
         img_file_path: any;
         int_after_day: any;
         special_interest_yn: any;
         req_profile_open_yn: any;
         res_profile_open_yn: any;
         nickname: any;
         age: any;
         height: any;
         job_name: any;
         member_status: any;
      }) => {
         const img_path = findSourcePath(img_file_path);

         console.log('img_path ::::::: ' , img_path);

         const dataJson = { 
            match_seq: '', 
            req_member_seq: '', 
            res_member_seq: '', 
            img_path: '', 
            dday: 0, 
            special_interest_yn: '', 
            req_profile_open_yn: '', 
            res_profile_open_yn: '',
            nickname: '',
            age: '',
            height: '',
            job_name: '',
            member_status: '',
         };
         const dday_mod = 7 - Number(int_after_day);

         dataJson.match_seq = match_seq;
         dataJson.req_member_seq = req_member_seq;
         dataJson.res_member_seq = res_member_seq;
         dataJson.img_path = img_path;
         dataJson.dday = dday_mod;
         dataJson.special_interest_yn = special_interest_yn;
         dataJson.req_profile_open_yn = req_profile_open_yn;
         dataJson.res_profile_open_yn = res_profile_open_yn;
         dataJson.nickname = nickname;
         dataJson.age = age;
         dataJson.height = height;
         dataJson.job_name = job_name;
         dataJson.member_status = member_status;

         dataList.push(dataJson);
         hNum++;

         /* let chk = false;
         if (dataList.length == 2) {
            chk = true;
            arrayList.push(dataList);
            dataList = new Array();
         }

         if (!chk && hNum == list.length) {
            arrayList.push(dataList);
         } */
      },
   );

   return dataList;
};