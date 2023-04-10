interface InterviewProps {
  answer: string;
  member_interview_seq: number;
  code_name: string;
  common_code: string;
}
interface secondaryAuthenticationProps {
  file_seq: number;
  img_file_path: string;
  member_auth_seq: number;
  second_auth_code: string;
  file_gubun: string;
  member_seq: number;
  status: string;
}
interface ImageProps {
  order_seq: number;
  file_seq: number;
  img_file_path: string;
  member_img_seq: number;
  use_yn: string;
  member_seq: number;
  status: string;
}
interface TokenProps {
  expire_date: string;
  jwt_token: string;
}
interface IdealProps {
  want_age_max: string;
  want_person3: string;
  want_person2: string;
  want_person1: string;
  use_yn: string;
  want_job3: string;
  want_job2: string;
  want_business1: string;
  want_business2: string;
  want_local1: string;
  want_business3: string;
  member_seq: number;
  want_job1: string;
  want_local2: string;
  want_age_min: string;
  ideal_type_seq: number;
}
interface BaseProps {
  friend_match_yn: string;
  gender: string;
  profile_tier: string;
  mst_img_path: string;
  smoking: string;
  nickname: string;
  profile_score: number;
  height: string;
  introduce_comment: string;
  drinking: string;
  business: string;
  form_body: string;
  kakao_id: string;
  member_seq: number;
  religion: string;
  member_level: number;
  job_name: string;
  name: string;
  comment: string;
  phone_number: string;
  join_dt: string;
  job: string;
  match_yn: string;
  join_status: string;
  age: string;
  status: string;
}
export interface PrincipalProps {
  mbr_img_list: ImageProps[];
  mbr_second_auth_list: secondaryAuthenticationProps[];
  mbr_base: BaseProps;
  mbr_ideal_type: IdealProps;
  mbr_interview_list: InterviewProps[];

  // match_trgt_list: any;
  // res_like_list: any[];
}
