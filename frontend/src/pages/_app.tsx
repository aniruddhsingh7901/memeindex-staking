import { TonConnectUIProvider } from '@tonconnect/ui-react';
import type { AppProps } from 'next/app';
import '../styles/globals.css';

// For development/testing
const manifestUrl = 'https://memeindex.com/tonconnect-manifest.json';

function App({ Component, pageProps }: AppProps) {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <Component {...pageProps} />
    </TonConnectUIProvider>
  );
}

export default App;