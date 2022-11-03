import { createI18n } from 'vue-i18n';
import vn from './vn';

const i18n = createI18n({
  legacy: false,
  locale: 'vn',
  fallbackLocale: 'vn',
  messages: {
    vn
  }
});

export default i18n;
