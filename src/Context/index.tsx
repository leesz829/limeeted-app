import React, { createContext, useContext, useState } from 'react';
import { BasePopup } from 'screens/commonpopup/BasePopup';
import { GuidePopup } from 'screens/commonpopup/GuidePopup';

export const PopupContext = createContext({} as any);

interface PopupContextProps {
  title: string | undefined;
  content: string | undefined;
  subContent: string | undefined;
  confirmCallback: Function | undefined;
  cancelCallback: Function | undefined;
  type: string | undefined;
  guideType: string | undefined;
  guideSlideYn: string | undefined;
  guideNexBtnExpoYn: string | undefined;
  btnExpYn: string | undefined;
}

export const PopupProvider = ({ children }: any) => {
  const [visible, setVisible] = useState(false);
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
  });

  function show(content: PopupContextProps) {
    setVisible(true);
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
