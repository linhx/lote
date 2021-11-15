import { nanoid } from 'nanoid';

export const getExt = (name: string) => {
  return name?.substring(name?.lastIndexOf('.') + 1);
};

export const randomFileName = (fileName: string) => {
  return nanoid() + '.' + getExt(fileName);
};
