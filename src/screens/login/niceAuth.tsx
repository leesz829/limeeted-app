import { ColorType, ScreenNavigationProp } from '@types';
import { layoutStyle, styles } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import * as React from 'react';
import { View, Image, Alert } from 'react-native';
import { ICON, IMAGE } from 'utils/imageUtils';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview'; 
import axios from 'axios';

export const NiceAuth = () => {

	return (
		<WebView
			originWhitelist={['*']}
			source={{ html: 
					'<form id="form" name="form"  method="post" action="https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb" accept-charset="euc-kr">'
					+	'<input type="text" id="m" name="m" value="service" />'
					
					+ '<input type="text" id="token_version_id" name="token_version_id" value="202206222253149E-NC70BX701-F55DE-E27092FDH7" />'
					+ '<input type="text" id="enc_data" name="enc_data" value="A2cxP+YOQPTAUxqlnJcw0Y3Ynd37ruxvX07M64S5lrtw86xwTc9Ydz8NVKqL5ydaTYCi3tcAnWnfcwepeepLa/cm/6gJRkmVCnZXj20JTsrkwMrZTI+GztTWfvgVmtSA10Sh3Pp4ze+DyVDHKXeIEzhTG4RIX9aYTZpuhius+B5MAWeVWL56XN+PRhR+eCeuBgtpTOJv+r1XzY1tyL+XRo9xHcgbdjAK7lej1hWv4mzaojEirBXebgtF0Tp1xeM4" />'
					+ '<input type="text" id="integrity_value" name="integrity_value" value="RkrMdEugYB9nQVesuRXrSLWsLty57vsJzMglqWl218I=" />'

					+	'<input type="submit" value="누르시오">'
					+ '</form>'
			}}
		/>
	);
};
