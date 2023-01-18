import AsyncStorage from '@react-native-community/async-storage';
import { AxiosRequestConfig, Method } from 'axios';
import storeKey from 'constants/storeKey';
import YahooClient from 'utils/client';
import { api_domain } from 'utils/properties';

interface ResponseProps {
  success: boolean;
  data: {} | undefined;
  message: string;
}
export const Send = (
  url: string,
  method: Method | undefined,
  body: {} | undefined,
  isAuth: boolean
): Promise<ResponseProps> =>
  new Promise(async (resolve) => {
    try {
      const endPoint = api_domain + url;
      const token = await AsyncStorage.getItem(storeKey.JWT_TOKEN);
      // const member_seq = await AsyncStorage.getItem(storeKey.MEMBER_SEQ);
      let config: AxiosRequestConfig = {
        url: endPoint,
        method: method,
      };

      // body가 있는 경우
      if (body !== undefined) {
        config = {
          ...config,
          data: body,
        };
      }
      // 토큰이 있는경우
      if (isAuth && token) {
        config = {
          ...config,
          headers: {
            'jwt-token': token,
            'Content-Type': 'application/json',
          },
        };
      }
      // console.log('config\n\n' + JSON.stringify(config) + '\n\n');
      const result = await YahooClient(config);

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
