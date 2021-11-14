export const isEmpty = (val?: string) => {
  if (!val) {
    return true;
  }
  if (val.length == 0) {
    return true;
  }
  return false;
}

export const removeConsecutiveSpace = (str: string) => {
  let _str = str.trim()
  let result = ''
  let prevChar = ''
  for (let i = 0; i < _str.length; i++) {
    let char = _str.charAt(i)
    if (char !== ' ' || prevChar !== ' ') {
      result += char
    }
    prevChar = char
  }
  return result
}

function removeVietnameseTones(str: string) {
  if (!str) {
    return str;
  }
  str = str.replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g,"a"); 
  str = str.replace(/[èéẹẻẽêềếệểễ]/g,"e"); 
  str = str.replace(/[ìíịỉĩ]/g,"i"); 
  str = str.replace(/[òóọỏõôồốộổỗơờớợởỡ]/g,"o"); 
  str = str.replace(/[ùúụủũưừứựửữ]/g,"u"); 
  str = str.replace(/[ỳýỵỷỹ]/g,"y"); 
  str = str.replace(/đ/g,"d");
  str = str.replace(/[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]/g, "A");
  str = str.replace(/[ÈÉẸẺẼÊỀẾỆỂỄ]/g, "E");
  str = str.replace(/[ÌÍỊỈĨ]/g, "I");
  str = str.replace(/[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]/g, "O");
  str = str.replace(/[ÙÚỤỦŨƯỪỨỰỬỮ]/g, "U");
  str = str.replace(/[ỲÝỴỶỸ]/g, "Y");
  str = str.replace(/Đ/g, "D");
  return str;
}

export const convertFreeTextToKebabCase = (str?: string) => {
  if (!str) {
    return str;
  }
  let _str = removeVietnameseTones(str);
  _str = _str.replaceAll(/[^A-Za-z0-9$]/g, ' ')
  _str = removeConsecutiveSpace(_str);
  if (!_str.length) return _str;
  _str = _str.toLowerCase();

  return _str.replaceAll(' ', '-');
}
