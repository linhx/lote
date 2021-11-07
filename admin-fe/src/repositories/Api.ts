import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  withCredentials: true
});

export const authApi = axios.create({
  baseURL: import.meta.env.VITE_APP_AUTH_URL,
  withCredentials: true
});

let subscribers: ((success: boolean) => void)[] = []; // execute subscribers after refreshing token
function addSubscriber (callback: (success: boolean) => void) {
  subscribers.push(callback);
}
function onAccessTokenFetched (success: boolean) {
  const _subscribers = subscribers.slice(0, subscribers.length);
  subscribers = [];
  _subscribers.forEach(callback => callback(success));
  isRefreshingToken = false;
}

let isRefreshingToken = false;

export const refreshToken = () => {
  const result = new Promise((resolve, reject) => {
    addSubscriber((success: boolean) => {
      if (success) {
        resolve(true);
      } else {
        reject(new Error('Can not refresh token'));
      }
    });
  });

  if (!isRefreshingToken) {
    isRefreshingToken = true;
    authApi.post('/refresh-token').then(() => {
      onAccessTokenFetched(true);
    }).catch(({ response }) => {
      const messages = response?.data?.messages;
      if (messages && messages[0].messageCode === 'error.refreshToken.alreadyUsed') {
        return authApi.post('/cancel-logout', {
          llhs: messages[0].params.llhs
        }).then(() => {
          onAccessTokenFetched(true);
        }).catch(() => {
          onAccessTokenFetched(false);
        });
      } else {
        onAccessTokenFetched(false);
      }
    });
  }
  return result;
}

api.interceptors.response.use(res => {
  return res.data;
},
async e => {
  const { response } = e;
  if (response && response.status === 401) {
    const refreshTokenSuccess = await refreshToken().catch(() => false);
    if (refreshTokenSuccess) {
      return api(e.response.config);
    }
  }
  throw e;
});

export default api;
