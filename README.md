# 실행방법
## 안드로이드
### yarn
### yarn android
* * *
## ios(m1)
### yarn
### yarn pod
### yarn ios
* * *
## ios(intel)

### yarn
### cd ios && pod install && cd ../
### yarn ios
* * *
<br>
<br>
   
# 폴더 구조
```
  src
    @types // 타입 관련 정의
    assets
      fonts     // 폰트 정보
      icon      // 아이콘 관련
      img       // 기타 이미지
      startimg  // 최초 화면 이미지만 따로
      styles    // 컬러 코드와 공통 스타일 정의
    component   // 공통적으로 사용 되는 컴포넌트 정의
    navigation  // 네비게이션 관련하여 정의(bottom-tab 네비게이션과, stack 네비게이션 사용)
    screens     // 화면
    utils       // 이미지 유틸이 들어 있음
```

# 네비게이션 관련
## 네비게이션은 react-navigation을 사용
* 참고 https://reactnavigation.org/docs/getting-started/
## stack navigation과 bottom-tab navigation 사용
* 참고 https://reactnavigation.org/docs/stack-navigator/
* 참고 https://reactnavigation.org/docs/bottom-tab-navigator/

## 두 네비게이션을 nested 하게 구성함
* 참고 https://reactnavigation.org/docs/nesting-navigators/

```
기본적으로 stack 네비게이션을 적용 하였으며,
bottom-tab이 있는 네비게이션에 경우 BottomNavigation에 적용하였음
navigation/index.ts참고
BottomNavigation.tsx참고

BottomTab에 경우 아래에 나타는 navigation은 tabBarShowLabel 속성이 true인 경우에만 나타남
BottomNavigation.tsx, CustomTab.tsx참고

기본적으로 이동은 navigation.navigate("이름")으로 합니다.
다만 stack => bottom-tab으로 이동 시,
navigation.navigate("Main", "bottom-tab 이름") 으로 합니다.
ex) navigation.navigate('Main', { screen: 'Profile2' }); bottom-tab navigation에 있는 Profile2로 이동 합니다.


기존 스택 초기화
CommonActions 객체를 이용하여 reset 합니다.
ex) navigation.dispatch(
  CommonActions.reset({
    index: 1,
    routes: [
      { name: 'StartPage' },
      {
        name: 'Main',
        params: { screen: 'LiveSearch' },
      },
    ],
  })
);
ex) https://reactnavigation.org/docs/navigation-actions

top navigation
top navigation에 경우 컴포넌트를 만들어서 구현 되어 있어 있습니다.
기존 네비게이션 이동과 같이 onPress에 넣으면 됩니다.
* 참고 TopNavigation
```
