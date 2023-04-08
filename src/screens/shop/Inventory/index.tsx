import { get_my_items } from 'api/models';
import { ColorType, ScreenNavigationProp } from '@types';
import { Color } from 'assets/styles/Color';
import CommonHeader from 'component/CommonHeader';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ICON, IMAGE } from 'utils/imageUtils';
import { use_item } from 'api/models';
import { SUCCESS } from 'constants/reusltcode';
import { usePopup } from 'Context';
import { useDispatch } from 'react-redux';
import { myProfile } from 'redux/reducers/authReducer';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { ROUTES, STACK } from 'constants/routes';
import { findSourcePath } from 'utils/imageUtils';



const dummy = ['', '', '', ''];
export default function Inventory() {
  const navigation = useNavigation<ScreenNavigationProp>();

  const [tab, setTab] = useState(categories[0]);
  const [data, setData] = useState(dummy);

  const { show } = usePopup();  // 공통 팝업
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      const body = {
        cate_group_code: tab.value
      };
      const { data, message } = await get_my_items(body);
      console.log('data ::::::' , data);

      if(data) {
        setData(data?.inventory_list);
      }
    }
    fetchData();
  }, [tab]);

  const onPressTab = (value) => {
    setTab(value);
  };

  // ########################################## 아이템 사용
  const useItem = async (item) => {
    show({
      title: '사용/획득',
      content: item.cate_name + ' 사용/획득 하시겠습니까?' ,
      cancelCallback: function() {
        
      },
      confirmCallback: async function() {
        console.log('item ::::: ', item);

        const body = {
          item_category_code: item.item_category_code,
          cate_group_code: item.cate_group_code,
          cate_common_code: item.cate_common_code
        };
        try {
          const { success, data } = await use_item(body);
          if(success) {
            switch (data.result_code) {
              case SUCCESS:
                dispatch(myProfile());
                navigation.navigate(STACK.TAB, { screen: 'Shop' });
                break;
              default:
                show({
                  content: '오류입니다. 관리자에게 문의해주세요.' ,
                  confirmCallback: function() {}
                });
                break;
            }
          } else {
            show({
              content: '오류입니다. 관리자에게 문의해주세요.' ,
              confirmCallback: function() {}
            });
          }
        } catch (error) {
          console.log(error);
        } finally {
          
        }
      }
    });
  }

  const ListHeaderComponent = () => (
    <>
      <View style={styles.categoriesContainer}>
        {categories?.map((item) => (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.categoryBorder(item.value === tab.value)}
            onPress={() => onPressTab(item)}
          >
            <Text style={styles.categoryText(item.value === tab.value)}>
              {item?.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ height: 30 }} />
    </>
  );
  const renderItem = ({ item, index }) => (
    <View style={styles.renderItem}>
      <View style={{ flexDirection: 'row' }}>
        <Image source={findSourcePath(item.file_path + item.file_name)} style={styles.thumb} />
        <View style={{ marginLeft: 15, width: '65%' }}>
          <Text style={styles.title}>{item?.cate_name}</Text>
          <Text style={styles.infoText}>{item?.cate_desc}</Text>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              style={styles.button(item?.use_yn == 'N')}
              disabled={item?.use_yn == 'Y'}
              onPress={() => {useItem(item);}}
            >
              <Text style={styles.buttonText(item?.use_yn == 'N')}>
                {item?.use_yn == 'N' ? '사용/획득' : '사용중('+ item?.subscription_end_day +'일남음)'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const renderItemEmpty = () => (
    <View style={styles.renderItem}>
      <Text>인벤토리 상품이 없습니다.</Text>
    </View>
  );
  return (
    <>
      <CommonHeader title="인벤토리" />
      <FlatList
        style={styles.root}
        data={data}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={renderItemEmpty}
        renderItem={renderItem}
      />
    </>
  );
}





{/* ################################################################################################################
############### Style 영역
################################################################################################################ */}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    width: '100%',
  },
  categoriesContainer: {
    marginTop: 15,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'flex-start',
  },
  categoryBorder: (isSelected: boolean) => {
    return {
      paddingVertical: 9,
      paddingHorizontal: 15,
      borderWidth: 1,
      borderColor: isSelected ? Color.primary : Color.grayAAAA,
      borderRadius: 9,
      marginLeft: 8,
    };
  },
  categoryText: (isSelected: boolean) => {
    return {
      fontSize: 14,
      color: isSelected ? Color.primary : Color.grayAAAA,
    };
  },
  renderItem: {
    width: `100%`,
    paddingVertical: 15,
    borderBottomColor: Color.grayEEEE,
    borderBottomWidth: 1,
  },
  thumb: {
    width: '30%',
    height: ((Dimensions.get('window').width - 32) * 8 * 0.3) / 11,
    borderRadius: 5,
    backgroundColor: '#d1d1d1',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  title: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 15,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#363636',
  },
  infoText: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 13,
    fontWeight: 'normal',
    textAlign: 'left',
    color: '#939393',
  },
  buttonWrapper: {
    width: '100%',
    marginTop: 12,
    alignItems: 'flex-end',
  },
  button: (used) => {
    return {
      width: 90,
      height: 29,
      borderRadius: 5,
      backgroundColor: used ? '#742dfa' : '#f2f2f2',
      flexDirection: `row`,
      alignItems: `center`,
      justifyContent: `center`,
    };
  },
  buttonText: (used) => {
    return {
      fontSize: 11,
      fontWeight: 'normal',
      fontStyle: 'normal',
      letterSpacing: 0,
      textAlign: 'left',
      color: used ? '#ffffff' : '#b5b5b5',
    };
  },
});

const categories = [
  {
    label: '전체',
    value: 'ALL',
  },
  {
    label: '패스',
    value: 'PASS',
  },
  {
    label: '구독',
    value: 'SUBSCRIPTION',
  },
];
