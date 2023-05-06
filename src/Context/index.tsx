import React, { createContext, useContext, useState } from 'react';
import { BasePopup } from 'screens/commonpopup/BasePopup';

export const PopupContext = createContext({} as any);

interface PopupContextProps {
  title: string | undefined;
  content: string | undefined;
  subContent: string | undefined;
  confirmCallback: Function | undefined;
  cancelCallback: Function | undefined;
}

export const PopupProvider = ({ children }: any) => {
  const [visible, setVisible] = useState(false);
  const [contents, setContents] = useState<PopupContextProps>({
    title: '',
    content: '',
    subContent: '',
    confirmCallback: undefined,
    cancelCallback: undefined,
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
    });
  }

  return (
    <PopupContext.Provider value={{ show, hide }}>
      {children}
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
      />
    </PopupContext.Provider>
  );
};

export const usePopup = () => {
  const { show, hide } = useContext(PopupContext);
  return { show, hide };
};
