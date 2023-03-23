export const formatDate = (time: string) => {
  const year = new Date(time).getFullYear();
  const month = new Date(time).getMonth();
  const day = new Date(time).getDate();
  return `${year}.${month}.${day}`;
};
export function CommaFormat(value: number | string) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
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
export function leftPad(number: number | string, targetLength: number) {
  var output = number + '';
  while (output.length < targetLength) {
    output = '0' + output;
  }
  return output;
}
export function rightPad(number: number | string, targetLength: number) {
  var output = number + '';
  while (output.length < targetLength) {
    output = output + '0';
  }
  return output;
}
export function phoneApplyhyphen(str: string) {
  if (!str) return '';
  return str?.toString().replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
}
export default {
  formatDate,
  removeDuplicate,
  arrayToString,
  leftPad,
  rightPad,
};
