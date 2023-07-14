import AsyncStorage from '@react-native-community/async-storage';
import { AxiosRequestConfig, Method } from 'axios';
import storeKey from 'constants/storeKey';
import YahooClient from 'utils/client';
import { api_domain } from 'utils/properties';
import axios from 'axios';

interface ResponseProps {
  success: boolean;
  data: {} | undefined;
  message: string;
}

export const send = (
  url: string,
  method: Method | undefined,
  body: {} | undefined,
  isAuth: boolean,
  isFile: boolean
): Promise<ResponseProps> =>
  new Promise(async (resolve) => {
    try {
      const endPoint = api_domain + url;
      const token = await AsyncStorage.getItem(storeKey.JWT_TOKEN);
      const push_token = await AsyncStorage.getItem(storeKey.FCM_TOKEN);
      // const member_seq = await AsyncStorage.getItem(storeKey.MEMBER_SEQ);
      let config: AxiosRequestConfig = {
        url: endPoint,
        method: method,
      };

      let contentType = '';

      if (isFile) {
        contentType = 'multipart/form-data';
      } else {
        contentType = 'application/json';
      }

      // body가 있는 경우
      if (body !== undefined) {
        config = {
          ...config,
          data: body,
        };
      }
      
      // 토큰이 있는경우
      if (isAuth && token) {
        // YahooClient.defaults.headers.common['Authorization'] = '';

        config = {
          ...config,
          headers: {
            'jwt-token': token,
            //'push-token': push_token ? push_token : '',
            'Content-Type': contentType,
            ip : await getIpClient(),
          },
        };
      }

      const result = await YahooClient(config);

      console.log('result api url :::::::::::::::::::::::::::::: ', endPoint);

      if (result && result.data) {
        if (result.data.success !== undefined) {
          resolve(result.data);
        } else {
          resolve({
            success: true,
            message: '',
            data: result.data,
          });
        }
      } else {
        resolve({
          success: false,
          message: '일시적인 오류가 발생했습니다.',
          data: undefined,
        });
      }
    } catch (error) {
      resolve({
        success: false,
        message: '일시적인 오류가 발생했습니다.',
        data: undefined,
      });
    }
  });


  async function getIpClient() {
    try {
      const response = await axios.get('https://ipinfo.io/json');
      return response.data.ip;

    } catch (error) {
      console.log(error);
      return '';
    }
  }
// ######################## 파일 전송
export const send_file = (
  url: string,
  body: FormData | undefined,
  isAuth: boolean
): Promise<ResponseProps> =>
  new Promise(async (resolve) => {
    try {
      const endPoint = api_domain + url;
      const token = await AsyncStorage.getItem(storeKey.JWT_TOKEN);

      let config = {
        method: 'POST',
        body: body,
      };

      // 토큰이 있는경우
      if (isAuth && token) {
        config = {
          ...config,
          headers: {
            'jwt-token': token,
          },
        };
      }

      const result = await fetch(endPoint, config)
        .then((res) => res.json())
        .then((res) => {
          resolve({
            success: true,
            message: '',
            data: res,
          });
        })
        .catch((error) => {
          resolve({
            success: false,
            message: '일시적인 오류가 발생했습니다.',
            data: undefined,
          });
        });
    } catch (error) {
      resolve({
        success: false,
        message: '일시적인 오류가 발생했습니다.',
        data: undefined,
      });
    }
  });
