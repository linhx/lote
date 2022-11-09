import { v4 as uuidv4 } from 'uuid';

export const uuid = () => {
  return uuidv4();
};

/**
 * Join paths, no need to care about that path start/end with slash character or not
 * e.g. path[0] = "path0"; path[1] = "path1" => result = path0/path1
 *      path[0] = "path0/"; path[1] = "/path1" => result = path0/path1
 * @param  {...String} paths the paths
 * @returns the joined url
 */
export const joinUrl = function (...paths: string[]) {
  if (!paths || !paths.length) return null;

  for (let i = 0; i < paths.length; i++) {
    if (!paths[i]) continue;
    if (i === 0) {
      // check the first path
      paths[i] = paths[i].replace(/\/+$/g, '');
    } else if (i === paths.length - 1) {
      // check the last path
      paths[i] = paths[i].replace(/^\/+/g, '');
    } else {
      paths[i] = paths[i].replace(/^\/+|\/+$/g, '');
    }
  }
  const _paths = paths.filter((e) => e);
  return _paths.join('/');
};

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
  _str = _str.replace(/[^A-Za-z0-9$]/gs, ' ')
  _str = removeConsecutiveSpace(_str);
  if (!_str.length) return _str;
  _str = _str.toLowerCase();

  return _str.replace(new RegExp(' ', 'gs'), '-');
}
