import type { AppProps } from 'next/app';
import '../styles/reset.css';

const App = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

export default App;
