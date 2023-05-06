import dayjs from 'dayjs';
// 날짜 format
export const formatDate = (time: string) => {
  const year = new Date(time).getFullYear();
  const month = new Date(time).getMonth();
  const day = new Date(time).getDate();
  return `${year}.${month}.${day}`;
};

// 현재 날짜 format
export const formatNowDate = () => {
  const year = new Date().getFullYear();
  const month = leftPad(new Date().getMonth() + 1, 2);
  const day = new Date().getDate();
  const hours = new Date().getHours() + 9;
  const minutes = leftPad(new Date().getMinutes(), 2);
  const seconds = leftPad(new Date().getSeconds(), 2);
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

// 숫자 콤마 format
export function CommaFormat(value: number | string) {
  if (!value) return 0;
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 배열 중복 항목 제거
export const removeDuplicate = (arr: Array<any>, item: any) => {
  let newArr = [...arr];
  if (newArr.length === 0) newArr.push(item);
  else if (newArr.filter((_item) => _item === item).length === 0)
    newArr.push(item);
  else {
    newArr = newArr.filter((_item) => _item !== item);
  }
  return newArr;
};

// 배열 -> 문자 변환
export const arrayToString = (arr: Array<any>) => {
  let joinedArr = '';
  if (arr.length > 0 && typeof arr !== 'string') {
    arr.forEach((item) => {
      joinedArr += ' ' + item.name;
    });
    return joinedArr;
  }
  return arr;
};

// 자리수 0 채움(왼쪽)
export function leftPad(number: number | string, targetLength: number) {
  var output = number + '';
  while (output.length < targetLength) {
    output = '0' + output;
  }
  return output;
}

// 자리수 0 채움(오른쪾)
export function rightPad(number: number | string, targetLength: number) {
  var output = number + '';
  while (output.length < targetLength) {
    output = output + '0';
  }
  return output;
}

// 전화번호 하이픈 적용
export function phoneApplyhyphen(str: string) {
  if (!str) return '';
  return str?.toString().replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
}

// 이메일 벨리데이션 체크
export function validateEmailChk(email: string) {
  const regex =
    /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
  return regex.test(email);
}

export const getRemainTime = (time, isOpen) => {
  const remail = timeDiff(time);

  if (!remail) return '';
  if (isOpen) {
    return `${remail}남음`;
  }
  return `${remail}후 열림`;
};

export const timeDiff = (time) => {
  const difference = dayjs(time) - dayjs();

  let timeLeft = {
    days: '0',
    hours: '0',
    minutes: '0',
    seconds: '0',
  };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)).toString(),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24)
        .toString()
        .padStart(2, '0'),
      minutes: Math.floor((difference / 1000 / 60) % 60)
        .toString()
        .padStart(2, '0'),
      seconds: Math.floor((difference / 1000) % 60)
        .toString()
        .padStart(2, '0'),
    };
  } else return '';

  if (Number(timeLeft.days) > 0) {
    return timeLeft.days + '일 ' + timeLeft.hours + '시간 ';
  }
  if (Number(timeLeft.hours) > 0) {
    return timeLeft.hours + '시간 ' + timeLeft.minutes + '분 ';
  }
  if (Number(timeLeft.minutes) > 0) {
    return timeLeft.minutes + '분 ' + timeLeft.seconds + '초 ';
  }
  if (Number(timeLeft.seconds) > 0) {
    return '잠시 후 ';
  }
};

// 데이터 빈값 체크
export function isEmptyData(data: any) {
  let isChk = true;
  if(typeof data == 'undefined') { isChk = false; }
  if(data == null) { isChk = false; }
  if(data == '') { isChk = false; }
  return isChk;
}


export default {
  formatDate,
  removeDuplicate,
  arrayToString,
  leftPad,
  rightPad,
  validateEmailChk,
  getRemainTime,
  isEmptyData,
};
