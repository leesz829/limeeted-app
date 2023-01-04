import AsyncStorage from '@react-native-community/async-storage';
import { AxiosRequestConfig, Method } from 'axios';
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
  isAuth: boolean,
  isConsole: boolean
): Promise<ResponseProps> =>
  new Promise(async (resolve) => {
    try {
      const endPoint = api_domain + url;
      const token = await AsyncStorage.getItem('jwt-token');
      let config: AxiosRequestConfig = {
        url: endPoint,
        method: method,
      };

      // body가 있는 경우
      if (body !== undefined) {
        config = { ...config, data: body };
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
      if (isConsole) {
        console.log(
          '\n\n[Network.js]===================================================================================================================\n'
        );
        console.log(`보내는 데이터 : ${JSON.stringify(config)}`);
      }

      const result = await YahooClient(config);

      if (result && result.data) {
        if (isConsole) {
          console.log(`받은 데이터 : ${JSON.stringify(result.data)}`);
          console.log(
            '\n\n===================================================================================================================\n'
          );
        }
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
      console.log('에러 error : ', error);
      resolve({
        success: false,
        message: '일시적인 오류가 발생했습니다.',
        data: undefined,
      });
    }
  });
