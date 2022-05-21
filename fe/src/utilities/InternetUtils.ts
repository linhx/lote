export const check = () => {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/empty.js?v=${new Date().toISOString()}`);
    xhr.onerror = function () {
      resolve(false);
    };
    xhr.onload = function () {
      resolve(true);
    };
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (this.status && this.status < 12000) {
          resolve(true);
        } else {
          resolve(false);
        }
      } else if (xhr.readyState === 0) {
        resolve(false);
      }
    };
    try {
      xhr.send();
    } catch (e) {
      resolve(false);
    }
  });
};
