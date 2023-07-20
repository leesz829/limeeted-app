import React, { createContext, useContext, useState } from 'react';
import { BasePopup } from 'screens/commonpopup/BasePopup';
import { GuidePopup } from 'screens/commonpopup/GuidePopup';
import { EventPopup } from 'screens/commonpopup/EventPopup';
import { ResponsivePopup } from 'screens/commonpopup/ResponsivePopup';

export const PopupContext = createContext({} as any);

interface PopupContextProps {
  title: string | undefined; // 제목
  content: string | undefined; // 내용
  subContent: string | undefined; // 부가 내용
  confirmCallback: Function | undefined; // 확인 콜백 함수
  cancelCallback: Function | undefined; // 취소 콜백 함수
  type: string | undefined; // 팝업 유형
  guideType: string | undefined; // 가이드 팝업 유형
  guideSlideYn: string | undefined; // 가이드 팝업 슬라이드 여부
  guideNexBtnExpoYn: string | undefined; // 가이드 팝업 그만보기 버튼 노출 여부
  btnExpYn: string | undefined; // 버튼 노출 여부
  eventType: string | undefined; // 이벤트 팝업 유형
  eventPopupList: any | undefined; // 이벤트 목록
  etcCallback: Function | undefined; // 기타 콜백 함수
}

export const PopupProvider = ({ children }: any) => {
  const [visible, setVisible] = useState(false);
  const [visibleResponsive, setVisibleResponsive] = useState(false);
  const [contents, setContents] = useState<PopupContextProps>({
    title: '',
    content: '',
    subContent: '',
    confirmCallback: undefined,
    cancelCallback: undefined,
    type: '',
    guideType: '',
    guideSlideYn: '',
    guideNexBtnExpoYn: '',
    btnExpYn: '',
    eventType: '',
    eventPopupList: [],
    etcCallback: undefined,
  });

  function show(content: PopupContextProps) {
    if(content.type == 'RESPONSIVE') {
      setVisibleResponsive(true);
    } else {
      setVisible(true);
    }
    setContents(content);
  }
  function hide() {
    setVisible(false);
    
    setContents({
      title: '',
      content: '',
      subContent: '',
      confirmCallback: undefined,
      cancelCallback: undefined,
      type: '',
      guideType: '',
      guideSlideYn: '',
      guideNexBtnExpoYn: '',
      btnExpYn: '',
      eventType: '',
      eventPopupList: [],
      etcCallback: undefined,
    });
  }

  return (
    <PopupContext.Provider value={{ show, hide }}>
      {children}

      {contents.type == 'GUIDE' ? (
        <GuidePopup
          popupVisible={visible}
          setPopupVIsible={setVisible}
          confirmCallbackFunc={contents.confirmCallback}
          guideType={contents.guideType}
          guideSlideYn={contents.guideSlideYn}
          guideNexBtnExpoYn={contents.guideNexBtnExpoYn}
        />
      ) : contents.type == 'EVENT' ? (
        <EventPopup
          popupVisible={visible}
          setPopupVIsible={setVisible}
          confirmCallbackFunc={contents.confirmCallback}
          eventType={contents.eventType}
          eventPopupList={contents.eventPopupList}
          etcCallbackFunc={contents.etcCallback}
        />
      ) : contents.type == 'RESPONSIVE' ? (
        <ResponsivePopup
          popupVisible={visibleResponsive}
          setPopupVIsible={setVisibleResponsive}
          text={contents.content}
          subText={contents.subContent}
        />
      ) : (
        <BasePopup
          popupVisible={visible}
          setPopupVIsible={setVisible}
          title={contents.title}
          text={contents.content}
          subText={contents.subContent}
          isConfirm={
            typeof contents.confirmCallback != 'undefined' &&
            typeof contents.cancelCallback != 'undefined'
          }
          confirmCallbackFunc={contents.confirmCallback}
          cancelCallbackFunc={contents.cancelCallback}
          btnExpYn={contents.btnExpYn}
        />
      )}
    </PopupContext.Provider>
  );
};

export const usePopup = () => {
  const { show, hide } = useContext(PopupContext);
  return { show, hide };
};
