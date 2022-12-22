import '../assets/css/index.css';
import '../assets/css/preflight.css';
import '../assets/css/fonts.css';
import '../assets/css/content-theme.css';
import '../assets/css/emoji.css';
import '../assets/css/note.css';
import '../assets/css/equilibrium-gray-light.min.css';
import '../assets/css/onedark.min.css';
import '../assets/css/modal.css';
import { appWithTranslation } from 'next-i18next';
import MainLayout from '@/layouts/main.layout';
import { useEffect } from 'react';
import NextNProgress from 'nextjs-progressbar';

function App({ Component, pageProps }) {
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
  }, []);
  return (
    <MainLayout>
      <NextNProgress color="rgb(14, 165, 233)" />
      <Component {...pageProps} />
    </MainLayout>
  );
}

export default appWithTranslation(App);
