import '../styles/globals.css'
import 'prismjs/themes/prism-tomorrow.css'  // Add this line
import Layout from '../components/Layout'

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp