/* eslint-disable @next/next/no-sync-scripts */
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <meta charSet="UTF-8" />
        <meta
          httpEquiv="Cache-control"
          content="no-cache, no-store, must-revalidate"
        />
        <meta httpEquiv="Pragma" content="no-cache" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <script src='/scripts/set-theme-mode.js'></script>
        <script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        ></script>
      </Head>
      <body className='bg-white dark:bg-slate-900'>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
