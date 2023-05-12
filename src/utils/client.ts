import axios from 'axios';
import { api_domain } from './properties';

// axios 인스턴스 생성
const YahooClient = axios.create({
  baseURL: api_domain,
  // timeout: 1000,
  headers: {
    // 커스텀헤더를 넣으면 오류남. 커스텀헤더에는 ' 가 생김.
    Accept: 'application/json',
    useQueryString: 'true',
  },
});

// 요청 인티셉터 (요청 전에 가로채서 axios 설정을 적용함)
YahooClient.interceptors.request.use(
  function (config) {
    let params = 'no params and body';
    if (config?.data) params = JSON.stringify(config?.data);
    if (config?.params) params = JSON.stringify(config?.params);
    console.log(`[ API REQUEST URL : ${config.url} ]\n${params}`);

    // 요청 성공 직전 호출
    // axios 설정값을 넣음 (사용자 정의 설정도 추가 가능)
    return config;
  },
  function (error) {
    console.error('API call failed: ', error?.response?.config?.url);
    // 요청 에러 직전 호출
    return Promise.reject(error);
  }
);

// 응답 인티셉터 (응답 직전에 호출)
YahooClient.interceptors.response.use(
  function (response) {
    console.log(
      `\n[ API RESPONSE URL : ${response.config.url} ]\n${JSON.stringify(
        response.data
      )}`
    );
    // https stauts === 200 일 때 - axios 함수에서 .then()으로 연결됨
    return response;
  },

  function (error) {
    console.warn('[ API call failed: ', error?.response?.config?.url, ' ]');
    // https stauts !== 200 일 때 - axios 함수에서 .catch()으로 연결됨
    return Promise.reject(error);
  }
);

export default YahooClient;
