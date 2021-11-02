import { uuid } from './StringUtils';

export const getExt = (name: string) => {
  return name?.substring(name?.lastIndexOf('.') + 1);
};

export const randomFileName = (fileName: string) => {
  return uuid() + '.' + getExt(fileName);
};
