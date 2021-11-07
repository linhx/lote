import { authApi } from './Api'

export default {
  getLoggedInUser() {
    return authApi.get('/profile').then(res => res.data);
  }
}
