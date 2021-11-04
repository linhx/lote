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
  const _paths = paths.filter(e => e);
  return _paths.join('/');
};