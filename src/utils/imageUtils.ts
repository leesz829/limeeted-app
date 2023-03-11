import properties from './properties';

export const ICON = {
  roby: require('assets/icon/dock_lobby_off.png'),
  robyOn: require('assets/icon/dock_lobby_on.png'),
  cashshopOn: require('assets/icon/dock_cashshop_on.png'),
  cashshop: require('assets/icon/dock_cashshop_off.png'),
  mailbox: require('assets/icon/dock_mailbox_off.png'),
  mailboxOn: require('assets/icon/dock_mailbox_on.png'),
  storage: require('assets/icon/dock_storage_off.png'),
  storageOn: require('assets/icon/dock_storage_on.png'),
  back: require('assets/icon/icon-back.png'),
  job: require('assets/icon/icon-job.png'),
  degree: require('assets/icon/icon-degree.png'),
  income: require('assets/icon/icon-income.png'),
  asset: require('assets/icon/icon-asset.png'),
  sns: require('assets/icon/icon-sns.png'),
  vehicle: require('assets/icon/icon-vehicle.png'),
  arrRight: require('assets/icon/icon-arr-right.png'),
  xBtn: require('assets/icon/icon-x.png'),
  plus: require('assets/icon/icon-plus.png'),
  distance: require('assets/icon/icon-distance.png'),
  close: require('assets/icon/icon-close.png'),
  like: require('assets/icon/icon-like.png'),
  royalpass: require('assets/icon/icon-royalpass.png'),
  medalAll: require('assets/icon/icon-medal_all.png'),
  tooltip: require('assets/icon/icon-tooltip.png'),
  info: require('assets/icon/icon-info.png'),
  siren: require('assets/icon/icon-siren.png'),
  party: require('assets/icon/icon-party.png'),
  manage: require('assets/icon/icon-manager.png'),
  boy: require('assets/icon/icon-boy.png'),
  girl: require('assets/icon/icon-girl.png'),
  checkOff: require('assets/icon/icon-check-off.png'),
  checkOn: require('assets/icon/icon-check-on.png'),
  star: require('assets/icon/icon-star.png'),
  starHalf: require('assets/icon/icon-star-half.png'),
  starEmpty: require('assets/icon/icon-star-empty.png'),
  new: require('assets/icon/icon-new.png'),
  badge: require('assets/icon/icon-badege.png'),
  process: require('assets/icon/icon-process.png'),
  search: require('assets/icon/icon-search.png'),
  pen: require('assets/icon/icon-pen.png'),
  refresh: require('assets/icon/icon-refresh.png'),
  refreshDark: require('assets/icon/icon-refresh-dark.png'),
  penGray: require('assets/icon/icon-pen-gray.png'),
  kakao: require('assets/icon/icon-kakao.png'),
  penCircleGray: require('assets/icon/icon-penCircleGray.png'),
  align: require('assets/icon/icon-align.png'),
  searchGray: require('assets/icon/icon-search-gray.png'),
  wait: require('assets/icon/icon-wait.png'),
  pass: require('assets/icon/icon-pass.png'),
  purplePlus: require('assets/icon/icon-purple-plus.png'),
  currency: require('assets/icon/icon-currency.png'),
  ticket: require('assets/icon/icon-ticket.png'),
  currencyTooltip: require('assets/icon/icon-currency-tooltip.png'),
};

export const GIF_IMG = {
  faceScan: require('assets/img/gif/face-scan.gif'),
}

export const IMAGE = {
  logo: require('assets/img/logo.png'),
  logoText: require('assets/img/logo_txt.png'),
  logoMark: require('assets/img/logo_mark.png'),
  kakaoBtn: require('assets/img/kakao-btn.png'),
  main: require('assets/img/main.png'),
  common: require('assets/img/common.png'),
};

export const START_IMAGE = {
  view1: require('assets/startimg/view1.png'),
  view2: require('assets/startimg/view2.png'),
  view3: require('assets/startimg/view3.png'),
  view4: require('assets/startimg/view4.png'),
  view5: require('assets/startimg/view5.png'),
  view6: require('assets/startimg/view6.png'),
  view7: require('assets/startimg/view7.png'),
  view8: require('assets/startimg/view8.png'),
  view9: require('assets/startimg/view9.png'),
  view10: require('assets/startimg/view10.png'),
  view11: require('assets/startimg/view11.png'),
  view12: require('assets/startimg/view12.png'),
  view13: require('assets/startimg/view13.png'),
  view14: require('assets/startimg/view14.png'),
  view15: require('assets/startimg/view15.png'),
  view16: require('assets/startimg/view16.png'),
  view17: require('assets/startimg/view17.png'),
  view18: require('assets/startimg/view18.png'),
  view19: require('assets/startimg/view19.png'),
  view20: require('assets/startimg/view20.png'),
  view21: require('assets/startimg/view21.png'),
  view22: require('assets/startimg/view22.png'),
  view23: require('assets/startimg/view23.png'),
  view24: require('assets/startimg/view24.png'),
  view25: require('assets/startimg/view25.png'),
  view26: require('assets/startimg/view26.png'),
};

export const PROFILE_IMAGE = {
  manTmp1: require('assets/img/tmp/profile_m_01.jpg'),
  manTmp2: require('assets/img/tmp/profile_m_02.jpg'),
  manTmp3: require('assets/img/tmp/profile_m_03.jpg'),
  manTmp4: require('assets/img/tmp/profile_m_04.jpg'),
  manTmp5: require('assets/img/tmp/profile_m_05.jpg'),
  manTmp6: require('assets/img/tmp/profile_m_06.jpg'),
  womanTmp1: require('assets/img/tmp/profile_w_01.jpg'),
  womanTmp2: require('assets/img/tmp/profile_w_02.jpg'),
  womanTmp3: require('assets/img/tmp/profile_w_03.jpg'),
  womanTmp4: require('assets/img/tmp/profile_w_04.jpg'),
  womanTmp5: require('assets/img/tmp/profile_w_05.jpg'),
  womanTmp6: require('assets/img/tmp/profile_w_06.jpg'),
  womanTmp7: require('assets/img/tmp/profile_w_07.jpg'),
  profileM1: require('assets/img/tmp/robby_tmp.jpg'),
};

export function findSourcePath(img_file_path: any) {
  if (img_file_path) {
    const path = properties.img_domain + img_file_path;
    return { uri: path };
  }
  return img_file_path;
}
