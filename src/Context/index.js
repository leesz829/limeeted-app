import React, { createContext, useContext, useState } from 'react';
import { BasePopup } from 'screens/commonpopup/BasePopup';

export const PopupContext = createContext();

// interface ContentProps {
//   title: string;
//   content: string;
// }
export const PopupProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [contents, setContents] = useState({
    title: '',
    content: '',
  });

  function show(content) {
    setVisible(true);
    setContents(content);
  }
  function hide() {
    setVisible(false);
    setContents({ title: '', content: '' });
  }
  return (
    <PopupContext.Provider value={{ show, hide }}>
      {children}
      <BasePopup
        popupVisible={visible}
        setPopupVIsible={setVisible}
        title={contents.title}
        text={contents.content}
      />
    </PopupContext.Provider>
  );
};

export const usePopup = () => {
  const { show, hide } = useContext(PopupContext);
  return { show, hide };
};
