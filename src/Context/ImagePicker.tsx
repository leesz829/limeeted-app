import React, { createContext, useContext, useState } from 'react';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';

export const ImagePickerContext = createContext({} as any);

interface Action {
  title: string;
  type: 'library';
  options: ImageLibraryOptions;
}

interface Props {
  type?: string;
  isAuth?: boolean;
  callbackFn: (
    uri: any,
    base64: string
  ) => void;
  uriParam?: string;
  plusBtnType?: string;
  auth_status?: string;
  imgWidth?: number;
  imgHeight?: number;
  borderRadius?: number;
  iconSize?: number;
  isMst?: boolean;
}

const includeExtra = true;
const options: Action = {
  title: '이미지를 선택해 주세요.',
  type: 'library',
  options: {
    //maxHeight: 200,
    //maxWidth: 200,
    selectionLimit: 1,
    mediaType: 'photo',
    includeBase64: true,
    includeExtra,
  },
};


export const ImagePickerProvider = ({ children }: any) => {
  const [visible, setVisible] = useState(false);
  const [visibleResponsive, setVisibleResponsive] = useState(false);
  const [visibleCross, setVisibleCross] = useState(false);
  /* const [contents, setContents] = useState<PopupContextProps>({
    title: '',
    content: '',
    subContent: '',
    confirmCallback: undefined,
    cancelCallback: undefined,
    confirmBtnText: '',
    cancelBtnText: '',
    type: '',
    guideType: '',
    guideSlideYn: '',
    guideNexBtnExpoYn: '',
    btnExpYn: '',
    eventType: '',
    eventPopupList: [],
    etcCallback: undefined,
    popupDuration: undefined,
    prodList: [],
    passType: '',
    passAmt: '',
    isCross: false,
  }); */

  function openImagePicker(content: Props) {
    console.log('asdasdasdsad');

    /* ImagePicker.openPicker({
      width: 800,
      height: 1000,
      cropping: true,
      //cropperActiveWidgetColor: '#8E9AEB',  // widget 색상
      cropperToolbarTitle: '사진 편집',
      showCropGuidelines: false,
      hideBottomControls: true,
      includeBase64: true,
      mediaType: "photo",
      //smartAlbums: 'UserLibrary',
    }).then(image => {
      return {
        'path' : image.path,
        'data' : image.data
      }

    }).catch(
      console.log
    ); */
  }

  /* function show(content: PopupContextProps) {
    if(content.type == 'RESPONSIVE') {
      setVisibleResponsive(true);
    } else {
      if(content.isCross) {
        setVisibleCross(true);
      } else {
        setVisible(true);
      }
    }
    setContents(content);
  } */
  
  /* function hide(content: PopupContextProps) {
    if(content.isCross) {
      setVisibleCross(true);
    } else {
      setVisible(false);
    }
    
    setContents({
      title: '',
      content: '',
      subContent: '',
      confirmCallback: undefined,
      cancelCallback: undefined,
      confirmBtnText: '',
      cancelBtnText: '',
      type: '',
      guideType: '',
      guideSlideYn: '',
      guideNexBtnExpoYn: '',
      btnExpYn: '',
      eventType: '',
      eventPopupList: [],
      etcCallback: undefined,
      popupDuration: undefined,
      prodList: [],
      passType: '',
      passAmt: '',
      isCross: false,
    });
  } */

  return (
    <>
    </>
  );
};

export const useImagePicker = () => {
  const { openImagePicker } = useContext(ImagePickerContext);
  return { openImagePicker };
};
