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
import { useIsFocused, useNavigation, useFocusEffect } from '@react-navigation/native';
import { ROUTES, STACK } from 'constants/routes';
import { findSourcePath } from 'utils/imageUtils';
import { CommonLoading } from 'component/CommonLoading';
import AsyncStorage from '@react-native-community/async-storage';
import { CommaFormat, formatNowDate } from 'utils/functions';



const dummy = ['', '', '', ''];
export default function Inventory() {
  const navigation = useNavigation<ScreenNavigationProp>();
  const [isLoading, setIsLoading] = useState(true);

  const [tab, setTab] = useState(categories[0]);
  const [data, setData] = useState(dummy);

  const { show } = usePopup();  // 공통 팝업
  const dispatch = useDispatch();


  // 데이터 조회
  const fetchData = async (item:any) => {
    const body = {
      cate_group_code: item.value
    };
    const { data, message } = await get_my_items(body);

    if(data) {
      const connectDate = await AsyncStorage.getItem('INVENTORY_CONNECT_DT') || '20230524000000';
      data?.inventory_list.map((item: any) => {
        item.connect_date = connectDate;
      });

      setData(data?.inventory_list);
      setIsLoading(false);
    }

    await AsyncStorage.setItem('INVENTORY_CONNECT_DT', formatNowDate());
    dispatch(myProfile());
  }

  useFocusEffect(
    React.useCallback(() => {
      async function fetch() {
        onPressTab(categories[0]);
      };
      fetch();
      return async() => {
      };
    }, []),
  );

  const onPressTab = (item:any) => {
    setTab(item);
    fetchData(item);
  };

  // ########################################## 아이템 사용
  const useItem = async (item) => {
    show({
      title: '사용/획득',
      content: item.cate_name + ' 사용/획득 하시겠습니까?' ,
      cancelCallback: function() {
        
      },
      confirmCallback: async function() {
        setIsLoading(true);

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
                if(body.cate_common_code == 'STANDARD'){
                  // 조회된 매칭 노출 회원
                  // "profile_member_seq_list"
                  navigation.navigate(STACK.COMMON, {
                      screen: 'ItemMatching'
                      , params : {profile_member_seq_list: data.profile_member_seq_list.toString()}
                    });
                }
                dispatch(myProfile());
                // navigation.navigate(STACK.TAB, { screen: 'Shop' });
                fetchData(tab);
                break;
              case '3001':
                show({
                  content: '소개해드릴 회원을 찾는 중이에요. 다음에 다시 사용해주세요.' ,
                  confirmCallback: function() {}
                });
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
          console.warn(error);
        } finally {
          setIsLoading(false);
        }
      }
    });
  }

  function ListHeaderComponent() {
    return (
      <>
        <View style={_styles.categoriesContainer}>
          {categories?.map((item) => (
            <TouchableOpacity
              activeOpacity={0.8}
              style={_styles.categoryBorder(item.value === tab.value)}
              onPress={() => onPressTab(item)}
            >
              <Text style={_styles.categoryText(item.value === tab.value)}>
                {item?.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height: 30 }} />
      </>
    )
  };

  function renderItem({ item, index }) {
    const isNew = (typeof item.connect_date == 'undefined' || item.connect_date == null || item.connect_date < item.reg_dt) ? true : false;

    return (
      <View style={_styles.renderItem}>
        <View style={{ flexDirection: 'row' }}>
          <View style={_styles.thumb}>
            <Image source={findSourcePath(item?.file_path + item?.file_name)} style={{width: '100%', height: '100%'}} resizeMode='cover' />
            {item?.item_qty > 0 && <Text style={_styles.qtyText}>{item.item_qty}개 보유</Text>}

            {isNew &&
              <View style={_styles.iconArea}>
                <Text style={_styles.newText}>NEW</Text>
              </View>
            }
          </View>

          <View style={{ marginLeft: 15, width: '65%' }}>
            <Text style={_styles.title}>{item?.cate_name}</Text>
            <Text style={_styles.infoText}>{item?.cate_desc}</Text>
            <View style={_styles.buttonWrapper}>
              <TouchableOpacity
                style={_styles.button(item?.use_yn == 'N' && item?.be_in_use_yn == 'N')}
                disabled={item?.use_yn == 'Y' || item?.be_in_use_yn == 'Y'}
                onPress={() => {useItem(item);}} >
                <Text style={_styles.buttonText(item?.use_yn == 'N' && item?.be_in_use_yn == 'N')}>
                  {item?.use_yn == 'N' && item?.be_in_use_yn == 'N' && '사용 / 획득'}
                  {item?.use_yn == 'N' && item?.be_in_use_yn == 'Y' && '0일 후 열림'}
                  {item?.use_yn == 'Y' && '사용중('+ item?.subscription_end_day +'일남음)'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    )
  };

  const renderItemEmpty = () => (
    <View style={_styles.renderItem}>
      <Text>인벤토리 상품이 없습니다.</Text>
    </View>
  );
  return (
    <>
      {isLoading && <CommonLoading />}

      <CommonHeader title="인벤토리" />
      <FlatList
        style={_styles.root}
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

const _styles = StyleSheet.create({
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
      borderColor: isSelected ? Color.blue01 : Color.grayECECEC,
      borderRadius: 9,
      backgroundColor: isSelected ? '#f8f5ff' : Color.white,
      marginLeft: 5,
      marginRight: 5,
    };
  },
  categoryText: (isSelected: boolean) => {
    return {
      fontSize: 14,
      fontFamily: 'AppleSDGothicNeoEB00',
      color: isSelected ? Color.blue01 : Color.grayAAAA,
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
    marginTop: 5,
  },
  qtyText: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 12,
    fontWeight: 'normal',
    textAlign: 'left',
    color: '#fff',
    marginTop: 5,
  },
  buttonWrapper: {
    width: '100%',
    marginTop: 7,
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
      fontFamily: 'AppleSDGothicNeoB00',
      letterSpacing: 0,
      textAlign: 'left',
      color: used ? '#ffffff' : '#b5b5b5',
    };
  },
  iconArea: {
    position: 'absolute',
    top: 4,
    left: 5,
  },
  newText: {
    backgroundColor: '#FF7E8C',
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 11,
    color: ColorType.white,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    overflow: 'hidden',
  }
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
    label: '부스팅',
    value: 'SUBSCRIPTION',
  },
  {
    label: '뽑기권',
    value: 'PROFILE_DRAWING',
  },
];
