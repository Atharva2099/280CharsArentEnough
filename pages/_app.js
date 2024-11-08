import '../styles/globals.css'
import 'prismjs/themes/prism-tomorrow.css'  // Add this line
// pages/_app.js
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;